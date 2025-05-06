import { createRouter, createWebHistory } from 'vue-router'
import { useLoadingStore } from '@/stores/loadingStore'
import AlertDemo from '@/views/alert/AlertDemo.vue'
import InputDemo from '@/views/input/InputDemo.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('@/views/chat/ChatView.vue')
    },
    {
      path: '/alert-demo',
      name: 'AlertDemo',
      component: AlertDemo
    },
    {
      path: '/input-demo',
      name: 'InputDemo',
      component: InputDemo
    },
    {
      path: '/landlord',
      name: 'Landlord',
      component: () => import('@/views/landlord/landlord.vue')
    }
  ],
})

router.beforeEach((to, from, next) => {
  const loadingStore = useLoadingStore()
  loadingStore.show()
  next()
})

router.afterEach(() => {
  const loadingStore = useLoadingStore()
  setTimeout(() => {
    loadingStore.hide()
  }, 300)
})

export default router
