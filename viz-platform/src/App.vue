<template>
  <div class="app-layout" :class="{ 'fullscreen-mode': isScreenRoute }">
    <Sidebar v-if="!isScreenRoute" />
    <div class="app-main" v-if="!isScreenRoute">
      <TopBar />
      <div class="app-content">
        <router-view />
      </div>
    </div>
    <router-view v-if="isScreenRoute" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './components/layout/Sidebar.vue'
import TopBar from './components/layout/TopBar.vue'

const route = useRoute()
const isScreenRoute = computed(() => route.path === '/screen')
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}
.fullscreen-mode {
  display: block;
}
.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: #f8fafc;
}
.app-content {
  flex: 1;
  overflow-y: auto;
}
</style>
