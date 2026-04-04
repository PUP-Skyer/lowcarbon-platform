<template>
  <div class="screen-container">
    <!-- 顶部标题栏 -->
    <div class="screen-header">
      <div class="header-decoration left"></div>
      <h1 class="screen-title">低碳生活数字化管理平台</h1>
      <div class="header-decoration right"></div>
      <div class="header-time">{{ currentTime }}</div>
      <router-link to="/dashboard" class="back-btn">
        <span class="back-icon">&#8592;</span> 返回
      </router-link>
    </div>

    <!-- 主内容区域 -->
    <div class="screen-body">
      <!-- 左列 -->
      <div class="screen-column left-column">
        <div class="screen-panel" :style="{ animationDelay: '0.1s' }">
          <div class="panel-title">各场景碳排放量对比</div>
          <div ref="chartSceneEmission" class="chart-box"></div>
        </div>
        <div class="screen-panel" :style="{ animationDelay: '0.2s' }">
          <div class="panel-title">碳积分来源分布</div>
          <div ref="chartCreditSource" class="chart-box"></div>
        </div>
        <div class="screen-panel" :style="{ animationDelay: '0.3s' }">
          <div class="panel-title">用户行为与碳排放关系</div>
          <div ref="chartBehaviorEmission" class="chart-box"></div>
        </div>
      </div>

      <!-- 中列 -->
      <div class="screen-column center-column">
        <!-- KPI 指标卡 -->
        <div class="screen-panel kpi-panel" :style="{ animationDelay: '0.15s' }">
          <div class="kpi-grid">
            <div class="kpi-card" v-for="(kpi, idx) in kpiList" :key="idx">
              <div class="kpi-value">
                <span class="kpi-number">{{ kpi.displayValue }}</span>
                <span class="kpi-unit">{{ kpi.unit }}</span>
              </div>
              <div class="kpi-label">{{ kpi.label }}</div>
              <div class="kpi-trend" :class="kpi.trendDir">
                {{ kpi.trendDir === 'up' ? '&#9650;' : '&#9660;' }} {{ kpi.trend }}
              </div>
            </div>
          </div>
        </div>
        <div class="screen-panel" :style="{ animationDelay: '0.25s' }">
          <div class="panel-title">用户碳足迹变化趋势</div>
          <div ref="chartFootprintTrend" class="chart-box"></div>
        </div>
        <div class="screen-panel" :style="{ animationDelay: '0.35s' }">
          <div class="panel-title">低碳排行榜</div>
          <div ref="chartLowcarbonRank" class="chart-box"></div>
        </div>
      </div>

      <!-- 右列 -->
      <div class="screen-column right-column">
        <div class="screen-panel" :style="{ animationDelay: '0.1s' }">
          <div class="panel-title">用户低碳表现</div>
          <div ref="chartUserPerformance" class="chart-box"></div>
        </div>
        <div class="screen-panel" :style="{ animationDelay: '0.2s' }">
          <div class="panel-title">低碳活动转化率</div>
          <div ref="chartActivityFunnel" class="chart-box"></div>
        </div>
        <div class="screen-panel" :style="{ animationDelay: '0.3s' }">
          <div class="panel-title">社区碳排放密度分布</div>
          <div ref="chartCommunityHeatmap" class="chart-box"></div>
        </div>
      </div>
    </div>

    <!-- 底部装饰线 -->
    <div class="screen-footer">
      <div class="footer-line"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'
import { fetchRealData } from '../data/mockData'

// ==================== 时间 ====================
const currentTime = ref('')
let timeTimer: ReturnType<typeof setInterval> | null = null

function updateTime() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const h = String(now.getHours()).padStart(2, '0')
  const min = String(now.getMinutes()).padStart(2, '0')
  const s = String(now.getSeconds()).padStart(2, '0')
  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const week = weekDays[now.getDay()]
  currentTime.value = `${y}-${m}-${d} ${week} ${h}:${min}:${s}`
}

// ==================== KPI ====================
const kpiList = reactive([
  { label: '注册用户', targetValue: 7403, displayValue: '0', unit: '人', trend: '12.5%', trendDir: 'up' },
  { label: '活跃用户', targetValue: 5470, displayValue: '0', unit: '人', trend: '8.3%', trendDir: 'up' },
  { label: '碳减排量', targetValue: 1884, displayValue: '0', unit: '吨', trend: '15.2%', trendDir: 'up' },
  { label: '碳积分发放', targetValue: 326, displayValue: '0', unit: '万', trend: '6.7%', trendDir: 'up' },
])

