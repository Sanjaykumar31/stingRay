<template>
  <div class="todo-dashboard p-4 md:p-6">
    <!-- Header -->
    <div class="glass-effect p-4 md:p-6 rounded-2xl mb-4 md:mb-6">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl md:text-3xl font-display font-bold">To-Do List</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ incompleteTasks }} pending, {{ completedTasks }} completed
          </p>
        </div>
        <div class="flex gap-2">
          <el-button type="primary" icon="Plus" @click="showAddDialog = true" size="large">
            New Task
          </el-button>
          <el-button icon="Download" @click="exportTasks" size="large">Export CSV</el-button>
          <el-button icon="Upload" @click="triggerImport" size="large">Import</el-button>
          <el-button icon="Delete" type="danger" @click="clearAllTasks" size="large">Clear All</el-button>
          <input ref="fileInput" type="file" accept=".json" @change="handleImport" class="hidden" />
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-4">
        <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <div class="text-xs md:text-sm text-blue-600 dark:text-blue-400">All Tasks</div>
          <div class="text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-300">
            {{ todoStore.tasks.length }}
          </div>
        </div>
        <div class="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
          <div class="text-xs md:text-sm text-yellow-600 dark:text-yellow-400">Pending</div>
          <div class="text-xl md:text-2xl font-bold text-yellow-700 dark:text-yellow-300">
            {{ incompleteTasks }}
          </div>
        </div>
        <div class="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
          <div class="text-xs md:text-sm text-green-600 dark:text-green-400">Completed</div>
          <div class="text-xl md:text-2xl font-bold text-green-700 dark:text-green-300">
            {{ completedTasks }}
          </div>
        </div>
        <div class="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
          <div class="text-xs md:text-sm text-red-600 dark:text-red-400">High Priority</div>
          <div class="text-xl md:text-2xl font-bold text-red-700 dark:text-red-300">
            {{ highPriorityTasks }}
          </div>
        </div>
      </div>
    </div>

    <!-- Filter -->
    <div class="glass-effect p-3 md:p-4 rounded-xl mb-4 flex gap-2 overflow-x-auto">
      <el-button
        v-for="filter in filters"
        :key="filter.value"
        :type="currentFilter === filter.value ? 'primary' : 'default'"
        size="small"
        @click="currentFilter = filter.value"
      >
        {{ filter.label }}
      </el-button>
    </div>

    <!-- Tasks Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
      <div
        v-for="task in filteredTasks"
        :key="task.id"
        class="glass-effect p-4 rounded-xl hover:shadow-lg transition-all group"
        :class="task.completed ? 'opacity-60' : ''"
      >
        <div class="flex items-start gap-3">
          <el-checkbox
            :model-value="task.completed"
            @change="toggleComplete(task.id)"
            size="large"
            class="mt-1"
          />
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2 mb-2">
              <h3
                class="text-base md:text-lg font-semibold flex-1 cursor-pointer"
                :class="task.completed ? 'line-through text-gray-400' : ''"
                @click="editTask(task)"
              >
                {{ task.title }}
              </h3>
              <div class="flex gap-1 flex-shrink-0">
                <el-button
                  icon="Edit"
                  circle
                  size="small"
                  @click="editTask(task)"
                />
                <el-button
                  icon="Delete"
                  circle
                  size="small"
                  type="danger"
                  class="opacity-0 group-hover:opacity-100 transition-opacity"
                  @click.stop="deleteTaskDirect(task.id)"
                />
              </div>
            </div>
            
            <p v-if="task.description" class="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
              {{ task.description }}
            </p>

            <div class="flex flex-wrap items-center gap-2 text-xs">
              <el-tag
                :type="getPriorityType(task.priority)"
                size="small"
              >
                {{ task.priority }}
              </el-tag>
              
              <el-tag v-if="task.dueDate" size="small" :type="isOverdue(task.dueDate) ? 'danger' : 'info'">
                {{ formatDueDate(task.dueDate) }}
              </el-tag>

              <el-tag
                v-for="tag in task.tags"
                :key="tag"
                size="small"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredTasks.length === 0" class="col-span-full text-center py-12">
        <el-icon :size="48" class="text-gray-300 mb-2"><Document /></el-icon>
        <p class="text-gray-400 mb-4">No tasks found</p>
        <el-button type="primary" @click="showAddDialog = true">Create First Task</el-button>
      </div>
    </div>

    <!-- Add/Edit Task Dialog -->
    <el-dialog
      v-model="showAddDialog"
      :title="editingTask ? 'Edit Task' : 'New Task'"
      width="90%"
      :style="{ maxWidth: '500px' }"
    >
      <el-form label-position="top">
        <el-form-item label="Task Title">
          <el-input v-model="taskForm.title" placeholder="What needs to be done?" size="large" />
        </el-form-item>

        <el-form-item label="Description">
          <el-input
            v-model="taskForm.description"
            type="textarea"
            :rows="3"
            placeholder="Optional description"
          />
        </el-form-item>

        <el-form-item label="Priority">
          <el-radio-group v-model="taskForm.priority" class="w-full">
            <el-radio-button label="low" class="flex-1">Low</el-radio-button>
            <el-radio-button label="medium" class="flex-1">Medium</el-radio-button>
            <el-radio-button label="high" class="flex-1">High</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Due Date">
          <el-date-picker
            v-model="taskForm.dueDate"
            type="date"
            placeholder="Select due date"
            class="w-full"
          />
        </el-form-item>

        <el-form-item label="Tags">
          <el-select
            v-model="taskForm.tags"
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
      </el-form>
      <template #footer>
        <div class="flex gap-2">
          <el-button @click="showAddDialog = false" class="flex-1">Cancel</el-button>
          <el-button v-if="editingTask" type="danger" @click="deleteTask" class="flex-1">
            Delete
          </el-button>
          <el-button type="primary" @click="saveTask" class="flex-1">
            {{ editingTask ? 'Update' : 'Add' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTodoStore } from '@/stores/useTodoStore'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

const todoStore = useTodoStore()

const showAddDialog = ref(false)
const editingTask = ref(null)
const currentFilter = ref('all')
const fileInput = ref(null)

const taskForm = ref({
  title: '',
  description: '',
  priority: 'medium',
  dueDate: null,
  tags: []
})

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
  { label: 'High Priority', value: 'high' },
  { label: 'Overdue', value: 'overdue' }
]

