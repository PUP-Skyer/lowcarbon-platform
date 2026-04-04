<template>
  <aside class="sidebar" :class="{ collapsed }">
    <div class="sidebar-brand">
      <div class="brand-icon">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="8" fill="#3b82f6"/>
          <path d="M8 20C8 20 10 12 14 12C18 12 14 8 20 8" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="9" cy="9" r="2" fill="#fff" opacity="0.6"/>
        </svg>
      </div>
      <transition name="fade">
        <span v-if="!collapsed" class="brand-text">低碳可视化</span>
      </transition>
    </div>

    <nav class="sidebar-nav">
      <router-link to="/dashboard" class="nav-item" active-class="active">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="4" rx="1.5"/>
          <rect x="3" y="14" width="7" height="4" rx="1.5"/><rect x="14" y="11" width="7" height="7" rx="1.5"/>
        </svg>
        <transition name="fade"><span v-if="!collapsed">仪表盘</span></transition>
      </router-link>

      <router-link to="/screen" class="nav-item" active-class="active">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
          <path d="M7 8h2M7 11h4"/>
        </svg>
        <transition name="fade"><span v-if="!collapsed">可视化</span></transition>
      </router-link>

      <router-link to="/ai-analysis" class="nav-item" active-class="active">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M12 2a4 4 0 014 4c0 1.95-1.4 3.58-3.25 3.93L12 14"/>
          <circle cx="12" cy="18" r="0.5" fill="currentColor"/>
          <path d="M9.5 2.5l1.5-0.5 1.5 0.5"/>
          <path d="M4.93 4.93l1.06 1.06M17.01 4.93l-1.06 1.06"/>
        </svg>
        <transition name="fade"><span v-if="!collapsed">AI分析</span></transition>
      </router-link>

      <router-link to="/video-creator" class="nav-item" active-class="active">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <polygon points="23 7 16 12 23 17 23 7"/>
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
        </svg>
        <transition name="fade"><span v-if="!collapsed">视频创作</span></transition>
      </router-link>

      <router-link to="/editor" class="nav-item" active-class="active">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M12 3v18M3 12h18M7 7l10 10M17 7L7 17"/>
        </svg>
        <transition name="fade"><span v-if="!collapsed">编辑器</span></transition>
      </router-link>

      <router-link to="/datasource" class="nav-item" active-class="active">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
        </svg>
        <transition name="fade"><span v-if="!collapsed">数据源</span></transition>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <button class="collapse-btn" @click="collapsed = !collapsed">
        <svg :class="{ rotated: collapsed }" class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const collapsed = ref(false)
</script>

<style scoped>
.sidebar {
  width: 220px;
  min-width: 220px;
  height: 100vh;
  background: #0f172a;
  display: flex;
  flex-direction: column;
  transition: width 0.25s ease, min-width 0.25s ease;
  overflow: hidden;
  position: sticky;
  top: 0;
  z-index: 100;
}
.sidebar.collapsed {
  width: 64px;
  min-width: 64px;
}
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.brand-icon {
  flex-shrink: 0;
}
.brand-text {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  letter-spacing: -0.01em;
}
.sidebar-nav {
  flex: 1;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  color: #94a3b8;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.15s;
  white-space: nowrap;
}
.nav-item:hover {
  background: rgba(255,255,255,0.06);
  color: #e2e8f0;
}
.nav-item.active {
  background: rgba(59,130,246,0.15);
  color: #60a5fa;
}
.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}
.sidebar-footer {
  padding: 12px 8px;
  border-top: 1px solid rgba(255,255,255,0.06);
}
.collapse-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s;
}
.collapse-btn:hover {
  background: rgba(255,255,255,0.06);
  color: #e2e8f0;
}
.rotated {
  transform: rotate(180deg);
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.15s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
  }
  .sidebar.collapsed {
    width: 0;
    min-width: 0;
    padding: 0;
  }
}
</style>
