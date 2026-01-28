import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { evaluate } from 'mathjs'

export const useCalculatorStore = defineStore('calculator', () => {
  // State
  const currentInput = ref('0')
  const previousInput = ref('')
  const operation = ref(null)
  const history = ref(JSON.parse(localStorage.getItem('calculatorHistory') || '[]'))
  const memory = ref([])
  const mode = ref('basic') // basic, scientific, programmer, currency
  const angle = ref('deg') // deg, rad, grad
  
  // Computed
  const displayValue = computed(() => {
    if (currentInput.value.length > 15) {
      return parseFloat(currentInput.value).toExponential(10)
    }
    return currentInput.value
  })
  
  // Actions
  function appendNumber(number) {
    if (currentInput.value === '0' || currentInput.value === 'Error') {
      currentInput.value = number.toString()
    } else {
      currentInput.value += number.toString()
    }
  }
  
  function appendDecimal() {
    if (!currentInput.value.includes('.')) {
      currentInput.value += '.'
    }
  }
  
  function appendOperator(op) {
    if (previousInput.value && operation.value) {
      calculate()
    }
    operation.value = op
    previousInput.value = currentInput.value
    currentInput.value = '0'
  }
  
  function calculate() {
    if (!operation.value || !previousInput.value) return
    
    try {
      let result
      const prev = parseFloat(previousInput.value)
      const current = parseFloat(currentInput.value)
      
      switch (operation.value) {
        case '+':
          result = prev + current
          break
        case '-':
          result = prev - current
          break
        case '*':
          result = prev * current
          break
        case '/':
          if (current === 0) {
            throw new Error('Division by zero')
          }
          result = prev / current
          break
        case '%':
          result = prev % current
          break
        case '^':
          result = Math.pow(prev, current)
          break
        default:
          return
      }
      
      addToHistory(`${previousInput.value} ${operation.value} ${currentInput.value}`, result)
      currentInput.value = result.toString()
      operation.value = null
      previousInput.value = ''
    } catch (error) {
      currentInput.value = 'Error'
      console.error('Calculation error:', error)
    }
  }
  
  function evaluateExpression(expr) {
    try {
      const result = evaluate(expr)
      addToHistory(expr, result)
      currentInput.value = result.toString()
      return result
    } catch (error) {
      currentInput.value = 'Error'
      console.error('Expression error:', error)
      return null
    }
  }
  
  function clear() {
    currentInput.value = '0'
    previousInput.value = ''
    operation.value = null
  }
  
  function clearEntry() {
    currentInput.value = '0'
  }
  
  function backspace() {
    if (currentInput.value.length > 1) {
      currentInput.value = currentInput.value.slice(0, -1)
    } else {
      currentInput.value = '0'
    }
  }
  
  function negate() {
    if (currentInput.value !== '0') {
      currentInput.value = (parseFloat(currentInput.value) * -1).toString()
    }
  }
  
  function percentage() {
    currentInput.value = (parseFloat(currentInput.value) / 100).toString()
  }
  
  function sqrt() {
    const value = parseFloat(currentInput.value)
    if (value < 0) {
      currentInput.value = 'Error'
      return
    }
    const result = Math.sqrt(value)
    addToHistory(`√(${currentInput.value})`, result)
    currentInput.value = result.toString()
  }
  
  function square() {
    const value = parseFloat(currentInput.value)
    const result = value * value
    addToHistory(`(${currentInput.value})²`, result)
    currentInput.value = result.toString()
  }
  
  function inverse() {
    const value = parseFloat(currentInput.value)
    if (value === 0) {
      currentInput.value = 'Error'
      return
    }
    const result = 1 / value
    addToHistory(`1/(${currentInput.value})`, result)
    currentInput.value = result.toString()
  }
  
  function scientificFunction(func) {
    const value = parseFloat(currentInput.value)
    let result
    
    try {
      switch (func) {
        case 'sin':
          result = angle.value === 'deg' ? Math.sin(value * Math.PI / 180) : Math.sin(value)
          break
        case 'cos':
          result = angle.value === 'deg' ? Math.cos(value * Math.PI / 180) : Math.cos(value)
          break
        case 'tan':
          result = angle.value === 'deg' ? Math.tan(value * Math.PI / 180) : Math.tan(value)
          break
        case 'ln':
          if (value <= 0) throw new Error('Invalid input for ln')
          result = Math.log(value)
          break
        case 'log':
          if (value <= 0) throw new Error('Invalid input for log')
          result = Math.log10(value)
          break
        case 'exp':
          result = Math.exp(value)
          break
        case 'pi':
          result = Math.PI
          break
        case 'e':
          result = Math.E
          break
        default:
          return
      }
      
      addToHistory(`${func}(${currentInput.value})`, result)
      currentInput.value = result.toString()
    } catch (error) {
      currentInput.value = 'Error'
      console.error('Scientific function error:', error)
    }
  }
  
  function memoryAdd() {
    const value = parseFloat(currentInput.value)
    memory.value.push(value)
  }
  
  function memorySubtract() {
    const value = parseFloat(currentInput.value)
    memory.value.push(-value)
  }
  
  function memoryRecall() {
    if (memory.value.length > 0) {
      const sum = memory.value.reduce((a, b) => a + b, 0)
      currentInput.value = sum.toString()
    }
  }
  
  function memoryClear() {
    memory.value = []
  }
  
  function addToHistory(expression, result) {
    const entry = {
      expression,
      result,
      timestamp: Date.now()
    }
    
    history.value.unshift(entry)
    
    // Keep only last 100 entries
    if (history.value.length > 100) {
      history.value = history.value.slice(0, 100)
    }
    
    saveHistory()
  }
  
  function clearHistory() {
    history.value = []
    saveHistory()
  }
  
  function saveHistory() {
    localStorage.setItem('calculatorHistory', JSON.stringify(history.value))
  }
  
  function setMode(newMode) {
    mode.value = newMode
  }
  
  function toggleAngle() {
    angle.value = angle.value === 'deg' ? 'rad' : 'deg'
  }
  
  return {
    currentInput,
    previousInput,
    operation,
    history,
    memory,
    mode,
    angle,
    displayValue,
    appendNumber,
    appendDecimal,
    appendOperator,
    calculate,
    evaluateExpression,
    clear,
    clearEntry,
    backspace,
    negate,
    percentage,
    sqrt,
    square,
    inverse,
    scientificFunction,
    memoryAdd,
    memorySubtract,
    memoryRecall,
    memoryClear,
    clearHistory,
    setMode,
    toggleAngle
  }
})