function animateKpiNumbers() {
  kpiList.forEach((kpi) => {
    const duration = 2000
    const startTime = Date.now()
    const step = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      const current = Math.round(kpi.targetValue * eased)
      kpi.displayValue = current.toLocaleString()
      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }
    requestAnimationFrame(step)
  })
}

// ==================== 图表 refs ====================
const chartSceneEmission = ref<HTMLElement | null>(null)
const chartCreditSource = ref<HTMLElement | null>(null)
const chartBehaviorEmission = ref<HTMLElement | null>(null)
const chartFootprintTrend = ref<HTMLElement | null>(null)
const chartLowcarbonRank = ref<HTMLElement | null>(null)
const chartUserPerformance = ref<HTMLElement | null>(null)
const chartActivityFunnel = ref<HTMLElement | null>(null)
const chartCommunityHeatmap = ref<HTMLElement | null>(null)

let chartInstances: echarts.ECharts[] = []
let resizeHandler: (() => void) | null = null

// ==================== 通用深蓝主题配置 ====================
const textColor = '#b8d4f0'
const axisLineColor = 'rgba(32,160,255,0.2)'
const splitLineColor = 'rgba(32,160,255,0.08)'
const tooltipStyle = {
  backgroundColor: 'rgba(10,22,40,0.95)',
  borderColor: 'rgba(32,160,255,0.3)',
  textStyle: { color: '#b8d4f0' },
}

function createChart(el: HTMLElement): echarts.ECharts {
  const chart = echarts.init(el)
  chartInstances.push(chart)
  return chart
}

// ==================== 图表1：各场景碳排放量对比（柱状图） ====================
function renderSceneEmission(data: { columns: string[]; rows: Record<string, any>[] }) {
  if (!chartSceneEmission.value) return
  const chart = createChart(chartSceneEmission.value)
  const categories = data.rows.map(r => r['场景'])
  const option: echarts.EChartsOption = {
    tooltip: { ...tooltipStyle, trigger: 'axis' },
    legend: {
      data: ['直接排放', '间接排放', '碳抵消'],
      textStyle: { color: textColor, fontSize: 11 },
      top: 5,
      right: 10,
    },
    grid: { left: 50, right: 20, top: 40, bottom: 30 },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: { color: textColor, fontSize: 11 },
      axisLine: { lineStyle: { color: axisLineColor } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: textColor, fontSize: 11 },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: splitLineColor } },
    },
    series: [
      {
        name: '直接排放',
        type: 'bar',
        stack: 'total',
        data: data.rows.map(r => r['直接排放']),
        itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#3b82f6' },
          { offset: 1, color: '#1e40af' },
        ]), borderRadius: [0, 0, 0, 0] },
        barWidth: '40%',
      },
      {
        name: '间接排放',
        type: 'bar',
        stack: 'total',
        data: data.rows.map(r => r['间接排放']),
        itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#8b5cf6' },
          { offset: 1, color: '#6d28d9' },
        ]), borderRadius: [0, 0, 0, 0] },
      },
      {
        name: '碳抵消',
        type: 'bar',
        stack: 'total',
        data: data.rows.map(r => r['碳抵消']),
        itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#10b981' },
          { offset: 1, color: '#059669' },
        ]), borderRadius: [4, 4, 0, 0] },
      },
    ],
    animationDuration: 1500,
    animationEasing: 'cubicOut',
  }
  chart.setOption(option)
}

// ==================== 图表2：碳积分来源分布（环形图） ====================
function renderCreditSource(data: { columns: string[]; rows: Record<string, any>[] }) {
  if (!chartCreditSource.value) return
  const chart = createChart(chartCreditSource.value)
  const pieColors = ['#00d4ff', '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ec4899']
  const option: echarts.EChartsOption = {
    tooltip: { ...tooltipStyle, trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: { color: textColor, fontSize: 11 },
      itemWidth: 10,
      itemHeight: 10,
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '65%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: 13, fontWeight: 'bold', color: '#00d4ff' },
        },
        labelLine: { show: false },
        data: data.rows.map((r, i) => ({
          value: r['积分量'],
          name: r['来源'],
          itemStyle: { color: pieColors[i % pieColors.length] },
        })),
        animationType: 'scale',
        animationDuration: 1500,
      },
    ],
  }
  chart.setOption(option)
}

