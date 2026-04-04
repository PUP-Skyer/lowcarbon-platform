<template>
  <div class="editor-page">
    <!-- 左侧图表面板 -->
    <aside class="chart-panel" :class="{ open: showPanel }">
      <div class="panel-header">
        <h3>图表组件</h3>
        <button class="close-btn" @click="showPanel = false">✕</button>
      </div>
      <div class="chart-types">
        <div
          v-for="ct in chartTypeList"
          :key="ct.type"
          class="chart-type-item"
          draggable="true"
          @dragstart="onDragStart($event, ct)"
          @click="addChartDirect(ct)"
        >
          <div class="type-icon" :style="{ background: ct.color }">
            <span v-html="ct.icon"></span>
          </div>
          <div class="type-info">
            <span class="type-name">{{ ct.name }}</span>
            <span class="type-desc">{{ ct.desc }}</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- 主编辑区 -->
    <main class="editor-main">
      <div class="editor-toolbar">
        <div class="toolbar-left">
          <button class="tool-btn" @click="showPanel = !showPanel" :class="{ active: showPanel }">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
            添加图表
          </button>
          <span class="dash-name">{{ dashboard?.name || '未命名' }}</span>
        </div>
        <div class="toolbar-right">
          <button class="tool-btn" @click="togglePreview">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
            {{ isPreview ? '编辑' : '预览' }}
          </button>
        </div>
      </div>

      <div
        class="grid-canvas"
        @dragover.prevent
        @drop="onDrop"
      >
        <div v-if="!dashboard?.charts.length" class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" width="48" height="48" class="empty-icon">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke-dasharray="4 2"/>
            <path d="M12 8v8M8 12h8"/>
          </svg>
          <p>从左侧拖拽图表组件到此处，或点击添加</p>
        </div>

        <div
          v-for="chart in dashboard?.charts"
          :key="chart.id"
          class="grid-item"
          :style="getChartStyle(chart)"
          :class="{ 'is-editing': !isPreview }"
        >
          <ChartRenderer
            :config="chart"
            :editable="!isPreview"
            @edit="editChart(chart)"
            @remove="removeChart(chart.id)"
          />
        </div>
      </div>
    </main>

    <!-- 右侧配置面板 -->
    <aside v-if="editingChart" class="config-panel">
      <div class="panel-header">
        <h3>图表配置</h3>
        <button class="close-btn" @click="editingChart = null">✕</button>
      </div>
      <div class="config-form">
        <div class="form-group">
          <label>标题</label>
          <input v-model="editForm.title" class="form-input" />
        </div>
        <div class="form-group">
          <label>图表类型</label>
          <select v-model="editForm.type" class="form-input">
            <option v-for="ct in chartTypeList" :key="ct.type" :value="ct.type">{{ ct.name }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>数据源</label>
          <select v-model="editForm.dataSource" class="form-input">
            <option v-for="ds in dataSources" :key="ds" :value="ds">{{ ds }}</option>
          </select>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>宽度</label>
            <input v-model.number="editForm.width" type="number" min="2" max="12" class="form-input" />
          </div>
          <div class="form-group">
            <label>高度</label>
            <input v-model.number="editForm.height" type="number" min="2" max="8" class="form-input" />
          </div>
        </div>
        <button class="btn-save" @click="saveEdit">保存配置</button>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDashboardStore } from '../../stores/dashboard'
import ChartRenderer from '../../components/charts/ChartRenderer.vue'
import type { ChartConfig } from '../../types'

const route = useRoute()
const store = useDashboardStore()
const dashboardId = computed(() => route.params.id as string)
const dashboard = computed(() => store.currentDashboard)

const showPanel = ref(true)
const isPreview = ref(false)
const editingChart = ref<ChartConfig | null>(null)

