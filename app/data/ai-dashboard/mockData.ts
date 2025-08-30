import type { Session, TokenLog, ModelCost, AgentCost } from '@/types/ai-dashboard'

export const sessions: Session[] = [
  { id: 'session_ghi012', date: '2025-07-29', duration: 120, agent: 'Charlie', model: 'gpt-4o-mini-preview', cost: 0.020 },
  { id: 'session_pqr901', date: '2025-07-29', duration: 300, agent: '-', model: 'gpt-4o-mini-preview', cost: 0.060 },
  { id: 'session_xyz789', date: '2025-07-30', duration: 300, agent: 'Alice', model: 'gpt-4o-mini-preview', cost: 0.050 },
  { id: 'session_def456', date: '2025-07-31', duration: 300, agent: 'Bob', model: 'gpt-3.5-turbo', cost: 0.045 },
  { id: 'session_jkl345', date: '2025-07-30', duration: 300, agent: 'Dana', model: 'gpt-3.5-turbo', cost: 0.055 },
  { id: 'session_mno678', date: '2025-07-31', duration: 180, agent: 'Eve', model: 'gpt-4o-mini-preview', cost: 0.030 },
  { id: 'fake_room', date: '2025-07-31', duration: 57, agent: 'Alloy', model: 'gpt-4o-mini-realtime-preview', cost: 0.00228 },
]

export const tokenLogs: TokenLog[] = [
  { session: 'session_xyz789', prompt: 1200, completion: 900, cached: 300 },
  { session: 'session_def456', prompt: 1800, completion: 1600, cached: 200 },
  { session: 'session_ghi012', prompt: 1500, completion: 1000, cached: 500 },
  { session: 'session_mno678', prompt: 1300, completion: 600, cached: 700 },
  { session: 'session_jkl345', prompt: 1000, completion: 600, cached: 400 },
  { session: 'fake_room', prompt: 114, completion: 57, cached: 0 },
]

export const modelCosts: ModelCost[] = [
  { model: 'gpt-4o-mini-preview', cost: 0.045 + 0.050 + 0.030 + 0.060 + 0.020 },
  { model: 'gpt-3.5-turbo', cost: 0.045 + 0.055 },
  { model: 'gpt-4o-mini-realtime-preview', cost: 0.00228 },
]

export const agentCosts: AgentCost[] = [
  { agent: 'Alice', cost: 0.050 },
  { agent: 'Bob', cost: 0.045 },
  { agent: 'Charlie', cost: 0.020 },
  { agent: 'Dana', cost: 0.055 },
  { agent: 'Eve', cost: 0.030 },
  { agent: 'Alloy', cost: 0.00228 },
]