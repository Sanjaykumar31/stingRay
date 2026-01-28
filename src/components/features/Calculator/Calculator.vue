<template>
  <div class="calculator-page">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Calculator -->
      <div class="lg:col-span-2">
        <div class="glass-effect p-8 rounded-2xl shadow-xl">
          <!-- Mode Selector -->
          <div class="flex gap-2 mb-6">
            <el-button
              v-for="mode in modes"
              :key="mode.value"
              :type="calc.mode === mode.value ? 'primary' : 'default'"
              @click="calc.setMode(mode.value)"
            >
              {{ mode.label }}
            </el-button>
          </div>
          
          <!-- Display -->
          <div class="calculator-display mb-6 relative">
            <div class="text-sm text-gray-500 dark:text-gray-400 mb-2 h-6">
              {{ calc.previousInput }} {{ calc.operation }}
            </div>
            <div class="text-4xl font-mono">
              {{ calc.displayValue }}
            </div>
            
            <div class="absolute top-2 right-2">
              <el-button 
                icon="DocumentCopy" 
                circle 
                size="small"
                @click="copyToClipboard"
              />
            </div>
          </div>
          
          <!-- Basic Calculator -->
          <div v-if="calc.mode === 'basic'" class="grid grid-cols-4 gap-3">
            <template v-for="button in basicButtons" :key="button.label">
              <button
                :class="[
                  'calculator-button',
                  button.class,
                  button.span ? `col-span-${button.span}` : ''
                ]"
                @click="handleButtonClick(button)"
              >
                {{ button.label }}
              </button>
            </template>
          </div>
          
          <!-- Scientific Calculator -->
          <div v-if="calc.mode === 'scientific'" class="space-y-3">
            <!-- Angle Mode -->
            <div class="flex justify-between items-center mb-4">
              <el-radio-group v-model="calc.angle" size="small">
                <el-radio-button label="deg">Deg</el-radio-button>
                <el-radio-button label="rad">Rad</el-radio-button>
              </el-radio-group>
              
              <el-button size="small" @click="insertConstant('pi')">π</el-button>
              <el-button size="small" @click="insertConstant('e')">e</el-button>
            </div>
            
            <div class="grid grid-cols-5 gap-2">
              <template v-for="button in scientificButtons" :key="button.label">
                <button
                  :class="['calculator-button text-sm', button.class]"
                  @click="handleScientificButton(button)"
                >
                  {{ button.label }}
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
      
      <!-- History Panel -->
      <div class="glass-effect p-6 rounded-2xl shadow-xl">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-display font-bold">History</h3>
          <el-button 
            icon="Delete" 
            size="small" 
            @click="calc.clearHistory()"
            :disabled="calc.history.length === 0"
          >
            Clear
          </el-button>
        </div>
        
        <div class="space-y-2 max-h-[600px] overflow-y-auto scrollbar-thin">
          <div
            v-for="entry in calc.history.slice(0, 20)"
            :key="entry.timestamp"
            class="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
            @click="useHistoryEntry(entry)"
          >
            <div class="text-sm text-gray-600 dark:text-gray-400 font-mono">
              {{ entry.expression }}
            </div>
            <div class="text-lg font-bold text-gray-900 dark:text-white font-mono">
              = {{ entry.result }}
            </div>
            <div class="text-xs text-gray-400 mt-1">
              {{ formatTimestamp(entry.timestamp) }}
            </div>
          </div>
          
          <div v-if="calc.history.length === 0" class="text-center py-8 text-gray-400">
            <el-icon :size="48" class="mb-2">
              <Clock />
            </el-icon>
            <p>No calculation history yet</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCalculatorStore } from '@/stores/useCalculatorStore'
import { ElMessage } from 'element-plus'
import { Clock } from '@element-plus/icons-vue'

const calc = useCalculatorStore()

const modes = [
  { label: 'Basic', value: 'basic' },
  { label: 'Scientific', value: 'scientific' }
]

