import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/dashboard/DashboardView.vue'),
      meta: { title: '仪表盘' },
    },
    {
      path: '/editor/:id?',
      name: 'Editor',
      component: () => import('../views/editor/EditorView.vue'),
      meta: { title: '编辑器' },
    },
    {
      path: '/ai-analysis',
      name: 'AiAnalysis',
      component: () => import('../views/AiAnalysisView.vue'),
      meta: { title: 'AI可行性分析' },
    },
    {
      path: '/video-creator',
      name: 'VideoCreator',
      component: () => import('../views/VideoCreatorView.vue'),
      meta: { title: '视频创作' },
    },
    {
      path: '/datasource',
      name: 'DataSource',
      component: () => import('../views/DataSourceView.vue'),
      meta: { title: '数据源' },
    },
    {
      path: '/screen',
      name: 'Screen',
      component: () => import('../views/ScreenView.vue'),
      meta: { title: '可视化' },
    },
  ],
})

export default router
