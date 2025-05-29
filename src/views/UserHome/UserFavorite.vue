<template>
  <div class="user-favorite container py-4">
    <h2 class="mb-4 section-title"><i class="fa-solid fa-heart"></i> 我的收藏</h2>
    <div class="row g-4">
      <div class="col-md-3" v-for="item in pagedFavorites" :key="item.propertyId">
        <PropertyCard :propertyId="item.propertyId" :image="item.image" :title="item.title" :city="item.city"
          :district="item.district" :address="item.address" :rentPrice="item.rentPrice"
          :propertyType="item.propertyType" :roomCount="item.roomCount" :bathroomCount="item.bathroomCount"
          class="small-card" />
      </div>
      <div v-if="favorites.length === 0" class="empty-favorites">
        <p class="text-muted fs-5">目前沒有收藏任何房源</p>
        <router-link to="/PropertySearch" class="explore-btn">
          去探索房源 <i class="fa-solid fa-chevron-right ms-1"></i>
        </router-link>
      </div>
      <div class="col-md-12 d-flex justify-content-center mt-4">
        <Pagination v-model="currentPage"
              :totalItems="favorites.length"
              :itemsPerPage="itemsPerPage"
              :showFirstLastButtons="true"
              :showPageInfo="true" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import axios from 'axios'
import PropertyCard from '@/components/cards/PropertyCard.vue'
import propertyImg from '@/assets/images/property/property.jpg'
import Pagination from '@/components/Pagination/Pagination.vue'
import { useFavoriteStore } from '@/stores/favoriteStore.js';


const favoriteStore = useFavoriteStore()
const favorites = computed(() => favoriteStore.list)

const currentPage = ref(1)
const itemsPerPage = 8

const pagedFavorites = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return favorites.value.slice(start, start + itemsPerPage)
})


onMounted(() => {
  favoriteStore.fetchFavorites()
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

watch(currentPage, () => {
  nextTick(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
})
</script>

<style scoped>
.section-title {
  font-size: 1.8rem;
  margin-bottom: 30px;
}

.empty-favorites {
  position: relative;
  height: 300px;
  background: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 12px;
  margin-top: 40px;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
}

.empty-favorites p {
  font-size: 1.25rem;
  margin-bottom: auto;
  margin-top: 115px;
}

.explore-btn {
  position: absolute;
  bottom: 90px;
  background-color: transparent;
  color: #24B4A8 !important;
  padding: 10px 16px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.explore-btn:hover {
  color: #3CDDD2 !important;
}

.explore-btn:active {
  color: #007A75 !important;
}
</style>
