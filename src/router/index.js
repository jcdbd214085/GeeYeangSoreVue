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
    //收藏頁面
    {
      path: '/user/favorite',
      component: () => import('@/views/UserHome/UserFavorite.vue') 
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

    //個人頁面
    {
      path: '/UserHome/UserProfile',
      name: 'UserProfile',
      component: () => import('@/views/UserHome/UserProfile.vue')
    },
    {
      path: '/landlord/property-manage',
      name: 'landlord-property-manage',
      component: () => import('@/views/landlord/PropertyManage.vue')
    },
    {
      path: '/landlord/property-create',
      name: 'landlord-property-create',
      component: () => import('@/views/landlord/PropertyCreate.vue')
    },
    //
    {
      path: '/landlord/property-detail-form',
      name: 'landlord-property-detail-form',
      component: () => import('@/views/landlord/PropertyDetailForm.vue')
    },
    {
      path: '/landlord/property-plan-select',
      name: 'landlord-property-plan-select',
      component: () => import('@/views/landlord/PropertyPlanSelect.vue')
    },

    {
      path: '/landlord/property-stats',
      name: 'landlord-property-stats',
      component: () => import('@/views/landlord/PropertyStats.vue')
    },
    //房東編輯
    {
      path: '/landlord/property-edit',
      name: 'landlord-property-edit',
      component: () => import('@/views/landlord/PropertyEdit.vue')
    },
    //成為房東
    {
      path: '/landlord/become',
      name: 'BecomeLandlordModal',
      component: () => import('@/views/landlord/BecomeLandlordModal.vue')
    },
    //房屋詳細資訊
    {
      path: '/property/:id',
      name: 'PropertyDetail',
      component: () => import('@/views/PropertySearch/PropertyDetailView.vue')
    },
    //公告
    {

      path: '/notice',
      name: 'notice',
      component: () => import('@/views/notice/Notice.vue')
    },
    {
      path: '/guide',
      name: 'guide',
      component: () => import('@/views/guide/Guide.vue')
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('@/views/faq/Faq.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/about/About.vue')
    },




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
