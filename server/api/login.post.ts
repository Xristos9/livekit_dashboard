import { defineEventHandler, readBody, createError, setCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody<{ username?: string; password?: string }>(event)

  if (!username || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Username and password required' })
  }

  const { airtable } = useRuntimeConfig()
  const { apiKey, baseId } = airtable || {}

  if (!apiKey || !baseId) {
    throw createError({ statusCode: 500, statusMessage: 'Airtable credentials not configured' })
  }

  const escapeValue = (v: string) => v.replace(/'/g, "\\'")
  const filter = `{Username}='${escapeValue(username)}'`
  const url = `https://api.airtable.com/v0/${baseId}/Users?filterByFormula=${encodeURIComponent(filter)}&maxRecords=1`

  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })

  if (!resp.ok) {
    throw createError({ statusCode: resp.status, statusMessage: 'Airtable request failed' })
  }

  const data = await resp.json()
  const record = Array.isArray(data.records) ? data.records[0] : null

  if (record && record.fields?.Password === password) {
    const secure = process.env.NODE_ENV === 'production'
    setCookie(event, 'user', JSON.stringify(record.fields), {
      path: '/',
      sameSite: 'lax',
      secure,
      httpOnly: false,
    })
    return { success: true, user: record.fields }
  }

  return { success: false, message: 'Invalid credentials' }
})
