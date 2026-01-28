<template>
  <div class="dashboard">
    <!-- Hero Section with Parallax -->
    <section class="relative overflow-hidden rounded-3xl mb-8">
      <div class="hero-parallax glass-effect p-12 min-h-[400px] flex items-center relative">
        <!-- Animated background -->
        <div class="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-accent-500/20 to-purple-500/20 animate-gradient"></div>
        
        <!-- Floating shapes -->
        <div class="absolute top-10 left-10 w-32 h-32 bg-primary-400/30 rounded-full blur-3xl animate-float"></div>
        <div class="absolute bottom-10 right-10 w-40 h-40 bg-accent-400/30 rounded-full blur-3xl animate-float" style="animation-delay: 2s"></div>
        <div class="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-400/30 rounded-full blur-2xl animate-float" style="animation-delay: 4s"></div>
        
        <div class="relative z-10 flex-1">
          <h1 class="text-5xl md:text-6xl font-display font-bold mb-4 animate__animated animate__fadeInDown">
            <span class="gradient-text">Multi-Tool Suite</span>
          </h1>
          <p class="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl animate__animated animate__fadeInUp">
            Your all-in-one productivity platform with powerful tools for every task
          </p>
          
          <!-- Statistics -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 animate__animated animate__fadeInUp animate__delay-1s">
            <!-- <div class="glass-effect p-4 rounded-xl">
              <div class="text-3xl font-bold text-primary-600 dark:text-primary-400">{{ formModels.length }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Form Models</div>
            </div> -->
            <div class="glass-effect p-4 rounded-xl">
              <div class="text-3xl font-bold text-accent-600 dark:text-accent-400">{{ notes.length }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Notes</div>
            </div>
            <div class="glass-effect p-4 rounded-xl">
              <div class="text-3xl font-bold text-green-600 dark:text-green-400">{{ incompleteTasks }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Active Tasks</div>
            </div>
            <div class="glass-effect p-4 rounded-xl">
              <div class="text-3xl font-bold text-orange-600 dark:text-orange-400">{{ calculatorHistory }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Calculations</div>
            </div>
          </div>
        </div>
        
        <!-- Calculator Widget -->
        <div class="hidden lg:block">
          <CalculatorWidget />
        </div>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="mb-8">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-3xl font-display font-bold text-gray-900 dark:text-white">
          All Features
        </h2>
        <el-input
          v-model="searchQuery"
          placeholder="Search features..."
          prefix-icon="Search"
          class="w-64"
          clearable
        />
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <FeatureCard
          v-for="(feature, index) in filteredFeatures"
          :key="feature.path"
          :feature="feature"
          :style="{ animationDelay: `${index * 0.1}s` }"
          class="animate__animated animate__fadeInUp"
        />
      </div>
    </section>

    <!-- Recent Features -->
    <section v-if="recentFeatures.length > 0" class="mb-8">
      <h2 class="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">
        Recently Used
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <router-link
          v-for="recent in recentFeatures.slice(0, 4)"
          :key="recent.path"
          :to="recent.path"
          class="glass-effect p-4 rounded-xl hover:shadow-xl transition-all duration-300 group"
        >
          <div class="flex items-center gap-3">
            <component :is="recent.icon" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <div class="flex-1">
              <div class="font-semibold group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {{ recent.name }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatTime(recent.timestamp) }}
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </section>

    <!-- Quick Tips -->
    <section class="glass-effect p-6 rounded-2xl">
      <h3 class="text-xl font-display font-bold text-gray-900 dark:text-white mb-4">
        💡 Quick Tips
      </h3>
      <ul class="space-y-2 text-gray-700 dark:text-gray-300">
        <li class="flex items-start gap-2">
          <span class="text-primary-600 dark:text-primary-400">→</span>
          <span>Use the Form Designer to create custom data collection forms</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="text-primary-600 dark:text-primary-400">→</span>
          <span>Convert between units quickly with the Unit Converter</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="text-primary-600 dark:text-primary-400">→</span>
          <span>Track your expenses and manage budgets with Money Manager</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="text-primary-600 dark:text-primary-400">→</span>
          <span>All your data is stored locally in your browser</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppSettingsStore } from '@/stores/useAppSettingsStore'
import { useFormModelsStore } from '@/stores/useFormModelsStore'
import { useNotesStore } from '@/stores/useNotesStore'
import { useTodoStore } from '@/stores/useTodoStore'
import { useCalculatorStore } from '@/stores/useCalculatorStore'
import FeatureCard from '@/components/common/FeatureCard.vue'
import CalculatorWidget from '@/components/common/CalculatorWidget.vue'
import {
  Odometer,
  MagicStick as Magic,
  Document,
  Coin,
  Memo,
  Money,
  List,
  DocumentCopy,
  View,
  TrendCharts
} from '@element-plus/icons-vue'

const router = useRouter()
const appSettings = useAppSettingsStore()
const formModelsStore = useFormModelsStore()
const notesStore = useNotesStore()
const todoStore = useTodoStore()
const calculatorStore = useCalculatorStore()

const searchQuery = ref('')

const formModels = computed(() => formModelsStore.models)
const notes = computed(() => notesStore.notes)
const incompleteTasks = computed(() => todoStore.tasks.filter(t => !t.completed).length)
const calculatorHistory = computed(() => calculatorStore.history.length)
const recentFeatures = computed(() => appSettings.recentFeatures)

const features = [
  {
    name: 'Calculator',
    path: '/calculator',
    icon: Odometer,
    description: 'Basic, Scientific, and Programmer calculators with history',
    color: 'from-blue-500 to-cyan-500',
    category: 'utilities'
  },
  {
    name: 'Form Designer',
    path: '/form-designer',
    icon: Magic,
    description: 'Create dynamic forms with drag-and-drop builder',
    color: 'from-purple-500 to-pink-500',
    category: 'productivity'
  },
  // {
  //   name: 'Form Models',
  //   path: '/form-models',
  //   icon: Document,
  //   description: 'Manage and view your form templates',
  //   color: 'from-indigo-500 to-purple-500',
  //   category: 'productivity'
  // },
  {
    name: 'Unit Converter',
    path: '/unit-converter',
    icon: Coin,
    description: 'Convert between different units of measurement',
    color: 'from-green-500 to-teal-500',
    category: 'utilities'
  },
  {
    name: 'Notes',
    path: '/notes',
    icon: Memo,
    description: 'Rich text note-taking with organization',
    color: 'from-yellow-500 to-orange-500',
    category: 'productivity'
  },
  {
    name: 'Money Manager',
    path: '/money-manager',
    icon: Money,
    description: 'Track expenses and manage your budget',
    color: 'from-emerald-500 to-green-500',
    category: 'finance'
  },
  {
    name: 'To-Do List',
    path: '/todo',
    icon: List,
    description: 'Organize tasks and boost productivity',
    color: 'from-red-500 to-pink-500',
    category: 'productivity'
  },
  {
    name: 'File Converter',
    path: '/file-converter',
    icon: DocumentCopy,
    description: 'Convert between different file formats',
    color: 'from-violet-500 to-purple-500',
    category: 'utilities'
  },
  {
    name: 'Document Viewer',
    path: '/document-viewer',
    icon: View,
    description: 'View PDFs, images, and office documents',
    color: 'from-sky-500 to-blue-500',
    category: 'utilities'
  }
]

const filteredFeatures = computed(() => {
  if (!searchQuery.value) return features
  
  const query = searchQuery.value.toLowerCase()
  return features.filter(f => 
    f.name.toLowerCase().includes(query) ||
    f.description.toLowerCase().includes(query) ||
    f.category.toLowerCase().includes(query)
  )
})

function formatTime(timestamp) {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}
</script>

<style scoped>
.hero-parallax {
  position: relative;
  transform-style: preserve-3d;
}

.animate-gradient {
  animation: gradient-shift 8s ease infinite;
  background-size: 200% 200%;
}

@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
</style>
