<template>
  <div class="chart-wrapper" :style="wrapperStyle">
    <div class="chart-header">
      <span class="chart-title">{{ title }}</span>
      <div class="chart-actions" v-if="editable">
        <button class="action-btn" @click="$emit('edit')" title="编辑">&#9998;</button>
        <button class="action-btn danger" @click="$emit('remove')" title="删除">&#10005;</button>
      </div>
    </div>
    <div class="chart-body" ref="chartRef">
      <div class="chart-loading" v-if="loading">加载中...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import { fetchRealData } from '../../data/mockData'
import type { ChartConfig } from '../../types'

const props = defineProps<{
  config: ChartConfig
  editable?: boolean
}>()

defineEmits<{
  edit: []
  remove: []
}>()

const chartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null
const loading = ref(true)

const title = computed(() => props.config.title)

const wrapperStyle = computed(() => ({
  width: '100%',
  height: '100%',
}))

// 科技蓝主题色板
const COLORS = {
  blue1: '#3b82f6',
  blue2: '#60a5fa',
  blue3: '#93c5fd',
  blue4: '#2563eb',
  blue5: '#1d4ed8',
  cyan: '#22d3ee',
  teal: '#14b8a6',
  orange: '#f59e0b',
  red: '#ef4444',
  purple: '#8b5cf6',
  green: '#10b981',
}

