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
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const loadingStore = useLoadingStore()

const showLoginModal = ref(false)
function openLoginModal() {
  showLoginModal.value = true;
}
function closeLoginModal() {
  showLoginModal.value = false;
}

const userStore = useUserStore();
onMounted(() => {
  userStore.initFromLocalStorage();
});

</script>

<template>
  <!-- 導覽列會出現在每個頁面上方 -->
  <Navbar @open-login="openLoginModal" />

  <!-- 主要內容區，避免被 fixed-top 導覽列遮擋 -->
  <div class="main-content">
    <RouterView />
  </div>

  <!-- 全站聊天室彈窗 -->
  <ChatPopup />

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
  padding-top: 80px; /* 根據 Navbar 實際高度調整 */
}
</style>
