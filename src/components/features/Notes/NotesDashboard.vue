<template>
  <div class="notes-dashboard p-4 md:p-6">
    <!-- Header -->
    <div class="glass-effect p-4 md:p-6 rounded-2xl mb-4 md:mb-6">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl md:text-3xl font-display font-bold">Notes</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ filteredNotes.length }} notes</p>
        </div>
        <div class="flex gap-2 w-full md:w-auto flex-wrap">
          <el-input
            v-model="searchQuery"
            placeholder="Search notes..."
            prefix-icon="Search"
            class="flex-1 md:w-64"
            clearable
            size="large"
          />
          <el-button type="primary" icon="Plus" @click="createNewNote" size="large">
            New
          </el-button>
          <el-button icon="Download" @click="exportNotes" size="large">Export CSV</el-button>
          <el-button icon="Upload" @click="triggerImport" size="large">Import</el-button>
          <el-button icon="Delete" type="danger" @click="clearAllNotes" size="large">Clear All</el-button>
          <input ref="fileInput" type="file" accept=".json" @change="handleImport" class="hidden" />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <!-- Sidebar - Folders -->
      <div class="glass-effect p-4 rounded-xl">
        <h3 class="font-semibold mb-3">Folders</h3>
        <div class="space-y-1">
          <div
            v-for="folder in folders"
            :key="folder.id"
            class="p-3 rounded-lg cursor-pointer transition-colors"
            :class="currentFolder === folder.id ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800'"
            @click="currentFolder = folder.id"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <el-icon><component :is="folder.icon" /></el-icon>
                <span class="font-medium">{{ folder.name }}</span>
              </div>
              <el-tag size="small" round>{{ getCount(folder.id) }}</el-tag>
            </div>
          </div>
        </div>
      </div>

      <!-- Notes Grid -->
      <div class="lg:col-span-3">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          <div
            v-for="note in filteredNotes"
            :key="note.id"
            class="glass-effect p-4 rounded-xl hover:shadow-xl transition-all group"
            :style="{ borderLeft: `4px solid ${getNoteColor(note.color)}` }"
          >
            <div class="flex items-start justify-between mb-2">
              <h3 class="text-base md:text-lg font-bold flex-1 truncate cursor-pointer" @click="editNote(note)">
                {{ note.title }}
              </h3>
              <div class="flex gap-1 flex-shrink-0">
                <el-button
                  :icon="note.starred ? 'StarFilled' : 'Star'"
                  circle
                  size="small"
                  text
                  :class="note.starred ? 'text-yellow-500' : 'text-gray-400'"
                  @click.stop="toggleStar(note.id)"
                />
                <el-button
                  icon="Delete"
                  circle
                  size="small"
                  type="danger"
                  class="opacity-0 group-hover:opacity-100 transition-opacity"
                  @click.stop="deleteNoteDirect(note.id)"
                />
              </div>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3 cursor-pointer" @click="editNote(note)">
              {{ note.content || 'No content' }}
            </p>
            <div class="flex items-center justify-between text-xs text-gray-500">
              <span>{{ formatDate(note.updatedAt) }}</span>
              <div class="flex gap-1">
                <el-tag v-for="tag in note.tags.slice(0, 2)" :key="tag" size="small">
                  {{ tag }}
                </el-tag>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredNotes.length === 0" class="col-span-full text-center py-12">
            <el-icon :size="48" class="text-gray-300 mb-2"><Document /></el-icon>
            <p class="text-gray-400 mb-4">No notes found</p>
            <el-button type="primary" @click="createNewNote">Create First Note</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Note Editor Dialog -->
    <el-dialog
      v-model="showEditor"
      :title="currentNote.id ? 'Edit Note' : 'New Note'"
      width="90%"
      :style="{ maxWidth: '800px' }"
      :fullscreen="isMobile"
    >
      <el-form label-position="top">
        <el-form-item label="Title">
          <el-input v-model="currentNote.title" placeholder="Note title" size="large" clearable />
        </el-form-item>
        <el-form-item label="Content">
          <el-input
            v-model="currentNote.content"
            type="textarea"
            :rows="10"
            placeholder="Write your note here..."
          />
        </el-form-item>
        <el-form-item label="Tags">
          <el-select
            v-model="currentNote.tags"
            multiple
            filterable
            allow-create
            placeholder="Add tags"
            class="w-full"
          >
            <el-option
              v-for="tag in allTags"
              :key="tag"
              :label="tag"
              :value="tag"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Color">
          <div class="flex gap-2">
            <div
              v-for="color in noteColors"
              :key="color.value"
              class="w-8 h-8 rounded-full cursor-pointer border-2 hover:scale-110 transition-transform"
              :class="currentNote.color === color.value ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'"
              :style="{ backgroundColor: color.hex }"
              @click="currentNote.color = color.value"
            ></div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="flex gap-2">
          <el-button @click="showEditor = false" class="flex-1">Cancel</el-button>
          <el-button v-if="currentNote.id" type="danger" @click="deleteNote" class="flex-1">
            Delete
          </el-button>
          <el-button type="primary" @click="saveNote" class="flex-1">
            Save
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useNotesStore } from '@/stores/useNotesStore'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document, Star, Files, FolderOpened } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

const notesStore = useNotesStore()

