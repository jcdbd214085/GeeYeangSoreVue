<template>

    <div class="property-detail-layout">
        <div class="carousel-container">
            <!-- 主圖區域 -->
            <div class="main-swiper-wrapper position-relative">
                <button class="follow-btn favorite-icon" @click="toggleFavorite">
                    <i :class="['fa-heart', isFavorited ? 'fa-solid' : 'fa-regular']"
                        :style="{ color: isFavorited ? '#ff9800' : '' }"></i>
                </button>
                <swiper :modules="[Navigation, Thumbs]" :slides-per-view="1" navigation
                    :thumbs="{ swiper: thumbsSwiper }">
                    <swiper-slide v-for="(img, index) in images" :key="index">
                        <img :src="img" alt="房源圖片" class="carousel-img" />
                    </swiper-slide>
                </swiper>
            </div>

            <!-- 縮圖區域 -->
            <swiper class="thumb-swiper" :modules="[Thumbs]" @swiper="setThumbsSwiper" :space-between="10"
                :slides-per-view="5" watchSlidesProgress>
                <swiper-slide v-for="(img, index) in images" :key="'thumb-' + index">
                    <img :src="img" class="thumb-img" />
                </swiper-slide>
            </swiper>
        </div>

        <!-- 右側資訊欄 -->
        <div class="info-container">

            <h2 class="title">{{ property.title }}</h2>
            <p class="price">NT$ {{ new Intl.NumberFormat().format(property.rentPrice) }} / 月</p>
            <p class="address">
                <i class="fa-solid fa-location-dot me-1"></i>
                {{ property.city }} {{ property.district }} {{ property.address }}
            </p>
            <ul class="details-list">

                <li><strong>格局：</strong>{{ property.roomCount }} 房 {{ property.bathroomCount }} 衛</li>
                <li><strong>坪數：</strong>{{ property.area }} 坪</li>
                <li><strong>樓層：</strong>{{ property.floor }} / {{ property.totalFloors }} 樓</li>
                <li><strong>類型：</strong>{{ property.propertyType }}</li>
                <li><strong>建物：</strong>{{ property.buildingType }}</li>
                <li><strong>刊登日期：</strong>{{ formatDate(property.publishedDate) }}</li>
            </ul>
        </div>
    </div>
</template>

<script setup>

import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Thumbs } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import { ref } from 'vue'

const thumbsSwiper = ref(null)

function setThumbsSwiper(swiper) {
    thumbsSwiper.value = swiper
}

const props = defineProps({
    property: Object,
    images: Array
})

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString()
}

const isFavorited = ref(false)

function toggleFavorite() {
    isFavorited.value = !isFavorited.value
}
</script>

<style scoped>
.property-detail-layout {
    display: flex;
    flex-wrap: nowrap;
    gap: 2rem;
    align-items: flex-start;
}

.carousel-container {
    flex: 2;
    max-width: 66.66%;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.main-swiper-wrapper {
    border-radius: 15px;
    overflow: hidden;
}

.carousel-img {
    width: 100%;
    height: 100%;
    max-height: 430px;
    object-fit: cover;
    display: block;
    border-radius: 15px;
    background-color: #f7f7f7;
}

.thumb-swiper {
    height: 80px;
    width: 100%;
}

.thumb-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.3s ease;
}

.swiper-slide-thumb-active .thumb-img {
    opacity: 1;
    border: 2px solid #24b4a8;
}

.info-container {
    flex: 1;
    min-width: 33.33%;
    padding-top: 1rem;
    padding-left: 1rem;
    font-size: 1rem;
}

.title {
    font-size: 1.6rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 0.8rem;
}

.price {
    font-size: 1.6rem;
    font-weight: bold;
    color: var(--accent, #ff9800);
    margin-bottom: 0.8rem;
}

.address {
    font-size: 1.1rem;
    color: #777;
    margin-bottom: 1rem;
}

.desc {
    font-size: 0.9rem;
    color: #444;
    margin-bottom: 1rem;
}

.details-list {
    list-style: none;
    padding: 0;
    font-size: 1rem;
    line-height: 2rem;
}


.details-list li {
    margin-bottom: 0.6rem;
}

::v-deep(.swiper-button-next),
::v-deep(.swiper-button-prev) {
    color: #ccc;
}

.follow-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--accent);
    font-size: 1.8rem;
    transition: color 0.3s ease, transform 0.2s ease;
    z-index: 10;
}

.follow-btn:hover {
    color: #24B4A8;
    transform: scale(1.4);
}

.follow-btn:active {
    transform: scale(1.2);
}

.favorite-icon {
    position: absolute;
    top: 15px;
    right: 15px;
}
</style>