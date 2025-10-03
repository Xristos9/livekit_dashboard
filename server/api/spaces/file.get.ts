import { getCookie, getQuery, createError, setHeaders, type H3Event } from 'h3'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getS3Client } from '~/server/utils/s3'

export default defineEventHandler(async (event: H3Event) => {
  try {
    const q = getQuery(event)
    const key = typeof q.key === 'string' ? q.key : null
    const download = q.download === '1' || q.download === 'true'
    if (!key) throw createError({ statusCode: 400, statusMessage: 'Missing key' })

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

    if (!key.startsWith(`${trunkId}/`)) {
      throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }

    const rc = useRuntimeConfig()
    const bucket = rc.doSpaces.bucket
    if (!bucket)
      throw createError({
        statusCode: 500,
        statusMessage: 'Bucket not configured',
      })

    const s3 = getS3Client()

    // Fetch object from Spaces
    const out = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }))
    if (!out.Body) throw createError({ statusCode: 404, statusMessage: 'Not found' })

    // Pass through headers
    const headers: Record<string, string> = {}
    if (out.ContentType) headers['content-type'] = out.ContentType
    if (out.ContentLength != null) headers['content-length'] = String(out.ContentLength)
    if (out.ETag) headers['etag'] = out.ETag
    if (download) {
      const filename = key.split('/').pop() || 'download'
      headers['content-disposition'] = `attachment; filename="${filename}"`
    }
    setHeaders(event, headers)

    // Stream body to client
    // @ts-ignore Body is a web/Node stream
    return out.Body
  } catch (error: any) {
    console.error('[spaces/file] Error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Internal server error',
    })
  }
})
