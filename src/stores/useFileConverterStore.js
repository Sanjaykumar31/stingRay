import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFileConverterStore = defineStore('fileConverter', () => {
  const queue = ref([])
  const history = ref(JSON.parse(localStorage.getItem('conversionHistory') || '[]'))
  
  function addToQueue(file, targetFormat) {
    queue.value.push({
      id: Date.now(),
      file,
      targetFormat,
      status: 'pending',
      progress: 0
    })
  }
  
  function updateProgress(id, progress) {
    const item = queue.value.find(q => q.id === id)
    if (item) {
      item.progress = progress
    }
  }
  
  function removeFromQueue(id) {
    const index = queue.value.findIndex(q => q.id === id)
    if (index !== -1) {
      queue.value.splice(index, 1)
    }
  }
  
  return {
    queue,
    history,
    addToQueue,
    updateProgress,
    removeFromQueue
  }
})
