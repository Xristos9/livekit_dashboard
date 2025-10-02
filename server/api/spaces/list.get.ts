// server/api/spaces/list.get.ts
// ----------------------------------------------------------------------------
// PURPOSE
//   Nuxt (Nitro) server endpoint that lists a limited batch of JSON logs from a
//   DigitalOcean Space (S3‑compatible), reads each JSON to discover the
//   associated MP4 filename/URL, and optionally verifies the MP4 via a HEAD
//   request. The endpoint is designed to be memory‑safe by processing only a
//   bounded number of JSON files per request with small, fixed concurrency.
//
//   NOTE: This file also includes verbose console logging to help debug flow.
//   It intentionally avoids building large in‑memory indexes of MP4s.
// ----------------------------------------------------------------------------
// HOW IT WORKS
//   1) Page through bucket objects until we collect up to `jsonLimit` JSON items.
//      - We do not accumulate all objects, only a small batch of JSON keys.
//   2) For each JSON (in small concurrent chunks):
//      - Download the JSON (with timeout), parse it, and extract MP4 reference
//        from either `files[0].location` (preferred) or `files[0].filename`.
//      - Compute the MP4 object key from the URL or fall back to same directory
//        as the JSON.
//      - Optionally do a HEAD to verify existence and enrich size/modified.
//   3) Produce an array of paired records (JSON + inferred/verified MP4).
//
//   Bounded concurrency + early pagination exit keeps memory usage stable.
// ----------------------------------------------------------------------------
// QUERY PARAMS (all optional)
//   prefix              Filter listing to a folder/prefix (e.g. "2025-08/")
//   continuationToken   S3 pagination token from a previous call (not used in
//                       this simplified version's return payload)
//   jsonLimit           Max JSON files to process in this call (default 25,
//                       hard max 200)
//   jsonConcurrency     Number of parallel JSON fetches (default 3, max 8)
// ----------------------------------------------------------------------------
// RESPONSE (this version returns just the array for simplicity)
//   RecordPair[] where each record contains egress/room metadata from JSON,
//   plus JSON and MP4 object info (if resolvable).
// ----------------------------------------------------------------------------