const searchQuery = ref('')
const showEditor = ref(false)
const fileInput = ref(null)
const currentFolder = ref('all')

const currentNote = ref({
  id: null,
  title: '',
  content: '',
  tags: [],
  color: 'white'
})

const folders = [
  { id: 'all', name: 'All Notes', icon: Files },
  { id: 'starred', name: 'Starred', icon: Star },
  { id: 'recent', name: 'Recent', icon: FolderOpened }
]

const isMobile = computed(() => window.innerWidth < 768)

const noteColors = [
  { value: 'white', hex: '#ffffff' },
  { value: 'red', hex: '#fecaca' },
  { value: 'orange', hex: '#fed7aa' },
  { value: 'yellow', hex: '#fef08a' },
  { value: 'green', hex: '#bbf7d0' },
  { value: 'blue', hex: '#bfdbfe' },
  { value: 'purple', hex: '#e9d5ff' },
  { value: 'pink', hex: '#fbcfe8' }
]

const filteredNotes = computed(() => {
  let notes = notesStore.notes

  // Filter by folder
  if (currentFolder.value === 'starred') {
    notes = notes.filter(n => n.starred)
  } else if (currentFolder.value === 'recent') {
    notes = notes.slice(0, 20)
  }

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    notes = notes.filter(note =>
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query) ||
      note.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  return notes
})

const allTags = computed(() => {
  const tags = new Set()
  notesStore.notes.forEach(note => {
    note.tags.forEach(tag => tags.add(tag))
  })
  return Array.from(tags)
})

function getCount(folderId) {
  if (folderId === 'all') return notesStore.notes.length
  if (folderId === 'starred') return notesStore.notes.filter(n => n.starred).length
  if (folderId === 'recent') return Math.min(notesStore.notes.length, 20)
  return 0
}

function getNoteColor(color) {
  const colorMap = {
    white: '#e5e7eb',
    red: '#fecaca',
    orange: '#fed7aa',
    yellow: '#fef08a',
    green: '#bbf7d0',
    blue: '#bfdbfe',
    purple: '#e9d5ff',
    pink: '#fbcfe8'
  }
  return colorMap[color] || colorMap.white
}

function formatDate(timestamp) {
  return dayjs(timestamp).format('MMM D, YYYY')
}

function createNewNote() {
  currentNote.value = {
    id: null,
    title: '',
    content: '',
    tags: [],
    color: 'white'
  }
  showEditor.value = true
}

function editNote(note) {
  currentNote.value = {
    id: note.id,
    title: note.title,
    content: note.content,
    tags: [...note.tags],
    color: note.color
  }
  showEditor.value = true
}

function saveNote() {
  if (!currentNote.value.title) {
    ElMessage.warning('Please enter a title')
    return
  }

  if (currentNote.value.id) {
    notesStore.updateNote(currentNote.value.id, {
      title: currentNote.value.title,
      content: currentNote.value.content,
      tags: currentNote.value.tags,
      color: currentNote.value.color
    })
    ElMessage.success('Note updated')
  } else {
    notesStore.createNote({
      title: currentNote.value.title,
      content: currentNote.value.content,
      tags: currentNote.value.tags,
      color: currentNote.value.color
    })
    ElMessage.success('Note created')
  }

  showEditor.value = false
}

function deleteNoteDirect(id) {
  ElMessageBox.confirm('Delete this note?', 'Warning', {
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(() => {
    notesStore.deleteNote(id)
    ElMessage.success('Note deleted')
  })
}

function deleteNote() {
  ElMessageBox.confirm('Delete this note?', 'Warning', {
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(() => {
    notesStore.deleteNote(currentNote.value.id)
    ElMessage.success('Note deleted')
    showEditor.value = false
  })
}

function toggleStar(id) {
  notesStore.toggleStar(id)
}

function exportNotes() {
  const csv = [
    ['Title', 'Content', 'Tags', 'Color', 'Starred', 'Created', 'Updated'].join(','),
    ...notesStore.notes.map(n => [
      `"${n.title}"`,
      `"${n.content}"`,
      `"${n.tags.join(', ')}"`,
      n.color,
      n.starred,
      dayjs(n.createdAt).format('YYYY-MM-DD'),
      dayjs(n.updatedAt).format('YYYY-MM-DD')
    ].join(','))
  ].join('\n')
  
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `notes-${Date.now()}.csv`
  a.click()
  ElMessage.success('Notes exported to CSV')
}

function triggerImport() {
  fileInput.value.click()
}

function handleImport(event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      if (data.notes) {
        data.notes.forEach(note => {
          notesStore.createNote(note)
        })
        ElMessage.success('Notes imported')
      }
    } catch (error) {
      ElMessage.error('Invalid file format')
    }
  }
  reader.readAsText(file)
  event.target.value = ''
}

function clearAllNotes() {
  ElMessageBox.confirm(
    'This will delete all notes. This action cannot be undone!',
    'Clear All Notes',
    {
      confirmButtonText: 'Delete All',
      cancelButtonText: 'Cancel',
      type: 'error'
    }
  ).then(() => {
    notesStore.clearAll()
    ElMessage.success('All notes cleared')
  })
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.hidden {
  display: none;
}
.space-y-1 > * + * {
  margin-top: 0.25rem;
}
</style>
