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

// Assets listing (GET /assets)
export interface AssetStatus {
    asset_id: string
    risk_level?: RiskLevel
    failure_probability?: number
    timestamp?: string
    model_id?: string
}

export interface AssetsResponse {
    assets: AssetStatus[]
}

// Asset detail (GET /assets/{asset_id})
export interface PredictionSummary {
    model_id: string
    timestamp: string
    risk_level: RiskLevel
    failure_probability: number
}

export interface HistoryPoint {
    model_id: string
    timestamp: string
    risk_level: RiskLevel
    failure_probability: number
}

export interface MetricsSnapshot {
    temperature: number
    vibration: number
    pressure: number
    current: number
}

export interface AssetDetailResponse {
    asset_id: string
    latest: PredictionSummary | null
    history: HistoryPoint[]
    metrics: MetricsSnapshot | null
}
