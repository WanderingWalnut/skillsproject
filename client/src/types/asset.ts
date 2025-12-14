export type RiskStatus = 'normal' | 'warning' | 'critical'

export type WorkflowStep = 0 | 1 | 2 | 3

export interface Asset {
  id: string
  name: string
  status: RiskStatus
  temp: number
  vibration: number
  efficiency: number
  lastReading: string
  prediction: string
  action: string
}


