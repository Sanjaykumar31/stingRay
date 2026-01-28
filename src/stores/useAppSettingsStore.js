import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'

export const useAppSettingsStore = defineStore('appSettings', () => {
  // State
  const theme = ref(localStorage.getItem('theme') || 'light')
  const sidebarCollapsed = ref(localStorage.getItem('sidebarCollapsed') === 'true')
  const language = ref(localStorage.getItem('language') || 'en')
  const animations = ref(localStorage.getItem('animations') !== 'false')
  const recentFeatures = ref(JSON.parse(localStorage.getItem('recentFeatures') || '[]'))
  const favoriteFeatures = ref(JSON.parse(localStorage.getItem('favoriteFeatures') || '[]'))
  
  // Computed
  const isDark = computed(() => theme.value === 'dark')
  
  // Actions
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    applyTheme()
  }
  
  function setTheme(newTheme) {
    theme.value = newTheme
    applyTheme()
  }
  
  function applyTheme() {
    if (theme.value === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  
  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
  
  function addRecentFeature(feature) {
    const existingIndex = recentFeatures.value.findIndex(f => f.path === feature.path)
    
    if (existingIndex !== -1) {
      recentFeatures.value.splice(existingIndex, 1)
    }
    
    recentFeatures.value.unshift({
      ...feature,
      timestamp: Date.now()
    })
    
    // Keep only last 10
    if (recentFeatures.value.length > 10) {
      recentFeatures.value = recentFeatures.value.slice(0, 10)
    }
  }
  
  function toggleFavorite(featurePath) {
    const index = favoriteFeatures.value.indexOf(featurePath)
    if (index === -1) {
      favoriteFeatures.value.push(featurePath)
    } else {
      favoriteFeatures.value.splice(index, 1)
    }
  }
  
  function isFavorite(featurePath) {
    return favoriteFeatures.value.includes(featurePath)
  }
  
  function setLanguage(lang) {
    language.value = lang
  }
  
  function toggleAnimations() {
    animations.value = !animations.value
  }
  
  function resetSettings() {
    theme.value = 'light'
    sidebarCollapsed.value = false
    language.value = 'en'
    animations.value = true
    recentFeatures.value = []
    favoriteFeatures.value = []
    applyTheme()
  }
  
  // Watchers for localStorage persistence
  watch(theme, (val) => localStorage.setItem('theme', val))
  watch(sidebarCollapsed, (val) => localStorage.setItem('sidebarCollapsed', val))
  watch(language, (val) => localStorage.setItem('language', val))
  watch(animations, (val) => localStorage.setItem('animations', val))
  watch(recentFeatures, (val) => localStorage.setItem('recentFeatures', JSON.stringify(val)), { deep: true })
  watch(favoriteFeatures, (val) => localStorage.setItem('favoriteFeatures', JSON.stringify(val)), { deep: true })
  
  // Initialize theme on load
  applyTheme()
  
  return {
    theme,
    isDark,
    sidebarCollapsed,
    language,
    animations,
    recentFeatures,
    favoriteFeatures,
    toggleTheme,
    setTheme,
    toggleSidebar,
    addRecentFeature,
    toggleFavorite,
    isFavorite,
    setLanguage,
    toggleAnimations,
    resetSettings
  }
})