const chartTypeList = [
  { type: 'line' as const, name: '折线图', desc: '趋势分析', color: 'linear-gradient(135deg, #3b82f6, #60a5fa)', icon: '📈' },
  { type: 'bar' as const, name: '柱状图', desc: '对比分析', color: 'linear-gradient(135deg, #0ea5e9, #22d3ee)', icon: '📊' },
  { type: 'pie' as const, name: '饼图', desc: '占比分析', color: 'linear-gradient(135deg, #f59e0b, #fbbf24)', icon: '🥧' },
  { type: 'gauge' as const, name: '仪表盘', desc: '进度展示', color: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', icon: '⏱' },
  { type: 'radar' as const, name: '雷达图', desc: '多维对比', color: 'linear-gradient(135deg, #06b6d4, #22d3ee)', icon: '🎯' },
  { type: 'funnel' as const, name: '漏斗图', desc: '转化分析', color: 'linear-gradient(135deg, #2563eb, #3b82f6)', icon: '🔽' },
  { type: 'heatmap' as const, name: '热力图', desc: '密度分布', color: 'linear-gradient(135deg, #1d4ed8, #2563eb)', icon: '🗺' },
  { type: 'scatter' as const, name: '散点图', desc: '分布分析', color: 'linear-gradient(135deg, #fb923c, #f97316)', icon: '⚫' },
  { type: 'kpi' as const, name: '指标卡', desc: '关键指标', color: 'linear-gradient(135deg, #3b82f6, #93c5fd)', icon: '🔢' },
  { type: 'table' as const, name: '数据表', desc: '明细数据', color: 'linear-gradient(135deg, #64748b, #94a3b8)', icon: '📋' },
]

const dataSources = ['scene-emission', 'credit-source', 'behavior-emission', 'lowcarbon-rank', 'user-performance', 'activity-funnel', 'footprint-trend', 'community-heatmap', 'kpi-registered', 'kpi-active', 'kpi-reduction', 'gauge-target']

const editForm = ref({
  title: '',
  type: 'line' as ChartConfig['type'],
  dataSource: 'sales-trend',
  width: 6,
  height: 4,
})

onMounted(() => {
  if (dashboardId.value) {
    store.loadDashboard(dashboardId.value)
  }
})

function getChartStyle(chart: ChartConfig) {
  return {
    gridColumn: `span ${chart.width}`,
    gridRow: `span ${chart.height}`,
  }
}

function onDragStart(e: DragEvent, ct: typeof chartTypeList[0]) {
  e.dataTransfer!.setData('chartType', ct.type)
}

function onDrop(e: DragEvent) {
  const type = e.dataTransfer!.getData('chartType') as ChartConfig['type']
  if (type) {
    addChart(type)
  }
}

function addChartDirect(ct: typeof chartTypeList[0]) {
  addChart(ct.type)
}

function addChart(type: ChartConfig['type']) {
  if (!dashboardId.value) return
  const dsMap: Record<string, string> = {
    line: 'footprint-trend', bar: 'scene-emission', pie: 'credit-source',
    gauge: 'gauge-target', radar: 'user-performance', kpi: 'kpi-registered',
    table: 'footprint-trend', scatter: 'behavior-emission',
    funnel: 'activity-funnel', heatmap: 'community-heatmap',
  }
  store.addChart(dashboardId.value, {
    type,
    title: chartTypeList.find(c => c.type === type)?.name || '新图表',
    dataSource: dsMap[type] || 'sales-trend',
    width: type === 'kpi' ? 3 : 6,
    height: type === 'kpi' ? 2 : 4,
    x: 0, y: 0,
    options: {},
  })
}

function editChart(chart: ChartConfig) {
  editingChart.value = chart
  editForm.value = {
    title: chart.title,
    type: chart.type,
    dataSource: chart.dataSource,
    width: chart.width,
    height: chart.height,
  }
}

function saveEdit() {
  if (!editingChart.value || !dashboardId.value) return
  store.updateChart(dashboardId.value, editingChart.value.id, {
    title: editForm.value.title,
    type: editForm.value.type,
    dataSource: editForm.value.dataSource,
    width: editForm.value.width,
    height: editForm.value.height,
  })
  editingChart.value = null
}

function removeChart(chartId: string) {
  if (!dashboardId.value) return
  store.removeChart(dashboardId.value, chartId)
}

function togglePreview() {
  isPreview.value = !isPreview.value
}
</script>

<style scoped>
.editor-page {
  display: flex;
  height: calc(100vh - 56px);
  overflow: hidden;
}

/* 左侧面板 */
.chart-panel {
  width: 260px;
  min-width: 260px;
  background: #fff;
  border-right: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.25s, opacity 0.25s;
}
.chart-panel:not(.open) {
  margin-left: -260px;
  opacity: 0;
  pointer-events: none;
}
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
}
.panel-header h3 {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
}
.close-btn {
  border: none;
  background: none;
  color: #94a3b8;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
}
.chart-types {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.chart-type-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 10px;
  cursor: grab;
  transition: all 0.15s;
  border: 1px solid transparent;
}
.chart-type-item:hover {
  background: #f8fafc;
  border-color: #e2e8f0;
}
.chart-type-item:active {
  cursor: grabbing;
}
.type-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}
.type-info {
  display: flex;
  flex-direction: column;
}
.type-name {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}
.type-desc {
  font-size: 11px;
  color: #94a3b8;
}

/* 主编辑区 */
.editor-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.editor-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  border-bottom: 1px solid #f1f5f9;
  background: #fff;
}
.toolbar-left, .toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.tool-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  color: #475569;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}
.tool-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}
.tool-btn.active {
  background: #3b82f6;
  color: #fff;
  border-color: #3b82f6;
}
.dash-name {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
}

/* 网格画布 */
.grid-canvas {
  flex: 1;
  overflow: auto;
  padding: 20px;
  background: #f8fafc;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: minmax(80px, auto);
  gap: 16px;
  align-content: start;
}
.grid-item {
  min-height: 0;
  border-radius: 12px;
  overflow: hidden;
}
.grid-item.is-editing {
  outline: 2px dashed transparent;
  transition: outline-color 0.2s;
}
.grid-item.is-editing:hover {
  outline-color: #3b82f6;
  outline-offset: 2px;
}
.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #cbd5e1;
  text-align: center;
}
.empty-icon {
  margin-bottom: 16px;
  opacity: 0.5;
}
.empty-state p {
  font-size: 14px;
}

/* 右侧配置面板 */
.config-panel {
  width: 280px;
  min-width: 280px;
  background: #fff;
  border-left: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
}
.config-form {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.form-group label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}
.form-input {
  padding: 8px 12px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  color: #1e293b;
  outline: none;
  transition: border-color 0.15s;
}
.form-input:focus {
  border-color: #3b82f6;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.btn-save {
  margin-top: auto;
  padding: 10px;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-save:hover {
  background: #2563eb;
}

/* 移动端 */
@media (max-width: 768px) {
  .chart-panel {
    position: fixed;
    left: 0;
    top: 56px;
    bottom: 0;
    z-index: 200;
    box-shadow: 4px 0 20px rgba(0,0,0,0.1);
  }
  .config-panel {
    position: fixed;
    right: 0;
    top: 56px;
    bottom: 0;
    z-index: 200;
    box-shadow: -4px 0 20px rgba(0,0,0,0.1);
  }
  .grid-canvas {
    grid-template-columns: repeat(6, 1fr);
    padding: 12px;
    gap: 10px;
  }
}
</style>
