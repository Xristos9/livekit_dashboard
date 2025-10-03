export interface Session {
  id: string
  date: string
  duration: number
  agents: string[]
  model: string
  cost: number
  callReason: string
  roomName?: string | null
}

export interface AgentUsage {
  agent: string
  usageCount: number
}
export interface CallReason {
  reason: string
  count: number
}

export interface KPIData {
  totalSessions: number
  totalCost: number
  avgDuration: number
  avgCostPerSession: number
}

export interface DashboardApiPayload {
  sessions: Session[]
  agentUsage: AgentUsage[]
  callReasons: CallReason[]
}
