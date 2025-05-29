import { createRouter, createWebHistory } from "vue-router";
import { useLoadingStore } from "@/stores/loadingStore";
import AlertDemo from "@/views/alert/AlertDemo.vue";
import InputDemo from "@/views/input/InputDemo.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/HomeView.vue"),
    },
    //聊天室
    {
      path: "/chat",
      name: "chat",
      component: () => import("@/views/chat/ChatView.vue"),
    },
    {
      path: "/alert-demo",
      name: "AlertDemo",
      component: AlertDemo,
    },
    {
      path: "/input-demo",
      name: "InputDemo",
      component: InputDemo,
    },
    //收藏頁面
    {
      path: "/user/favorite",
      component: () => import("@/views/UserHome/UserFavorite.vue"),
    },

    //房屋搜尋
    {
      path: "/PropertySearch",
      name: "property-search-view",
      component: () => import("@/views/PropertySearch/PropertySearchView.vue"),
    },

    //個人資料
    {
      path: "/UserHome/UserProfile",
      name: "UserProfile",
      component: () => import("@/views/UserHome/UserProfile.vue"),
    },
    //物件管理
    {
      path: "/landlord/property-manage",
      name: "landlord-property-manage",
      component: () => import("@/views/landlord/PropertyManage.vue"),
    },
    //刊登物件
    {
      path: "/landlord/property-create",
      name: "landlord-property-create",
      component: () => import("@/views/landlord/PropertyCreate.vue"),
    },
    //物件詳細資訊
    {
      path: "/landlord/property-detail-form",
      name: "landlord-property-detail-form",
      component: () => import("@/views/landlord/PropertyDetailForm.vue"),
    },
    //廣告方案頁面
    {
      path: "/landlord/property-plan-select",
      name: "landlord-property-plan-select",
      component: () => import("@/views/landlord/PropertyPlanSelect.vue"),
    },
    //房東編輯
    {
      path: "/landlord/property-edit/:id",
      name: "landlord-property-edit",
      component: () => import("@/views/landlord/PropertyEdit.vue"),
    },
    //成為房東
    {
      path: "/landlord/become",
      name: "BecomeLandlordModal",
      component: () => import("@/views/landlord/BecomeLandlordModal.vue"),
    },
    //房屋詳細資訊
    {
      path: "/property/:id",
      name: "PropertyDetail",
      component: () => import("@/views/PropertySearch/PropertyDetailView.vue"),
    },
    //公告
    {
      path: "/notice",
      name: "notice",
      component: () => import("@/views/notice/Notice.vue"),
    },
    {
      path: "/guide",
      name: "guide",
      component: () => import("@/views/guide/Guide.vue"),
    },
    {
      path: "/faq",
      name: "faq",
      component: () => import("@/views/faq/Faq.vue"),
    },
    {
      path: "/about",
      name: "about",
      component: () => import("@/views/about/About.vue"),
    },
    {
      path: "/contact",
      name: "contact",
      component: () => import("@/views/contact/Contact.vue"),
    },
    {
      path: "/guide",
      name: "guide",
      component: () => import("@/views/guide/Guide.vue"),
    },
    // 廣告管理（刊登管理合併）
    {
      path: "/landlord/ad-manage",
      name: "landlord-ad-manage",
      component: () => import("@/views/landlord/AdManage.vue"),
    },
    // 廣告購買專區
    {
      path: "/landlord/ad-purchase",
      name: "landlord-ad-purchase",
      component: () => import("@/views/landlord/AdPurchase.vue"),
    },
    // 金流 API 測試開始
    {
      path: '/landlord/payment-result/:orderId',
      name: 'PaymentResult',
      component: () => import('@/views/landlord/PaymentResultView.vue'),
    },
    {
      path: '/frontend/ad-confirm/:orderId',
      name: 'AdConfirm',
      component: () => import('@/views/landlord/PaymentResultView.vue'),
    }
    // 金流 API 測試結束
  ],
});

router.beforeEach((to, from, next) => {
  const loadingStore = useLoadingStore();
  loadingStore.show();
  next();
});

router.afterEach(() => {
  const loadingStore = useLoadingStore();
  setTimeout(() => {
    loadingStore.hide();
  }, 300);
});

export default router;
