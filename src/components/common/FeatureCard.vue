<template>
  <router-link
    :to="feature.path"
    class="feature-card group relative overflow-hidden"
    @click="trackFeatureUse"
  >
    <!-- Gradient background -->
    <div :class="['absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity', feature.color]"></div>
    
    <div class="relative z-10">
      <!-- Icon -->
      <div class="mb-4 flex items-center justify-between">
        <div :class="['w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform', feature.color]">
          <component :is="feature.icon" class="w-7 h-7" />
        </div>
        
        <el-button
          :icon="isFavorite ? 'StarFilled' : 'Star'"
          circle
          text
          @click.prevent="toggleFavorite"
          :class="isFavorite ? 'text-yellow-500' : 'text-gray-400'"
        />
      </div>
      
      <!-- Content -->
      <h3 class="text-xl font-display font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {{ feature.name }}
      </h3>
      
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {{ feature.description }}
      </p>
      
      <!-- Category Badge -->
      <div class="flex items-center justify-between">
        <span class="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 capitalize">
          {{ feature.category }}
        </span>
        
        <el-icon class="text-primary-600 dark:text-primary-400 transform group-hover:translate-x-1 transition-transform">
          <ArrowRight />
        </el-icon>
      </div>
    </div>
    
    <!-- Hover effect -->
    <div class="absolute inset-0 border-2 border-transparent group-hover:border-primary-300 dark:group-hover:border-primary-700 rounded-2xl transition-colors pointer-events-none"></div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import { useAppSettingsStore } from '@/stores/useAppSettingsStore'
import { ArrowRight } from '@element-plus/icons-vue'

const props = defineProps({
  feature: {
    type: Object,
    required: true
  }
})

const appSettings = useAppSettingsStore()

const isFavorite = computed(() => appSettings.isFavorite(props.feature.path))

function trackFeatureUse() {
  appSettings.addRecentFeature(props.feature)
}

function toggleFavorite() {
  appSettings.toggleFavorite(props.feature.path)
}
</script>
