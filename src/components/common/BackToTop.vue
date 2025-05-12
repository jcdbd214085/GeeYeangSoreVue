<template>
  <transition name="fade">
    <button v-if="visible" class="back-to-top" @click="scrollToTop">
      <i class="fa-solid fa-chevron-up"></i>
    </button>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)

function handleScroll() {
  visible.value = window.scrollY > 300
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.back-to-top {
  position: fixed;
  right: 24px;
  bottom: 24px;
  background-color: transparent;
  color: #3CDDD2;
  border: 2px solid #3CDDD2;
  border-radius: 8px;
  width: 48px;
  height: 48px;
  font-size: 18px;
  cursor: pointer;
  z-index: 1000;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-to-top:hover {
  background-color: #3CDDD2;
  color: white;
  transform: scale(1.1);
}

.back-to-top:active {
  transform: scale(0.95);
}

/* 淡入淡出動畫 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>