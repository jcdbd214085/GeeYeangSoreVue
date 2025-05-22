<!-- Carousel.vue -->
<template>
    <div id="heroCarousel" class="carousel slide" data-bs-ride="carousel">
        <!-- 指示點 -->
        <div class="carousel-indicators">
            <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" class="active"></button>
            <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1"></button>
            <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2"></button>
        </div>

        <!-- 輪播內容 -->
        <div class="carousel-inner">
            <div class="carousel-item active" data-bs-interval="5000">
                <img :src="img1" class="d-block w-100" alt="租屋廣告1" />
            </div>
            <div class="carousel-item" data-bs-interval="5000">
                <img :src="img2" class="d-block w-100" alt="租屋廣告2" />
            </div>
            <div class="carousel-item" data-bs-interval="5000">
                <img :src="img3" class="d-block w-100" alt="租屋廣告3" />
            </div>
        </div>

        <!-- 左右按鈕 -->
        <button class="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon"></span>
        </button>

        <!-- 標題 -->
        <div class="carousel-caption">
            <h2 class="text-white fw-bold">尋找您的理想租屋</h2>
        </div>
    </div>
</template>

<script setup>
import img1 from '@/assets/images/carousel/carousel11.jpg'
import img2 from '@/assets/images/carousel/carousel12.jpg'
import img3 from '@/assets/images/carousel/carousel18.jpg'
</script>

<style scoped>
.carousel-caption {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    padding: 20px;
    border-radius: 10px;
}

#heroCarousel {
    max-height: 400px;
    overflow: hidden;
    z-index: 0 !important;
    position: relative;
}

.carousel-item img {
    object-fit: contain;
    height: 100%;
    width: 100%;
}

.carousel-control-prev {
    left: -50px;
}

.carousel-control-next {
    right: -50px;
}
.carousel-indicators {
  z-index: 900 !important;
}
</style>