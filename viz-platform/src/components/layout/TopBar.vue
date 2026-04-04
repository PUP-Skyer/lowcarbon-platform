<template>
  <header class="top-bar">
    <button class="mobile-menu-btn" @click="showMobileMenu = !showMobileMenu">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22">
        <path d="M3 12h18M3 6h18M3 18h18"/>
      </svg>
    </button>
    <div class="breadcrumb">
      <span class="breadcrumb-item" v-for="(item, i) in breadcrumbs" :key="i">
        <router-link v-if="item.to" :to="item.to">{{ item.label }}</router-link>
        <span v-else class="current">{{ item.label }}</span>
        <span v-if="i < breadcrumbs.length - 1" class="sep">/</span>
      </span>
    </div>
    <div class="top-actions">
      <div class="user-avatar">U</div>
    </div>
  </header>
  <Teleport to="body">
    <div v-if="showMobileMenu" class="mobile-overlay" @click="showMobileMenu = false"></div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const showMobileMenu = ref(false)

const breadcrumbs = computed(() => {
  const items: Array<{ label: string; to?: string }> = [{ label: '首页', to: '/dashboard' }]
  if (route.name === 'Editor') {
    items.push({ label: '编辑器' })
  } else if (route.name === 'DataSource') {
    items.push({ label: '数据源' })
  }
  return items
})
</script>

<style scoped>
.top-bar {
  height: 56px;
  background: #fff;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 16px;
  position: sticky;
  top: 0;
  z-index: 50;
}
.mobile-menu-btn {
  display: none;
  border: none;
  background: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
}
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}
.breadcrumb-item a {
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.15s;
}
.breadcrumb-item a:hover {
  color: #6366f1;
}
.breadcrumb-item .current {
  color: #334155;
  font-weight: 600;
}
.sep {
  color: #cbd5e1;
}
.top-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px;
}
.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
}
.mobile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 999;
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
  }
  .top-bar {
    padding: 0 16px;
  }
}
</style>
