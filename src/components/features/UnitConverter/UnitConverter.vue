<template>
  <div class="unit-converter p-4 md:p-6">
    <!-- Header -->
    <div class="glass-effect p-4 md:p-6 rounded-2xl mb-4 md:mb-6">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl md:text-3xl font-display font-bold mb-2">Unit Converter</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">Convert between different units</p>
        </div>
        <div class="flex gap-2">
          <el-button icon="Download" @click="exportHistory">Export</el-button>
          <el-button icon="Upload" @click="triggerImport">Import</el-button>
          <input ref="fileInput" type="file" accept=".json" @change="handleImport" class="hidden" />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      <!-- Main Converter -->
      <div class="lg:col-span-2">
        <div class="glass-effect p-4 md:p-6 rounded-2xl">
          <!-- Category Tabs -->
          <el-tabs v-model="activeCategory" @tab-change="onCategoryChange" class="mb-4">
            <el-tab-pane
              v-for="category in categories"
              :key="category.value"
              :label="category.label"
              :name="category.value"
            />
          </el-tabs>

          <!-- Converter Inputs -->
          <div class="space-y-4">
            <!-- From -->
            <div>
              <label class="block text-sm font-medium mb-2">From</label>
              <div class="flex gap-2">
                <el-input
                  v-model="fromValue"
                  type="number"
                  size="large"
                  placeholder="Enter value"
                  class="flex-1"
                  clearable
                  @input="convert"
                />
                <el-select v-model="fromUnit" size="large" class="w-32 md:w-40" @change="convert">
                  <el-option
                    v-for="unit in currentUnits"
                    :key="unit.value"
                    :label="unit.label"
                    :value="unit.value"
                  />
                </el-select>
              </div>
            </div>

            <!-- Swap Button -->
            <div class="flex justify-center">
              <el-button icon="Sort" circle @click="swapUnits" />
            </div>

            <!-- To -->
            <div>
              <label class="block text-sm font-medium mb-2">To</label>
              <div class="flex gap-2">
                <el-input
                  v-model="toValue"
                  size="large"
                  readonly
                  placeholder="Result"
                  class="flex-1"
                />
                <el-select v-model="toUnit" size="large" class="w-32 md:w-40" @change="convert">
                  <el-option
                    v-for="unit in currentUnits"
                    :key="unit.value"
                    :label="unit.label"
                    :value="unit.value"
                  />
                </el-select>
              </div>
            </div>

            <!-- Quick Reference -->
            <div class="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <h4 class="font-semibold mb-3 text-sm md:text-base">Quick Reference</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs md:text-sm">
                <div v-for="quick in quickConversions" :key="quick" class="text-gray-600 dark:text-gray-400">
                  {{ quick }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- History -->
      <div class="glass-effect p-4 md:p-6 rounded-2xl">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg md:text-xl font-display font-bold">History</h3>
          <el-button icon="Delete" size="small" @click="clearHistory">
            Clear
          </el-button>
        </div>

        <div class="space-y-2 max-h-[500px] overflow-y-auto scrollbar-thin">
          <div
            v-for="entry in converterStore.history.slice(0, 20)"
            :key="entry.timestamp"
            class="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
            @click="useHistoryEntry(entry)"
          >
            <div class="text-sm font-mono">
              {{ entry.fromValue }} {{ getUnitLabel(entry.category, entry.fromUnit) }}
            </div>
            <div class="text-base md:text-lg font-bold font-mono">
              = {{ entry.toValue }} {{ getUnitLabel(entry.category, entry.toUnit) }}
            </div>
            <div class="text-xs text-gray-400 mt-1">
              {{ formatTime(entry.timestamp) }}
            </div>
          </div>

          <div v-if="converterStore.history.length === 0" class="text-center py-8 text-gray-400">
            <p class="text-sm">No conversion history yet</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useUnitConverterStore } from '@/stores/useUnitConverterStore'
import { ElMessage } from 'element-plus'

const converterStore = useUnitConverterStore()

const activeCategory = ref('distance')
const fromValue = ref('')
const toValue = ref('')
const fromUnit = ref('meter')
const toUnit = ref('kilometer')
const fileInput = ref(null)

const categories = [
  { label: 'Distance', value: 'distance' },
  { label: 'Weight', value: 'weight' },
  { label: 'Temperature', value: 'temperature' },
  { label: 'Volume', value: 'volume' },
  { label: 'Time', value: 'time' },
  { label: 'Speed', value: 'speed' }
]

