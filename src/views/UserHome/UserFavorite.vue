<template>
  <div class="user-favorite container py-4">
    <h2 class="mb-4 section-title"><i class="fa-solid fa-heart"></i> 我的收藏</h2>
    <div class="row g-4">
      <div class="col-md-3" v-for="item in favorites" :key="item.propertyId">
        <PropertyCard
          :propertyId="item.propertyId"
          :image="item.image"
          :title="item.title"
          :city="item.city"
          :district="item.district"
          :address="item.address"
          :rentPrice="item.rentPrice"
          :propertyType="item.propertyType"
          :roomCount="item.roomCount"
          :bathroomCount="item.bathroomCount"
          class="small-card"
        />
        </div>
        <div class="col-md-12 d-flex justify-content-center mt-4">
            <Pagination :totalItems="favorites.length" :itemsPerPage="8" :currentPage="1"
            :showFirstLastButtons="true" :showPageInfo="true" />
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import PropertyCard from '@/components/cards/PropertyCard.vue'
import propertyImg from '@/assets/images/property/property.jpg'
import Pagination from '@/components/Pagination/Pagination.vue';

const fallbackList = [
  {
    propertyId: 1,
    image: propertyImg,
    title: '物件1',
    city: '台中市',
    district: '西區',
    address: '公益路二段 88 號',
    rentPrice: 16800,
    propertyType: '套房',
    roomCount: 1,
    bathroomCount: 1
  },
  {
    propertyId: 2,
    image: propertyImg,
    title: '物件2',
    city: '高雄市',
    district: '前鎮區',
    address: '海岸路 100 號 7 樓',
    rentPrice: 16800,
    propertyType: '套房',
    roomCount: 1,
    bathroomCount: 1
  },
  {
    propertyId: 3,
    image: propertyImg,
    title: '物件3',
    city: '高雄市',
    district: '前鎮區',
    address: '海岸路 100 號 7 樓',
    rentPrice: 16800,
    propertyType: '套房',
    roomCount: 1,
    bathroomCount: 1
  },
  {
    propertyId: 4,
    image: propertyImg,
    title: '物件4',
    city: '高雄市',
    district: '前鎮區',
    address: '海岸路 100 號 7 樓',
    rentPrice: 16800,
    propertyType: '套房',
    roomCount: 1,
    bathroomCount: 1
  },
  {
    propertyId: 5,
    image: propertyImg,
    title: '物件5',
    city: '高雄市',
    district: '前鎮區',
    address: '海岸路 100 號 7 樓',
    rentPrice: 16800,
    propertyType: '套房',
    roomCount: 1,
    bathroomCount: 1
  },
  {
    propertyId: 6,
    image: propertyImg,
    title: '物件6',
    city: '高雄市',
    district: '前鎮區',
    address: '海岸路 100 號 7 樓',
    rentPrice: 16800,
    propertyType: '套房',
    roomCount: 1,
    bathroomCount: 1
  },
]

const favorites = ref([])

onMounted(async () => {
  try {
    const res = await axios.get('https://localhost:7167/api/Favorites/byUser/1')
    favorites.value = res.data
  } catch (error) {
    console.warn('取得收藏資料失敗，使用假資料', error)
    favorites.value = fallbackList
  }
})
</script>

<style scoped>
.section-title {
    font-size: 1.8rem;
    margin-bottom: 30px;
}
</style>
