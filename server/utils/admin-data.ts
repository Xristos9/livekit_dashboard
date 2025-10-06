import { createError } from 'h3'
import type {
  AdminCustomerSummary,
  AdminOverviewMeta,
  AdminOverviewPayload,
  AdminTotalsSummary,
  AdminUsagePatternReport,
  AdminUsageTimelineEntry,
} from '@/types/admin'

interface BuildAdminOverviewOptions {
  config: any
  startTime: number
  endTime: number
  includeTimeline?: boolean
}

interface AirtableRecord<T = any> {
  id: string
  fields: T
}

interface AirtableListResponse<T = any> {
  records: AirtableRecord<T>[]
  offset?: string
}

interface TimelineAccumulator {
  totalMinutes: number
  totalCost: number
}

interface AirtableCustomerFields {
  ID?: string
  Name?: string
  Email?: string
  Username?: string
  Password?: string
  ['Trunk ID']?: string
  ['Cost per Minute']?: number | string
  ['Commission Rate (Euro per Minute)']?: number | string
  ['OpenAI Project ID']?: string
}

interface AirtableSessionFields {
  ['Session ID']?: string
  ['Start Time']?: string
  ['Duration (s)']?: number | string
  ['Customer']?: string[]
  ['Commission Cost (Euro)']?: number | string
}

interface OpenAICostBucketResult {
  amount?: {
    value?: number
    currency?: string
  }
  project_id?: string | null
}

interface OpenAICostBucket {
  start_time: number
  end_time: number
  results: OpenAICostBucketResult[]
}

