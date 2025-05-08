<script setup>
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.js'
import 'swiper/css'
import 'swiper/css/navigation'
import ChatPopup from '@/components/chat/ChatPopup.vue';

import FullScreenLoading from '@/components/common/FullScreenLoading.vue'
import Navbar from '@/components/common/Navbar.vue'

import { useLoadingStore } from '@/stores/loadingStore'
const loadingStore = useLoadingStore()
</script>

<template>
  <!-- 導覽列會出現在每個頁面上方 -->
  <Navbar />

  <!-- 主要內容區，避免被 fixed-top 導覽列遮擋 -->
  <div class="main-content">
    <RouterView />
  </div>

  <!-- 全站聊天室彈窗 -->
  <ChatPopup />
  <div>TEST</div>

  <!-- 全站 Loading 畫面 -->
  <FullScreenLoading :show="loadingStore.isLoading" />
</template>

<style scoped>
.main-content {
  padding-top: 80px; /* 根據 Navbar 實際高度調整 */
}
</style>
