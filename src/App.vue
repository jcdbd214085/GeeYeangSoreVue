<script setup>
import { RouterLink, RouterView } from 'vue-router'
import ChatPopup from '@/components/chat/ChatPopup.vue';
import FullScreenLoading from '@/components/common/FullScreenLoading.vue'
import { useLoadingStore } from '@/stores/loadingStore'
const loadingStore = useLoadingStore()
</script>

<template>
  <router-view />
  <ChatPopup />
  <FullScreenLoading :show="loadingStore.isLoading" />
</template>

<style scoped></style>
