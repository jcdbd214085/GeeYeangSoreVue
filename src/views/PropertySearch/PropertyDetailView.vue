<template>
    <div class="container my-5">
        <h2 class="section-title">
            <i class="fa-solid fa-house"></i> 房源詳細資訊
        </h2>
        <PropertyDetailCard v-if="property" :property="property" :images="images" @open-login="handleOpenLogin" />

        <div class="row mt-4 " v-if="property">
            <div class="col-md-8">
                <div class="row mt-4 mb-5">
                    <h5 class="component-title">房源特色</h5>
                    <FeatureIcons :features="mappedFeatures" />
                </div>
                <div class="property-description mt-4 mb-5">
                    <h5 class="component-title">房源描述</h5>
                    <p>{{ property.description }}</p>
                </div>
                <div class="row mt-4 mb-5">
                    <h5 class="component-title">房源位置</h5>
                    <MapView v-if="fullAddress" :address="fullAddress" :key="fullAddress" />
                </div>
                <div class="row mt-4 mb-5">
                    <h5 class="component-title">推薦房源</h5>
                    <div>
                        <PropertyCarouselSmall :list="featuredProperties" @open-login="handleOpenLogin" />
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div style="position: sticky; top: 100px;">
                    <LandlordCard :landlord="landlord" @open-chat="handleOpenChat" />
                </div>
            </div>
        </div>
        <ChatPopup v-if="isChatOpen" :key="currentChatTenantId" @close="isChatOpen = false" />
    </div>

</template>

<script setup>
import PropertyDetailCard from '@/components/cards/PropertyDetailCard.vue'
import propertyImg from '@/assets/images/property/property.jpg';
import FeatureIcons from '@/components/featureIcons/FeatureIcons.vue'
import LandlordCard from '@/components/cards/LandlordCard.vue'
import MapView from '@/components/map/MapView.vue'
import PropertyCarouselSmall from '@/components/carousel/PropertyCarouselSmall.vue'
import BackToTop from '@/components/common/BackToTop.vue'
import Footer from '@/components/common/Footer.vue';
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import ChatPopup from '@/components/chat/ChatPopup.vue'
import { useLoadingStore } from '@/stores/loadingStore.js'
import { useFavoriteStore } from '@/stores/favoriteStore.js'

const favoriteStore = useFavoriteStore()
const loadingStore = useLoadingStore()
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const route = useRoute()
const propertyId = ref(route.params.id)
const property = ref(null)
const images = ref([])
const landlord = ref(null)
const featuredProperties = ref([])
const isChatOpen = ref(false)
const currentChatTenantId = ref(null)

const allFeatures = [
    { key: 'dog', label: '可養狗', icon: 'fa-solid fa-dog' },
    { key: 'cat', label: '可養貓', icon: 'fa-solid fa-cat' },
    { key: 'other_pet', label: '可養其他寵物', icon: 'fa-solid fa-paw' },
    { key: 'cooking', label: '可開伙', icon: 'fa-solid fa-utensils' },
    { key: 'furniture', label: '有家具', icon: 'fa-solid fa-couch' },
    { key: 'bed', label: '有床', icon: 'fa-solid fa-bed' },
    { key: 'balcony', label: '有陽台', icon: 'fa-solid fa-mountain-sun' },
    { key: 'public_facility', label: '公設', icon: 'fa-solid fa-dumbbell' },
    { key: 'parking', label: '車位', icon: 'fa-solid fa-car' },
    { key: 'aircon', label: '有冷氣', icon: 'fa-solid fa-snowflake' },
    { key: 'tv', label: '有電視', icon: 'fa-solid fa-tv' },
    { key: 'fridge', label: '有冰箱', icon: 'fa-solid fa-temperature-low' },
    { key: 'washer', label: '有洗衣機', icon: 'fa-solid fa-pump-soap' },
    { key: 'water_dispenser', label: '有飲水機', icon: 'fa-solid fa-glass-water' },
    { key: 'heater', label: '有熱水器', icon: 'fa-solid fa-fire-flame-simple' },
    { key: 'gas', label: '有天然瓦斯', icon: 'fa-solid fa-fire' },
    { key: 'internet', label: '有網路', icon: 'fa-solid fa-wifi' },
    { key: 'cable_tv', label: '有第四台', icon: 'fa-solid fa-satellite-dish' },
    { key: 'public_elec', label: '公家電費', icon: 'fa-solid fa-bolt' },
    { key: 'public_water', label: '公家水費', icon: 'fa-solid fa-droplet' },
    { key: 'short_term', label: '短期租賃', icon: 'fa-solid fa-clock' },
    { key: 'social_housing', label: '社會住宅', icon: 'fa-solid fa-building' },
    { key: 'landlord_live', label: '房東同住', icon: 'fa-solid fa-user' },
]

