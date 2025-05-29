<script setup>
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.js'
import 'swiper/css'
import 'swiper/css/navigation'
import { RouterLink, RouterView } from 'vue-router'
import ChatPopup from '@/components/chat/ChatPopup.vue';

import FullScreenLoading from '@/components/common/FullScreenLoading.vue'
import Navbar from '@/components/common/Navbar.vue'
import Footer from '@/components/common/Footer.vue';
import BackToTop from '@/components/common/BackToTop.vue'
import LoginModal from '@/components/login/LoginModal.vue'

import { useLoadingStore } from '@/stores/loadingStore'
import { ref, onMounted, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { useFavoriteStore } from '@/stores/favoriteStore'
import QARobot from "@/components/QARobot/QARobot.vue";

const loadingStore = useLoadingStore()
const showLoginModal = ref(false)
const showChatPopup = ref(false)
const isUserReady = ref(false); // 新增登入狀態同步指標，使彈窗聊天室能同步
function openLoginModal() {
  showLoginModal.value = true;
}
function closeLoginModal() {
  showLoginModal.value = false;
}
const favoriteStore = useFavoriteStore()

function openChatPopup() {
  if (!isUserReady.value) return; //  防呆，尚未初始化完成不開啟
  showChatPopup.value = true;
}
function closeChatPopup() {
  showChatPopup.value = false;
}

const userStore = useUserStore();
onMounted(async () => {

  // ✅ 載入 Google reCAPTCHA v3 script（防止重複）
  if (!window.grecaptcha) {
    const recaptchaScript = document.createElement('script')
    recaptchaScript.src = 'https://www.google.com/recaptcha/api.js?render=6Ldt9T4rAAAAAG-4q6vmfn9XZIcRhjhczfEUNGyw'
    recaptchaScript.async = true
    recaptchaScript.defer = true
    document.head.appendChild(recaptchaScript)
  }

  // ✅ 初始化使用者狀態
  userStore.initFromLocalStorage();

  // 嘗試從後端抓目前登入者（驗證 Session）
  try {
    const res = await fetch('/api/auth/me', {
      credentials: 'include' // 必加，才能帶 cookie 給後端
    });
    if (res.ok) {
      const data = await res.json();
      userStore.login(data.role, data.userName, data.isLandlord);
      await favoriteStore.fetchFavorites(); 
    } else {
      userStore.logout(); // Session 無效 → 登出前端狀態
      favoriteStore.clearFavorites();
    }
  } catch (err) {
    console.error('Session 驗證失敗', err);
    userStore.logout();
    favoriteStore.clearFavorites();
  } finally {
    isUserReady.value = true; //無論成功或失敗都表示初始化完成
  }
});

watch(
  () => userStore.isLogin,
  (newVal) => {
    if (!newVal) closeChatPopup();
  }
);// 監聽登入狀態變化，登出後關閉彈窗聊天室

</script>

<template>
  <!-- 導覽列會出現在每個頁面上方 -->
  <Navbar @open-login="openLoginModal" @open-chat="openChatPopup" />

  <!-- 主要內容區，避免被 fixed-top 導覽列遮擋 -->
  <div class="main-content">
    <RouterView @open-login="openLoginModal" />
  </div>

  <!-- 全站聊天室彈窗 -->
  <ChatPopup
    v-if="showChatPopup && isUserReady"
    @close="closeChatPopup"
  />
  
<!-- 全站 Loading 畫面 -->
  <FullScreenLoading :show="loadingStore.isLoading" />
  <Footer />
  <BackToTop />
  <Teleport to="body">
    <LoginModal v-if="showLoginModal" @close="closeLoginModal" />
  </Teleport>
</template>

<style scoped>
.main-content {
  padding-top: 80px;
  /* 根據 Navbar 實際高度調整 */
}
</style>

<style>

/* 調整 reCAPTCHA v3 徽章樣式 */
.grecaptcha-badge {
  left: 0 !important;
  right: auto !important;
  bottom: 0 !important;
  z-index: 1000 !important;
  position: fixed !important;

  transform: scale(0.5); /* ✅ 調整大小 */
  transform-origin: bottom left; /* ✅ 縮放以左下角為基準 */
  opacity: 0.2; /* 降低透明度 */
}

.grecaptcha-badge:hover {
  transform: scale(1);
  opacity: 1;
}




</style>
