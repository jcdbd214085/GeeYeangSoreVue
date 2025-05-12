<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

import PropertyCard from '@/components/cards/PropertyCard.vue'
import propertyImg from '@/assets/images/property/property.jpg'
import { computed } from 'vue'

const props = defineProps({
    list: {
        type: Array,
        required: false,
        default: () => []
    }
})

// 預設資料
const fallbackList = [
    {
        propertyId: 1,
        image: propertyImg,
        rentPrice: 4500,
        title: '物件1',
        city: '新北市',
        district: '板橋區',
        address: '文化路一段100號',
        propertyType: '套房',
        roomCount: 1,
        bathroomCount: 1
    },
    {
        propertyId: 2,
        image: propertyImg,
        rentPrice: 5000,
        title: '物件2',
        city: '新北市',
        district: '中和區',
        address: '連城路88號',
        propertyType: '雅房',
        roomCount: 2,
        bathroomCount: 1
    },
    {
        propertyId: 3,
        image: propertyImg,
        rentPrice: 5000,
        title: '物件3',
        city: '新北市',
        district: '中和區',
        address: '連城路88號',
        propertyType: '雅房',
        roomCount: 2,
        bathroomCount: 1
    },
    {
        propertyId: 4,
        image: propertyImg,
        rentPrice: 5000,
        title: '物件4',
        city: '新北市',
        district: '中和區',
        address: '連城路88號',
        propertyType: '雅房',
        roomCount: 2,
        bathroomCount: 1
    },
    {
        propertyId: 5,
        image: propertyImg,
        rentPrice: 5000,
        title: '物件5',
        city: '新北市',
        district: '中和區',
        address: '連城路88號',
        propertyType: '雅房',
        roomCount: 2,
        bathroomCount: 1
    }
]

const propertyList = computed(() => props.list.length > 0 ? props.list : fallbackList)
</script>

<template>
    <Swiper :modules="[Autoplay, Navigation]" :slides-per-view="1" :loop="true"
        :autoplay="{ delay: 3000, pauseOnMouseEnter: true }" :space-between="20"
        :breakpoints="{ 768: { slidesPerView: 2 }, 992: { slidesPerView: 3 } }">
        <SwiperSlide v-for="(item, i) in propertyList" :key="i">
            <PropertyCard v-bind="item" class="no-animation" />
        </SwiperSlide>
    </Swiper>
</template>

<style scoped></style>
