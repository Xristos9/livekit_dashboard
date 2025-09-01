import { log } from 'console'
import { defineEventHandler, readBody, createError } from 'h3'

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
  log('Airtable login URL:', url)
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
    const { Password, ...user } = record.fields
    return { success: true, user }
  }

  return { success: false, message: 'Invalid credentials' }
})