const mappedFeatures = computed(() => {
    const keys = property.value?.features || []
    return allFeatures.map(f => ({ ...f, active: keys.includes(f.key) }))
})

const fallbackProperty = {
    propertyId: 1,
    title: '清幽小築',
    description: `透天獨立套房，環境清幽，生活機能便利，適合單身或小家庭入住。
    室內空間配置良好，附設冷氣、衣櫃、床組等基本家具，讓您拎包即可入住。
    房屋鄰近台電公司及多項公車路線，交通便利，步行可達超商、市場及餐飲商圈，生活機能完善。
    是尋求舒適與便利生活的理想選擇。`,
    address: '雅潭路四段',
    city: '台中市',
    district: '大雅區',
    zipcode: '428',
    rentPrice: 9000,
    propertyType: '獨立套房',
    roomCount: 1,
    bathroomCount: 1,
    area: 6,
    floor: 2,
    totalFloors: 3,
    buildingType: '透天',
    publishedDate: '2025-05-08T00:00:00',
    features: ['dog', 'cooking', 'tv', 'internet', 'balcony']
}

const fallbackLandlord = {
    id: 1,
    name: '王大明',
    phone: '0912-345-678',
    avatar: ''
}

const fallbackImages = Array(6).fill(propertyImg)

const fallbackList = [
    { propertyId: 1, image: propertyImg, rentPrice: 12000, title: '物件1', city: '台中市', district: '西區', address: '五權西路二段', propertyType: '雅房', roomCount: 1, bathroomCount: 1 },
    { propertyId: 2, image: propertyImg, rentPrice: 18000, title: '物件2', city: '新竹市', district: '東區', address: '光復路一段', propertyType: '整層住家', roomCount: 2, bathroomCount: 1 },
    { propertyId: 3, image: propertyImg, rentPrice: 18000, title: '物件3', city: '新竹市', district: '東區', address: '光復路一段', propertyType: '整層住家', roomCount: 2, bathroomCount: 1 },
    { propertyId: 4, image: propertyImg, rentPrice: 18000, title: '物件4', city: '新竹市', district: '東區', address: '光復路一段', propertyType: '整層住家', roomCount: 2, bathroomCount: 1 },
    { propertyId: 5, image: propertyImg, rentPrice: 18000, title: '物件5', city: '新竹市', district: '東區', address: '光復路一段', propertyType: '整層住家', roomCount: 2, bathroomCount: 1 }
]

const fullAddress = computed(() => {
    return [
        property.value?.city,
        property.value?.district,
        property.value?.address
    ].filter(Boolean).join('')
})

async function loadPropertyDetail(id) {
    try {
        loadingStore.show()
        console.log("房源 ID:", id);
        console.log("API 呼叫 URL:", `${API_BASE_URL}/api/PropertySearch/${id}`);
        const res = await axios.get(`${API_BASE_URL}/api/PropertySearch/${id}`)
        property.value = res.data.property
        images.value = res.data.images
        landlord.value = res.data.landlord
    } catch (error) {
        console.error('取得房源失敗:', error)
        property.value = fallbackProperty
        images.value = fallbackImages
        landlord.value = fallbackLandlord
    } finally {
        loadingStore.hide()
    }
}

onMounted(async () => {
    await favoriteStore.fetchFavorites()
    await loadPropertyDetail(route.params.id)

    try {
        const res2 = await axios.get(`${API_BASE_URL}/api/PropertySearch/recommendedProperties`)
        featuredProperties.value = res2.data
    } catch (error) {
        console.warn('取得推薦物件失敗:', error)
        featuredProperties.value = fallbackList
    }
})

watch(() => route.params.id, async (newId, oldId) => {
    if (newId !== oldId) {
        await loadPropertyDetail(newId)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
})

const emit = defineEmits(['open-login'])
function handleOpenLogin() {
    emit('open-login')
}

function handleOpenChat(landlordTenantId) {
    currentChatTenantId.value = landlordTenantId
    isChatOpen.value = true
}
</script>

<style scoped>
.section-title {
    font-size: 1.8rem;
    margin-bottom: 30px;
}

.component-title {
    font-size: 1.4rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #333;
}

.property-description p {
    font-size: 1rem;
    line-height: 2;
    color: #444;
    white-space: pre-line;
}

.page-wrapper {
    justify-content: center;
}
</style>