<template>
  <div class="video-creator">
    <!-- 页面标题 -->
    <div class="page-header">
      <div>
        <h1 class="page-title">AI 视频创作</h1>
        <p class="page-subtitle">基于碳数据的智能视频生成（Seedance 2.0 驱动）</p>
      </div>
    </div>

    <!-- 区域一：统计概览 -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-value">{{ stats.total || 0 }}</div>
        <div class="stat-label">总视频数</div>
      </div>
      <div class="stat-card">
        <div class="stat-value completed">{{ stats.completed || 0 }}</div>
        <div class="stat-label">已完成</div>
      </div>
      <div class="stat-card">
        <div class="stat-value generating">{{ stats.generating || 0 }}</div>
        <div class="stat-label">生成中</div>
      </div>
      <div class="stat-card">
        <div class="stat-value pending">{{ stats.pending || 0 }}</div>
        <div class="stat-label">待处理</div>
      </div>
    </div>

    <!-- 区域二：创建新视频 -->
    <div class="card create-card">
      <h2 class="card-title">创建新视频</h2>
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">视频标题</label>
          <input
            v-model="form.title"
            type="text"
            class="form-input"
            placeholder="请输入视频标题"
          />
        </div>
        <div class="form-group">
          <label class="form-label">视频类型</label>
          <select v-model="form.type" class="form-input">
            <option value="">请选择类型</option>
            <option value="report">碳数据报告</option>
            <option value="story">个人碳足迹回顾</option>
            <option value="rank">社区排行榜</option>
            <option value="edu">低碳科普</option>
          </select>
        </div>

        <!-- 动态参数配置 -->
        <div v-if="form.type === 'report'" class="form-group">
          <label class="form-label">时间范围</label>
          <select v-model="form.params.timeRange" class="form-input">
            <option value="">请选择</option>
            <option value="Q1">Q1（第一季度）</option>
            <option value="Q2">Q2（第二季度）</option>
            <option value="Q3">Q3（第三季度）</option>
            <option value="Q4">Q4（第四季度）</option>
            <option value="year">全年</option>
          </select>
        </div>

        <div v-if="form.type === 'story'" class="form-group">
          <label class="form-label">风格选择</label>
          <select v-model="form.params.style" class="form-input">
            <option value="">请选择</option>
            <option value="warm">温馨</option>
            <option value="tech">科技</option>
            <option value="minimal">简约</option>
          </select>
        </div>

        <div v-if="form.type === 'rank'" class="form-group">
          <label class="form-label">社区选择</label>
          <select v-model="form.params.community" class="form-input">
            <option value="">请选择</option>
            <option value="green-city">绿色城市社区</option>
            <option value="low-carbon">低碳生活社区</option>
            <option value="eco-family">生态家园社区</option>
          </select>
        </div>

        <div v-if="form.type === 'rank'" class="form-group">
          <label class="form-label">周期</label>
          <select v-model="form.params.period" class="form-input">
            <option value="">请选择</option>
            <option value="week">周</option>
            <option value="month">月</option>
          </select>
        </div>

        <div v-if="form.type === 'edu'" class="form-group">
          <label class="form-label">主题关键词</label>
          <input
            v-model="form.params.keyword"
            type="text"
            class="form-input"
            placeholder="例如：碳中和、绿色出行"
          />
        </div>
      </div>

      <button
        class="btn-generate"
        :disabled="generating || !form.title || !form.type"
        @click="handleGenerate"
      >
        <span v-if="generating" class="spinner"></span>
        {{ generating ? '生成中...' : '开始生成' }}
      </button>
    </div>

    <!-- 区域三：视频列表 -->
    <div class="card list-card">
      <h2 class="card-title">视频任务列表</h2>
      <div v-if="loading" class="loading-text">加载中...</div>
      <div v-else-if="tasks.length === 0" class="empty-text">暂无视频任务</div>
      <table v-else class="task-table">
        <thead>
          <tr>
            <th>标题</th>
            <th>类型</th>
            <th>状态</th>
            <th>时长</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id" class="table-row">
            <td>{{ task.title }}</td>
            <td>
              <span class="type-tag" :class="'type-' + task.type">
                {{ typeLabel(task.type) }}
              </span>
            </td>
            <td>
              <span class="status-tag" :class="'status-' + task.status">
                <span v-if="task.status === 'generating'" class="spin-dot"></span>
                {{ statusLabel(task.status) }}
              </span>
            </td>
            <td>{{ task.duration ? task.duration + '秒' : '-' }}</td>
            <td>{{ formatDate(task.created_at) }}</td>
            <td class="action-cell">
              <button class="btn-action btn-view" @click="viewScript(task)">查看脚本</button>
              <button class="btn-action btn-del" @click="handleDelete(task.id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 区域四：脚本预览弹窗 -->
    <Transition name="modal">
      <div v-if="modalVisible" class="modal-overlay" @click.self="modalVisible = false">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ modalTask?.title || '视频脚本' }}</h3>
            <button class="modal-close" @click="modalVisible = false">&times;</button>
          </div>
          <div class="modal-body">
            <div class="script-section">
              <h4>AI 生成脚本</h4>
              <p class="script-text">{{ modalTask?.script || '暂无脚本内容' }}</p>
            </div>
            <div class="script-section">
              <h4>Seedance 提示词</h4>
              <p class="script-text prompt-text">{{ modalTask?.prompt || '暂无提示词' }}</p>
            </div>
            <div v-if="modalTask?.status === 'completed' && modalTask?.video_url" class="script-section">
              <h4>视频链接</h4>
              <a :href="modalTask.video_url" target="_blank" class="video-link">{{ modalTask.video_url }}</a>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast 提示 -->
    <Transition name="toast">
      <div v-if="toastVisible" class="toast">{{ toastMsg }}</div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { api } from '../utils/api'

