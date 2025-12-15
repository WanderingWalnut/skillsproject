/**
 * API response types matching backend Pydantic schemas.
 */

export interface TrainResponse {
    model_id: string
    rows_used: number
    assets: number
    positive_rate: number
    metrics: Record<string, number>
    model_path: string | null
}

export type RiskLevel = 'normal' | 'warning' | 'critical'

export interface AssetAssessment {
    asset_id: string
    timestamp: string
    temperature: number
    vibration: number
    pressure: number
    current: number
    failure_probability: number
    risk_level: RiskLevel
}

export interface PredictResponse {
    model_id: string
    assessments: AssetAssessment[]
}

