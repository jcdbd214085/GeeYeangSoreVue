<template>
    <Swiper :modules="[Autoplay, Navigation]" :loop="propertyList.length >= 3" :slides-per-view="1" :space-between="20"
        :autoplay="{ delay: 3000, pauseOnMouseEnter: true }" :breakpoints="{
            768: { slidesPerView: 2 },
            992: { slidesPerView: 3 }
        }">
        <SwiperSlide v-for="(item, i) in propertyList" :key="i">
            <PropertyCard v-bind="item" class="no-animation small-card" @open-login="$emit('open-login')" >
            <template #badge v-if="item.badgeType">
                    <BadgeList :type="item.badgeType" />
            </template>
        </PropertyCard>
        </SwiperSlide>
    </Swiper>
</template>
<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import PropertyCard from '@/components/cards/PropertyCard.vue'
import propertyImg from '@/assets/images/property/property.jpg'
import { computed } from 'vue'
import BadgeList from '@/components/BadgeList.vue'

const emit = defineEmits(['open-login'])
const props = defineProps({
    list: {
        type: Array,
        default: () => []
    }
})

const fallbackList = [
    {
        propertyId: 1,
        image: propertyImg,
        rentPrice: 5000,
        title: '清幽小築',
        city: '台中市',
        district: '大雅區',
        address: '雅潭路四段',
        propertyType: '獨立套房',
        roomCount: 1,
        bathroomCount: 1
    }
]

const propertyList = computed(() => props.list.length > 0 ? props.list : fallbackList)
</script>

<style scoped>
.carousel-card-wrapper {
    max-width: 300px;
    margin: 0 auto;
}

.property-card.small-card {
    font-size: 0.875rem;
}

.property-card.small-card .rent {
    font-size: 1.1rem;
}

.property-card.small-card .type-title {
    font-size: 1rem;
}

.property-card.small-card .room-info {
    font-size: 0.75rem;
}
</style>