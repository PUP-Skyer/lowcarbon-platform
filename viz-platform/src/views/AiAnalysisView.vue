<template>
  <div class="ai-analysis-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div>
        <h1 class="page-title">AI 可行性分析</h1>
        <p class="page-desc">基于平台数据的智能分析与决策建议（Agent 接口预留）</p>
      </div>
    </div>

    <!-- 板块一：核心分析指标 -->
    <div class="section">
      <h2 class="section-title">核心分析指标</h2>
      <div class="gauge-grid">
        <div v-for="item in gaugeMetrics" :key="item.name" class="gauge-card">
          <div class="gauge-chart" :ref="(el: any) => gaugeRefs[item.name] = el"></div>
          <div class="gauge-status" :class="item.statusClass">
            <span class="status-dot"></span>
            {{ item.status }}
          </div>
          <div class="gauge-formula">{{ item.formula }}</div>
        </div>
      </div>
    </div>

    <!-- 板块二：趋势预测分析 -->
    <div class="section">
      <h2 class="section-title">趋势预测分析</h2>
      <div class="chart-card">
        <div class="chart-container" ref="trendChartRef"></div>
      </div>
    </div>

    <!-- 板块三：维度评分雷达图 -->
    <div class="section">
      <h2 class="section-title">维度评分雷达图</h2>
      <div class="chart-card">
        <div class="chart-container radar-container" ref="radarChartRef"></div>
      </div>
    </div>

    <!-- 板块四：AI 智能建议 -->
    <div class="section">
      <h2 class="section-title">AI 智能建议</h2>
      <div class="suggestion-grid">
        <div
          v-for="(item, index) in suggestions"
          :key="index"
          class="suggestion-card"
          :class="'priority-' + item.priority"
        >
          <div class="suggestion-header">
            <span class="suggestion-icon">{{ item.icon }}</span>
            <span class="priority-tag" :class="'tag-' + item.priority">{{ item.priorityLabel }}</span>
          </div>
          <h3 class="suggestion-title">{{ item.title }}</h3>
          <p class="suggestion-desc">{{ item.desc }}</p>
          <div class="suggestion-effect">
            <span class="effect-label">预期效果</span>
            <span class="effect-value">{{ item.effect }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Agent 接口预留 -->
    <div class="agent-api-section">
      <div class="api-title">🤖 AI Agent 接口预留</div>
      <div class="api-cards">
        <div class="api-card">
          <div class="api-name">POST /api/ai/analyze</div>
          <div class="api-desc">提交数据获取AI分析结果</div>
          <div class="api-status">待接入</div>
        </div>
        <div class="api-card">
          <div class="api-name">POST /api/ai/suggest</div>
          <div class="api-desc">获取个性化减排建议</div>
          <div class="api-status">待接入</div>
        </div>
        <div class="api-card">
          <div class="api-name">POST /api/ai/predict</div>
          <div class="api-desc">碳减排趋势预测</div>
          <div class="api-status">待接入</div>
        </div>
        <div class="api-card">
          <div class="api-name">WebSocket /api/ai/stream</div>
          <div class="api-desc">实时流式对话接口</div>
          <div class="api-status">待接入</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'

// ==================== 数据定义 ====================

const gaugeMetrics = [
  {
    name: '用户活跃度指数',
    value: 78.5,
    color: '#3b82f6',
    status: '良好',
    statusClass: 'status-good',
    formula: '计算逻辑：活跃用户/注册用户 × 100',
  },
  {
    name: '碳减排达成率',
    value: 62.3,
    color: '#22c55e',
    status: '需关注',
    statusClass: 'status-warning',
    formula: '计算逻辑：实际减排量/目标减排量 × 100',
  },
  {
    name: '活动转化效率',
    value: 85.2,
    color: '#06b6d4',
    status: '优秀',
    statusClass: 'status-excellent',
    formula: '计算逻辑：完成活动人数/浏览活动人数 × 100',
  },
  {
    name: '社区覆盖率',
    value: 45.8,
    color: '#f97316',
    status: '待提升',
    statusClass: 'status-low',
    formula: '计算逻辑：已接入社区数/目标社区数 × 100',
  },
]

const suggestions = [
  {
    icon: '🔴',
    title: '扩大社区覆盖',
    desc: '当前社区覆盖率仅45.8%，建议优先拓展高校和产业园区场景，预计可提升注册用户30%',
    priority: 'high',
    priorityLabel: '高优先级',
    effect: '用户增长 +30%，碳数据采集量 +40%',
  },
  {
    icon: '🔴',
    title: '优化活动转化漏斗',
    desc: '浏览到报名转化率仅53%，建议增加签到奖励和社交分享机制',
    priority: 'high',
    priorityLabel: '高优先级',
    effect: '活动参与率 +25%，用户留存率 +15%',
  },
  {
    icon: '🟡',
    title: '引入企业碳账户',
    desc: '企业端功能尚未上线，建议开发企业ESG碳报告自动生成功能',
    priority: 'medium',
    priorityLabel: '中优先级',
    effect: '商业收入 +50万/年，数据维度 +60%',
  },
  {
    icon: '🟡',
    title: '强化AI个性化推荐',
    desc: '当前减排建议为通用模板，建议接入LLM Agent生成个性化低碳方案',
    priority: 'medium',
    priorityLabel: '中优先级',
    effect: '用户满意度 +20%，碳减排效率 +18%',
  },
  {
    icon: '🟢',
    title: '碳资产交易试点',
    desc: '平台累计碳减排1884吨，具备CCER交易基础，建议对接碳交易所',
    priority: 'low',
    priorityLabel: '低优先级',
    effect: '额外收入 +20万/年',
  },
  {
    icon: '🟢',
    title: '区块链存证升级',
    desc: '当前数据存证为链下模式，建议迁移至联盟链提升数据可信度',
    priority: 'low',
    priorityLabel: '低优先级',
    effect: '数据可信度 +35%，合规成本 -20%',
  },
]

// ==================== 图表引用 ====================

const gaugeRefs = reactive<Record<string, any>>({})
const trendChartRef = ref<HTMLElement | null>(null)
const radarChartRef = ref<HTMLElement | null>(null)

let trendChart: echarts.ECharts | null = null
let radarChart: echarts.ECharts | null = null
const gaugeCharts: echarts.ECharts[] = []

// ==================== 初始化图表 ====================

function initGaugeCharts() {
  gaugeMetrics.forEach((item) => {
    const el = gaugeRefs[item.name]
    if (!el) return
    const chart = echarts.init(el)
    gaugeCharts.push(chart)
    chart.setOption({
      series: [
        {
          type: 'gauge',
          startAngle: 220,
          endAngle: -40,
          min: 0,
          max: 100,
          progress: { show: true, width: 12 },
          axisLine: {
            lineStyle: {
              width: 12,
              color: [[1, 'rgba(255,255,255,0.1)']],
            },
          },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          pointer: { show: false },
          title: {
            offsetCenter: [0, '70%'],
            fontSize: 12,
            color: '#94a3b8',
          },
          detail: {
            valueAnimation: true,
            fontSize: 24,
            fontWeight: 'bold',
            offsetCenter: [0, '20%'],
            formatter: '{value}%',
            color: item.color,
          },
          data: [{ value: item.value, name: item.name }],
          itemStyle: {
            color: item.color,
          },
        },
      ],
    })
  })
}

function initTrendChart() {
  if (!trendChartRef.value) return
  trendChart = echarts.init(trendChartRef.value)

  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '1月*', '2月*', '3月*']

  const actual = [120, 145, 180, 210, 255, 290, 320, 355, 390, 420, 450, 480, null, null, null]
  const predicted = [null, null, null, null, null, null, null, null, null, null, 450, 480, 520, 560, 600]
  const confidenceUpper = [null, null, null, null, null, null, null, null, null, null, 480, 540, 600, 660, null]
  const confidenceLower = [null, null, null, null, null, null, null, null, null, null, 420, 460, 500, 540, null]

  trendChart.setOption({
    title: {
      text: '碳减排趋势预测',
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 16,
        fontWeight: 700,
        color: '#1e293b',
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#fff',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: { color: '#334155', fontSize: 13 },
    },
    legend: {
      data: ['实际数据', '预测数据', '置信区间'],
      bottom: 10,
      textStyle: { color: '#64748b', fontSize: 12 },
    },
    grid: {
      left: 60,
      right: 30,
      top: 60,
      bottom: 50,
    },
    xAxis: {
      type: 'category',
      data: months,
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: '#64748b', fontSize: 12 },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      name: '减排量(吨)',
      nameTextStyle: { color: '#94a3b8', fontSize: 12 },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f1f5f9' } },
      axisLabel: { color: '#64748b', fontSize: 12 },
    },
    series: [
      {
        name: '置信区间',
        type: 'line',
        data: confidenceUpper,
        lineStyle: { opacity: 0 },
        symbol: 'none',
        stack: 'confidence',
        areaStyle: { opacity: 0 },
      },
      {
        name: '置信区间下限',
        type: 'line',
        data: confidenceLower,
        lineStyle: { opacity: 0 },
        symbol: 'none',
        stack: 'confidence',
        areaStyle: {
          color: 'rgba(59,130,246,0.12)',
        },
      },
      {
        name: '实际数据',
        type: 'line',
        data: actual,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: '#3b82f6', width: 2.5 },
        itemStyle: { color: '#3b82f6' },
      },
      {
        name: '预测数据',
        type: 'line',
        data: predicted,
        smooth: true,
        symbol: 'diamond',
        symbolSize: 6,
        lineStyle: { color: '#3b82f6', width: 2, type: 'dashed' },
        itemStyle: { color: '#3b82f6' },
      },
    ],
  })
}

