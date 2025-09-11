export interface Call {
  id: string
  sessionId: string
  phone: string
  status: 'negative' | 'callback'
  callbackAt?: string
  createdAt: string
}

export interface CallStats {
  totalCalls: number
  callbacks: number
  negative: number
  callbackPercentage: number
  negativePercentage: number
}
