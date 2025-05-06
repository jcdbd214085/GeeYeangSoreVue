<template>
  <!-- 輪播圖元件 -->
  <div class="carousel-wrapper animate__animated animate__fadeInUp animate__faster">
    <div class="carousel-slide" v-for="(img, i) in images" :key="i" :class="{ active: current === i }">
      <img :src="img" class="d-block w-100" :alt="`輪播圖${i + 1}`">
    </div>
    <!-- <Button class="carousel-control-prev" @click="prev">
      <i class="fa-solid fa-chevron-left"></i>
    </Button>
    <Button class="carousel-control-next" @click="next">
      <i class="fa-solid fa-chevron-right"></i>
    </Button> -->
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Button from '@/components/buttons/button.vue';
import Carousel1 from '@/assets/images/carousel/首頁展示圖(1).jpg';
import Carousel2 from '@/assets/images/carousel/首頁展示圖(2).jpg';
import Carousel3 from '@/assets/images/carousel/首頁展示圖(3).jpg';
import Carousel4 from '@/assets/images/carousel/首頁展示圖(4).jpg';
import Carousel5 from '@/assets/images/carousel/首頁展示圖(5).jpg';
import Carousel6 from '@/assets/images/carousel/首頁展示圖(6).jpg';
const images = [
  Carousel1,
  Carousel2,
  Carousel3,
  Carousel4,
  Carousel5,
  Carousel6
];
const current = ref(0);
let timer = null;
function next() {
  current.value = (current.value + 1) % images.length;
}
function prev() {
  current.value = (current.value - 1 + images.length) % images.length;
}
function startAuto() {
  timer = setInterval(next, 5000);
}
function stopAuto() {
  if (timer) clearInterval(timer);
}
onMounted(() => {
  startAuto();
});
onUnmounted(() => {
  stopAuto();
});
</script>
<style scoped>
.carousel-wrapper {
  position: relative;
  height: 400px;
  margin-bottom: 32px;
  overflow: hidden;
}

.carousel-wrapper.animate__animated {
  --animate-duration: 0.4s;
}

.carousel-slide {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 1;
  transition: opacity 0.4s;
  pointer-events: none;
  display: block;
}

.carousel-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-slide.active {
  opacity: 1;
  z-index: 2;
  pointer-events: auto;
}

:deep(.carousel-control-prev),
:deep(.carousel-control-next) {
  background: rgba(0, 0, 0, 0.2) !important;
  border: none !important;
  width: 40px !important;
  height: 40px !important;
  border-radius: 50% !important;
  color: #fff !important;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
}
:deep(.carousel-control-prev) { left: 10px; }
:deep(.carousel-control-next) { right: 10px; }
:deep(.carousel-control-prev-icon),
:deep(.carousel-control-next-icon) {
  /* 若有自訂箭頭圖示可在這裡加強 */
  /* 這裡保留原本的 background-image 或 SVG */
}

.carousel-item {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
</style>
