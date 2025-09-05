export interface Session {
  id: string
  date: string
  duration: number
  agents: string[]
  model: string
  cost: number
  callReason: string
}

export interface TokenLog {
  session: string
  prompt: number
  completion: number
  cached: number
}

export interface ModelCost {
  model: string
  cost: number
}

export interface AgentCost {
  agent: string
  cost: number
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
