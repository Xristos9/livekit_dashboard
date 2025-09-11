import { defineEventHandler, createError, getCookie } from 'h3'
import type { Call, CallStats } from '@/types/cold-calling'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiKey = config.airtable?.apiKey
  const baseId = config.airtable?.baseId

  if (!apiKey || !baseId) {
    throw createError({ statusCode: 500, statusMessage: 'Airtable credentials not configured' })
  }

  // Check authentication
  const userCookie = getCookie(event, 'user')
  if (!userCookie) {
    throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
  }

  async function fetchAllRecords(table: string, filter?: string) {
    const records: any[] = []
    let offset: string | undefined

    do {
      const url = new URL(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`)
      if (offset) url.searchParams.set('offset', offset)
      if (filter) url.searchParams.set('filterByFormula', filter)
      url.searchParams.set('sort[0][field]', 'CreatedAt')
      url.searchParams.set('sort[0][direction]', 'desc')

      const resp = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${apiKey}` },
      })

      if (!resp.ok) {
        throw createError({ statusCode: resp.status, statusMessage: 'Airtable request failed' })
      }

      const data = await resp.json()
      records.push(...(data.records || []))
      offset = data.offset
    } while (offset)

    return records
  }

  try {
    // Fetch all calls from the Calls table
    const callRecords = await fetchAllRecords('Calls')

    // Transform Airtable records to our Call interface
    const calls: Call[] = callRecords.map((record: any) => {
      const fields = record.fields || {}
      return {
        id: record.id,
        sessionId: fields.SessionID || '',
        phone: fields.Phone || '',
        status: fields.Status || 'negative',
        callbackAt: fields.CallbackAt || undefined,
        createdAt: fields.CreatedAt || new Date().toISOString(),
      }
    })

    // Calculate statistics
    const totalCalls = calls.length
    const callbacks = calls.filter((call) => call.status === 'callback')
    const negative = calls.filter((call) => call.status === 'negative')

    const stats: CallStats = {
      totalCalls,
      callbacks: callbacks.length,
      negative: negative.length,
      callbackPercentage: totalCalls > 0 ? (callbacks.length / totalCalls) * 100 : 0,
      negativePercentage: totalCalls > 0 ? (negative.length / totalCalls) * 100 : 0,
    }

    return {
      calls,
      callbacks,
      stats,
    }
  } catch (error: any) {
    console.error('[cold-calling] Error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Internal server error',
    })
  }
})
