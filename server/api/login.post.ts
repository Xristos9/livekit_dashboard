import { log } from 'console'
import { defineEventHandler, readBody, createError, setCookie } from 'h3'
import { randomBytes } from 'crypto'

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody<{ username?: string; password?: string }>(event)

  if (!username || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Username and password required' })
  }

  const config = useRuntimeConfig()
  const apiKey = config.airtable?.apiKey
  const baseId = config.airtable?.baseId
  const table = config.airtable?.tableName

  if (!apiKey || !baseId) {
    throw createError({ statusCode: 500, statusMessage: 'Airtable credentials not configured' })
  }

  const escapeValue = (v: string) => v.replace(/'/g, "\\'")
  const filter = `{Username}='${escapeValue(username)}'`
  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}?filterByFormula=${encodeURIComponent(filter)}&maxRecords=1`
  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })

  if (!resp.ok) {
    let detail: string | undefined
    try {
      const body = await resp.json()
      detail = body?.error?.message || JSON.stringify(body)
    } catch {}
    throw createError({
      statusCode: resp.status,
      statusMessage: 'Airtable request failed',
      message: detail,
    })
  }

  const data = await resp.json()
  const record = Array.isArray(data.records) ? data.records[0] : null

  if (record && record.fields?.Password === password) {
    const userData = {
      id: record.id,
      recID: record.fields?.ID,
      name: record.fields?.Name,
      email: record.fields?.Email,
      trunkId: record.fields?.['Trunk ID'],
      sessions: record.fields?.Sessions,
      totalSessions: record.fields?.['Total Sessions'],
      totalCostUSD: record.fields?.['Total Cost (USD)'],
      averageSessionDuration: record.fields?.['Average Session Duration (s)'],
      username: record.fields?.Username,
    }

    // store user information in a cookie accessible on client
    setCookie(event, 'user', JSON.stringify(userData), {
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60, // 1 hour
    })

    const token = randomBytes(16).toString('hex')
    setCookie(event, 'session', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60, // 1 hour
    })

    return { success: true, user: userData }
  }

  return { success: false, message: 'Invalid credentials' }
})