interface OpenAICostResponse {
  object: string
  data: OpenAICostBucket[]
  has_more?: boolean
  next_page?: string | null
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const COMMISSION_RATE_DEFAULT = 0.04

export async function buildAdminOverview({
  config,
  startTime,
  endTime,
  includeTimeline = true,
}: BuildAdminOverviewOptions): Promise<AdminOverviewPayload> {
  if (!config?.airtable?.apiKey || !config?.airtable?.baseId) {
    throw createError({ statusCode: 500, statusMessage: 'Airtable credentials not configured' })
  }

  const airtableApiKey: string = config.airtable.apiKey
  const airtableBaseId: string = config.airtable.baseId
  const customersTable: string = config.airtable.tableName || 'Customers'
  const sessionsTable: string = config.airtable.sessionsTable || 'Sessions'

  async function fetchAll<T = any>(table: string): Promise<AirtableRecord<T>[]> {
    const records: AirtableRecord<T>[] = []
    let offset: string | undefined
    do {
      const url = new URL(`https://api.airtable.com/v0/${airtableBaseId}/${encodeURIComponent(table)}`)
      if (offset) {
        url.searchParams.set('offset', offset)
      }
      const resp = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${airtableApiKey}` },
      })
      if (!resp.ok) {
        throw createError({ statusCode: resp.status, statusMessage: `Failed to load ${table}` })
      }
      const data = (await resp.json()) as AirtableListResponse<T>
      records.push(...(data.records || []))
      offset = data.offset
    } while (offset)
    return records
  }

  const [customerRecords, sessionRecords] = await Promise.all([
    fetchAll<AirtableCustomerFields>(customersTable),
    fetchAll<AirtableSessionFields>(sessionsTable),
  ])

  const customersMap = new Map<string, AdminCustomerSummary>()
  const customerDayUsage = new Map<string, number[]>()
  const customerHourUsage = new Map<string, number[]>()
  const customerLastSession = new Map<string, number>()

  for (const record of customerRecords) {
    const fields = record.fields || {}
    const costPerMinute = Number(fields['Cost per Minute'] ?? 0) || 0
    const commissionRate =
      Number(fields['Commission Rate (Euro per Minute)'] ?? COMMISSION_RATE_DEFAULT) || COMMISSION_RATE_DEFAULT

    const summary: AdminCustomerSummary = {
      id: record.id,
      name: fields.Name || 'Unknown Customer',
      email: fields.Email,
      trunkId: fields['Trunk ID'],
      username: fields.Username,
      costPerMinute,
      commissionRatePerMinute: commissionRate,
      totalMinutes: 0,
      totalSessions: 0,
      averageSessionDurationMinutes: 0,
      totalCost: 0,
      commission: 0,
      openAiCost: 0,
      profit: 0,
      openAiProjectId: fields['OpenAI Project ID'] || undefined,
      lastSessionAt: undefined,
      peakUsageDay: undefined,
      peakUsageHour: undefined,
    }

    customersMap.set(record.id, summary)
    customerDayUsage.set(record.id, new Array(7).fill(0))
    customerHourUsage.set(record.id, new Array(24).fill(0))
  }

  const timelineAccumulator = new Map<string, TimelineAccumulator>()

  const startMs = startTime * 1000
  const endMs = endTime * 1000

  for (const record of sessionRecords) {
    const fields = record.fields || {}
    const start = fields['Start Time'] ? new Date(fields['Start Time']) : null
    if (!start || Number.isNaN(start.getTime())) {
      continue
    }
    const startTimestamp = start.getTime()
    if (startTimestamp < startMs || startTimestamp >= endMs) {
      continue
    }

    const customerId = Array.isArray(fields['Customer']) ? fields['Customer'][0] : undefined
    if (!customerId) {
      continue
    }
    const summary = customersMap.get(customerId)
    if (!summary) {
      continue
    }

    const durationSeconds = Number(fields['Duration (s)'] ?? 0) || 0
    const durationMinutes = durationSeconds / 60

    summary.totalSessions += 1
    summary.totalMinutes += durationMinutes
    summary.totalCost += durationMinutes * summary.costPerMinute
    summary.commission += durationMinutes * summary.commissionRatePerMinute

    if (!summary.lastSessionAt || startTimestamp > (customerLastSession.get(customerId) || 0)) {
      summary.lastSessionAt = start.toISOString()
      customerLastSession.set(customerId, startTimestamp)
    }

    const dayUsage = customerDayUsage.get(customerId)
    const hourUsage = customerHourUsage.get(customerId)
    if (dayUsage) {
      const dayIndex = start.getUTCDay()
      dayUsage[dayIndex] = (dayUsage[dayIndex] || 0) + 1
    }
    if (hourUsage) {
      const hourIndex = start.getUTCHours()
      hourUsage[hourIndex] = (hourUsage[hourIndex] || 0) + 1
    }

    if (includeTimeline) {
      const dateKey = start.toISOString().split('T')[0]
      const current = timelineAccumulator.get(dateKey) || { totalMinutes: 0, totalCost: 0 }
      current.totalMinutes += durationMinutes
      current.totalCost += durationMinutes * summary.costPerMinute
      timelineAccumulator.set(dateKey, current)
    }
  }

  const openAiProjectCosts = new Map<string, number>()
  const openAiDailyTotals = new Map<string, number>()
  let openAiCurrency: string | undefined
  let openAiCostAvailable = false

  if (config?.openai?.adminKey) {
    openAiCostAvailable = true
    const openAiBase: string = config.openai.costApiBase || 'https://api.openai.com/v1'
    const usdToEurRate: number = Number(config.openai.usdToEurRate ?? 0.92) || 1
    const knownProjectIds = Array.from(customersMap.values())
      .map((customer) => customer.openAiProjectId)
      .filter((id): id is string => Boolean(id))

    let nextPage: string | undefined
    do {
      const url = new URL(`${openAiBase.replace(/\/$/, '')}/organization/costs`)
      url.searchParams.set('start_time', String(startTime))
      url.searchParams.set('end_time', String(endTime))
      url.searchParams.set('bucket_width', '1d')
      url.searchParams.append('group_by', 'project_id')
      url.searchParams.set('limit', '90')
      if (knownProjectIds.length > 0) {
        for (const projectId of knownProjectIds) {
          url.searchParams.append('project_ids[]', projectId)
        }
      }
      if (nextPage) {
        url.searchParams.set('page', nextPage)
      }

      const resp = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${config.openai.adminKey}`,
          'Content-Type': 'application/json',
        },
      })

      if (!resp.ok) {
        throw createError({ statusCode: resp.status, statusMessage: 'Failed to load OpenAI costs' })
      }

