import { createError, defineEventHandler, getQuery } from 'h3'
import { buildAdminOverview } from '~/server/utils/admin-data'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  const now = Math.floor(Date.now() / 1000)
  const maxDays = 365
  const queryDays = Number(query.days ?? 90)
  const days = Number.isFinite(queryDays) && queryDays > 0 ? Math.min(queryDays, maxDays) : 90

  const queryStart = Number(query.start_time)
  const queryEnd = Number(query.end_time)

  const endTime = Number.isFinite(queryEnd) && queryEnd > 0 ? queryEnd : now
  const startTime = Number.isFinite(queryStart) && queryStart > 0 ? queryStart : endTime - days * 24 * 60 * 60

  if (startTime >= endTime) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid time range specified' })
  }

  const overview = await buildAdminOverview({
    config,
    startTime,
    endTime,
    includeTimeline: false,
  })

  return {
    totals: overview.totals,
    customers: overview.customers,
    reports: overview.reports,
    meta: overview.meta,
  }
})