import { getCookie, type H3Event } from 'h3'
import {
  ListObjectsV2Command,
  type ListObjectsV2CommandOutput,
  GetObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3'
import { getS3Client } from '~/server/utils/s3'
import type { RecordPair } from '@/types/recordings'

// Minimal shape we use for S3 objects in this handler
type Obj = { Key: string; LastModified?: string; Size?: number }

// Runtime knobs with conservative defaults
const DEFAULT_JSON_LIMIT = 25 // how many JSON files per call
const DEFAULT_JSON_CONCURRENCY = 3 // parallel JSON fetches
const PAGE_LOOP_LIMIT = 200 // hard safety to avoid infinite loops

// ----------------------------------------------------------------------------
// helpers
// ----------------------------------------------------------------------------

// Convert a Node stream (GetObject Body) to string
async function streamToString(body: any): Promise<string> {
  if (!body) return '' // defensive: empty body -> empty string
  const chunks: Uint8Array[] = []
  // Async iteration over the stream, collecting all chunks
  for await (const chunk of body as AsyncIterable<Uint8Array>) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  // Concatenate chunks and decode as UTF‑8
  return Buffer.concat(chunks).toString('utf-8')
}

function extractPhoneFromRoomName(roomName: string | null | undefined): string | null {
  if (!roomName) return null
  // room_name looks like: "call2_00306932886053_TYs96ZyAYYig"
  // phone is always between the first and second underscore
  // More defensive: capture the 1st group between underscores
  const m = roomName.match(/^[^_]+_([^_]+)/)
  return m?.[1] ?? null
}

// Heuristic to convert started/ended into seconds, regardless of raw unit
// (ns, µs, ms, or seconds). We infer unit by magnitude and keep 3 decimals.
// Convert ns timestamps to seconds duration
function durationFromNs(startedAt: number | null, endedAt: number | null): number | null {
  if (startedAt == null || endedAt == null || endedAt <= startedAt) return null
  return +((endedAt - startedAt) / 1e9).toFixed(3) // seconds with ms precision
}

// Pull filename/location from JSON.files[0]. Prefer location; fallback filename.
function extractMp4Ref(json: any): {
  filename: string | null
  location: string | null
} {
  try {
    if (Array.isArray(json?.files) && json.files.length > 0) {
      const f = json.files[0]
      const filename = typeof f?.filename === 'string' ? f.filename.trim() : null
      const location = typeof f?.location === 'string' ? f.location.trim() : null
      return { filename: filename || null, location: location || null }
    }
  } catch {}
  return { filename: null, location: null }
}

// Derive an S3 object key from a full URL. Handles:
//  - virtual‑hosted style: https://<bucket>.<region>.digitaloceanspaces.com/<key>
//  - path style:          https://<region>.digitaloceanspaces.com/<bucket>/<key>
// If host isn't a Spaces host (e.g., CDN), we fall back to pathname logic.
function keyFromLocation(location: string, bucketHint?: string): string | null {
  try {
    const u = new URL(location)
    const host = u.host.toLowerCase()
    const path = u.pathname.replace(/^\/+/, '') // strip leading slashes

    if (host.endsWith('digitaloceanspaces.com')) {
      // virtual‑hosted: "<bucket>.<region>.digitaloceanspaces.com"
      const maybeBucket = host.split('.')[0]
      if (bucketHint && maybeBucket === bucketHint) {
        // If URL host bucket matches our configured bucket, path is already <key>
        return path || null
      }
      // path style: "<region>.digitaloceanspaces.com/<bucket>/<key>"
      if (bucketHint && path.startsWith(bucketHint + '/')) {
        // Strip leading "<bucket>/" prefix -> return <key>
        return path.slice(bucketHint.length + 1) || null
      }
      // As a generic fallback, try removing the first path segment (assume it was bucket)
      const firstSlash = path.indexOf('/')
      if (firstSlash > 0) return path.slice(firstSlash + 1) || null
      return path || null
    }

    // Non‑Spaces host (e.g., CDN). Best effort: drop the first segment.
    const idx = path.indexOf('/')
    return idx >= 0 ? path.slice(idx + 1) || null : path || null
  } catch {
    return null // malformed URL
  }
}

// Fallback when only filename is known: keep the MP4 in the same folder as the JSON
function keyFromSameDir(jsonKey: string, filename: string): string {
  const dir = jsonKey.includes('/') ? jsonKey.slice(0, jsonKey.lastIndexOf('/') + 1) : ''
  return dir + filename
}

// HEAD the MP4 to verify it exists and enrich metadata (size/lastModified)
// Returns null if HEAD fails (404, timeout, etc.).
async function tryHead(
  s3: ReturnType<typeof getS3Client>,
  bucket: string,
  key: string
): Promise<Obj | null> {
  try {
    const head = await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }))
    return {
      Key: key,
      Size: Number(head.ContentLength ?? 0),
      LastModified: head.LastModified?.toISOString(),
    }
  } catch {
    return null
  }
}

