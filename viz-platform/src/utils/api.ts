const API_BASE = '/api'

async function fetchApi<T>(url: string): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

// 各数据源API
export const api = {
  sceneEmission: () => fetchApi<any[]>('/data/scene-emission'),
  creditSource: () => fetchApi<any[]>('/data/credit-source'),
  userCarbon: () => fetchApi<any[]>('/data/user-carbon'),
  footprintTrend: () => fetchApi<any[]>('/data/footprint-trend'),
  activityFunnel: () => fetchApi<any[]>('/data/activity-funnel'),
  communityHeatmap: () => fetchApi<any[]>('/data/community-heatmap'),
  lowcarbonRank: () => fetchApi<any[]>('/data/lowcarbon-rank'),
  userPerformance: () => fetchApi<any[]>('/data/user-performance'),
  kpi: () => fetchApi<any>('/data/kpi'),

  // 视频创作
  videoTasks: (status?: string) => fetchApi<any[]>(`/video/tasks${status ? '?status=' + status : ''}`),
  videoTask: (id: number) => fetchApi<any>(`/video/tasks/${id}`),
  videoGenerate: (data: any) => fetch('/api/video/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json()),
  videoDelete: (id: number) => fetch(`/api/video/tasks/${id}`, { method: 'DELETE' }).then(r => r.json()),
  videoStats: () => fetchApi<any>('/video/stats'),
}
