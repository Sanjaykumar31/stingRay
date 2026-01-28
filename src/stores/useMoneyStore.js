import { defineStore } from 'pinia'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

export const useMoneyStore = defineStore('money', () => {
  const transactions = ref(JSON.parse(localStorage.getItem('transactions') || '[]'))
  const budgets = ref(JSON.parse(localStorage.getItem('budgets') || '[]'))
  const categories = ref(JSON.parse(localStorage.getItem('moneyCategories') || JSON.stringify([
    { id: 'food', name: 'Food & Dining', type: 'expense', color: '#f97316' },
    { id: 'transport', name: 'Transportation', type: 'expense', color: '#3b82f6' },
    { id: 'shopping', name: 'Shopping', type: 'expense', color: '#ec4899' },
    { id: 'bills', name: 'Bills & Utilities', type: 'expense', color: '#ef4444' },
    { id: 'entertainment', name: 'Entertainment', type: 'expense', color: '#8b5cf6' },
    { id: 'health', name: 'Healthcare', type: 'expense', color: '#10b981' },
    { id: 'salary', name: 'Salary', type: 'income', color: '#22c55e' },
    { id: 'freelance', name: 'Freelance', type: 'income', color: '#14b8a6' },
    { id: 'investment', name: 'Investment Returns', type: 'income', color: '#06b6d4' }
  ])))
  
  function addTransaction(data) {
    const transaction = {
      id: uuidv4(),
      type: data.type,
      amount: parseFloat(data.amount),
      category: data.category,
      description: data.description || '',
      date: data.date || Date.now(),
      createdAt: Date.now()
    }
    transactions.value.unshift(transaction)
    saveTransactions()
    return transaction
  }
  
  function updateTransaction(id, updates) {
    const index = transactions.value.findIndex(t => t.id === id)
    if (index !== -1) {
      transactions.value[index] = { ...transactions.value[index], ...updates }
      saveTransactions()
      return transactions.value[index]
    }
    return null
  }
  
  function deleteTransaction(id) {
    const index = transactions.value.findIndex(t => t.id === id)
    if (index !== -1) {
      transactions.value.splice(index, 1)
      saveTransactions()
      return true
    }
    return false
  }
  
  function getBalance() {
    return transactions.value.reduce((sum, t) => {
      return sum + (t.type === 'income' ? t.amount : -t.amount)
    }, 0)
  }
  
  function getMonthlyExpenses() {
    const now = new Date()
    const thisMonth = transactions.value.filter(t => {
      const date = new Date(t.date)
      return t.type === 'expense' && 
             date.getMonth() === now.getMonth() && 
             date.getFullYear() === now.getFullYear()
    })
    return thisMonth.reduce((sum, t) => sum + t.amount, 0)
  }

  function getMonthlyIncome() {
    const now = new Date()
    const thisMonth = transactions.value.filter(t => {
      const date = new Date(t.date)
      return t.type === 'income' && 
             date.getMonth() === now.getMonth() && 
             date.getFullYear() === now.getFullYear()
    })
    return thisMonth.reduce((sum, t) => sum + t.amount, 0)
  }

  function getCategoryTotal(categoryId) {
    return transactions.value
      .filter(t => t.category === categoryId)
      .reduce((sum, t) => sum + t.amount, 0)
  }

  // Category Management
  function addCategory(data) {
    const category = {
      id: uuidv4(),
      name: data.name,
      type: data.type,
      color: data.color
    }
    categories.value.push(category)
    saveCategories()
    return category
  }

  function updateCategory(id, updates) {
    const index = categories.value.findIndex(c => c.id === id)
    if (index !== -1) {
      categories.value[index] = { ...categories.value[index], ...updates }
      saveCategories()
      return categories.value[index]
    }
    return null
  }

  function deleteCategory(id) {
    const index = categories.value.findIndex(c => c.id === id)
    if (index !== -1) {
      categories.value.splice(index, 1)
      saveCategories()
      return true
    }
    return false
  }

  function getExpenseCategories() {
    return categories.value.filter(c => c.type === 'expense')
  }

  function getIncomeCategories() {
    return categories.value.filter(c => c.type === 'income')
  }
  
  function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions.value))
  }

  function saveCategories() {
    localStorage.setItem('moneyCategories', JSON.stringify(categories.value))
  }

  function exportData() {
    return {
      transactions: transactions.value,
      categories: categories.value,
      budgets: budgets.value,
      exportedAt: Date.now()
    }
  }

  function importData(data) {
    if (data.transactions) transactions.value = data.transactions
    if (data.categories) categories.value = data.categories
    if (data.budgets) budgets.value = data.budgets
    saveTransactions()
    saveCategories()
  }

  function clearAll() {
    transactions.value = []
    categories.value = [
      { id: 'food', name: 'Food & Dining', type: 'expense', color: '#f97316' },
      { id: 'transport', name: 'Transportation', type: 'expense', color: '#3b82f6' },
      { id: 'shopping', name: 'Shopping', type: 'expense', color: '#ec4899' },
      { id: 'bills', name: 'Bills & Utilities', type: 'expense', color: '#ef4444' },
      { id: 'entertainment', name: 'Entertainment', type: 'expense', color: '#8b5cf6' },
      { id: 'health', name: 'Healthcare', type: 'expense', color: '#10b981' },
      { id: 'salary', name: 'Salary', type: 'income', color: '#22c55e' },
      { id: 'freelance', name: 'Freelance', type: 'income', color: '#14b8a6' },
      { id: 'investment', name: 'Investment Returns', type: 'income', color: '#06b6d4' }
    ]
    budgets.value = []
    saveTransactions()
    saveCategories()
  }
  
  return {
    transactions,
    budgets,
    categories,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getBalance,
    getMonthlyExpenses,
    getMonthlyIncome,
    getCategoryTotal,
    addCategory,
    updateCategory,
    deleteCategory,
    getExpenseCategories,
    getIncomeCategories,
    exportData,
    importData,
    clearAll
  }
})
