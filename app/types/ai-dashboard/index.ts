export interface Session {
  id: string
  date: string
  duration: number
  agent: string
  model: string
  cost: number
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

export interface KPIData {
  totalSessions: number
  totalCost: number
  avgDuration: number
  avgCostPerSession: number
}