const units = {
  distance: [
    { label: 'Meters', value: 'meter', ratio: 1 },
    { label: 'Kilometers', value: 'kilometer', ratio: 0.001 },
    { label: 'Miles', value: 'mile', ratio: 0.000621371 },
    { label: 'Feet', value: 'foot', ratio: 3.28084 },
    { label: 'Inches', value: 'inch', ratio: 39.3701 }
  ],
  weight: [
    { label: 'Grams', value: 'gram', ratio: 1 },
    { label: 'Kilograms', value: 'kilogram', ratio: 0.001 },
    { label: 'Pounds', value: 'pound', ratio: 0.00220462 },
    { label: 'Ounces', value: 'ounce', ratio: 0.035274 }
  ],
  temperature: [
    { label: 'Celsius', value: 'celsius' },
    { label: 'Fahrenheit', value: 'fahrenheit' },
    { label: 'Kelvin', value: 'kelvin' }
  ],
  volume: [
    { label: 'Liters', value: 'liter', ratio: 1 },
    { label: 'Milliliters', value: 'milliliter', ratio: 1000 },
    { label: 'Gallons', value: 'gallon', ratio: 0.264172 },
    { label: 'Cups', value: 'cup', ratio: 4.22675 }
  ],
  time: [
    { label: 'Seconds', value: 'second', ratio: 1 },
    { label: 'Minutes', value: 'minute', ratio: 1/60 },
    { label: 'Hours', value: 'hour', ratio: 1/3600 },
    { label: 'Days', value: 'day', ratio: 1/86400 }
  ],
  speed: [
    { label: 'KM/H', value: 'kmh', ratio: 1 },
    { label: 'MPH', value: 'mph', ratio: 0.621371 },
    { label: 'M/S', value: 'ms', ratio: 0.277778 }
  ]
}

const currentUnits = computed(() => units[activeCategory.value] || [])

const quickConversions = computed(() => {
  const conversions = {
    distance: ['1 km = 0.621 mi', '1 mi = 1.609 km', '1 m = 3.281 ft', '1 ft = 0.305 m'],
    weight: ['1 kg = 2.205 lb', '1 lb = 453.6 g', '1 oz = 28.35 g', '1 kg = 1000 g'],
    temperature: ['0°C = 32°F', '100°C = 212°F', '0°C = 273.15 K', '-40°C = -40°F'],
    volume: ['1 L = 0.264 gal', '1 gal = 3.785 L', '1 L = 4.227 cups', '1 cup = 236.6 mL'],
    time: ['1 min = 60 sec', '1 hr = 60 min', '1 day = 24 hrs', '1 hr = 3600 sec'],
    speed: ['1 m/s = 3.6 km/h', '1 mph = 1.609 km/h', '100 km/h = 27.8 m/s']
  }
  return conversions[activeCategory.value] || []
})

// Watch category change to update units
watch(activeCategory, () => {
  onCategoryChange()
})

function onCategoryChange() {
  const firstUnit = currentUnits.value[0]
  const secondUnit = currentUnits.value[1] || currentUnits.value[0]
  
  fromUnit.value = firstUnit.value
  toUnit.value = secondUnit.value
  
  if (fromValue.value) {
    convert()
  }
}

function convert() {
  if (!fromValue.value) {
    toValue.value = ''
    return
  }

  const value = parseFloat(fromValue.value)

  if (activeCategory.value === 'temperature') {
    toValue.value = convertTemperature(value, fromUnit.value, toUnit.value).toFixed(2)
  } else {
    const fromUnitData = currentUnits.value.find(u => u.value === fromUnit.value)
    const toUnitData = currentUnits.value.find(u => u.value === toUnit.value)

    if (fromUnitData && toUnitData) {
      const baseValue = value / fromUnitData.ratio
      toValue.value = (baseValue * toUnitData.ratio).toFixed(6)
    }
  }

  converterStore.addToHistory({
    category: activeCategory.value,
    fromValue: value,
    fromUnit: fromUnit.value,
    toValue: toValue.value,
    toUnit: toUnit.value
  })
}

function convertTemperature(value, from, to) {
  let celsius = value

  if (from === 'fahrenheit') {
    celsius = (value - 32) * 5 / 9
  } else if (from === 'kelvin') {
    celsius = value - 273.15
  }

  if (to === 'fahrenheit') {
    return celsius * 9 / 5 + 32
  } else if (to === 'kelvin') {
    return celsius + 273.15
  }

  return celsius
}

function swapUnits() {
  const temp = fromUnit.value
  fromUnit.value = toUnit.value
  toUnit.value = temp

  const tempValue = fromValue.value
  fromValue.value = toValue.value
  
  convert()
}

function useHistoryEntry(entry) {
  activeCategory.value = entry.category
  setTimeout(() => {
    fromValue.value = entry.fromValue.toString()
    fromUnit.value = entry.fromUnit
    toUnit.value = entry.toUnit
    convert()
  }, 100)
}

function getUnitLabel(category, unitValue) {
  const categoryUnits = units[category]
  const unit = categoryUnits?.find(u => u.value === unitValue)
  return unit?.label || unitValue
}

function formatTime(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleTimeString()
}

function clearHistory() {
  converterStore.clearHistory()
  ElMessage.success('History cleared')
}

function exportHistory() {
  const data = {
    history: converterStore.history,
    exportedAt: Date.now()
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `unit-converter-${Date.now()}.json`
  a.click()
  ElMessage.success('History exported')
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
      if (data.history) {
        data.history.forEach(entry => {
          converterStore.addToHistory(entry)
        })
        ElMessage.success('History imported')
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
.space-y-4 > * + * {
  margin-top: 1rem;
}

.space-y-2 > * + * {
  margin-top: 0.5rem;
}

.hidden {
  display: none;
}
</style>
