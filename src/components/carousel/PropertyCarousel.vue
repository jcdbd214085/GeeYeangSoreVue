<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Autoplay } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'

import PropertyCard from '@/components/cards/PropertyCard.vue'
import propertyImg from '@/assets/images/property/property.jpg'

// 假資料
const rawPropertyList = [
    {
        image: propertyImg,
        h_RentPrice: 4500,
        h_PropertyTitle: '物件1',
        h_City: '新北市',
        h_District: '板橋區',
        h_Address: '文化路一段100號',
        h_PropertyType: '套房',
        h_RoomCount: 1,
        h_BathroomCount: 1
    },
    {
        image: propertyImg,
        h_RentPrice: 4500,
        h_PropertyTitle: '物件2',
        h_City: '新北市',
        h_District: '板橋區',
        h_Address: '文化路一段100號',
        h_PropertyType: '套房',
        h_RoomCount: 1,
        h_BathroomCount: 1
    },
    {
        image: propertyImg,
        h_RentPrice: 5000,
        h_PropertyTitle: '物件3',
        h_City: '新北市',
        h_District: '中和區',
        h_Address: '連城路88號',
        h_PropertyType: '雅房',
        h_RoomCount: 2,
        h_BathroomCount: 1
    },
    {
        image: propertyImg,
        h_RentPrice: 6000,
        h_PropertyTitle: '物件4',
        h_City: '新北市',
        h_District: '三峽區',
        h_Address: '三峽路200號',
        h_PropertyType: '套房',
        h_RoomCount: 1,
        h_BathroomCount: 1
    },
    {
        image: propertyImg,
        h_RentPrice: 7000,
        h_PropertyTitle: '物件5',
        h_City: '新北市',
        h_District: '三峽區',
        h_Address: '三峽路200號',
        h_PropertyType: '套房',
        h_RoomCount: 1,
        h_BathroomCount: 1
    }
]

// 資料轉換
const propertyList = rawPropertyList.map(p => ({
    image: p.image,
    rentPrice: p.h_RentPrice,
    title: p.h_PropertyTitle,
    city: p.h_City,
    district: p.h_District,
    address: p.h_Address,
    propertyType: p.h_PropertyType,
    roomCount: p.h_RoomCount,
    bathroomCount: p.h_BathroomCount
}))
</script>

<template>
    <Swiper :modules="[Autoplay]" :slides-per-view="1" :loop="true" :autoplay="{ delay: 3000 }" :space-between="20"
        :breakpoints="{ 768: { slidesPerView: 2 }, 992: { slidesPerView: 3 } }">
        <SwiperSlide v-for="(item, i) in propertyList" :key="i">
            <PropertyCard v-bind="item" :class="'no-animation'" />
        </SwiperSlide>
    </Swiper>
</template>

<style scoped></style>