// ==================== 图表3：用户行为与碳排放关系（散点图） ====================
function renderBehaviorEmission(data: { columns: string[]; rows: Record<string, any>[] }) {
  if (!chartBehaviorEmission.value) return
  const chart = createChart(chartBehaviorEmission.value)
  const scatterData = data.rows.map(r => [r['低碳行为次数'], r['碳排放量(kg)']])
  const option: echarts.EChartsOption = {
    tooltip: {
      ...tooltipStyle,
      trigger: 'item',
      formatter: (params: any) => {
        const row = data.rows[params.dataIndex]
        return `${row['用户']}<br/>低碳行为: ${row['低碳行为次数']}次<br/>碳排放: ${row['碳排放量(kg)']}kg`
      },
    },
    grid: { left: 50, right: 20, top: 20, bottom: 40 },
    xAxis: {
      name: '低碳行为次数',
      nameTextStyle: { color: textColor, fontSize: 10 },
      axisLabel: { color: textColor, fontSize: 11 },
      axisLine: { lineStyle: { color: axisLineColor } },
      splitLine: { lineStyle: { color: splitLineColor } },
    },
    yAxis: {
      name: '碳排放(kg)',
      nameTextStyle: { color: textColor, fontSize: 10 },
      axisLabel: { color: textColor, fontSize: 11 },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: splitLineColor } },
    },
    series: [
      {
        type: 'scatter',
        data: scatterData,
        symbolSize: (val: number[]) => Math.max(val[1] * 0.6, 8),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
            { offset: 0, color: '#00d4ff' },
            { offset: 1, color: '#8b5cf6' },
          ]),
          shadowBlur: 10,
          shadowColor: 'rgba(0,212,255,0.3)',
        },
        emphasis: {
          itemStyle: { shadowBlur: 20, shadowColor: 'rgba(0,212,255,0.6)' },
        },
      },
    ],
    animationDuration: 1500,
  }
  chart.setOption(option)
}

// ==================== 图表4：用户碳足迹变化趋势（折线图） ====================
function renderFootprintTrend(data: { columns: string[]; rows: Record<string, any>[] }) {
  if (!chartFootprintTrend.value) return
  const chart = createChart(chartFootprintTrend.value)
  const categories = data.rows.map(r => r['日期'])
  const option: echarts.EChartsOption = {
    tooltip: { ...tooltipStyle, trigger: 'axis' },
    legend: {
      data: ['人均碳排放(kg)', '人均碳减排(kg)'],
      textStyle: { color: textColor, fontSize: 11 },
      top: 5,
      right: 10,
    },
    grid: { left: 55, right: 20, top: 40, bottom: 30 },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: { color: textColor, fontSize: 11 },
      axisLine: { lineStyle: { color: axisLineColor } },
      axisTick: { show: false },
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: textColor, fontSize: 11 },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: splitLineColor } },
    },
    series: [
      {
        name: '人均碳排放(kg)',
        type: 'line',
        data: data.rows.map(r => r['人均碳排放(kg)']),
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { width: 2, color: '#f59e0b' },
        itemStyle: { color: '#f59e0b' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(245,158,11,0.25)' },
            { offset: 1, color: 'rgba(245,158,11,0)' },
          ]),
        },
      },
      {
        name: '人均碳减排(kg)',
        type: 'line',
        data: data.rows.map(r => r['人均碳减排(kg)']),
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { width: 2, color: '#00d4ff' },
        itemStyle: { color: '#00d4ff' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0,212,255,0.25)' },
            { offset: 1, color: 'rgba(0,212,255,0)' },
          ]),
        },
      },
    ],
    animationDuration: 2000,
    animationEasing: 'cubicOut',
  }
  chart.setOption(option)
}