function buildOption(data: { columns: string[], rows: Record<string, any>[] }): echarts.EChartsOption {
  if (!data.rows.length) return {}

  const type = props.config.type
  const opts = props.config.options || {}

  switch (type) {
    case 'line':
      return {
        tooltip: { trigger: 'axis', backgroundColor: 'rgba(15,23,42,0.9)', borderColor: 'transparent', textStyle: { color: '#fff', fontSize: 12 } },
        legend: { data: data.columns.slice(1), top: 0, textStyle: { fontSize: 11, color: '#64748b' } },
        grid: { left: 50, right: 20, top: 40, bottom: 30 },
        xAxis: { type: 'category', data: data.rows.map(r => r[data.columns[0]]), boundaryGap: false, axisLine: { lineStyle: { color: '#e2e8f0' } }, axisLabel: { color: '#94a3b8', fontSize: 11 } },
        yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f1f5f9' } }, axisLabel: { color: '#94a3b8', fontSize: 11 } },
        series: data.columns.slice(1).map((col, i) => ({
          name: col,
          type: 'line' as const,
          data: data.rows.map(r => r[col]),
          smooth: opts.smooth ?? true,
          symbol: 'circle',
          symbolSize: 5,
          lineStyle: { width: 2.5 },
          itemStyle: { color: [COLORS.blue1, COLORS.cyan, COLORS.orange][i % 3] },
          areaStyle: i === 0 ? {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(59,130,246,0.3)' },
              { offset: 1, color: 'rgba(59,130,246,0.02)' },
            ]),
          } : undefined,
        })),
      }

    case 'bar': {
      const isHorizontal = opts.horizontal
      const isStack = opts.stack
      const categoryAxis = { type: 'category' as const, data: data.rows.map(r => r[data.columns[0]]) }
      const valueAxis = { type: 'value' as const }
      const xAxis = isHorizontal ? valueAxis : categoryAxis
      const yAxis = isHorizontal ? categoryAxis : valueAxis

      return {
        tooltip: { trigger: 'axis', backgroundColor: 'rgba(15,23,42,0.9)', borderColor: 'transparent', textStyle: { color: '#fff', fontSize: 12 } },
        legend: { data: data.columns.slice(1), top: 0, textStyle: { fontSize: 11, color: '#64748b' } },
        grid: { left: isHorizontal ? 80 : 50, right: 20, top: 40, bottom: 30 },
        xAxis: { ...xAxis, axisLine: { lineStyle: { color: '#e2e8f0' } }, axisLabel: { color: '#94a3b8', fontSize: 11 } },
        yAxis: { ...yAxis, splitLine: { lineStyle: { color: '#f1f5f9' } }, axisLabel: { color: '#94a3b8', fontSize: 11 } },
        series: data.columns.slice(1).map((col, i) => ({
          name: col,
          type: 'bar' as const,
          data: data.rows.map(r => r[col]),
          stack: isStack ? 'total' : undefined,
          barWidth: isHorizontal ? '50%' : '35%',
          itemStyle: {
            color: isHorizontal
              ? new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: [COLORS.blue4, COLORS.cyan, COLORS.cyan][i % 3] },
                  { offset: 1, color: [COLORS.blue2, COLORS.cyan, COLORS.blue3][i % 3] },
                ])
              : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: [COLORS.blue1, COLORS.cyan, COLORS.cyan][i % 3] },
                  { offset: 1, color: [COLORS.blue4, '#0284c7', '#0891b2'][i % 3] },
                ]),
            borderRadius: isHorizontal ? [0, 4, 4, 0] : [4, 4, 0, 0],
          },
          label: isHorizontal ? { show: true, position: 'right', color: '#334155', fontSize: 11, fontWeight: 600 } : undefined,
        })),
      }
    }

    case 'pie':
      return {
        tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)', backgroundColor: 'rgba(15,23,42,0.9)', borderColor: 'transparent', textStyle: { color: '#fff', fontSize: 12 } },
        legend: { orient: 'vertical', right: 10, top: 'center', textStyle: { fontSize: 11, color: '#64748b' } },
        color: [COLORS.blue1, COLORS.cyan, COLORS.orange, COLORS.cyan, COLORS.purple, COLORS.blue4],
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['38%', '52%'],
          avoidLabelOverlap: true,
          itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
          label: { show: false },
          emphasis: { label: { show: true, fontSize: 13, fontWeight: 'bold' } },
          data: data.rows.map(r => ({
            name: r[data.columns[0]],
            value: r[data.columns[1]],
          })),
        }],
      }

    case 'gauge':
      return {
        series: [{
          type: 'gauge',
          startAngle: 200,
          endAngle: -20,
          min: 0,
          max: 100,
          progress: { show: true, width: 14, itemStyle: { color: COLORS.blue1 } },
          axisLine: { lineStyle: { width: 14, color: [[1, '#e5e7eb']] } },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          pointer: { show: false },
          title: { offsetCenter: [0, '60%'], fontSize: 12, color: '#9ca3af' },
          detail: {
            valueAnimation: true,
            fontSize: 26,
            fontWeight: 'bold',
            offsetCenter: [0, '10%'],
            formatter: '{value}%',
            color: COLORS.blue1,
          },
          data: [{ value: data.rows[0]?.[data.columns[1]] ?? 0, name: data.rows[0]?.[data.columns[0]] ?? '' }],
        }],
      }

    case 'radar':
      return {
        tooltip: { backgroundColor: 'rgba(15,23,42,0.9)', borderColor: 'transparent', textStyle: { color: '#fff', fontSize: 12 } },
        legend: { data: data.columns.slice(1), top: 0, textStyle: { fontSize: 11, color: '#64748b' } },
        radar: {
          indicator: data.rows.map(r => ({ name: r[data.columns[0]], max: 100 })),
          shape: 'polygon',
          splitArea: { areaStyle: { color: ['rgba(59,130,246,0.04)', 'rgba(59,130,246,0.08)'] } },
          axisLine: { lineStyle: { color: '#e2e8f0' } },
          splitLine: { lineStyle: { color: '#f1f5f9' } },
        },
        series: [{
          type: 'radar',
          data: data.columns.slice(1).map((col, i) => ({
            value: data.rows.map(r => r[col]),
            name: col,
            areaStyle: { color: `rgba(59,130,246,${0.12 + i * 0.08})` },
            lineStyle: { color: [COLORS.blue1, COLORS.cyan][i % 2], width: 2 },
            itemStyle: { color: [COLORS.blue1, COLORS.cyan][i % 2] },
          })),
        }],
      }

    case 'scatter':
      return {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(15,23,42,0.9)',
          borderColor: 'transparent',
          textStyle: { color: '#fff', fontSize: 12 },
          formatter: (p: any) => `${p.data[2]}<br/>低碳行为: ${p.data[0]}次<br/>碳排放: ${p.data[1]}kg`,
        },
        grid: { left: 50, right: 20, top: 20, bottom: 40 },
        xAxis: { type: 'value', name: '低碳行为次数', nameTextStyle: { color: '#94a3b8', fontSize: 11 }, axisLine: { lineStyle: { color: '#e2e8f0' } }, splitLine: { lineStyle: { color: '#f1f5f9' } }, axisLabel: { color: '#94a3b8', fontSize: 11 } },
        yAxis: { type: 'value', name: '碳排放量(kg)', nameTextStyle: { color: '#94a3b8', fontSize: 11 }, axisLine: { lineStyle: { color: '#e2e8f0' } }, splitLine: { lineStyle: { color: '#f1f5f9' } }, axisLabel: { color: '#94a3b8', fontSize: 11 } },
        series: [{
          type: 'scatter',
          symbolSize: (val: number[]) => Math.max(8, val[0] / 5),
          data: data.rows.map(r => [r[data.columns[1]], r[data.columns[2]], r[data.columns[0]]]),
          itemStyle: { color: COLORS.blue1, opacity: 0.7 },
          emphasis: { itemStyle: { color: COLORS.blue4, opacity: 1 } },
        }],
      }

    case 'funnel':
      return {
        tooltip: { trigger: 'item', formatter: '{b}: {c}', backgroundColor: 'rgba(15,23,42,0.9)', borderColor: 'transparent', textStyle: { color: '#fff', fontSize: 12 } },
        series: [{
          type: 'funnel',
          left: '10%',
          top: 10,
          bottom: 10,
          width: '80%',
          min: 0,
          max: data.rows[0]?.[data.columns[1]] ?? 100,
          minSize: '20%',
          maxSize: '100%',
          sort: 'descending',
          gap: 4,
          label: { show: true, position: 'inside', formatter: '{b}\n{c}', fontSize: 12, color: '#fff', fontWeight: 600, lineHeight: 18 },
          itemStyle: { borderColor: '#fff', borderWidth: 2 },
          emphasis: { label: { fontSize: 14 } },
          data: data.rows.map((r, i) => ({
            name: r[data.columns[0]],
            value: r[data.columns[1]],
            itemStyle: { color: [COLORS.blue1, COLORS.blue2, COLORS.cyan, COLORS.cyan, COLORS.blue3][i % 5] },
          })),
        }],
      }

    case 'heatmap': {
      const xLabels = data.columns.slice(1)
      const yLabels = data.rows.map(r => r[data.columns[0]])
      const heatData: [number, number, number][] = []
      data.rows.forEach((row, yi) => {
        xLabels.forEach((_, xi) => {
          heatData.push([xi, yi, row[xLabels[xi]] as number])
        })
      })
      return {
        tooltip: {
          backgroundColor: 'rgba(15,23,42,0.9)',
          borderColor: 'transparent',
          textStyle: { color: '#fff', fontSize: 12 },
          formatter: (p: any) => `${yLabels[p.data[1]]} ${xLabels[p.data[0]]}<br/>碳排放指数: <b>${p.data[2]}</b>`,
        },
        grid: { left: 80, right: 40, top: 10, bottom: 40 },
        xAxis: { type: 'category', data: xLabels, splitArea: { show: false }, axisLine: { lineStyle: { color: '#e2e8f0' } }, axisLabel: { color: '#94a3b8', fontSize: 11 } },
        yAxis: { type: 'category', data: yLabels, splitArea: { show: false }, axisLine: { lineStyle: { color: '#e2e8f0' } }, axisLabel: { color: '#64748b', fontSize: 11 } },
        visualMap: {
          min: 30,
          max: 95,
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: 0,
          inRange: { color: ['#eff6ff', '#6ee7b7', '#10b981', '#059669', '#1e3a5f'] },
          textStyle: { color: '#94a3b8', fontSize: 10 },
          itemWidth: 12,
          itemHeight: 100,
        },
        series: [{
          type: 'heatmap',
          data: heatData,
          label: { show: true, color: '#334155', fontSize: 10 },
          itemStyle: { borderColor: '#fff', borderWidth: 2, borderRadius: 4 },
          emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.15)' } },
        }],
      }
    }

    default:
      return {}
  }
}

