import { defineStore } from 'pinia'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { useFormModelsStore } from './useFormModelsStore'

export const useFormDataStore = defineStore('formData', () => {
  function getFormData(modelId) {
    const key = `formData_${modelId}`
    return JSON.parse(localStorage.getItem(key) || '[]')
  }
  
  function saveFormData(modelId, data) {
    const key = `formData_${modelId}`
    localStorage.setItem(key, JSON.stringify(data))
  }
  
  function addSubmission(modelId, formData) {
    const submissions = getFormData(modelId)
    const newSubmission = {
      id: uuidv4(),
      data: formData,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    
    submissions.push(newSubmission)
    saveFormData(modelId, submissions)
    
    const modelsStore = useFormModelsStore()
    modelsStore.incrementDataCount(modelId)
    
    return newSubmission
  }
  
  function updateSubmission(modelId, submissionId, formData) {
    const submissions = getFormData(modelId)
    const index = submissions.findIndex(s => s.id === submissionId)
    
    if (index !== -1) {
      submissions[index] = {
        ...submissions[index],
        data: formData,
        updatedAt: Date.now()
      }
      saveFormData(modelId, submissions)
      return submissions[index]
    }
    return null
  }
  
  function deleteSubmission(modelId, submissionId) {
    const submissions = getFormData(modelId)
    const index = submissions.findIndex(s => s.id === submissionId)
    
    if (index !== -1) {
      submissions.splice(index, 1)
      saveFormData(modelId, submissions)
      
      const modelsStore = useFormModelsStore()
      modelsStore.decrementDataCount(modelId)
      return true
    }
    return false
  }
  
  function getSubmission(modelId, submissionId) {
    const submissions = getFormData(modelId)
    return submissions.find(s => s.id === submissionId)
  }
  
  function exportData(modelId, format = 'json') {
    const submissions = getFormData(modelId)
    
    if (format === 'json') {
      return JSON.stringify(submissions, null, 2)
    } else if (format === 'csv') {
      // Simple CSV export
      if (submissions.length === 0) return ''
      
      const headers = Object.keys(submissions[0].data)
      const rows = submissions.map(s => 
        headers.map(h => JSON.stringify(s.data[h] || '')).join(',')
      )
      
      return [headers.join(','), ...rows].join('\n')
    }
    
    return null
  }
  
  return {
    getFormData,
    addSubmission,
    updateSubmission,
    deleteSubmission,
    getSubmission,
    exportData
  }
})
