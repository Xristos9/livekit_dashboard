export interface Lead {
  id: string
  phone: string
  firstName?: string
  lastName?: string
  company?: string
  status: 'queued' | 'dialing' | 'in-call' | 'completed' | 'failed' | 'skipped'
  disposition?: string
  createdAt: string
  updatedAt?: string
}

export interface Agent {
  id: string
  name: string
  status: 'idle' | 'calling' | 'paused' | 'error'
  capacity: number
  callerId: string
  voicemailDrop: boolean
  timezone: string
  currentCalls: number
}

export interface ActiveCall {
  id: string
  phone: string
  leadName: string
  status: 'dialing' | 'in-call'
  startedAt: string
  agentId: string
}

export interface ActivityLogEntry {
  id: string
  timestamp: string
  type: 'dial' | 'success' | 'failure' | 'pause' | 'resume' | 'start' | 'stop'
  message: string
  leadId?: string
  agentId?: string
}

export interface DialerStats {
  queued: number
  active: number
  completed: number
  failed: number
  skipped: number
  total: number
}

export interface CSVMapping {
  phone: string
  firstName?: string
  lastName?: string
  company?: string
}

export interface DataSource {
  id: string
  name: string
  type: 'csv' | 'crm' | 'warehouse' | 's3'
}