// ==================== 图表5：低碳排行榜（横向柱状图） ====================
function renderLowcarbonRank(data: { columns: string[]; rows: Record<string, any>[] }) {
  if (!chartLowcarbonRank.value) return
  const chart = createChart(chartLowcarbonRank.value)
  const sorted = [...data.rows].sort((a, b) => a['减碳量(吨)'] - b['减碳量(吨)'])
  const categories = sorted.map(r => r['团队'])
  const values = sorted.map(r => r['减碳量(吨)'])
  const option: echarts.EChartsOption = {
    tooltip: { ...tooltipStyle, trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 70, right: 40, top: 10, bottom: 20 },
    xAxis: {
      type: 'value',
      axisLabel: { color: textColor, fontSize: 11 },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: splitLineColor } },
    },
    yAxis: {
      type: 'category',
      data: categories,
      axisLabel: { color: textColor, fontSize: 11 },
      axisLine: { lineStyle: { color: axisLineColor } },
      axisTick: { show: false },
    },
    series: [
      {
        type: 'bar',
        data: values.map((v, i) => ({
          value: v,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: 'rgba(0,212,255,0.3)' },
              { offset: 1, color: i === values.length - 1 ? '#00ffcc' : '#00d4ff' },
            ]),
            borderRadius: [0, 4, 4, 0],
          },
        })),
        barWidth: '50%',
        label: {
          show: true,
          position: 'right',
          color: '#00ffcc',
          fontSize: 12,
          fontWeight: 'bold',
          formatter: '{c}吨',
        },
      },
    ],
    animationDuration: 1500,
    animationEasing: 'cubicOut',
  }
  chart.setOption(option)
}

// ==================== 图表6：用户低碳表现（雷达图） ====================
function renderUserPerformance(data: { columns: string[]; rows: Record<string, any>[] }) {
  if (!chartUserPerformance.value) return
  const chart = createChart(chartUserPerformance.value)
  const indicators = data.rows.map(r => ({ name: r['维度'], max: 100 }))
  const option: echarts.EChartsOption = {
    tooltip: { ...tooltipStyle },
    legend: {
      data: ['用户A', '用户B', '用户C'],
      textStyle: { color: textColor, fontSize: 11 },
      bottom: 5,
    },
    radar: {
      indicator: indicators,
      shape: 'polygon',
      splitNumber: 4,
      axisName: { color: textColor, fontSize: 11 },
      splitLine: { lineStyle: { color: splitLineColor } },
      splitArea: {
        areaStyle: {
          color: ['rgba(0,212,255,0.02)', 'rgba(0,212,255,0.04)', 'rgba(0,212,255,0.06)', 'rgba(0,212,255,0.08)'],
        },
      },
      axisLine: { lineStyle: { color: axisLineColor } },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: data.rows.map(r => r['用户A']),
            name: '用户A',
            lineStyle: { color: '#00d4ff', width: 2 },
            itemStyle: { color: '#00d4ff' },
            areaStyle: { color: 'rgba(0,212,255,0.15)' },
          },
          {
            value: data.rows.map(r => r['用户B']),
            name: '用户B',
            lineStyle: { color: '#8b5cf6', width: 2 },
            itemStyle: { color: '#8b5cf6' },
            areaStyle: { color: 'rgba(139,92,246,0.15)' },
          },
          {
            value: data.rows.map(r => r['用户C']),
            name: '用户C',
            lineStyle: { color: '#10b981', width: 2 },
            itemStyle: { color: '#10b981' },
            areaStyle: { color: 'rgba(16,185,129,0.15)' },
          },
        ],
        animationDuration: 1500,
      },
    ],
  }
  chart.setOption(option)
}

// ==================== 图表7：低碳活动转化率（漏斗图） ====================
function renderActivityFunnel(data: { columns: string[]; rows: Record<string, any>[] }) {
  if (!chartActivityFunnel.value) return
  const chart = createChart(chartActivityFunnel.value)
  const funnelColors = ['#00d4ff', '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981']
  const option: echarts.EChartsOption = {
    tooltip: { ...tooltipStyle, trigger: 'item', formatter: '{b}: {c}人' },
    series: [
      {
        type: 'funnel',
        left: '10%',
        top: 10,
        bottom: 10,
        width: '80%',
        sort: 'descending',
        gap: 4,
        label: {
          show: true,
          position: 'inside',
          color: '#fff',
          fontSize: 12,
          formatter: '{b}\n{c}人',
        },
        labelLine: { show: false },
        itemStyle: { borderColor: 'rgba(0,0,0,0.1)', borderWidth: 1 },
        emphasis: {
          label: { fontSize: 14 },
        },
        data: data.rows.map((r, i) => ({
          value: r['人数'],
          name: r['阶段'],
          itemStyle: { color: funnelColors[i % funnelColors.length] },
        })),
        animationDuration: 1500,
        animationEasing: 'cubicOut',
      },
    ],
  }
  chart.setOption(option)
}

