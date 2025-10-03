import { defineEventHandler, createError, getCookie } from 'h3'
import type {
  Session,
  AgentUsage,
  CallReason,
  DashboardApiPayload,
  KPIData,
} from '@/types/dashboard'

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
  let recordId: number | undefined
  let customerId: string | undefined
  let name: string | undefined
  let email: string | undefined
  let trunkId: string | undefined
  let totalSessions: number | undefined
  let averageSessionDuration: number | undefined
  let costPerMinute: number | undefined
  let totalSessionDuration: number | undefined
  let totalCost: number | undefined
  let username: string | undefined
  try {
    let userData = JSON.parse(userCookie)
    recordId = userData.recID
    customerId = userData.id
    name = userData.name
    email = userData.email
    trunkId = userData.trunkId
    totalSessions = userData.totalSessions
    averageSessionDuration = userData.averageSessionDuration
    const parsedCostPerMinute = Number(userData.costPerMinute)
    costPerMinute = Number.isFinite(parsedCostPerMinute) ? parsedCostPerMinute : undefined
    totalSessionDuration = userData.totalSessionDuration
    totalCost = userData.totalCost
    username = userData.username
  } catch {}
  if (!customerId) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid user cookie' })
  }

  const sessionFilter = `FIND('${customerId}', {Customer})`
  const sessionRecords = await fetchAll(sessionsTable, sessionFilter)
  // console.log(`Fetched ${sessionRecords.length} sessions for user ${username || customerId}`)
  // console.log(sessionRecords)

  const sessionIds = sessionRecords.map((r: any) => r.fields?.['Session ID'])
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

    const agents = Array.from(
      new Set(
        logIds
          .map((id: string) => logMap.get(id)?.fields?.['Agent Name'])
          .filter((a): a is string => typeof a === 'string')
      )
    )

    const rawDurationSeconds = Number(f['Duration (s)'] ?? 0)
    const durationSeconds = Math.round(rawDurationSeconds * 100) / 100
    const durationMinutes = durationSeconds / 60
    const perMinuteRate =
      typeof costPerMinute === 'number' && Number.isFinite(costPerMinute) ? costPerMinute : 0
    const sessionCost = durationMinutes * perMinuteRate

    return {
      id: f['Session ID'] || rec.id,
      date,
      duration: durationSeconds,
      agents,
      model: firstLog?.fields?.['Model'] || '-',
      cost: sessionCost,
      callReason: reason,
    }
  })
  const agentUsageMap: Record<string, number> = {}

  for (const session of sessions) {
    for (const agent of session.agents) {
      agentUsageMap[agent] = (agentUsageMap[agent] || 0) + 1
    }
  }

  const agentUsage: AgentUsage[] = Object.entries(agentUsageMap)
    .map(([agent, usageCount]) => ({
      agent,
      usageCount,
    }))
    .sort((a, b) => b.usageCount - a.usageCount)

  const callReasons: CallReason[] = Object.entries(callReasonMap).map(([reason, count]) => ({
    reason,
    count,
  }))

  const payload: DashboardApiPayload = { sessions, agentUsage, callReasons }

  return payload
})
