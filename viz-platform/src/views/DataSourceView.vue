<template>
  <div class="datasource-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">数据源管理</h1>
        <p class="page-desc">配置和管理平台数据连接</p>
      </div>
    </div>

    <div class="ds-grid">
      <div v-for="ds in dataSources" :key="ds.id" class="ds-card">
        <div class="ds-icon" :class="ds.type">
          <svg v-if="ds.type === 'static'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="24" height="24">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
          </svg>
          <svg v-else-if="ds.type === 'api'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="24" height="24">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="24" height="24">
            <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
          </svg>
        </div>
        <div class="ds-info">
          <h3 class="ds-name">{{ ds.name }}</h3>
          <p class="ds-type">{{ typeLabels[ds.type] }}</p>
        </div>
        <div class="ds-status" :class="{ connected: ds.connected }">
          <span class="status-dot"></span>
          {{ ds.connected ? '已连接' : '未连接' }}
        </div>
        <div class="ds-meta">
          <span>{{ ds.tables }} 张表</span>
          <span>{{ ds.records?.toLocaleString() }} 条记录</span>
        </div>
      </div>
    </div>

    <div class="preview-section">
      <h2 class="section-title">数据预览</h2>
      <div class="preview-controls">
        <select v-model="selectedDS" class="form-select">
          <option v-for="ds in mockDataKeys" :key="ds" :value="ds">{{ ds }}</option>
        </select>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th v-for="col in currentData.columns" :key="col">{{ col }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in currentData.rows" :key="i">
              <td v-for="col in currentData.columns" :key="col">{{ row[col] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { mockDataSets } from '../data/mockData'

const typeLabels: Record<string, string> = {
  static: '静态数据',
  api: 'API 接口',
  database: '数据库',
}

const dataSources = [
  { id: 'ds-1', name: '碳排放数据集', type: 'static', connected: true, tables: 8, records: 2400 },
  { id: 'ds-2', name: '用户低碳行为', type: 'api', connected: true, tables: 5, records: 58000 },
  { id: 'ds-3', name: '碳积分交易库', type: 'database', connected: false, tables: 4, records: 12000 },
  { id: 'ds-4', name: '社区碳数据', type: 'static', connected: true, tables: 3, records: 730 },
]

const mockDataKeys = Object.keys(mockDataSets)
const selectedDS = ref(mockDataKeys[0])

const currentData = computed(() => mockDataSets[selectedDS.value] || { columns: [], rows: [] })
</script>

<style scoped>
.datasource-page {
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
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
  margin-bottom: 28px;
}
.ds-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 40px;
}
.ds-card {
  background: #fff;
  border: 1px solid #f1f5f9;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.2s;
}
.ds-card:hover {
  border-color: #e2e8f0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}
.ds-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ds-icon.static { background: #eff6ff; color: #3b82f6; }
.ds-icon.api { background: #f0fdf4; color: #22c55e; }
.ds-icon.database { background: #faf5ff; color: #a855f7; }
.ds-name {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
}
.ds-type {
  font-size: 12px;
  color: #94a3b8;
}
.ds-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #ef4444;
}
.ds-status.connected { color: #3b82f6; }
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
}
.ds-status.connected .status-dot {
  background: #3b82f6;
  box-shadow: 0 0 6px rgba(59,130,246,0.4);
}
.ds-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #cbd5e1;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
}
.preview-controls {
  margin-bottom: 16px;
}
.form-select {
  padding: 8px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  color: #1e293b;
  outline: none;
  background: #fff;
}
.form-select:focus {
  border-color: #3b82f6;
}
.table-wrapper {
  background: #fff;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  overflow: auto;
  max-height: 400px;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
thead th {
  text-align: left;
  padding: 12px 16px;
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
  padding: 10px 16px;
  color: #334155;
  border-bottom: 1px solid #f1f5f9;
}
tbody tr:hover {
  background: #f8fafc;
}

@media (max-width: 768px) {
  .datasource-page { padding: 16px; }
  .ds-grid { grid-template-columns: 1fr; }
}
</style>