function initRadarChart() {
  if (!radarChartRef.value) return
  radarChart = echarts.init(radarChartRef.value)

  radarChart.setOption({
    tooltip: {
      backgroundColor: '#fff',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: { color: '#334155', fontSize: 13 },
    },
    radar: {
      indicator: [
        { name: '用户增长', max: 100 },
        { name: '碳减排效果', max: 100 },
        { name: '用户粘性', max: 100 },
        { name: '社区覆盖', max: 100 },
        { name: '商业转化', max: 100 },
        { name: '技术成熟度', max: 100 },
      ],
      shape: 'polygon',
      splitNumber: 4,
      axisName: {
        color: '#64748b',
        fontSize: 12,
      },
      splitLine: {
        lineStyle: { color: '#e2e8f0' },
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(59,130,246,0.02)', 'rgba(59,130,246,0.04)', 'rgba(59,130,246,0.02)', 'rgba(59,130,246,0.04)'],
        },
      },
      axisLine: {
        lineStyle: { color: '#e2e8f0' },
      },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [82, 75, 68, 55, 42, 88],
            name: '平台评分',
            areaStyle: {
              color: 'rgba(59,130,246,0.2)',
            },
            lineStyle: {
              color: '#3b82f6',
              width: 2,
            },
            itemStyle: {
              color: '#3b82f6',
              borderColor: '#fff',
              borderWidth: 2,
            },
          },
        ],
      },
    ],
  })
}

