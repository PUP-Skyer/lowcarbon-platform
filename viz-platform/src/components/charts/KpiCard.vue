<template>
  <div class="kpi-card">
    <div class="kpi-header">
      <span class="kpi-label">{{ title }}</span>
    </div>
    <div class="kpi-grid">
      <div class="kpi-item" v-for="(item, i) in kpiItems" :key="i">
        <div class="kpi-value">
          <span class="kpi-prefix" v-if="item.prefix">{{ item.prefix }}</span>
          <span class="kpi-number" :ref="(el) => setNumberRef(el, i)">0</span>
          <span class="kpi-suffix" v-if="item.unit">{{ item.unit }}</span>
        </div>
        <div class="kpi-name">{{ item.name }}</div>
        <div class="kpi-trend" :class="item.trendClass">
          <span class="trend-icon">{{ item.trendIcon }}</span>
          <span class="trend-text">{{ item.trendText }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '../../utils/api'
import type { ChartConfig } from '../../types'

const props = defineProps<{
  config: ChartConfig
}>()

const numberRefs: Record<number, HTMLElement | null> = {}

function setNumberRef(el: any, index: number) {
  if (el) numberRefs[index] = el as HTMLElement
}

const title = props.config.title

// 默认 fallback 数据
const defaultKpiItems = [
  { name: '注册用户', value: 7403, unit: '人', prefix: '', trendClass: 'up', trendIcon: '↑', trendText: '+12.5%', color: '#3b82f6' },
  { name: '活跃用户', value: 5470, unit: '人', prefix: '', trendClass: 'up', trendIcon: '↑', trendText: '+8.3%', color: '#0ea5e9' },
  { name: '碳减排量', value: 1884, unit: '吨', prefix: '', trendClass: 'up', trendIcon: '↑', trendText: '+15.2%', color: '#2563eb' },
  { name: '碳积分发放', value: 326, unit: '万', prefix: '', trendClass: 'up', trendIcon: '↑', trendText: '+22.1%', color: '#f59e0b' },
]

const kpiItems = ref(defaultKpiItems)

function animateNumbers() {
  kpiItems.value.forEach((item, i) => {
    const el = numberRefs[i]
    if (!el) return
    const target = item.value
    let current = 0
    const step = target / 35
    const timer = setInterval(() => {
      current += step
      if (current >= target) {
        current = target
        clearInterval(timer)
      }
      el.textContent = current.toFixed(0)
    }, 25)
  })
}

onMounted(async () => {
  try {
    const data = await api.kpi()
    if (data) {
      kpiItems.value = [
        { name: '注册用户', value: data.registeredUsers ?? 7403, unit: '人', prefix: '', trendClass: 'up', trendIcon: '↑', trendText: '+12.5%', color: '#3b82f6' },
        { name: '活跃用户', value: data.activeUsers ?? 5470, unit: '人', prefix: '', trendClass: 'up', trendIcon: '↑', trendText: '+8.3%', color: '#0ea5e9' },
        { name: '碳减排量', value: data.totalReduction ?? 1884, unit: '吨', prefix: '', trendClass: 'up', trendIcon: '↑', trendText: '+15.2%', color: '#2563eb' },
        { name: '碳积分发放', value: data.totalCredits ?? 326, unit: '万', prefix: '', trendClass: 'up', trendIcon: '↑', trendText: '+22.1%', color: '#f59e0b' },
      ]
    }
  } catch {
    // API不可用，使用默认 fallback 数据
  }

  // 数据就绪后启动数字动画
  await new Promise(resolve => setTimeout(resolve, 50))
  animateNumbers()
})
</script>

<style scoped>
.kpi-card {
  background: linear-gradient(135deg, #f0fdf4 0%, #fff 100%);
  border-radius: 12px;
  border: 1px solid #dbeafe;
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 12px;
  height: 100%;
}
.kpi-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.kpi-label {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}
.kpi-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  flex: 1;
}
.kpi-item {
  background: #fff;
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  border: 1px solid #f1f5f9;
}
.kpi-value {
  display: flex;
  align-items: baseline;
  gap: 3px;
}
.kpi-prefix {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}
.kpi-number {
  font-size: 22px;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}
.kpi-suffix {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
}
.kpi-name {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
}
.kpi-trend {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  font-weight: 600;
}
.kpi-trend.up { color: #3b82f6; }
.kpi-trend.neutral { color: #f59e0b; }
.kpi-trend.down { color: #ef4444; }
.trend-icon { font-size: 12px; }
</style>
