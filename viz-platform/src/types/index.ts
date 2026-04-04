export interface ChartConfig {
  id: string
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'table' | 'gauge' | 'radar' | 'kpi' | 'funnel' | 'heatmap'
  title: string
  dataSource: string
  width: number
  height: number
  x: number
  y: number
  options: Record<string, any>
}

export interface Dashboard {
  id: string
  name: string
  description: string
  charts: ChartConfig[]
  layout: 'grid' | 'free'
  createdAt: string
  updatedAt: string
}

export interface DataSource {
  id: string
  name: string
  type: 'api' | 'static' | 'database'
  config: Record<string, any>
}

export interface QueryResult {
  columns: string[]
  rows: Record<string, any>[]
  total: number
}
