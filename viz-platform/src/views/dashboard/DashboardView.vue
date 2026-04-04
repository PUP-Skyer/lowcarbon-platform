<template>
  <div class="dashboard-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">仪表盘</h1>
        <p class="page-desc">管理和查看所有可视化仪表盘</p>
      </div>
      <button class="btn-primary" @click="createNew">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        新建仪表盘
      </button>
    </div>

    <div class="dashboard-grid">
      <div
        v-for="dash in dashboardList"
        :key="dash.id"
        class="dashboard-card"
        @click="openDashboard(dash.id)"
      >
        <div class="card-preview">
          <div class="preview-charts">
            <div class="mini-chart" v-for="n in Math.min(dash.charts.length, 4)" :key="n"
              :style="{ background: previewColors[n-1] }"></div>
          </div>
        </div>
        <div class="card-info">
          <h3 class="card-name">{{ dash.name }}</h3>
          <p class="card-desc">{{ dash.description || '暂无描述' }}</p>
          <div class="card-meta">
            <span class="meta-item">{{ dash.charts.length }} 个图表</span>
            <span class="meta-item">{{ formatDate(dash.updatedAt) }}</span>
          </div>
        </div>
        <div class="card-actions" @click.stop>
          <button class="card-btn" @click="editDashboard(dash.id)" title="编辑">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="16" height="16">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button class="card-btn danger" @click="handleDelete(dash.id)" title="删除">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="16" height="16">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="dashboard-card add-card" @click="createNew">
        <div class="add-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="32" height="32">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </div>
        <p>创建新仪表盘</p>
      </div>
    </div>

    <!-- 新建弹窗 -->
    <Teleport to="body">
      <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
        <div class="modal">
          <h2 class="modal-title">新建仪表盘</h2>
          <div class="form-group">
            <label>名称</label>
            <input v-model="newName" class="form-input" placeholder="输入仪表盘名称" />
          </div>
          <div class="form-group">
            <label>描述</label>
            <input v-model="newDesc" class="form-input" placeholder="简要描述（可选）" />
          </div>
          <div class="modal-actions">
            <button class="btn-ghost" @click="showCreateModal = false">取消</button>
            <button class="btn-primary" @click="confirmCreate">创建</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDashboardStore } from '../../stores/dashboard'

const router = useRouter()
const store = useDashboardStore()
const dashboardList = store.dashboardList

const previewColors = [
  'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(99,102,241,0.05))',
  'linear-gradient(135deg, rgba(34,211,238,0.15), rgba(34,211,238,0.05))',
  'linear-gradient(135deg, rgba(244,114,182,0.15), rgba(244,114,182,0.05))',
  'linear-gradient(135deg, rgba(167,139,250,0.15), rgba(167,139,250,0.05))',
]

const showCreateModal = ref(false)
const newName = ref('')
const newDesc = ref('')

function createNew() {
  newName.value = ''
  newDesc.value = ''
  showCreateModal.value = true
}

function confirmCreate() {
  if (!newName.value.trim()) return
  const dash = store.createDashboard(newName.value.trim(), newDesc.value.trim())
  showCreateModal.value = false
  router.push(`/editor/${dash.id}`)
}

function openDashboard(id: string) {
  router.push(`/editor/${id}`)
}

function editDashboard(id: string) {
  router.push(`/editor/${id}`)
}

function handleDelete(id: string) {
  if (confirm('确定删除该仪表盘？')) {
    store.deleteDashboard(id)
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.dashboard-page {
  padding: 32px;
  max-width: 1400px;
  margin: 0 auto;
}
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
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
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99,102,241,0.3);
}
.btn-ghost {
  padding: 10px 20px;
  background: transparent;
  color: #64748b;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-ghost:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
.dashboard-card {
  background: #fff;
  border-radius: 14px;
  border: 1px solid #f1f5f9;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}
.dashboard-card:hover {
  border-color: #e2e8f0;
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
  transform: translateY(-2px);
}
.card-preview {
  height: 120px;
  padding: 12px;
  background: #fafbfc;
}
.preview-charts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  height: 100%;
}
.mini-chart {
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.04);
}
.card-info {
  padding: 16px;
}
.card-name {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}
.card-desc {
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-meta {
  display: flex;
  gap: 16px;
}
.meta-item {
  font-size: 12px;
  color: #cbd5e1;
}
.card-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}
.dashboard-card:hover .card-actions {
  opacity: 1;
}
.card-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(8px);
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.card-btn:hover {
  background: #fff;
  color: #334155;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.card-btn.danger:hover {
  color: #ef4444;
  background: #fef2f2;
}

.add-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 240px;
  border: 2px dashed #e2e8f0;
  background: transparent;
  color: #94a3b8;
  font-size: 14px;
  gap: 12px;
}
.add-card:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: rgba(99,102,241,0.02);
  box-shadow: none;
  transform: none;
}
.add-icon {
  color: inherit;
}

/* 弹窗 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: #fff;
  border-radius: 16px;
  padding: 28px;
  width: 90%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
}
.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 20px;
}
.form-group {
  margin-bottom: 16px;
}
.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 6px;
}
.form-input {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  color: #1e293b;
  outline: none;
  transition: border-color 0.15s;
  box-sizing: border-box;
}
.form-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
}

@media (max-width: 768px) {
  .dashboard-page {
    padding: 16px;
  }
  .page-header {
    flex-direction: column;
    gap: 16px;
  }
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