// ==================== 生命周期 ====================

function handleResize() {
  gaugeCharts.forEach((c) => c.resize())
  trendChart?.resize()
  radarChart?.resize()
}

onMounted(() => {
  nextTick(() => {
    initGaugeCharts()
    initTrendChart()
    initRadarChart()
  })
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  gaugeCharts.forEach((c) => c.dispose())
  trendChart?.dispose()
  radarChart?.dispose()
})
</script>

<style scoped>
.ai-analysis-page {
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
  background: #f8fafc;
  min-height: 100vh;
}

/* 页面标题 */
.page-header {
  margin-bottom: 32px;
}
.page-title {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
}
.page-desc {
  font-size: 14px;
  color: #94a3b8;
  margin-top: 4px;
}

/* 板块 */
.section {
  margin-bottom: 36px;
}
.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
  padding-left: 12px;
  border-left: 3px solid #3b82f6;
}

/* 仪表盘网格 */
.gauge-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.gauge-card {
  background: #fff;
  border-radius: 14px;
  padding: 20px 16px 16px;
  text-align: center;
  position: relative;
  overflow: hidden;
  border: 1px solid #f1f5f9;
  transition: all 0.2s;
}
.gauge-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #06b6d4);
}
.gauge-card:hover {
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.1);
  border-color: #dbeafe;
}
.gauge-chart {
  width: 100%;
  height: 180px;
}
.gauge-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  margin-top: 4px;
}
.gauge-status .status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.status-good { color: #3b82f6; }
.status-good .status-dot { background: #3b82f6; box-shadow: 0 0 6px rgba(59,130,246,0.4); }
.status-warning { color: #f97316; }
.status-warning .status-dot { background: #f97316; box-shadow: 0 0 6px rgba(249,115,22,0.4); }
.status-excellent { color: #06b6d4; }
.status-excellent .status-dot { background: #06b6d4; box-shadow: 0 0 6px rgba(6,182,212,0.4); }
.status-low { color: #f97316; }
.status-low .status-dot { background: #f97316; box-shadow: 0 0 6px rgba(249,115,22,0.4); }
.gauge-formula {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 6px;
  line-height: 1.4;
}

/* 图表卡片 */
.chart-card {
  background: #fff;
  border-radius: 14px;
  border: 1px solid #f1f5f9;
  padding: 20px;
  transition: all 0.2s;
}
.chart-card:hover {
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.08);
  border-color: #dbeafe;
}
.chart-container {
  width: 100%;
  height: 380px;
}
.radar-container {
  height: 400px;
}

/* 建议卡片 */
.suggestion-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
.suggestion-card {
  background: #fff;
  border-radius: 14px;
  padding: 20px;
  border: 1px solid #f1f5f9;
  position: relative;
  overflow: hidden;
  transition: all 0.2s;
}
.suggestion-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
}
.suggestion-card.priority-high::before {
  background: #ef4444;
}
.suggestion-card.priority-medium::before {
  background: #f59e0b;
}
.suggestion-card.priority-low::before {
  background: #22c55e;
}
.suggestion-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  border-color: #e2e8f0;
}
.suggestion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.suggestion-icon {
  font-size: 18px;
}
.priority-tag {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 20px;
}
.tag-high {
  background: #fef2f2;
  color: #ef4444;
}
.tag-medium {
  background: #fffbeb;
  color: #f59e0b;
}
.tag-low {
  background: #f0fdf4;
  color: #22c55e;
}
.suggestion-title {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}
.suggestion-desc {
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 12px;
}
.suggestion-effect {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 8px;
}
.effect-label {
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  white-space: nowrap;
}
.effect-value {
  font-size: 12px;
  font-weight: 600;
  color: #3b82f6;
}

/* Agent API 区域 */
.agent-api-section {
  margin-top: 40px;
  margin-bottom: 24px;
  padding: 28px;
  background: #0f172a;
  border-radius: 14px;
}
.api-title {
  font-size: 18px;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 20px;
}
.api-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}
.api-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 16px;
  transition: all 0.2s;
}
.api-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(59, 130, 246, 0.3);
}
.api-name {
  font-size: 13px;
  font-weight: 700;
  color: #60a5fa;
  margin-bottom: 6px;
  word-break: break-all;
}
.api-desc {
  font-size: 12px;
  color: #94a3b8;
  margin-bottom: 10px;
}
.api-status {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
  padding: 2px 10px;
  border-radius: 20px;
}

/* 响应式 */
@media (max-width: 1024px) {
  .gauge-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .suggestion-grid {
    grid-template-columns: 1fr;
  }
  .api-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .ai-analysis-page {
    padding: 16px;
  }
  .gauge-grid {
    grid-template-columns: 1fr;
  }
  .api-cards {
    grid-template-columns: 1fr;
  }
  .chart-container {
    height: 300px;
  }
  .radar-container {
    height: 320px;
  }
}
</style>
