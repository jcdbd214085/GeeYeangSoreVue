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
    //聊天室
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
    },

    //註冊畫面 測試用
    {
      path: '/login',
      name: 'login',
      component: () => import('@/components/login/LoginModal.vue')
    },

    //側邊欄 測試用
    {
      path: '/sidemenu',
      name: 'sidemenu',
      component: () => import('@/components/SideMenu.vue')
    },

    //彈窗 測試用
    {
      path: '/inputmodel',
      name: 'inputmodel',
      component: () => import('@/components/InputModal.vue')
    },
    //個人頁面
    {
      path: '/userhome',
      name: 'userhome',
      component: () => import('@/views/UserHome/UserHome.vue')
    },

    //分頁元件 測試用
    {
      path: '/pagination',
      name: 'pagination',
      component: () => import('@/components/Pagination/Pagination.vue')
    },

    //房屋搜尋
    {
      path: '/PropertySearch',
      name: 'property-search-view',
      component: () => import('@/views/PropertySearch/PropertySearchView.vue')
    },
    //房屋詳細資訊
    {
      path: '/PropertyDetail',
      name: 'PropertyDetail',
      component: () => import('@/views/PropertySearch/PropertyDetailView.vue')
    },
    //個人頁面
    {
      path: '/UserHome/UserProfile',
      name: 'UserProfile',
      component: () => import('@/views/UserHome/UserProfile.vue')
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
