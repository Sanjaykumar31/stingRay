<template>
  <div class="models-dashboard">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-3xl font-display font-bold">Form Models</h2>
      <el-button type="primary" icon="Plus" @click="$router.push('/form-designer')">
        Create New Form
      </el-button>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="model in formModelsStore.models"
        :key="model.id"
        class="glass-effect p-6 rounded-2xl hover:shadow-xl transition-all"
      >
        <h3 class="text-xl font-bold mb-2">{{ model.name }}</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">{{ model.description }}</p>
        <div class="flex gap-2">
          <!-- <el-button size="small" @click="$router.push(\`/form-models/\${model.id}/data\`)">View Data</el-button>   -->
          <el-button size="small" type="danger" @click="deleteModel(model.id)">Delete</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFormModelsStore } from '@/stores/useFormModelsStore'
import { ElMessage } from 'element-plus'

const formModelsStore = useFormModelsStore()

function deleteModel(id) {
  formModelsStore.deleteModel(id)
  ElMessage.success('Form deleted')
}
</script>