// ----------------------------------------------------------------------------
// main handler
// ----------------------------------------------------------------------------

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Read & sanitize query params with reasonable bounds/defaults
    const q = getQuery(event)

    // Derive the trunk-based prefix from the authenticated user's cookie
    const userCookie = getCookie(event, 'user')
    let trunkId: string | null = null
    if (userCookie) {
      try {
        trunkId = JSON.parse(userCookie).trunkId || null
      } catch {}
    }
    if (!trunkId) {
      throw createError({ statusCode: 401, statusMessage: 'Missing trunk ID' })
    }

    const prefix =
      `${trunkId}/` + (typeof q.prefix === 'string' ? q.prefix : '') // only list within trunk folder
    const continuationToken =
      typeof q.continuationToken === 'string' ? q.continuationToken : undefined // S3 cursor (not returned in this version)
    const jsonLimit = Math.max(1, Math.min(200, Number(q.jsonLimit ?? DEFAULT_JSON_LIMIT))) // clamp 1..200
    const jsonConcurrency = Math.max(
      1,
      Math.min(8, Number(q.jsonConcurrency ?? DEFAULT_JSON_CONCURRENCY))
    ) // clamp 1..8

    // Runtime config carries private bucket credentials + names (server‑only)
    const rc = useRuntimeConfig()
    const bucket = rc.doSpaces.bucket
    if (!bucket)
      throw createError({
        statusCode: 500,
        statusMessage: 'Bucket not configured',
      })

    // Create S3 client for DO Spaces using credentials from runtime config
    const s3 = getS3Client()

    // ------------------------------------------------------------------------
    // STEP 1: list objects page‑by‑page, collecting ONLY up to `jsonLimit` JSONs
    //         This keeps memory bounded and avoids scanning the entire bucket.
    // ------------------------------------------------------------------------
    const jsonBatch: Obj[] = [] // small batch for this response
    let token = continuationToken // S3 pagination token (input)
    let nextToken: string | null = null // S3 pagination token (would be output)
    let pages = 0 // safety loop counter

    while (pages++ < PAGE_LOOP_LIMIT) {
      // Request one page of up to 1000 keys under `prefix`
      const out: ListObjectsV2CommandOutput = await s3.send(
        new ListObjectsV2Command({
          Bucket: bucket,
          Prefix: prefix || undefined,
          MaxKeys: 1000,
          ContinuationToken: token,
        })
      )

      // Collect JSONs until we reach `jsonLimit`; ignore non‑JSON objects here.
      for (const c of out.Contents ?? []) {
        if (!c.Key) continue // guard: empty keys shouldn't happen
        if (jsonBatch.length >= jsonLimit) break // stop early if we have enough
        if (c.Key.toLowerCase().endsWith('.json')) {
          jsonBatch.push({
            Key: c.Key,
            Size: Number(c.Size ?? 0),
            LastModified: c.LastModified?.toISOString(),
          })
        }
      }

      // If we reached our per‑call cap, remember the next token and exit the loop.
      if (jsonBatch.length >= jsonLimit) {
        nextToken = out.IsTruncated ? (out.NextContinuationToken ?? null) : null
        break
      }

      // If there are no more pages, exit; otherwise continue with new token.
      if (!out.IsTruncated) {
        nextToken = null
        break
      }

      token = out.NextContinuationToken // advance cursor
    }

    // ------------------------------------------------------------------------
    // STEP 2: process each JSON with small, fixed concurrency
    //         Each JSON is downloaded (with timeout), parsed, and used to derive
    //         the MP4 key. Optionally HEAD the MP4 to verify.
    // ------------------------------------------------------------------------

    // Generic timeout wrapper for SDK calls, using AbortController via client options
    async function sendWithTimeout<T>(
      fn: (signal: AbortSignal) => Promise<T>,
      ms: number,
      label: string
    ): Promise<T> {
      const ac = new AbortController()
      const t = setTimeout(() => ac.abort(), ms) // fire abort after `ms`
      try {
        // console.log(`[sendWithTimeout] Starting ${label}, timeout=${ms}ms`)
        // Pass the abort signal down into the SDK call via client options
        return await fn(ac.signal)
      } catch (err: any) {
        console.warn(`[timeout] ${label}: ${err?.name || err?.code || err}`)
        throw err // bubble up so the caller can handle and keep pipeline moving
      } finally {
        clearTimeout(t)
        // console.log(`[sendWithTimeout] Finished ${label}`)
      }
    }

    // Fetch JSON object text with a deadline; throws on timeout/empty body
    async function getObjectTextWithTimeout(
      s3: ReturnType<typeof getS3Client>,
      bucket: string,
      key: string,
      ms = 10000 // generous 10s per JSON
    ): Promise<string> {
      // console.log(`[getObjectTextWithTimeout] Fetching object: ${key}`)
      const got = await sendWithTimeout(
        (signal) =>
          s3.send(
            new GetObjectCommand({
              Bucket: bucket,
              Key: key,
            }),
            { abortSignal: signal }
          ),
        ms,
        `GetObject ${key}`
      )
      // @ts-ignore Body is an async iterable stream
      if (!got.Body) throw new Error('Empty JSON body')
      const text = await streamToString(got.Body)
      // console.log(`[getObjectTextWithTimeout] Retrieved JSON: ${key}, length=${text.length}`)
      return text
    }

    // HEAD the MP4 with a deadline to enrich/verify (non‑fatal if it fails)
    async function headObjectWithTimeout(
      s3: ReturnType<typeof getS3Client>,
      bucket: string,
      key: string,
      ms = 8000 // shorter deadline for HEAD
    ): Promise<Obj | null> {
      try {
        // console.log(`[headObjectWithTimeout] HEAD request for: ${key}`)
        const head = await sendWithTimeout(
          (signal) =>
            s3.send(
              new HeadObjectCommand({
                Bucket: bucket,
                Key: key,
              }),
              { abortSignal: signal }
            ),
          ms,
          `HeadObject ${key}`
        )
        // console.log(`[headObjectWithTimeout] Found: ${key}, size=${head.ContentLength}, lastModified=${head.LastModified}`)
        return {
          Key: key,
          Size: Number(head.ContentLength ?? 0),
          LastModified: head.LastModified?.toISOString(),
        }
      } catch (err) {
        console.warn(`[headObjectWithTimeout] Failed for ${key}:`, err)
        return null // treat as non‑blocking; UI can still show inferred key
      }
    }

    // Accumulator for results to return
    const records: RecordPair[] = []

    // Worker that handles ONE JSON object: fetch JSON, parse, derive MP4, HEAD MP4
    async function processOne(obj: Obj) {
      try {
        // console.log(`[processOne] Starting ${obj.Key}`)

        // 2a) Fetch + parse the JSON with timeout
        const text = await getObjectTextWithTimeout(s3, bucket, obj.Key, 10000)
        const data = JSON.parse(text)
        // console.log(`[processOne] Parsed JSON: ${obj.Key}`)

        // 2b) Extract filename/location for the MP4 from the JSON payload
        const { filename, location } = extractMp4Ref(data)
        // console.log(`[processOne] Extracted refs for ${obj.Key}: filename=${filename}, location=${location}`)

        // 2c) Derive MP4 key using URL when available; else same‑dir + filename
        let mp4Key: string | null = null
        if (location) {
          mp4Key = keyFromLocation(location, bucket)
          // console.log(`[processOne] keyFromLocation result: ${mp4Key}`)
        }
        if (!mp4Key && filename) {
          mp4Key = keyFromSameDir(obj.Key, filename)
          // console.log(`[processOne] keyFromSameDir result: ${mp4Key}`)
        }

        // 2d) Optionally verify/enrich the MP4 with HEAD; non‑fatal if it fails
        let mp4Obj: Obj | null = null
        if (mp4Key) {
          mp4Obj = await headObjectWithTimeout(s3, bucket, mp4Key, 8000)
        }

        // 2e) Normalize timing and push the consolidated record
        // ...inside processOne(), where you push to `records.push({ ... })`:
        const startedAt = typeof data?.started_at === 'number' ? data.started_at : null
        const endedAt = typeof data?.ended_at === 'number' ? data.ended_at : null
        const roomName = typeof data?.room_name === 'string' ? data.room_name : null

        // console.log(`[processOne] Computed timestamps for ${obj.Key}: startedAt=${startedAt}, endedAt=${endedAt}`)
        records.push({
          egressId: typeof data?.egress_id === 'string' ? data.egress_id : null,
          roomId: typeof data?.room_id === 'string' ? data.room_id : null,
          roomName,
          startedAt,
          endedAt,
          durationSeconds: durationFromNs(startedAt, endedAt), // << precise ns → s
          phoneNumber: extractPhoneFromRoomName(roomName), // << NEW
          json: { key: obj.Key, size: obj.Size, lastModified: obj.LastModified },
          mp4: mp4Obj
            ? {
                key: mp4Obj.Key,
                size: mp4Obj.Size,
                lastModified: mp4Obj.LastModified,
              }
            : mp4Key
              ? ({ key: mp4Key } as any)
              : null,
        })

        // console.log(`[processOne] Finished ${obj.Key}`)
      } catch (err) {
        // Ensure the pipeline keeps flowing even if this JSON is malformed or times out
        console.error(`[processOne] Error for ${obj.Key}:`, err)
        records.push({
          egressId: null,
          roomId: null,
          roomName: null,
          startedAt: null,
          endedAt: null,
          durationSeconds: null,
          phoneNumber: null,
          json: { key: obj.Key, size: obj.Size, lastModified: obj.LastModified },
          mp4: null,
        })
      }
    }

    // 2f) Execute workers in fixed‑size chunks (simpler than custom pools/races)
    const chunkSize = jsonConcurrency // e.g., 3
    // console.log(`[runPool] Starting pool with chunkSize=${chunkSize}, total=${jsonBatch.length}`)
    for (let i = 0; i < jsonBatch.length; i += chunkSize) {
      const slice = jsonBatch.slice(i, i + chunkSize)
      // console.log(`[runPool] Processing slice ${i}..${i + slice.length - 1}`)
      await Promise.all(slice.map(processOne)) // run up to chunkSize workers in parallel
    }
    // console.log('[runPool] Completed all JSON processing')

    // ------------------------------------------------------------------------
    // STEP 3: Sort newest first by whatever timestamp we have (MP4 or JSON)
    // ------------------------------------------------------------------------
    records.sort((a, b) => {
      const aTs = a.mp4?.lastModified ?? a.json?.lastModified ?? ''
      const bTs = b.mp4?.lastModified ?? b.json?.lastModified ?? ''
      return bTs > aTs ? 1 : bTs < aTs ? -1 : 0
    })

    // This endpoint returns just the array for simplicity. If the client needs
    // pagination (`nextToken`) or a public base URL, consider returning an object
    // that includes those fields.
    return records
  } catch (error: any) {
    console.error('[spaces/list] Error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Internal server error',
    })
  }
})
