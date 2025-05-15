<template>
    <section class="property-search-view">
        <div class="carousel-wrapper position-relative">
            <Carousel />
            <div class="search-container">
                <SearchBar @search="handleSearch" />
            </div>
        </div>
        <div class="container my-5">
            <h2 class="section-title">
                <i class="fa-solid fa-fire"></i> 精選房源
            </h2>
            <div v-intersect="'fadeInRight'">
                <PropertyCarousel :list="featuredProperties" />
            </div>
        </div>
        <div id="property-list-section" class="container my-5">
            <h2 class="section-title"><i class="fa-solid fa-house"></i> 房源列表</h2>
            <div v-if="pagedList.length === 0 && propertyList.length === 0" class="text-center my-5">
                <p>查無符合條件的房源，請嘗試其他搜尋條件。</p>
            </div>
            <div class="row" :key="currentPage">
                <div class="col-md-3" v-for="(item, i) in pagedList" :key="i" v-intersect="pageDirection === 'next' ? '' : 'fadeInRight'">
                    <PropertyCard :propertyId="item.propertyId" :image="item.image" :rentPrice="item.rentPrice"
                        :title="item.title" :city="item.city" :district="item.district" :address="item.address"
                        :roomCount="item.roomCount" :bathroomCount="item.bathroomCount"
                        :propertyType="item.propertyType" class="small-card" />
                </div>
                <div class="col-md-12 d-flex justify-content-center mt-4">
                    <Pagination v-model="currentPage" :totalItems="propertyList.length" :itemsPerPage="itemsPerPage"
                        :showFirstLastButtons="true" :showPageInfo="true" />
                </div>
            </div>
        </div>

        <div class="container my-5">
            <h2 class="section-title">
                <i class="fa-solid fa-star"></i> 推薦房東
            </h2>
            <div v-intersect="'fadeInRight'">
                <LandlordCarousel :list="landlordProperties" />
            </div>
        </div>
    </section>


</template>

<script setup>
import SearchBar from '@/components/searchBar/SearchBar.vue'
import Carousel from '@/components/carousel/Carousel2nd.vue';
import PropertyCarousel from '@/components/carousel/PropertyCarousel.vue'
import PropertyCard from '@/components/cards/PropertyCard.vue';
import propertyImg from '@/assets/images/property/property.jpg';
import LandlordCarousel from '@/components/carousel/LandlordCarousel.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import { ref, onMounted, computed, reactive, watch } from 'vue'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const propertyList = ref([])
const currentPage = ref(1)
const itemsPerPage = 8
const previousPage = ref(1)
const pageDirection = ref('next')

const pagedList = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return propertyList.value.slice(start, start + itemsPerPage)
})

watch(currentPage, (newVal, oldVal) => {
  pageDirection.value = newVal > oldVal ? 'next' : 'prev'
  previousPage.value = newVal
})

const featuredProperties = ref([])

onMounted(async () => {
    try {
        const res = await axios.get(`${API_BASE_URL}/api/PropertySearch/featuredProperties`)
        featuredProperties.value = res.data
        console.log("精選房源圖片列表：", featuredProperties.value.map(p => p.image))
    } catch (err) {
        console.error('載入精選房源失敗：', err)
    }
})

onMounted(async () => {
    try {
        const res = await axios.get(`${API_BASE_URL}/api/PropertySearch/propertyList`)
        propertyList.value = res.data
    } catch (error) {
        console.error('載入房源列表失敗:', error)
    }
})

const landlordProperties = ref([])

onMounted(async () => {
    try {
        const res = await axios.get(`${API_BASE_URL}/api/PropertySearch/landlordProperties`)
        landlordProperties.value = res.data
    } catch (err) {
        console.error("載入推薦房東失敗：", err)
    }
})

async function handleSearch(filter) {
    try {
        const res = await axios.post(`${API_BASE_URL}/api/PropertySearch/filter`, filter)
        propertyList.value = res.data
    } catch (err) {
        console.error("搜尋房源失敗：", err)
    }
}
</script>

<style scoped>
.section-title {
    font-size: 1.8rem;
    margin-bottom: 30px;
}

.carousel-wrapper {
    position: relative;
}

.search-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -20%);
    width: 70%;
    z-index: 1;
}
</style>