// ==================== 图表8：社区碳排放密度分布（热力图） ====================
function renderCommunityHeatmap(data: { columns: string[]; rows: Record<string, any>[] }) {
  if (!chartCommunityHeatmap.value) return
  const chart = createChart(chartCommunityHeatmap.value)
  const months = data.columns.slice(1) // ['1月', '2月', ...]
  const communities = data.rows.map(r => r['社区'])

  // 转换为 [x, y, value] 格式
  const heatData: [number, number, number][] = []
  let minVal = Infinity
  let maxVal = -Infinity
  data.rows.forEach((row, yIdx) => {
    months.forEach((month, xIdx) => {
      const val = row[month]
      heatData.push([xIdx, yIdx, val])
      if (val < minVal) minVal = val
      if (val > maxVal) maxVal = val
    })
  })

  const option: echarts.EChartsOption = {
    tooltip: {
      ...tooltipStyle,
      formatter: (params: any) => {
        return `${communities[params.value[1]]} ${months[params.value[0]]}<br/>排放指数: ${params.value[2]}`
      },
    },
    grid: { left: 80, right: 50, top: 10, bottom: 40 },
    xAxis: {
      type: 'category',
      data: months,
      axisLabel: { color: textColor, fontSize: 11 },
      axisLine: { lineStyle: { color: axisLineColor } },
      axisTick: { show: false },
      splitArea: { show: false },
    },
    yAxis: {
      type: 'category',
      data: communities,
      axisLabel: { color: textColor, fontSize: 11 },
      axisLine: { lineStyle: { color: axisLineColor } },
      axisTick: { show: false },
      splitArea: { show: false },
    },
    visualMap: {
      min: minVal,
      max: maxVal,
      calculable: true,
      orient: 'vertical',
      right: 0,
      top: 'center',
      itemHeight: 120,
      textStyle: { color: textColor, fontSize: 10 },
      inRange: {
        color: ['#0a1628', '#0d3b66', '#1a6fb5', '#00d4ff', '#00ffcc'],
      },
    },
    series: [
      {
        type: 'heatmap',
        data: heatData,
        label: {
          show: true,
          color: '#b8d4f0',
          fontSize: 10,
        },
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,212,255,0.5)' },
        },
        itemStyle: { borderColor: 'rgba(10,22,40,0.8)', borderWidth: 2, borderRadius: 2 },
      },
    ],
    animationDuration: 1500,
  }
  chart.setOption(option)
}

// ==================== 初始化 ====================
onMounted(async () => {
  updateTime()
  timeTimer = setInterval(updateTime, 1000)

  await nextTick()

  // 启动 KPI 数字动画
  setTimeout(animateKpiNumbers, 300)

  // 获取数据并渲染图表
  const dataPromises = [
    fetchRealData('scene-emission').then(d => renderSceneEmission(d)),
    fetchRealData('credit-source').then(d => renderCreditSource(d)),
    fetchRealData('behavior-emission').then(d => renderBehaviorEmission(d)),
    fetchRealData('footprint-trend').then(d => renderFootprintTrend(d)),
    fetchRealData('lowcarbon-rank').then(d => renderLowcarbonRank(d)),
    fetchRealData('user-performance').then(d => renderUserPerformance(d)),
    fetchRealData('activity-funnel').then(d => renderActivityFunnel(d)),
    fetchRealData('community-heatmap').then(d => renderCommunityHeatmap(d)),
  ]
  await Promise.all(dataPromises)

  // 监听窗口大小变化
  resizeHandler = () => {
    chartInstances.forEach(c => c.resize())
  }
  window.addEventListener('resize', resizeHandler)
})

onBeforeUnmount(() => {
  if (timeTimer) clearInterval(timeTimer)
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
  chartInstances.forEach(c => c.dispose())
  chartInstances = []
})
</script>

<style scoped>
/* ==================== 全局容器 ==================== */
.screen-container {
  width: 100vw;
  height: 100vh;
  background: #0a1628;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'PingFang SC', 'Microsoft YaHei', -apple-system, sans-serif;
}