const basicButtons = [
  { label: 'C', action: 'clear', class: 'bg-red-500 hover:bg-red-600 text-white' },
  { label: '±', action: 'negate', class: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600' },
  { label: '%', action: 'percentage', class: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600' },
  { label: '÷', action: 'operator', value: '/', class: 'bg-primary-600 hover:bg-primary-700 text-white' },
  
  { label: '7', action: 'number', value: 7, class: 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700' },
  { label: '8', action: 'number', value: 8, class: 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700' },
  { label: '9', action: 'number', value: 9, class: 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700' },
  { label: '×', action: 'operator', value: '*', class: 'bg-primary-600 hover:bg-primary-700 text-white' },
  
  { label: '4', action: 'number', value: 4, class: 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700' },
  { label: '5', action: 'number', value: 5, class: 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700' },
  { label: '6', action: 'number', value: 6, class: 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700' },
  { label: '−', action: 'operator', value: '-', class: 'bg-primary-600 hover:bg-primary-700 text-white' },
  
  { label: '1', action: 'number', value: 1, class: 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700' },
  { label: '2', action: 'number', value: 2, class: 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700' },
  { label: '3', action: 'number', value: 3, class: 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700' },
  { label: '+', action: 'operator', value: '+', class: 'bg-primary-600 hover:bg-primary-700 text-white' },
  
  { label: '0', action: 'number', value: 0, span: 2, class: 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700' },
  { label: '.', action: 'decimal', class: 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700' },
  { label: '=', action: 'calculate', class: 'bg-accent-600 hover:bg-accent-700 text-white' }
]

const scientificButtons = [
  { label: 'sin', action: 'function', value: 'sin', class: 'bg-purple-600 hover:bg-purple-700 text-white' },
  { label: 'cos', action: 'function', value: 'cos', class: 'bg-purple-600 hover:bg-purple-700 text-white' },
  { label: 'tan', action: 'function', value: 'tan', class: 'bg-purple-600 hover:bg-purple-700 text-white' },
  { label: 'ln', action: 'function', value: 'ln', class: 'bg-purple-600 hover:bg-purple-700 text-white' },
  { label: 'log', action: 'function', value: 'log', class: 'bg-purple-600 hover:bg-purple-700 text-white' },
  
  { label: 'x²', action: 'square', class: 'bg-indigo-600 hover:bg-indigo-700 text-white' },
  { label: '√x', action: 'sqrt', class: 'bg-indigo-600 hover:bg-indigo-700 text-white' },
  { label: 'xʸ', action: 'operator', value: '^', class: 'bg-indigo-600 hover:bg-indigo-700 text-white' },
  { label: '1/x', action: 'inverse', class: 'bg-indigo-600 hover:bg-indigo-700 text-white' },
  { label: 'exp', action: 'function', value: 'exp', class: 'bg-purple-600 hover:bg-purple-700 text-white' },
  
  { label: '7', action: 'number', value: 7, class: 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700' },
  { label: '8', action: 'number', value: 8, class: 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700' },
  { label: '9', action: 'number', value: 9, class: 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700' },
  { label: '÷', action: 'operator', value: '/', class: 'bg-primary-600 hover:bg-primary-700 text-white' },
  { label: 'C', action: 'clear', class: 'bg-red-500 hover:bg-red-600 text-white' },
  
  { label: '4', action: 'number', value: 4, class: 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700' },
  { label: '5', action: 'number', value: 5, class: 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700' },
  { label: '6', action: 'number', value: 6, class: 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700' },
  { label: '×', action: 'operator', value: '*', class: 'bg-primary-600 hover:bg-primary-700 text-white' },
  { label: '←', action: 'backspace', class: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600' },
  
  { label: '1', action: 'number', value: 1, class: 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700' },
  { label: '2', action: 'number', value: 2, class: 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700' },
  { label: '3', action: 'number', value: 3, class: 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700' },
  { label: '−', action: 'operator', value: '-', class: 'bg-primary-600 hover:bg-primary-700 text-white' },
  { label: '±', action: 'negate', class: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600' },
  
  { label: '0', action: 'number', value: 0, class: 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700' },
  { label: '.', action: 'decimal', class: 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700' },
  { label: '%', action: 'percentage', class: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600' },
  { label: '+', action: 'operator', value: '+', class: 'bg-primary-600 hover:bg-primary-700 text-white' },
  { label: '=', action: 'calculate', class: 'bg-accent-600 hover:bg-accent-700 text-white' }
]

function handleButtonClick(button) {
  switch (button.action) {
    case 'number':
      calc.appendNumber(button.value)
      break
    case 'operator':
      calc.appendOperator(button.value)
      break
    case 'decimal':
      calc.appendDecimal()
      break
    case 'calculate':
      calc.calculate()
      break
    case 'clear':
      calc.clear()
      break
    case 'negate':
      calc.negate()
      break
    case 'percentage':
      calc.percentage()
      break
    case 'backspace':
      calc.backspace()
      break
  }
}

function handleScientificButton(button) {
  switch (button.action) {
    case 'function':
      calc.scientificFunction(button.value)
      break
    case 'sqrt':
      calc.sqrt()
      break
    case 'square':
      calc.square()
      break
    case 'inverse':
      calc.inverse()
      break
    default:
      handleButtonClick(button)
  }
}

function insertConstant(constant) {
  if (constant === 'pi') {
    calc.currentInput = Math.PI.toString()
  } else if (constant === 'e') {
    calc.currentInput = Math.E.toString()
  }
}

function copyToClipboard() {
  navigator.clipboard.writeText(calc.displayValue)
  ElMessage.success('Copied to clipboard!')
}

function useHistoryEntry(entry) {
  calc.currentInput = entry.result.toString()
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleTimeString()
}
</script>

<style scoped>
.calculator-button {
  @apply h-14 rounded-xl font-semibold transition-all duration-200 active:scale-95 shadow-md;
}
</style>