function initChart() {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
}

async function loadChartData() {
  loading.value = true
  try {
    const data = await fetchRealData(props.config.dataSource)
    if (chartInstance && data.rows.length) {
      chartInstance.setOption(buildOption(data))
    }
  } finally {
    loading.value = false
  }
}

function handleResize() {
  chartInstance?.resize()
}

onMounted(async () => {
  nextTick(() => {
    initChart()
    loadChartData()
  })
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})

watch(() => props.config, () => {
  loadChartData()
}, { deep: true })
</script>

<style scoped>
.chart-wrapper {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: box-shadow 0.2s, border-color 0.2s;
}
.chart-wrapper:hover {
  border-color: #bfdbfe;
  box-shadow: 0 4px 12px rgba(59,130,246,0.08);
}
.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px 4px;
}
.chart-title {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  letter-spacing: 0.01em;
}
.chart-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}
.chart-wrapper:hover .chart-actions {
  opacity: 1;
}
.action-btn {
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 6px;
  background: #f1f5f9;
  color: #64748b;
  cursor: pointer;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.action-btn:hover {
  background: #e2e8f0;
  color: #334155;
}
.action-btn.danger:hover {
  background: #fee2e2;
  color: #ef4444;
}
.chart-body {
  flex: 1;
  min-height: 0;
  position: relative;
}
.chart-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 13px;
  z-index: 1;
}
</style>