/* ==================== 顶部标题栏 ==================== */
.screen-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70px;
  flex-shrink: 0;
  padding: 0 20px;
}

.screen-title {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 6px;
  background: linear-gradient(90deg, #00d4ff, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
  margin: 0;
  z-index: 1;
}

.header-decoration {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 260px;
  height: 2px;
  z-index: 0;
}

.header-decoration.left {
  right: calc(50% + 220px);
  background: linear-gradient(90deg, transparent, #00d4ff);
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.4);
}

.header-decoration.right {
  left: calc(50% + 220px);
  background: linear-gradient(90deg, #00d4ff, transparent);
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.4);
}

.header-time {
  position: absolute;
  right: 100px;
  top: 50%;
  transform: translateY(-50%);
  color: #b8d4f0;
  font-size: 14px;
  letter-spacing: 1px;
}

.back-btn {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #b8d4f0;
  font-size: 13px;
  text-decoration: none;
  padding: 4px 14px;
  border: 1px solid rgba(32, 160, 255, 0.3);
  border-radius: 4px;
  transition: all 0.3s;
  z-index: 2;
}

.back-btn:hover {
  color: #00d4ff;
  border-color: #00d4ff;
  background: rgba(0, 212, 255, 0.08);
}

.back-icon {
  margin-right: 4px;
}

/* ==================== 主体布局 ==================== */
.screen-body {
  flex: 1;
  display: grid;
  grid-template-columns: 25% 50% 25%;
  gap: 12px;
  padding: 0 12px 12px;
  min-height: 0;
  overflow: hidden;
}

.screen-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
}

/* ==================== 面板样式 ==================== */
.screen-panel {
  background: linear-gradient(135deg, rgba(6, 30, 65, 0.8), rgba(10, 22, 40, 0.9));
  border: 1px solid rgba(32, 160, 255, 0.15);
  border-radius: 8px;
  padding: 16px;
  position: relative;
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  animation: panelFadeIn 0.8s ease-out both;
}

.screen-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00d4ff, transparent);
}

.panel-title {
  color: #00d4ff;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  padding-left: 10px;
  border-left: 3px solid #00d4ff;
  flex-shrink: 0;
}

.chart-box {
  flex: 1;
  min-height: 0;
}

/* ==================== KPI 面板 ==================== */
.kpi-panel {
  flex: 0 0 auto;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.kpi-card {
  text-align: center;
  padding: 10px 8px;
  background: rgba(0, 212, 255, 0.04);
  border: 1px solid rgba(32, 160, 255, 0.1);
  border-radius: 6px;
  transition: all 0.3s;
}

.kpi-card:hover {
  background: rgba(0, 212, 255, 0.08);
  border-color: rgba(32, 160, 255, 0.25);
}

.kpi-value {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
}

.kpi-number {
  font-size: 28px;
  font-weight: 700;
  color: #00ffcc;
  font-family: 'DIN', 'Roboto Mono', monospace;
  line-height: 1.2;
}

.kpi-unit {
  font-size: 13px;
  color: #b8d4f0;
}

.kpi-label {
  font-size: 12px;
  color: #b8d4f0;
  margin-top: 4px;
  opacity: 0.8;
}

.kpi-trend {
  font-size: 11px;
  margin-top: 4px;
}

.kpi-trend.up {
  color: #10b981;
}

.kpi-trend.down {
  color: #ef4444;
}

/* ==================== 底部装饰 ==================== */
.screen-footer {
  flex-shrink: 0;
  padding: 0 40px 10px;
}

.footer-line {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.3), transparent);
}

/* ==================== 动画 ==================== */
@keyframes panelFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ==================== 响应式 ==================== */
@media (max-width: 1200px) {
  .screen-body {
    grid-template-columns: 1fr 1fr;
  }
  .center-column {
    grid-column: 1 / -1;
    order: -1;
  }
  .kpi-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .screen-body {
    grid-template-columns: 1fr;
  }
  .center-column {
    order: 0;
  }
  .screen-title {
    font-size: 18px;
    letter-spacing: 3px;
  }
  .header-decoration {
    display: none;
  }
  .header-time {
    right: 80px;
    font-size: 12px;
  }
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .kpi-number {
    font-size: 22px;
  }
}
</style>
