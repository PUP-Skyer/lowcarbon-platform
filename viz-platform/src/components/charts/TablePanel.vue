<template>
  <div class="table-panel">
    <div class="table-header">
      <span class="table-title">{{ title }}</span>
    </div>
    <div class="table-body">
      <div class="table-loading" v-if="loading">加载中...</div>
      <table v-if="!loading && columns.length">
        <thead>
          <tr>
            <th v-for="col in columns" :key="col">{{ col }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in rows" :key="i">
            <td v-for="col in columns" :key="col">{{ row[col] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { fetchRealData } from '../../data/mockData'
import type { ChartConfig } from '../../types'

const props = defineProps<{
  config: ChartConfig
}>()

const title = computed(() => props.config.title)
const columns = ref<string[]>([])
const rows = ref<Record<string, any>[]>([])
const loading = ref(true)

async function loadTableData() {
  loading.value = true
  try {
    const data = await fetchRealData(props.config.dataSource)
    columns.value = data.columns
    rows.value = data.rows
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTableData()
})

watch(() => props.config, () => {
  loadTableData()
}, { deep: true })
</script>

<style scoped>
.table-panel {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.table-header {
  padding: 12px 16px 4px;
}
.table-title {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}
.table-body {
  flex: 1;
  overflow: auto;
  padding: 8px 16px 16px;
  position: relative;
}
.table-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 13px;
  padding: 20px 0;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
thead th {
  text-align: left;
  padding: 8px 12px;
  font-weight: 600;
  color: #64748b;
  border-bottom: 2px solid #e2e8f0;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  position: sticky;
  top: 0;
  background: #fff;
}
tbody td {
  padding: 10px 12px;
  color: #334155;
  border-bottom: 1px solid #f1f5f9;
}
tbody tr:hover {
  background: #f8fafc;
}
</style>
