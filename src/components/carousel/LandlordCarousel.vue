<template>
    <Swiper :modules="[Autoplay]" :slides-per-view="2" :loop="true" :autoplay="{ delay: 5000, pauseOnMouseEnter: true }"
        :space-between="30">
        <SwiperSlide v-for="(item, i) in effectiveList" :key="i">
            <LandlordPropertyCard v-bind="item.property" :landlord="item.landlord" class="no-animation" />
        </SwiperSlide>
    </Swiper>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

import LandlordPropertyCard from '@/components/cards/LandlordPropertyCard.vue'
import propertyImg from '@/assets/images/property/property.jpg'
import avatarImg from '@/assets/images/avatar/default.png'
import { computed } from 'vue'

const props = defineProps({
    list: {
        type: Array,
        default: () => []
    }
})

const defaultList = [
    {
        landlord: {
            id: 101,
            name: '張先生',
            phone: '0912-345-678',
            avatar: avatarImg,
        },
        property: {
            propertyId: 1,
            image: propertyImg,
            rentPrice: 15000,
            title: '精緻套房出租',
            city: '台北市',
            district: '信義區',
            address: '松山路 123 號',
            propertyType: '套房',
            roomCount: 1,
            bathroomCount: 1
        }
    },
    {
        landlord: {
            id: 102,
            name: '李小姐',
            phone: '0987-654-321',
            avatar: '',
        },
        property: {
            propertyId: 2,
            image: propertyImg,
            rentPrice: 12000,
            title: '文青風雅房',
            city: '高雄市',
            district: '苓雅區',
            address: '三多路 456 號',
            propertyType: '雅房',
            roomCount: 1,
            bathroomCount: 1
        }
    },
    {
        landlord: {
            id: 103,
            name: '張先生',
            phone: '0912-345-678',
            avatar: avatarImg,
        },
        property: {
            propertyId: 3,
            image: propertyImg,
            rentPrice: 15000,
            title: '精緻套房出租',
            city: '台北市',
            district: '信義區',
            address: '松山路 123 號',
            propertyType: '套房',
            roomCount: 1,
            bathroomCount: 1
        }
    }
]

const effectiveList = computed(() =>
    props.list && props.list.length ? props.list : defaultList
)
</script>

<style scoped>
.landlord-carousel {
    padding-bottom: 30px;
}
</style>