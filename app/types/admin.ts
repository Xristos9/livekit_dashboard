export interface AdminCustomerSummary {
  id: string
  name: string
  email?: string
  trunkId?: string
  username?: string
  costPerMinute: number
  commissionRatePerMinute: number
  totalMinutes: number
  totalSessions: number
  averageSessionDurationMinutes: number
  totalCost: number
  commission: number
  openAiCost: number
  profit: number
  openAiProjectId?: string
  lastSessionAt?: string
  peakUsageDay?: string
  peakUsageHour?: number
}

export interface AdminUsageTimelineEntry {
  date: string
  totalMinutes: number
  totalCost: number
  openAiCost: number
  profit: number
}

export interface AdminUsagePatternReport {
  customerId: string
  name: string
  totalSessions: number
  totalMinutes: number
  averageSessionDurationMinutes: number
  peakUsageDay?: string
  peakUsageHour?: number
}

export interface AdminTotalsSummary {
  totalCustomers: number
  totalMinutes: number
  totalSessions: number
  totalCost: number
  totalCommission: number
  totalOpenAiCost: number
  totalProfit: number
}

export interface AdminOverviewMeta {
  startTime: string
  endTime: string
  openAiCostAvailable: boolean
  openAiCurrency?: string
  currency: string
}

export interface AdminOverviewPayload {
  totals: AdminTotalsSummary
  customers: AdminCustomerSummary[]
  timeline: AdminUsageTimelineEntry[]
  reports: {
    customerUsagePatterns: AdminUsagePatternReport[]
  }
  meta: AdminOverviewMeta
}

export interface CreateCustomerPayload {
  name: string
  email: string
  username: string
  password: string
  costPerMinute: number
  trunkId?: string
  openAiProjectId?: string
  commissionPerMinute?: number
}
