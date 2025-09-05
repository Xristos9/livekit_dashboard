import { defineEventHandler, createError, getCookie } from 'h3'
import type { Session, TokenLog, ModelCost, AgentCost, CallReason } from '@/types/ai-dashboard'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiKey = config.airtable?.apiKey
  const baseId = config.airtable?.baseId
  const sessionsTable = config.airtable?.sessionsTable || 'Sessions'
  const agentLogsTable = config.airtable?.agentLogsTable || 'Agent Logs'

  if (!apiKey || !baseId) {
    throw createError({ statusCode: 500, statusMessage: 'Airtable credentials not configured' })
  }

  async function fetchAll(table: string, filter?: string) {
    const records: any[] = []
    let offset: string | undefined
    do {
      const url = new URL(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`)
      if (offset) url.searchParams.set('offset', offset)
      if (filter) url.searchParams.set('filterByFormula', filter)
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

  const userCookie = getCookie(event, 'user')
  if (!userCookie) {
    throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
  }
  let customerId: string | undefined
  try {
    customerId = JSON.parse(userCookie).id
  } catch {}
  if (!customerId) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid user cookie' })
  }

  const sessionFilter = `FIND('${customerId}', {Customer})`
  const sessionRecords = await fetchAll(sessionsTable, sessionFilter)

  const sessionIds = sessionRecords.map((r: any) => r.id)
  let logRecords: any[] = []
  if (sessionIds.length > 0) {
    const logFilter =
      sessionIds.length === 1
        ? `FIND('${sessionIds[0]}', {Session})`
        : `OR(${sessionIds.map((id: string) => `FIND('${id}', {Session})`).join(',')})`
    logRecords = await fetchAll(agentLogsTable, logFilter)
  }

  const logMap = new Map<string, any>()
  for (const log of logRecords) {
    logMap.set(log.id, log)
  }

  const callReasonMap: Record<string, number> = {}

  const sessions: Session[] = sessionRecords.map((rec: any) => {
    const f = rec.fields || {}
    const logIds: string[] = Array.isArray(f['Agent Logs']) ? f['Agent Logs'] : []
    const firstLog = logIds.length > 0 ? logMap.get(logIds[0]) : undefined
    const start = f['Start Time']
    const date = start ? new Date(start).toISOString().split('T')[0] : ''
    const reason = typeof f['Call Reason'] === 'string' ? f['Call Reason'] : 'Unknown'
    callReasonMap[reason] = (callReasonMap[reason] || 0) + 1
    return {
      id: f['Session ID'] || rec.id,
      date,
      duration: Number(f['Duration (s)'] ?? f['Calculated Duration (s)'] ?? 0),
      agent: firstLog?.fields?.['Agent Name'] || '-',
      model: firstLog?.fields?.['Model'] || '-',
      cost: Number(f['Total Cost (USD)'] ?? 0),
      callReason: reason,
    }
  })

  const tokenLogs: TokenLog[] = logRecords.map((rec: any) => {
    const f = rec.fields || {}
    const sessionField = f['Session']
    const session = Array.isArray(sessionField) ? sessionField[0] : sessionField || ''
    return {
      session,
      prompt: Number(f['Prompt Token Count'] ?? 0),
      completion: Number(f['Completion Token Count'] ?? 0),
      cached: Number(f['Cached Token Count'] ?? 0),
    }
  })

  const modelCostMap: Record<string, number> = {}
  const agentCostMap: Record<string, number> = {}

  for (const rec of logRecords) {
    const f = rec.fields || {}
    const model = f['Model']
    const agent = f['Agent Name']
    const cost = Number(f['Cost (USD)'] ?? 0)
    if (typeof model === 'string') {
      modelCostMap[model] = (modelCostMap[model] || 0) + cost
    }
    if (typeof agent === 'string') {
      agentCostMap[agent] = (agentCostMap[agent] || 0) + cost
    }
  }

  const modelCosts: ModelCost[] = Object.entries(modelCostMap).map(([model, cost]) => ({
    model,
    cost,
  }))

  const agentCosts: AgentCost[] = Object.entries(agentCostMap).map(([agent, cost]) => ({
    agent,
    cost,
  }))

  const callReasons: CallReason[] = Object.entries(callReasonMap).map(([reason, count]) => ({ reason, count }))

  return { sessions, tokenLogs, modelCosts, agentCosts, callReasons }
})
