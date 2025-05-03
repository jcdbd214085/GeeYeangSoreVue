import { createRouter, createWebHistory } from 'vue-router'
import { useLoadingStore } from '@/stores/loadingStore'

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
    //註冊畫面 測試用
    {
      path: '/login',
      name: 'login',
      component: () => import('@/components/login/LoginModal.vue')
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
