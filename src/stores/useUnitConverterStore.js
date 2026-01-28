import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUnitConverterStore = defineStore('unitConverter', () => {
  const history = ref(JSON.parse(localStorage.getItem('conversionHistory') || '[]'))
  const favorites = ref(JSON.parse(localStorage.getItem('favoriteConversions') || '[]'))
  
  function addToHistory(conversion) {
    history.value.unshift({
      ...conversion,
      timestamp: Date.now()
    })
    
    if (history.value.length > 50) {
      history.value = history.value.slice(0, 50)
    }
    
    localStorage.setItem('conversionHistory', JSON.stringify(history.value))
  }
  
  function clearHistory() {
    history.value = []
    localStorage.setItem('conversionHistory', '[]')
  }
  
  return {
    history,
    favorites,
    addToHistory,
    clearHistory
  }
})
