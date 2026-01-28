import { defineStore } from 'pinia'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

export const useNotesStore = defineStore('notes', () => {
  const notes = ref(JSON.parse(localStorage.getItem('notes') || '[]'))
  const notebooks = ref(JSON.parse(localStorage.getItem('notebooks') || '[{"id":"default","name":"Default","color":"blue"}]'))
  
  function createNote(noteData) {
    const note = {
      id: uuidv4(),
      title: noteData.title || 'Untitled Note',
      content: noteData.content || '',
      notebook: noteData.notebook || 'default',
      tags: noteData.tags || [],
      color: noteData.color || 'white',
      starred: false,
      archived: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    notes.value.unshift(note)
    saveNotes()
    return note
  }
  
  function updateNote(id, updates) {
    const index = notes.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notes.value[index] = { ...notes.value[index], ...updates, updatedAt: Date.now() }
      saveNotes()
      return notes.value[index]
    }
    return null
  }
  
  function deleteNote(id) {
    const index = notes.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notes.value.splice(index, 1)
      saveNotes()
      return true
    }
    return false
  }
  
  function searchNotes(query) {
    const lowerQuery = query.toLowerCase()
    return notes.value.filter(note => 
      note.title.toLowerCase().includes(lowerQuery) ||
      note.content.toLowerCase().includes(lowerQuery) ||
      note.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }
  
  function toggleStar(id) {
    const note = notes.value.find(n => n.id === id)
    if (note) {
      note.starred = !note.starred
      saveNotes()
    }
  }
  
  function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes.value))
  }

  function clearAll() {
    notes.value = []
    saveNotes()
  }
  
  return {
    notes,
    notebooks,
    createNote,
    updateNote,
    deleteNote,
    searchNotes,
    toggleStar,
    clearAll
  }
})
