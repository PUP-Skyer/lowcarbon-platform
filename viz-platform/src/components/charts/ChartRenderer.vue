<template>
  <div class="chart-renderer">
    <EChartsPanel v-if="isEChartsType" :config="config" :editable="editable" @edit="$emit('edit')" @remove="$emit('remove')" />
    <KpiCard v-else-if="config.type === 'kpi'" :config="config" />
    <TablePanel v-else-if="config.type === 'table'" :config="config" />
    <div v-else class="unsupported">不支持的图表类型: {{ config.type }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ChartConfig } from '../../types'
import EChartsPanel from './EChartsPanel.vue'
import KpiCard from './KpiCard.vue'
import TablePanel from './TablePanel.vue'

const props = defineProps<{
  config: ChartConfig
  editable?: boolean
}>()

defineEmits<{
  edit: []
  remove: []
}>()

const echartsTypes = ['line', 'bar', 'pie', 'gauge', 'radar', 'scatter', 'funnel', 'heatmap']

const isEChartsType = computed(() => echartsTypes.includes(props.config.type))
</script>

<style scoped>
.chart-renderer {
  width: 100%;
  height: 100%;
}
.unsupported {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #94a3b8;
  font-size: 14px;
}
</style>
