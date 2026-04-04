import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Dashboard, ChartConfig } from '../types'

const generateId = () => Math.random().toString(36).substring(2, 10)

const defaultDashboards: Dashboard[] = [
  {
    id: 'demo-lowcarbon',
    name: '低碳生活数字化管理平台',
    description: '低碳数据可视化大屏 — 全场景碳排放监控与碳积分运营',
    charts: [
      // 第一行：场景碳排放 | 碳积分来源 | 行为与排放关系
      {
        id: 'lc-1', type: 'bar', title: '各场景碳排放量对比',
        dataSource: 'scene-emission', width: 4, height: 4, x: 0, y: 0,
        options: { stack: true },
      },
      {
        id: 'lc-2', type: 'pie', title: '碳积分来源分布',
        dataSource: 'credit-source', width: 4, height: 4, x: 4, y: 0,
        options: {},
      },
      {
        id: 'lc-3', type: 'scatter', title: '用户行为与碳排放关系',
        dataSource: 'behavior-emission', width: 4, height: 4, x: 8, y: 0,
        options: {},
      },
      // 第二行：低碳排行榜 | 用户低碳表现 | 活动转化率
      {
        id: 'lc-4', type: 'bar', title: '低碳排行榜',
        dataSource: 'lowcarbon-rank', width: 4, height: 4, x: 0, y: 4,
        options: { horizontal: true },
      },
      {
        id: 'lc-5', type: 'radar', title: '用户低碳表现',
        dataSource: 'user-performance', width: 4, height: 4, x: 4, y: 4,
        options: {},
      },
      {
        id: 'lc-6', type: 'funnel', title: '低碳活动转化率',
        dataSource: 'activity-funnel', width: 4, height: 4, x: 8, y: 4,
        options: {},
      },
      // 第三行：碳足迹趋势 | 社区碳排放热力图 | 核心运营数据
      {
        id: 'lc-7', type: 'line', title: '用户碳足迹变化趋势',
        dataSource: 'footprint-trend', width: 4, height: 4, x: 0, y: 8,
        options: { smooth: true },
      },
      {
        id: 'lc-8', type: 'heatmap', title: '社区碳排放密度分布',
        dataSource: 'community-heatmap', width: 4, height: 4, x: 4, y: 8,
        options: {},
      },
      {
        id: 'lc-9', type: 'kpi', title: '平台核心运营数据',
        dataSource: 'kpi-registered', width: 4, height: 4, x: 8, y: 8,
        options: { unit: '人', multiKpi: true },
      },
    ],
    layout: 'grid',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const useDashboardStore = defineStore('dashboard', () => {
  const dashboards = ref<Dashboard[]>(defaultDashboards)
  const currentDashboard = ref<Dashboard | null>(null)

  const dashboardList = computed(() => dashboards.value)

  function loadDashboard(id: string) {
    currentDashboard.value = dashboards.value.find(d => d.id === id) || null
  }

  function createDashboard(name: string, description = '') {
    const dashboard: Dashboard = {
      id: generateId(),
      name,
      description,
      charts: [],
      layout: 'grid',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    dashboards.value.push(dashboard)
    return dashboard
  }

  function deleteDashboard(id: string) {
    const index = dashboards.value.findIndex(d => d.id === id)
    if (index > -1) {
      dashboards.value.splice(index, 1)
      if (currentDashboard.value?.id === id) {
        currentDashboard.value = null
      }
    }
  }

  function addChart(dashboardId: string, chart: Omit<ChartConfig, 'id'>) {
    const dashboard = dashboards.value.find(d => d.id === dashboardId)
    if (dashboard) {
      const newChart: ChartConfig = { ...chart, id: generateId() }
      dashboard.charts.push(newChart)
      dashboard.updatedAt = new Date().toISOString()
      return newChart
    }
    return null
  }

  function updateChart(dashboardId: string, chartId: string, updates: Partial<ChartConfig>) {
    const dashboard = dashboards.value.find(d => d.id === dashboardId)
    if (dashboard) {
      const chart = dashboard.charts.find(c => c.id === chartId)
      if (chart) {
        Object.assign(chart, updates)
        dashboard.updatedAt = new Date().toISOString()
      }
    }
  }

  function removeChart(dashboardId: string, chartId: string) {
    const dashboard = dashboards.value.find(d => d.id === dashboardId)
    if (dashboard) {
      const index = dashboard.charts.findIndex(c => c.id === chartId)
      if (index > -1) {
        dashboard.charts.splice(index, 1)
        dashboard.updatedAt = new Date().toISOString()
      }
    }
  }

  function updateChartPosition(dashboardId: string, chartId: string, x: number, y: number, w: number, h: number) {
    const dashboard = dashboards.value.find(d => d.id === dashboardId)
    if (dashboard) {
      const chart = dashboard.charts.find(c => c.id === chartId)
      if (chart) {
        chart.x = x
        chart.y = y
        chart.width = w
        chart.height = h
        dashboard.updatedAt = new Date().toISOString()
      }
    }
  }

  return {
    dashboards,
    currentDashboard,
    dashboardList,
    loadDashboard,
    createDashboard,
    deleteDashboard,
    addChart,
    updateChart,
    removeChart,
    updateChartPosition,
  }
})
