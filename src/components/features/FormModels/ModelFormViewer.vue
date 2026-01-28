<template>
  <div>
    <el-page-header @back="$router.back()" title="Back" content="Form Data" class="mb-6" />
    <div class="glass-effect p-8 rounded-2xl">
      <h2 class="text-2xl font-display font-bold mb-6">Form Submissions</h2>
      <el-table :data="submissions" stripe>
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="createdAt" label="Date" :formatter="formatDate" />
        <el-table-column label="Actions" width="150">
          <template #default="{ row }">
            <el-button size="small" @click="viewSubmission(row)">View</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useFormDataStore } from '@/stores/useFormDataStore'

const route = useRoute()
const formDataStore = useFormDataStore()
const submissions = ref([])

onMounted(() => {
  submissions.value = formDataStore.getFormData(route.params.id)
})

function formatDate(row) {
  return new Date(row.createdAt).toLocaleDateString()
}

function viewSubmission(row) {
  console.log('View submission:', row)
}
</script>
