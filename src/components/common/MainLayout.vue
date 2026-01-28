<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <aside 
      :class="[
        'bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex-shrink-0',
        sidebarCollapsed ? 'w-20' : 'w-64'
      ]"
    >
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h1 v-if="!sidebarCollapsed" class="text-2xl font-display font-bold gradient-text">
              MultiTool
            </h1>
            <el-button 
              :icon="sidebarCollapsed ? 'Expand' : 'Fold'" 
              circle
              @click="appSettings.toggleSidebar()"
            />
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors group"
            active-class="bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400"
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span v-if="!sidebarCollapsed" class="font-medium">{{ item.name }}</span>
          </router-link>
        </nav>

        <!-- Settings -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700">
          <el-button
            :icon="isDark ? 'Sunny' : 'Moon'"
            :circle="sidebarCollapsed"
            class="w-full"
            @click="appSettings.toggleTheme()"
          >
            <span v-if="!sidebarCollapsed">{{ isDark ? 'Light' : 'Dark' }} Mode</span>
          </el-button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-display font-bold text-gray-900 dark:text-white">
              {{ currentPageTitle }}
            </h2>
            <el-breadcrumb separator="/" class="mt-1">
              <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
              <el-breadcrumb-item v-if="$route.meta.title">{{ $route.meta.title }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          
          <div class="flex items-center gap-4">
            <el-popover placement="bottom" :width="300" trigger="click">
              <template #reference>
                <el-badge :value="recentFeatures.length" :max="9" class="item">
                  <el-button icon="Clock" circle />
                </el-badge>
              </template>
              <div class="space-y-2 max-h-96 overflow-y-auto">
                <div class="font-semibold mb-2">Recent Features</div>
                <router-link
                  v-for="recent in recentFeatures"
                  :key="recent.path"
                  :to="recent.path"
                  class="block p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                >
                  <div class="flex items-center gap-2">
                    <component :is="recent.icon" class="w-4 h-4" />
                    <div class="flex-1">
                      <div class="text-sm font-medium">{{ recent.name }}</div>
                      <div class="text-xs text-gray-500">{{ formatRecentTime(recent.timestamp) }}</div>
                    </div>
                  </div>
                </router-link>
                <div v-if="recentFeatures.length === 0" class="text-center py-4 text-gray-400 text-sm">
                  No recent features
                </div>
              </div>
            </el-popover>
            
            <el-popover placement="bottom" :width="300" trigger="click">
              <template #reference>
                <el-badge :value="favoriteFeatures.length" :max="9" class="item">
                  <el-button icon="Star" circle />
                </el-badge>
              </template>
              <div class="space-y-2 max-h-96 overflow-y-auto">
                <div class="font-semibold mb-2">Favorite Features</div>
                <router-link
                  v-for="fav in favoriteFeatures"
                  :key="fav"
                  :to="getFeaturePath(fav)"
                  class="block p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                >
                  <div class="flex items-center gap-2">
                    <component :is="getFeatureIcon(fav)" class="w-4 h-4" />
                    <div class="text-sm font-medium">{{ fav }}</div>
                  </div>
                </router-link>
                <div v-if="favoriteFeatures.length === 0" class="text-center py-4 text-gray-400 text-sm">
                  No favorites yet
                </div>
              </div>
            </el-popover>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-6 scrollbar-thin">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppSettingsStore } from '@/stores/useAppSettingsStore'
import {
  Document,
  Odometer,
  MagicStick as Magic,
  Memo,
  List,
  Money,
  Coin,
  DocumentCopy,
  View,
  TrendCharts
} from '@element-plus/icons-vue'

const route = useRoute()
const appSettings = useAppSettingsStore()

const sidebarCollapsed = computed(() => appSettings.sidebarCollapsed)
const isDark = computed(() => appSettings.isDark)
const recentFeatures = computed(() => appSettings.recentFeatures)
const favoriteFeatures = computed(() => appSettings.favoriteFeatures)

const currentPageTitle = computed(() => {
  return route.meta.title || 'Dashboard'
})

const menuItems = [
  { name: 'Dashboard', path: '/', icon: TrendCharts },
  { name: 'Calculator', path: '/calculator', icon: Odometer },
  { name: 'Form Designer', path: '/form-designer', icon: Magic },
  // { name: 'Form Models', path: '/form-models', icon: Document },
  { name: 'Unit Converter', path: '/unit-converter', icon: Coin },
  { name: 'Notes', path: '/notes', icon: Memo },
  { name: 'Money Manager', path: '/money-manager', icon: Money },
  { name: 'To-Do List', path: '/todo', icon: List },
  { name: 'File Converter', path: '/file-converter', icon: DocumentCopy },
  { name: 'Document Viewer', path: '/document-viewer', icon: View }
]

function formatRecentTime(timestamp) {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

function getFeaturePath(name) {
  const item = menuItems.find(m => m.name === name)
  return item?.path || '/'
}

function getFeatureIcon(name) {
  const item = menuItems.find(m => m.name === name)
  return item?.icon || Document
}
</script>
