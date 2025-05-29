<template>
  <div class="footer-container">
    <div class="qa-wrapper">
      <QARobot />
      <div class="qa-box">
        <button class="back-to-top" @click="scrollToTop">
          <i class="fa-solid fa-chevron-up"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import QARobot from "@/components/QARobot/QARobot.vue"

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.qa-wrapper {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
}

.qa-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.back-to-top {
  background-color: transparent;
  color: #3CDDD2;
  border: 2px solid #3CDDD2;
  border-radius: 8px;
  width: 48px;
  height: 48px;
  font-size: 18px;
  cursor: pointer;
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
</style>