const filteredTasks = computed(() => {
  let tasks = todoStore.tasks

  switch (currentFilter.value) {
    case 'pending':
      tasks = tasks.filter(t => !t.completed)
      break
    case 'completed':
      tasks = tasks.filter(t => t.completed)
      break
    case 'high':
      tasks = tasks.filter(t => t.priority === 'high' && !t.completed)
      break
    case 'overdue':
      tasks = tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date())
      break
  }

  return tasks
})

const incompleteTasks = computed(() => {
  return todoStore.tasks.filter(t => !t.completed).length
})

const completedTasks = computed(() => {
  return todoStore.tasks.filter(t => t.completed).length
})

const highPriorityTasks = computed(() => {
  return todoStore.tasks.filter(t => t.priority === 'high' && !t.completed).length
})

const allTags = computed(() => {
  const tags = new Set()
  todoStore.tasks.forEach(task => {
    task.tags.forEach(tag => tags.add(tag))
  })
  return Array.from(tags)
})

function getPriorityType(priority) {
  const types = {
    low: 'info',
    medium: 'warning',
    high: 'danger'
  }
  return types[priority] || 'info'
}

function isOverdue(dueDate) {
  return new Date(dueDate) < new Date()
}

function formatDueDate(dueDate) {
  const date = dayjs(dueDate)
  const today = dayjs()
  
  if (date.isSame(today, 'day')) return 'Today'
  if (date.isSame(today.add(1, 'day'), 'day')) return 'Tomorrow'
  if (date.isBefore(today)) return 'Overdue'
  
  return date.format('MMM D')
}

function toggleComplete(id) {
  todoStore.toggleComplete(id)
}

function editTask(task) {
  editingTask.value = task
  taskForm.value = {
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate ? new Date(task.dueDate) : null,
    tags: [...task.tags]
  }
  showAddDialog.value = true
}

function saveTask() {
  if (!taskForm.value.title) {
    ElMessage.warning('Please enter a task title')
    return
  }

  if (editingTask.value) {
    todoStore.updateTask(editingTask.value.id, {
      title: taskForm.value.title,
      description: taskForm.value.description,
      priority: taskForm.value.priority,
      dueDate: taskForm.value.dueDate ? taskForm.value.dueDate.getTime() : null,
      tags: taskForm.value.tags
    })
    ElMessage.success('Task updated')
  } else {
    todoStore.createTask({
      title: taskForm.value.title,
      description: taskForm.value.description,
      priority: taskForm.value.priority,
      dueDate: taskForm.value.dueDate ? taskForm.value.dueDate.getTime() : null,
      tags: taskForm.value.tags
    })
    ElMessage.success('Task created')
  }

  closeDialog()
}

function deleteTask() {
  ElMessageBox.confirm('Delete this task?', 'Warning', {
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(() => {
    todoStore.deleteTask(editingTask.value.id)
    ElMessage.success('Task deleted')
    closeDialog()
  })
}

function closeDialog() {
  showAddDialog.value = false
  editingTask.value = null
  taskForm.value = {
    title: '',
    description: '',
    priority: 'medium',
    dueDate: null,
    tags: []
  }
}

function exportTasks() {
  const csv = [
    ['Title', 'Description', 'Priority', 'Due Date', 'Completed', 'Tags', 'Created'].join(','),
    ...todoStore.tasks.map(t => [
      `"${t.title}"`,
      `"${t.description}"`,
      t.priority,
      t.dueDate ? dayjs(t.dueDate).format('YYYY-MM-DD') : '',
      t.completed,
      `"${t.tags.join(', ')}"`,
      dayjs(t.createdAt).format('YYYY-MM-DD')
    ].join(','))
  ].join('\n')
  
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `tasks-${Date.now()}.csv`
  a.click()
  ElMessage.success('Tasks exported to CSV')
}

function deleteTaskDirect(id) {
  ElMessageBox.confirm('Delete this task?', 'Warning', {
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(() => {
    todoStore.deleteTask(id)
    ElMessage.success('Task deleted')
  })
}

function clearAllTasks() {
  ElMessageBox.confirm(
    'This will delete all tasks. This action cannot be undone!',
    'Clear All Tasks',
    {
      confirmButtonText: 'Delete All',
      cancelButtonText: 'Cancel',
      type: 'error'
    }
  ).then(() => {
    todoStore.clearAll()
    ElMessage.success('All tasks cleared')
  })
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
      if (data.tasks) {
        data.tasks.forEach(task => {
          todoStore.createTask(task)
        })
        ElMessage.success('Tasks imported')
      }
    } catch (error) {
      ElMessage.error('Invalid file format')
    }
  }
  reader.readAsText(file)
  event.target.value = ''
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.hidden {
  display: none;
}
</style>
