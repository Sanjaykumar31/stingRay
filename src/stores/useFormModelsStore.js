import { defineStore } from 'pinia'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

export const useFormModelsStore = defineStore('formModels', () => {
  // State
  const models = ref(JSON.parse(localStorage.getItem('formModels') || '[]'))
  
  // Actions
  function createModel(modelData) {
    const newModel = {
      id: uuidv4(),
      name: modelData.name,
      description: modelData.description || '',
      schema: modelData.schema || { fields: [] },
      category: modelData.category || 'general',
      tags: modelData.tags || [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      dataCount: 0
    }
    
    models.value.push(newModel)
    saveModels()
    return newModel
  }
  
  function updateModel(id, updates) {
    const index = models.value.findIndex(m => m.id === id)
    if (index !== -1) {
      models.value[index] = {
        ...models.value[index],
        ...updates,
        updatedAt: Date.now()
      }
      saveModels()
      return models.value[index]
    }
    return null
  }
  
  function deleteModel(id) {
    const index = models.value.findIndex(m => m.id === id)
    if (index !== -1) {
      models.value.splice(index, 1)
      saveModels()
      // Also delete associated form data
      localStorage.removeItem(`formData_${id}`)
      return true
    }
    return false
  }
  
  function getModelById(id) {
    return models.value.find(m => m.id === id)
  }
  
  function duplicateModel(id) {
    const model = getModelById(id)
    if (model) {
      const duplicate = {
        ...model,
        id: uuidv4(),
        name: `${model.name} (Copy)`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        dataCount: 0
      }
      models.value.push(duplicate)
      saveModels()
      return duplicate
    }
    return null
  }
  
  function searchModels(query) {
    const lowerQuery = query.toLowerCase()
    return models.value.filter(model => 
      model.name.toLowerCase().includes(lowerQuery) ||
      model.description.toLowerCase().includes(lowerQuery) ||
      model.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }
  
  function getModelsByCategory(category) {
    return models.value.filter(m => m.category === category)
  }
  
  function getAllCategories() {
    return [...new Set(models.value.map(m => m.category))]
  }
  
  function incrementDataCount(id) {
    const model = getModelById(id)
    if (model) {
      model.dataCount++
      saveModels()
    }
  }
  
  function decrementDataCount(id) {
    const model = getModelById(id)
    if (model && model.dataCount > 0) {
      model.dataCount--
      saveModels()
    }
  }
  
  function exportModel(id) {
    const model = getModelById(id)
    if (model) {
      return JSON.stringify(model, null, 2)
    }
    return null
  }
  
  function importModel(jsonString) {
    try {
      const model = JSON.parse(jsonString)
      const newModel = {
        ...model,
        id: uuidv4(),
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      models.value.push(newModel)
      saveModels()
      return newModel
    } catch (error) {
      console.error('Import error:', error)
      return null
    }
  }
  
  function saveModels() {
    localStorage.setItem('formModels', JSON.stringify(models.value))
  }
  
  return {
    models,
    createModel,
    updateModel,
    deleteModel,
    getModelById,
    duplicateModel,
    searchModels,
    getModelsByCategory,
    getAllCategories,
    incrementDataCount,
    decrementDataCount,
    exportModel,
    importModel
  }
})
