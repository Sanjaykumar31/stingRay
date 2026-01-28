import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const preferences = ref(JSON.parse(localStorage.getItem('userPreferences') || '{}'))
  const statistics = ref(JSON.parse(localStorage.getItem('userStats') || '{}'))
  
  function updatePreference(key, value) {
    preferences.value[key] = value
    localStorage.setItem('userPreferences', JSON.stringify(preferences.value))
  }
  
  function incrementStat(key) {
    if (!statistics.value[key]) {
      statistics.value[key] = 0
    }
    statistics.value[key]++
    localStorage.setItem('userStats', JSON.stringify(statistics.value))
  }
  
  return {
    preferences,
    statistics,
    updatePreference,
    incrementStat
  }
})
