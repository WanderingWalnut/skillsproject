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

