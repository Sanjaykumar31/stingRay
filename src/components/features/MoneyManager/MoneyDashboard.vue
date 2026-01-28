<template>
  <div class="money-manager p-4 md:p-6">
    <!-- Header with Balance & Navigation -->
    <div class="glass-effect p-4 md:p-6 rounded-2xl mb-4 md:mb-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 class="text-2xl md:text-3xl font-display font-bold">Money Manager</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">Track your expenses in INR</p>
        </div>
        <div class="text-left md:text-right">
          <div class="text-xs md:text-sm text-gray-500 dark:text-gray-400">Current Balance</div>
          <div class="text-2xl md:text-4xl font-bold gradient-text">
            {{ formatCurrency(moneyStore.getBalance()) }}
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        <div class="bg-green-50 dark:bg-green-900/20 p-3 md:p-4 rounded-lg md:rounded-xl">
          <div class="text-xs md:text-sm text-green-600 dark:text-green-400 mb-1">Income</div>
          <div class="text-lg md:text-2xl font-bold text-green-700 dark:text-green-300">
            {{ formatCurrency(getTotalIncome()) }}
          </div>
        </div>
        <div class="bg-red-50 dark:bg-red-900/20 p-3 md:p-4 rounded-lg md:rounded-xl">
          <div class="text-xs md:text-sm text-red-600 dark:text-red-400 mb-1">Expenses</div>
          <div class="text-lg md:text-2xl font-bold text-red-700 dark:text-red-300">
            {{ formatCurrency(getTotalExpenses()) }}
          </div>
        </div>
        <div class="bg-blue-50 dark:bg-blue-900/20 p-3 md:p-4 rounded-lg md:rounded-xl">
          <div class="text-xs md:text-sm text-blue-600 dark:text-blue-400 mb-1">This Period</div>
          <div class="text-lg md:text-2xl font-bold text-blue-700 dark:text-blue-300">
            {{ formatCurrency(getPeriodTotal()) }}
          </div>
        </div>
        <div class="bg-purple-50 dark:bg-purple-900/20 p-3 md:p-4 rounded-lg md:rounded-xl">
          <div class="text-xs md:text-sm text-purple-600 dark:text-purple-400 mb-1">Count</div>
          <div class="text-lg md:text-2xl font-bold text-purple-700 dark:text-purple-300">
            {{ getPeriodTransactions().length }}
          </div>
        </div>
      </div>
    </div>

    <!-- Period Navigation & Actions -->
    <div class="glass-effect p-4 rounded-xl mb-4">
      <div class="flex flex-col md:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-2 w-full md:w-auto">
          <el-select v-model="viewMode" size="small" class="w-20">
            <el-option label="Week" value="week" />
            <el-option label="Month" value="month" />
            <el-option label="Year" value="year" />
          </el-select>
          <el-button size="small" icon="ArrowLeft" @click="previousPeriod" />
          <div class="text-sm md:text-base font-semibold flex-1 md:flex-none text-center min-w-[120px] md:min-w-[200px]">
            {{ currentPeriodLabel }}
          </div>
          <el-button size="small" icon="ArrowRight" @click="nextPeriod" />
          <el-button size="small" @click="goToToday">Today</el-button>
        </div>
        <div class="flex gap-2 w-full md:w-auto flex-wrap">
          <el-select v-model="sortOrder" size="small" class="w-24">
            <el-option label="Newest" value="desc" />
            <el-option label="Oldest" value="asc" />
          </el-select>
          <el-button type="primary" size="small" icon="Plus" @click="showAddDialog = true">
            Add
          </el-button>
          <el-button size="small" icon="Setting" @click="showCategoryDialog = true">
            Categories
          </el-button>
          <el-button size="small" icon="Download" @click="exportCSV">
            Export CSV
          </el-button>
          <el-button size="small" icon="Upload" @click="triggerImport">Import</el-button>
          <el-button size="small" icon="Delete" type="danger" @click="clearAllData">
            Clear All
          </el-button>
          <input ref="fileInput" type="file" accept=".json" @change="handleImport" class="hidden" />
        </div>
      </div>
    </div>

    <!-- Day-wise Transaction Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
      <div
        v-for="day in sortedDayWiseTransactions"
        :key="day.date"
        class="glass-effect rounded-xl overflow-hidden"
      >
        <!-- Day Header -->
        <div 
          class="p-3 text-white"
          :class="day.netAmount >= 0 ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'"
        >
          <div class="flex items-center justify-between">
            <div>
              <div class="text-xs opacity-90">{{ day.dayName }}</div>
              <div class="font-bold">{{ day.dateLabel }}</div>
            </div>
            <div class="text-right">
              <div class="text-xs opacity-90">Net</div>
              <div class="font-bold">{{ formatCurrency(Math.abs(day.netAmount)) }}</div>
            </div>
          </div>
        </div>

        <!-- Transactions List -->
        <div class="p-3 space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin">
          <div
            v-for="transaction in day.transactions"
            :key="transaction.id"
            class="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-start gap-2 flex-1 min-w-0 cursor-pointer" @click="editTransaction(transaction)">
                <div
                  class="w-2 h-2 rounded-full mt-1 flex-shrink-0"
                  :style="{ backgroundColor: getCategoryColor(transaction.category) }"
                ></div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs md:text-sm font-semibold truncate">
                    {{ getCategoryName(transaction.category) }}
                  </div>
                  <div class="text-xs text-gray-500 truncate">{{ transaction.description }}</div>
                </div>
              </div>
              <div class="flex items-center gap-1 flex-shrink-0">
                <div
                  class="text-xs md:text-sm font-bold"
                  :class="transaction.type === 'income' ? 'text-green-600' : 'text-red-600'"
                >
                  {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
                </div>
                <el-button
                  icon="Delete"
                  size="small"
                  type="danger"
                  circle
                  class="opacity-0 group-hover:opacity-100 transition-opacity"
                  @click.stop="deleteTransactionDirect(transaction.id)"
                />
              </div>
            </div>
          </div>

          <div v-if="day.transactions.length === 0" class="text-center py-4 text-xs text-gray-400">
            No transactions
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="sortedDayWiseTransactions.length === 0" class="col-span-full text-center py-12">
        <el-icon :size="48" class="text-gray-300 mb-2"><Document /></el-icon>
        <p class="text-gray-400">No transactions in this period</p>
        <el-button type="primary" class="mt-4" @click="showAddDialog = true">
          Add First Transaction
        </el-button>
      </div>
    </div>

    <!-- Add/Edit Transaction Dialog -->
    <el-dialog
      v-model="showAddDialog"
      :title="editingTransaction ? 'Edit Transaction' : 'Add Transaction'"
      width="90%"
      :style="{ maxWidth: '500px' }"
    >
      <el-form label-position="top">
        <el-form-item label="Type">
          <el-radio-group v-model="transactionForm.type" class="w-full">
            <el-radio-button label="income" class="flex-1">Income</el-radio-button>
            <el-radio-button label="expense" class="flex-1">Expense</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Amount (₹)">
          <el-input
            v-model="transactionForm.amount"
            type="number"
            placeholder="0.00"
            size="large"
            clearable
          >
            <template #prepend>₹</template>
          </el-input>
        </el-form-item>

        <el-form-item label="Category">
          <el-select v-model="transactionForm.category" class="w-full" placeholder="Select category" clearable>
            <el-option
              v-for="cat in filteredCategories"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id"
            >
              <span :style="{ color: cat.color }">● {{ cat.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Description">
          <el-input
            v-model="transactionForm.description"
            placeholder="Optional description"
            clearable
          />
        </el-form-item>

        <el-form-item label="Date">
          <el-date-picker
            v-model="transactionForm.date"
            type="date"
            placeholder="Select date"
            class="w-full"
            clearable
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="flex gap-2">
          <el-button @click="showAddDialog = false" class="flex-1">Cancel</el-button>
          <el-button v-if="editingTransaction" type="danger" @click="deleteCurrentTransaction" class="flex-1">
            Delete
          </el-button>
          <el-button type="primary" @click="saveTransaction" class="flex-1">
            {{ editingTransaction ? 'Update' : 'Add' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- Category Management Dialog -->
    <el-dialog
      v-model="showCategoryDialog"
      title="Manage Categories"
      width="90%"
      :style="{ maxWidth: '600px' }"
    >
      <div class="mb-4">
        <el-button type="primary" size="small" icon="Plus" @click="addNewCategory" class="w-full">
          Add New Category
        </el-button>
      </div>

      <div class="space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin">
        <div
          v-for="cat in moneyStore.categories"
          :key="cat.id"
          class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
        >
          <div class="flex items-center gap-2 flex-1 min-w-0">
            <div class="w-4 h-4 rounded-full flex-shrink-0" :style="{ backgroundColor: cat.color }"></div>
            <span class="font-medium truncate">{{ cat.name }}</span>
            <el-tag size="small" :type="cat.type === 'income' ? 'success' : 'danger'">
              {{ cat.type }}
            </el-tag>
          </div>
          <div class="flex gap-1 flex-shrink-0">
            <el-button size="small" icon="Edit" circle @click="editCategory(cat)" />
            <el-button size="small" icon="Delete" circle type="danger" @click="deleteCategory(cat.id)" />
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- Add/Edit Category Dialog -->
    <el-dialog
      v-model="showCategoryFormDialog"
      :title="editingCategory ? 'Edit Category' : 'Add Category'"
      width="90%"
      :style="{ maxWidth: '400px' }"
    >
      <el-form label-position="top">
        <el-form-item label="Category Name">
          <el-input v-model="categoryForm.name" placeholder="e.g., Groceries" clearable />
        </el-form-item>
        <el-form-item label="Type">
          <el-radio-group v-model="categoryForm.type" class="w-full">
            <el-radio-button label="income" class="flex-1">Income</el-radio-button>
            <el-radio-button label="expense" class="flex-1">Expense</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Color">
          <div class="grid grid-cols-6 gap-2">
            <div
              v-for="color in colorOptions"
              :key="color"
              class="w-8 h-8 rounded-full cursor-pointer border-2 hover:scale-110 transition-transform"
              :class="categoryForm.color === color ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'"
              :style="{ backgroundColor: color }"
              @click="categoryForm.color = color"
            ></div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="flex gap-2">
          <el-button @click="showCategoryFormDialog = false" class="flex-1">Cancel</el-button>
          <el-button type="primary" @click="saveCategory" class="flex-1">
            {{ editingCategory ? 'Update' : 'Add' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMoneyStore } from '@/stores/useMoneyStore'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'

dayjs.extend(isoWeek)

const moneyStore = useMoneyStore()

// State
const viewMode = ref('month')
const currentDate = ref(new Date())
const sortOrder = ref('desc')
const showAddDialog = ref(false)
const showCategoryDialog = ref(false)
const showCategoryFormDialog = ref(false)
const editingTransaction = ref(null)
const editingCategory = ref(null)
const fileInput = ref(null)

const transactionForm = ref({
  type: 'expense',
  amount: '',
  category: '',
  description: '',
  date: new Date()
})

const categoryForm = ref({
  name: '',
  type: 'expense',
  color: '#3b82f6'
})

const colorOptions = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
  '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#64748b'
]

// Computed
const currentPeriodLabel = computed(() => {
  const date = dayjs(currentDate.value)
  if (viewMode.value === 'week') {
    const start = date.startOf('isoWeek')
    const end = date.endOf('isoWeek')
    return `${start.format('MMM D')} - ${end.format('MMM D, YYYY')}`
  } else if (viewMode.value === 'year') {
    return date.format('YYYY')
  } else {
    return date.format('MMMM YYYY')
  }
})

const filteredCategories = computed(() => {
  return moneyStore.categories.filter(cat => cat.type === transactionForm.value.type)
})

const dayWiseTransactions = computed(() => {
  const transactions = getPeriodTransactions()
  const grouped = {}

  transactions.forEach(transaction => {
    const date = dayjs(transaction.date).format('YYYY-MM-DD')
    if (!grouped[date]) {
      grouped[date] = {
        date,
        dayName: dayjs(transaction.date).format('ddd'),
        dateLabel: dayjs(transaction.date).format('MMM D'),
        transactions: [],
        netAmount: 0
      }
    }
    grouped[date].transactions.push(transaction)
    grouped[date].netAmount += transaction.type === 'income' ? transaction.amount : -transaction.amount
  })

  return Object.values(grouped)
})

const sortedDayWiseTransactions = computed(() => {
  const sorted = [...dayWiseTransactions.value]
  return sorted.sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return sortOrder.value === 'asc' ? dateA - dateB : dateB - dateA
  })
})

// Methods
function getPeriodTransactions() {
  const date = dayjs(currentDate.value)
  let start, end

  if (viewMode.value === 'week') {
    start = date.startOf('isoWeek')
    end = date.endOf('isoWeek')
  } else if (viewMode.value === 'year') {
    start = date.startOf('year')
    end = date.endOf('year')
  } else {
    start = date.startOf('month')
    end = date.endOf('month')
  }

  return moneyStore.transactions.filter(t => {
    const tDate = dayjs(t.date)
    return tDate.isAfter(start.subtract(1, 'day')) && tDate.isBefore(end.add(1, 'day'))
  })
}

function getPeriodTotal() {
  return getPeriodTransactions()
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
}

function formatCurrency(amount) {
  return '₹' + parseFloat(amount || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

function getTotalIncome() {
  return getPeriodTransactions()
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
}

function getTotalExpenses() {
  return getPeriodTransactions()
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
}

function getCategoryName(categoryId) {
  const cat = moneyStore.categories.find(c => c.id === categoryId)
  return cat ? cat.name : 'Unknown'
}

function getCategoryColor(categoryId) {
  const cat = moneyStore.categories.find(c => c.id === categoryId)
  return cat ? cat.color : '#94a3b8'
}

function previousPeriod() {
  if (viewMode.value === 'week') {
    currentDate.value = dayjs(currentDate.value).subtract(1, 'week').toDate()
  } else if (viewMode.value === 'year') {
    currentDate.value = dayjs(currentDate.value).subtract(1, 'year').toDate()
  } else {
    currentDate.value = dayjs(currentDate.value).subtract(1, 'month').toDate()
  }
}

function nextPeriod() {
  if (viewMode.value === 'week') {
    currentDate.value = dayjs(currentDate.value).add(1, 'week').toDate()
  } else if (viewMode.value === 'year') {
    currentDate.value = dayjs(currentDate.value).add(1, 'year').toDate()
  } else {
    currentDate.value = dayjs(currentDate.value).add(1, 'month').toDate()
  }
}

function goToToday() {
  currentDate.value = new Date()
}

function editTransaction(transaction) {
  editingTransaction.value = transaction
  transactionForm.value = {
    type: transaction.type,
    amount: transaction.amount,
    category: transaction.category,
    description: transaction.description,
    date: new Date(transaction.date)
  }
  showAddDialog.value = true
}

function saveTransaction() {
  if (!transactionForm.value.amount || !transactionForm.value.category) {
    ElMessage.warning('Please fill in all required fields')
    return
  }

  if (editingTransaction.value) {
    moneyStore.updateTransaction(editingTransaction.value.id, {
      type: transactionForm.value.type,
      amount: parseFloat(transactionForm.value.amount),
      category: transactionForm.value.category,
      description: transactionForm.value.description,
      date: transactionForm.value.date.getTime()
    })
    ElMessage.success('Transaction updated')
  } else {
    moneyStore.addTransaction({
      type: transactionForm.value.type,
      amount: transactionForm.value.amount,
      category: transactionForm.value.category,
      description: transactionForm.value.description,
      date: transactionForm.value.date.getTime()
    })
    ElMessage.success('Transaction added')
  }

  closeAddDialog()
}

function deleteTransactionDirect(id) {
  ElMessageBox.confirm('Delete this transaction?', 'Warning', {
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(() => {
    moneyStore.deleteTransaction(id)
    ElMessage.success('Transaction deleted')
  })
}

function deleteCurrentTransaction() {
  ElMessageBox.confirm('Delete this transaction?', 'Warning', {
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(() => {
    moneyStore.deleteTransaction(editingTransaction.value.id)
    ElMessage.success('Transaction deleted')
    closeAddDialog()
  })
}

function closeAddDialog() {
  showAddDialog.value = false
  editingTransaction.value = null
  transactionForm.value = {
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date()
  }
}

function addNewCategory() {
  editingCategory.value = null
  categoryForm.value = {
    name: '',
    type: 'expense',
    color: '#3b82f6'
  }
  showCategoryFormDialog.value = true
}

function editCategory(category) {
  editingCategory.value = category
  categoryForm.value = {
    name: category.name,
    type: category.type,
    color: category.color
  }
  showCategoryFormDialog.value = true
}

function saveCategory() {
  if (!categoryForm.value.name) {
    ElMessage.warning('Please enter category name')
    return
  }

  if (editingCategory.value) {
    moneyStore.updateCategory(editingCategory.value.id, categoryForm.value)
    ElMessage.success('Category updated')
  } else {
    moneyStore.addCategory(categoryForm.value)
    ElMessage.success('Category added')
  }

  showCategoryFormDialog.value = false
  editingCategory.value = null
}

function deleteCategory(id) {
  const hasTransactions = moneyStore.transactions.some(t => t.category === id)
  
  if (hasTransactions) {
    ElMessage.error('Cannot delete category with existing transactions')
    return
  }

  ElMessageBox.confirm('Delete this category?', 'Warning', {
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(() => {
    moneyStore.deleteCategory(id)
    ElMessage.success('Category deleted')
  })
}

function exportCSV() {
  const csv = [
    ['Date', 'Type', 'Category', 'Amount', 'Description'].join(','),
    ...moneyStore.transactions.map(t => [
      dayjs(t.date).format('YYYY-MM-DD'),
      t.type,
      getCategoryName(t.category),
      t.amount,
      `"${t.description}"`
    ].join(','))
  ].join('\n')
  
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `money-manager-${Date.now()}.csv`
  a.click()
  ElMessage.success('Data exported to CSV')
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
      moneyStore.importData(data)
      ElMessage.success('Data imported successfully')
    } catch (error) {
      ElMessage.error('Invalid file format')
    }
  }
  reader.readAsText(file)
  event.target.value = ''
}

function clearAllData() {
  ElMessageBox.confirm(
    'This will delete all transactions and categories. This action cannot be undone!',
    'Clear All Data',
    {
      confirmButtonText: 'Delete Everything',
      cancelButtonText: 'Cancel',
      type: 'error'
    }
  ).then(() => {
    moneyStore.clearAll()
    ElMessage.success('All data cleared')
  })
}
</script>

<style scoped>
.space-y-2 > * + * {
  margin-top: 0.5rem;
}
.hidden {
  display: none;
}
</style>
