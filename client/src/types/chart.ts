export interface ChartDataPoint {
  time: string
  vibration: number
  temperature: number
  threshold: number
}

export interface RiskHistoryPoint {
  time: string
  failureProbability: number
  riskLevel: 'normal' | 'warning' | 'critical'
}


