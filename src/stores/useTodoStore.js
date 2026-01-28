import { defineStore } from 'pinia'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

export const useTodoStore = defineStore('todo', () => {
  const tasks = ref(JSON.parse(localStorage.getItem('todos') || '[]'))
  const lists = ref(JSON.parse(localStorage.getItem('todoLists') || '[{"id":"default","name":"My Tasks","color":"blue"}]'))
  
  function createTask(taskData) {
    const task = {
      id: uuidv4(),
      title: taskData.title,
      description: taskData.description || '',
      completed: false,
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      list: taskData.list || 'default',
      tags: taskData.tags || [],
      subtasks: taskData.subtasks || [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    tasks.value.unshift(task)
    saveTasks()
    return task
  }
  
  function updateTask(id, updates) {
    const index = tasks.value.findIndex(t => t.id === id)
    if (index !== -1) {
      tasks.value[index] = { ...tasks.value[index], ...updates, updatedAt: Date.now() }
      saveTasks()
      return tasks.value[index]
    }
    return null
  }
  
  function toggleComplete(id) {
    const task = tasks.value.find(t => t.id === id)
    if (task) {
      task.completed = !task.completed
      task.updatedAt = Date.now()
      saveTasks()
    }
  }
  
  function deleteTask(id) {
    const index = tasks.value.findIndex(t => t.id === id)
    if (index !== -1) {
      tasks.value.splice(index, 1)
      saveTasks()
      return true
    }
    return false
  }
  
  function saveTasks() {
    localStorage.setItem('todos', JSON.stringify(tasks.value))
  }

  function clearAll() {
    tasks.value = []
    lists.value = []
    saveTasks()
  }
  
  return {
    tasks,
    lists,
    createTask,
    updateTask,
    toggleComplete,
    deleteTask,
    clearAll
  }
})
