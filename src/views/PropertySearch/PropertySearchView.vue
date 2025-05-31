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
                <PropertyCarousel :list="featuredProperties" @open-login="handleOpenLogin" />
            </div>
        </div>
        <div id="property-list-section" class="container my-5">
            <h2 class="section-title"><i class="fa-solid fa-house"></i> 房源列表</h2>
            <div v-if="pagedList.length === 0 && propertyList.length === 0" class="text-center my-5">
                <p>查無符合條件的房源，請嘗試其他搜尋條件。</p>
            </div>
            <div class="row" :key="currentPage">
                <div class="col-md-3" v-for="(item, i) in pagedList" :key="i"
                    v-intersect="pageDirection === 'next' ? '' : 'fadeInRight'">
                    <PropertyCard
                        :propertyId="item.propertyId"
                        :image="item.image"
                        :rentPrice="item.rentPrice"
                        :title="item.title"
                        :city="item.city"
                        :district="item.district"
                        :address="item.address"
                        :roomCount="item.roomCount"
                        :bathroomCount="item.bathroomCount"
                        :propertyType="item.propertyType"
                        class="small-card"
                        @open-login="handleOpenLogin"
                        >
                        <template #badge v-if="item.badgeType">
                            <BadgeList :type="item.badgeType" />
                        </template>
                    </PropertyCard>
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
                <LandlordCarousel :list="landlordProperties" @open-login="handleOpenLogin" @open-chat="handleOpenChat" />
            </div>
        </div>
        <!-- 當新註冊房客時點選房東，會有聊天視窗 -->
        <ChatPopup v-if="isChatOpen" :contact-id="chatContact.id" :contact-name="chatContact.name" :contact-avatar="chatContact.avatar" @close="isChatOpen = false" />
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
import { ref, onMounted, computed, reactive, watch, nextTick } from 'vue'
import axios from 'axios'
import { useFavoriteStore } from '@/stores/favoriteStore'
import ChatPopup from '@/components/chat/ChatPopup.vue'
import BadgeList from '@/components/BadgeList.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const favoriteStore = useFavoriteStore()
const emit = defineEmits(['open-login'])
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const propertyList = ref([])
const currentPage = ref(1)
const itemsPerPage = 12
const previousPage = ref(1)
const pageDirection = ref('next')

// 過濾房源列表的函數
const filterProperties = (properties, city, keyword) => {
  return properties.filter(property => {
    const matchesCity = !city || property.city === city
    const matchesKeyword = !keyword || 
      property.title.toLowerCase().includes(keyword.toLowerCase()) ||
      property.address.toLowerCase().includes(keyword.toLowerCase()) ||
      property.district.toLowerCase().includes(keyword.toLowerCase())
    return matchesCity && matchesKeyword
  })
}

onMounted(async () => {
  await favoriteStore.fetchFavorites()
  
  // 獲取所有房源
  try {
    const res = await axios.get(`${API_BASE_URL}/api/PropertySearch/propertyList`)
    let properties = res.data

    // 從 URL 獲取搜尋參數
    const { city, keyword } = route.query

    // 如果有搜尋參數，進行過濾
    if (city || keyword) {
      properties = filterProperties(properties, city, keyword)
    }

    propertyList.value = properties
  } catch (error) {
    console.error('載入房源列表失敗:', error)
  }
})

const pagedList = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return propertyList.value.slice(start, start + itemsPerPage)
})

watch(currentPage, (newVal, oldVal) => {
    pageDirection.value = newVal > oldVal ? 'next' : 'prev'
    previousPage.value = newVal

    nextTick(() => {
        const section = document.getElementById('property-list-section')
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    })
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
function handleOpenLogin() {
    emit('open-login')
}

const isChatOpen = ref(false)
const chatContact = ref({})
function handleOpenChat(contact) {
    chatContact.value = contact
    isChatOpen.value = true
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