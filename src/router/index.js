import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/components/common/MainLayout.vue'),
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/Dashboard.vue'),
          meta: { title: 'Dashboard' }
        },
        {
          path: '/calculator',
          name: 'calculator',
          component: () => import('@/components/features/Calculator/Calculator.vue'),
          meta: { title: 'Calculator' }
        },
        {
          path: '/form-designer',
          name: 'formDesigner',
          component: () => import('@/components/features/DynamicFormDesigner/FormDesigner.vue'),
          meta: { title: 'Form Designer' }
        },
        {
          path: '/form-models',
          name: 'formModels',
          component: () => import('@/components/features/FormModels/ModelsDashboard.vue'),
          meta: { title: 'Form Models' }
        },
        {
          path: '/form-models/:id/data',
          name: 'formData',
          component: () => import('@/components/features/FormModels/ModelFormViewer.vue'),
          meta: { title: 'Form Data' }
        },
        {
          path: '/unit-converter',
          name: 'unitConverter',
          component: () => import('@/components/features/UnitConverter/UnitConverter.vue'),
          meta: { title: 'Unit Converter' }
        },
        {
          path: '/notes',
          name: 'notes',
          component: () => import('@/components/features/Notes/NotesDashboard.vue'),
          meta: { title: 'Notes' }
        },
        {
          path: '/money-manager',
          name: 'moneyManager',
          component: () => import('@/components/features/MoneyManager/MoneyDashboard.vue'),
          meta: { title: 'Money Manager' }
        },
        {
          path: '/todo',
          name: 'todo',
          component: () => import('@/components/features/TodoList/TodoDashboard.vue'),
          meta: { title: 'To-Do List' }
        },
        {
          path: '/file-converter',
          name: 'fileConverter',
          component: () => import('@/components/features/FileConverter/FileConverter.vue'),
          meta: { title: 'File Converter' }
        },
        {
          path: '/document-viewer',
          name: 'documentViewer',
          component: () => import('@/components/features/DocumentViewer/DocumentViewer.vue'),
          meta: { title: 'Document Viewer' }
        }
      ]
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

router.beforeEach((to, from, next) => {
  // Update document title
  document.title = to.meta.title 
    ? `${to.meta.title} - Tool` 
    : 'Project StingRay'
  
  next()
})

export default router