      const payload = (await resp.json()) as OpenAICostResponse
      const buckets = Array.isArray(payload.data) ? payload.data : []
      for (const bucket of buckets) {
        const dateKey = new Date(bucket.start_time * 1000).toISOString().split('T')[0]
        let bucketTotal = 0
        for (const result of bucket.results || []) {
          const value = Number(result.amount?.value ?? 0) || 0
          const currency = result.amount?.currency
          if (!openAiCurrency && currency) {
            openAiCurrency = currency.toLowerCase()
          }
          bucketTotal += value
          const projectId = result.project_id || undefined
          if (projectId) {
            openAiProjectCosts.set(projectId, (openAiProjectCosts.get(projectId) || 0) + value)
          }
        }
        openAiDailyTotals.set(dateKey, (openAiDailyTotals.get(dateKey) || 0) + bucketTotal)
      }
      nextPage = payload.has_more ? payload.next_page ?? undefined : undefined
    } while (nextPage)

    const shouldConvert = !openAiCurrency || openAiCurrency === 'usd'
    const conversionRate = shouldConvert ? usdToEurRate : 1

    if (conversionRate !== 1 || shouldConvert) {
      for (const [projectId, value] of Array.from(openAiProjectCosts.entries())) {
        openAiProjectCosts.set(projectId, value * conversionRate)
      }
      for (const [dateKey, value] of Array.from(openAiDailyTotals.entries())) {
        openAiDailyTotals.set(dateKey, value * conversionRate)
      }
      openAiCurrency = shouldConvert ? 'usd' : openAiCurrency
    }
  }

  let totalMinutes = 0
  let totalSessions = 0
  let totalCost = 0
  let totalCommission = 0
  let totalOpenAiCost = 0

  const customers: AdminCustomerSummary[] = []
  const usagePatterns: AdminUsagePatternReport[] = []

  for (const customer of customersMap.values()) {
    if (customer.totalSessions > 0) {
      customer.averageSessionDurationMinutes = customer.totalMinutes / customer.totalSessions
    }

    if (customer.openAiProjectId && openAiProjectCosts.has(customer.openAiProjectId)) {
      customer.openAiCost = openAiProjectCosts.get(customer.openAiProjectId) || 0
    } else {
      customer.openAiCost = 0
    }

    customer.profit = customer.totalCost - customer.openAiCost

    totalMinutes += customer.totalMinutes
    totalSessions += customer.totalSessions
    totalCost += customer.totalCost
    totalCommission += customer.commission
    totalOpenAiCost += customer.openAiCost

    const dayUsage = customerDayUsage.get(customer.id) || []
    const hourUsage = customerHourUsage.get(customer.id) || []
    let peakDay: string | undefined
    let peakHour: number | undefined
    if (dayUsage.length) {
      const maxDayIndex = dayUsage.reduce((maxIdx, value, idx, arr) => (value > arr[maxIdx] ? idx : maxIdx), 0)
      peakDay = dayUsage[maxDayIndex] > 0 ? DAY_NAMES[maxDayIndex] : undefined
    }
    if (hourUsage.length) {
      const maxHourIndex = hourUsage.reduce((maxIdx, value, idx, arr) => (value > arr[maxIdx] ? idx : maxIdx), 0)
      peakHour = hourUsage[maxHourIndex] > 0 ? maxHourIndex : undefined
    }

    customer.peakUsageDay = peakDay
    customer.peakUsageHour = peakHour

    customers.push(customer)
    usagePatterns.push({
      customerId: customer.id,
      name: customer.name,
      totalSessions: customer.totalSessions,
      totalMinutes: customer.totalMinutes,
      averageSessionDurationMinutes: customer.averageSessionDurationMinutes,
      peakUsageDay: peakDay,
      peakUsageHour: peakHour,
    })
  }

  customers.sort((a, b) => b.totalMinutes - a.totalMinutes)

  const timeline: AdminUsageTimelineEntry[] = []
  if (includeTimeline) {
    for (const [date, value] of Array.from(timelineAccumulator.entries()).sort(([a], [b]) => (a < b ? -1 : 1))) {
      const openAiCost = openAiDailyTotals.get(date) || 0
      timeline.push({
        date,
        totalMinutes: value.totalMinutes,
        totalCost: value.totalCost,
        openAiCost,
        profit: value.totalCost - openAiCost,
      })
    }
  }

  const totals: AdminTotalsSummary = {
    totalCustomers: customers.length,
    totalMinutes,
    totalSessions,
    totalCost,
    totalCommission,
    totalOpenAiCost,
    totalProfit: totalCost - totalOpenAiCost,
  }

  const meta: AdminOverviewMeta = {
    startTime: new Date(startMs).toISOString(),
    endTime: new Date(endMs).toISOString(),
    openAiCostAvailable,
    openAiCurrency,
    currency: 'EUR',
  }

  return {
    totals,
    customers,
    timeline,
    reports: {
      customerUsagePatterns: usagePatterns,
    },
    meta,
  }
}
