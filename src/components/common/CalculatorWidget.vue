<template>
  <div class="glass-effect p-6 rounded-2xl shadow-2xl w-80 animate__animated animate__fadeInRight">
    <div class="mb-4 flex items-center justify-between">
      <h3 class="font-display font-bold text-lg">Quick Calculator</h3>
      <router-link to="/calculator">
        <el-button type="primary" size="small" icon="FullScreen">
          Full
        </el-button>
      </router-link>
    </div>
    
    <!-- Display -->
    <div class="calculator-display mb-4 flex items-center justify-end">
      {{ displayValue }}
    </div>
    
    <!-- Buttons -->
    <div class="grid grid-cols-4 gap-2">
      <!-- Row 1 -->
      <button
        @click="calc.clear()"
        class="calculator-button bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
      >
        C
      </button>
      <button
        @click="calc.negate()"
        class="calculator-button bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
      >
        ±
      </button>
      <button
        @click="calc.percentage()"
        class="calculator-button bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
      >
        %
      </button>
      <button
        @click="calc.appendOperator('/')"
        class="calculator-button bg-primary-600 hover:bg-primary-700 text-white"
      >
        ÷
      </button>
      
      <!-- Row 2 -->
      <button
        @click="calc.appendNumber(7)"
        class="calculator-button bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
      >
        7
      </button>
      <button
        @click="calc.appendNumber(8)"
        class="calculator-button bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
      >
        8
      </button>
      <button
        @click="calc.appendNumber(9)"
        class="calculator-button bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
      >
        9
      </button>
      <button
        @click="calc.appendOperator('*')"
        class="calculator-button bg-primary-600 hover:bg-primary-700 text-white"
      >
        ×
      </button>
      
      <!-- Row 3 -->
      <button
        @click="calc.appendNumber(4)"
        class="calculator-button bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
      >
        4
      </button>
      <button
        @click="calc.appendNumber(5)"
        class="calculator-button bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
      >
        5
      </button>
      <button
        @click="calc.appendNumber(6)"
        class="calculator-button bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
      >
        6
      </button>
      <button
        @click="calc.appendOperator('-')"
        class="calculator-button bg-primary-600 hover:bg-primary-700 text-white"
      >
        −
      </button>
      
      <!-- Row 4 -->
      <button
        @click="calc.appendNumber(1)"
        class="calculator-button bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
      >
        1
      </button>
      <button
        @click="calc.appendNumber(2)"
        class="calculator-button bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
      >
        2
      </button>
      <button
        @click="calc.appendNumber(3)"
        class="calculator-button bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
      >
        3
      </button>
      <button
        @click="calc.appendOperator('+')"
        class="calculator-button bg-primary-600 hover:bg-primary-700 text-white"
      >
        +
      </button>
      
      <!-- Row 5 -->
      <button
        @click="calc.appendNumber(0)"
        class="calculator-button col-span-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
      >
        0
      </button>
      <button
        @click="calc.appendDecimal()"
        class="calculator-button bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
      >
        .
      </button>
      <button
        @click="calc.calculate()"
        class="calculator-button bg-accent-600 hover:bg-accent-700 text-white"
      >
        =
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCalculatorStore } from '@/stores/useCalculatorStore'

const calc = useCalculatorStore()

const displayValue = computed(() => calc.displayValue)
</script>