const tasks = ref<any[]>([])
const stats = ref<any>({})
const loading = ref(false)
const generating = ref(false)

const form = reactive({
  title: '',
  type: '',
  params: {} as any,
})

const toastMsg = ref('')
const toastVisible = ref(false)

const modalVisible = ref(false)
const modalTask = ref<any>(null)

function showToast(msg: string) {
  toastMsg.value = msg
  toastVisible.value = true
  setTimeout(() => { toastVisible.value = false }, 3000)
}

function typeLabel(type: string) {
  const map: Record<string, string> = {
    report: '碳数据报告',
    story: '个人碳足迹回顾',
    rank: '社区排行榜',
    edu: '低碳科普',
  }
  return map[type] || type
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    pending: '待处理',
    generating: '生成中',
    completed: '已完成',
    failed: '失败',
  }
  return map[status] || status
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${day} ${h}:${min}`
}

async function loadData() {
  loading.value = true
  try {
    const [tasksData, statsData] = await Promise.all([
      api.videoTasks(),
      api.videoStats()
    ])
    tasks.value = tasksData
    stats.value = statsData
  } catch (e) {
    console.error('Failed to load video data:', e)
  } finally {
    loading.value = false
  }
}

async function handleGenerate() {
  if (!form.title || !form.type) return
  generating.value = true
  try {
    const newTask = await api.videoGenerate({
      title: form.title,
      type: form.type,
      params: form.params
    })
    showToast('视频生成任务已创建，预计需要7秒完成')
    loadData()

    // 轮询新任务状态
    const pollId = newTask.id
    const poll = setInterval(async () => {
      try {
        const task = await api.videoTask(pollId)
        if (task.status === 'completed') {
          clearInterval(poll)
          showToast('视频生成完成！')
          loadData()
        }
      } catch { clearInterval(poll) }
    }, 3000)
  } catch (e) {
    showToast('创建失败，请重试')
  } finally {
    generating.value = false
  }
}

async function handleDelete(id: number) {
  if (!confirm('确定删除该视频任务？')) return
  await api.videoDelete(id)
  loadData()
}

function viewScript(task: any) {
  modalTask.value = task
  modalVisible.value = true
}

onMounted(() => loadData())
</script>

<style scoped>
.video-creator {
  padding: 32px;
  background: #f8fafc;
  min-height: 100vh;
}

/* 页面标题 */
.page-header {
  margin-bottom: 28px;
}
.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px 0;
}
.page-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

/* 统计卡片 */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 28px;
}
.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px 24px;
  border-top: 4px solid #3b82f6;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #0f172a;
}
.stat-value.completed { color: #22c55e; }
.stat-value.generating { color: #3b82f6; }
.stat-value.pending { color: #94a3b8; }
.stat-label {
  font-size: 13px;
  color: #64748b;
  margin-top: 4px;
}

/* 通用卡片 */
.card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  margin-bottom: 28px;
}
.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 20px 0;
}

/* 创建表单 */
.create-card {
  border-top: 4px solid #3b82f6;
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-label {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}
.form-input {
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #0f172a;
  background: #fff;
  transition: border-color 0.2s;
  outline: none;
}
.form-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
}

/* 生成按钮 */
.btn-generate {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 28px;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-generate:hover:not(:disabled) {
  background: #2563eb;
}
.btn-generate:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 表格 */
.task-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.task-table thead th {
  text-align: left;
  padding: 12px 16px;
  font-weight: 600;
  color: #475569;
  background: #f1f5f9;
  border-bottom: 1px solid #e2e8f0;
}
.table-row:nth-child(even) {
  background: #f8fafc;
}
.task-table tbody td {
  padding: 12px 16px;
  color: #334155;
  border-bottom: 1px solid #f1f5f9;
}

/* 类型标签 */
.type-tag {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}
.type-report { background: #dbeafe; color: #2563eb; }
.type-story { background: #dcfce7; color: #16a34a; }
.type-rank { background: #ffedd5; color: #ea580c; }
.type-edu { background: #f3e8ff; color: #9333ea; }

/* 状态标签 */
.status-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}
.status-pending { background: #f1f5f9; color: #64748b; }
.status-generating { background: #dbeafe; color: #2563eb; }
.status-completed { background: #dcfce7; color: #16a34a; }
.status-failed { background: #fee2e2; color: #dc2626; }
.spin-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #3b82f6;
  border-radius: 50%;
  animation: pulse 1s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.7); }
}

/* 操作按钮 */
.action-cell {
  display: flex;
  gap: 8px;
}
.btn-action {
  padding: 5px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-action:hover { opacity: 0.8; }
.btn-view {
  background: #eff6ff;
  color: #2563eb;
}
.btn-del {
  background: #fef2f2;
  color: #dc2626;
}

/* 加载和空状态 */
.loading-text,
.empty-text {
  text-align: center;
  padding: 40px 0;
  color: #94a3b8;
  font-size: 14px;
}

/* 模态框 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  border-radius: 12px;
  width: 560px;
  max-width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
}
.modal-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
}
.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: #f1f5f9;
  border-radius: 8px;
  font-size: 18px;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.modal-close:hover {
  background: #e2e8f0;
}
.modal-body {
  padding: 24px;
}
.script-section {
  margin-bottom: 20px;
}
.script-section:last-child {
  margin-bottom: 0;
}
.script-section h4 {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  margin: 0 0 8px 0;
}
.script-text {
  font-size: 14px;
  color: #334155;
  line-height: 1.7;
  background: #f8fafc;
  padding: 14px 16px;
  border-radius: 8px;
  white-space: pre-wrap;
  word-break: break-word;
}
.prompt-text {
  font-style: italic;
  color: #64748b;
}
.video-link {
  color: #3b82f6;
  text-decoration: none;
  font-size: 14px;
  word-break: break-all;
}
.video-link:hover {
  text-decoration: underline;
}

/* 模态框过渡 */
.modal-enter-active { transition: opacity 0.25s; }
.modal-leave-active { transition: opacity 0.2s; }
.modal-enter-from { opacity: 0; }
.modal-leave-to { opacity: 0; }

/* Toast 提示 */
.toast {
  position: fixed;
  top: 80px;
  right: 24px;
  padding: 12px 24px;
  background: #1e293b;
  color: #fff;
  border-radius: 8px;
  font-size: 14px;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.toast-enter-active { transition: all 0.3s; }
.toast-leave-active { transition: all 0.3s; }
.toast-enter-from { opacity: 0; transform: translateX(40px); }
.toast-leave-to { opacity: 0; transform: translateX(40px); }

/* 响应式 */
@media (max-width: 768px) {
  .video-creator {
    padding: 16px;
  }
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .form-grid {
    grid-template-columns: 1fr;
  }
  .task-table {
    font-size: 13px;
  }
  .task-table thead th,
  .task-table tbody td {
    padding: 8px 10px;
  }
}
</style>
