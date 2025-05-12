<template>
    <section class="property-search-view">
        <div class="carousel-wrapper position-relative">
            <Carousel />
            <div class="search-container">
                <SearchBar />
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
        <div class="container my-5">
            <h2 class="section-title"><i class="fa-solid fa-house"></i> 房源列表</h2>
            <div class="row">
                <div class="col-md-3" v-for="(item, i) in propertyList" :key="i">
                    <PropertyCard :propertyId="item.propertyId" :image="item.image" :rentPrice="item.h_RentPrice"
                        :title="item.h_PropertyTitle" :city="item.h_City" :district="item.h_District"
                        :address="item.h_Address" :roomCount="item.h_RoomCount" :bathroomCount="item.h_BathroomCount"
                        :propertyType="item.h_PropertyType" class="small-card" />
                </div>
                <div class="col-md-12 d-flex justify-content-center mt-4">
                    <Pagination :totalItems="propertyList.length" :itemsPerPage="8" :currentPage="1"
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



import { ref, onMounted } from 'vue'

const propertyList = ref([])

onMounted(() => {
    // 模擬 API 資料
    propertyList.value = [
        {
            propertyId: 1,
            image: propertyImg,
            h_RentPrice: 18000,
            h_PropertyTitle: '晨曦小築',
            h_City: '高雄市',
            h_District: '鳳山區',
            h_Address: '中正四路211號',
            h_RoomCount: 2,
            h_BathroomCount: 1,
            h_PropertyType: '套房',
        },
        {
            propertyId: 2,
            image: propertyImg,
            h_RentPrice: 18000,
            h_PropertyTitle: '晨曦小築',
            h_City: '高雄市',
            h_District: '鳳山區',
            h_Address: '中正四路211號',
            h_RoomCount: 2,
            h_BathroomCount: 1,
            h_PropertyType: '套房',
        },
        {
            propertyId: 3,
            image: propertyImg,
            h_RentPrice: 18000,
            h_PropertyTitle: '晨曦小築',
            h_City: '高雄市',
            h_District: '鳳山區',
            h_Address: '中正四路211號',
            h_RoomCount: 2,
            h_BathroomCount: 1,
            h_PropertyType: '套房',
        },
        {
            propertyId: 4,
            image: propertyImg,
            h_RentPrice: 18000,
            h_PropertyTitle: '晨曦小築',
            h_City: '高雄市',
            h_District: '鳳山區',
            h_Address: '中正四路211號',
            h_RoomCount: 2,
            h_BathroomCount: 1,
            h_PropertyType: '套房',
        },
        {
            propertyId: 5,
            image: propertyImg,
            h_RentPrice: 18000,
            h_PropertyTitle: '晨曦小築',
            h_City: '高雄市',
            h_District: '鳳山區',
            h_Address: '中正四路211號',
            h_RoomCount: 2,
            h_BathroomCount: 1,
            h_PropertyType: '套房',
        },
        {
            propertyId: 6,
            image: propertyImg,
            h_RentPrice: 18000,
            h_PropertyTitle: '晨曦小築',
            h_City: '高雄市',
            h_District: '鳳山區',
            h_Address: '中正四路211號',
            h_RoomCount: 2,
            h_BathroomCount: 1,
            h_PropertyType: '套房',
        },
        {
            propertyId: 7,
            image: propertyImg,
            h_RentPrice: 18000,
            h_PropertyTitle: '晨曦小築',
            h_City: '高雄市',
            h_District: '鳳山區',
            h_Address: '中正四路211號',
            h_RoomCount: 2,
            h_BathroomCount: 1,
            h_PropertyType: '套房',
        },
        {
            propertyId: 8,
            image: propertyImg,
            h_RentPrice: 18000,
            h_PropertyTitle: '晨曦小築',
            h_City: '高雄市',
            h_District: '鳳山區',
            h_Address: '中正四路211號',
            h_RoomCount: 2,
            h_BathroomCount: 1,
            h_PropertyType: '套房',
        }
    ]
})

const landlordProperties = ref([])

onMounted(async () => {
    // 模擬從 API 抓資料
    landlordProperties.value = [
        {
            landlord: {
                id: 101,
                name: '王小明',
                phone: '0912345678',
                avatar: ''
            },
            property: {
                propertyId: 9,
                image: propertyImg,
                rentPrice: 15000,
                title: '晨曦小築',
                city: '台北市',
                district: '中正區',
                address: '和平東路一段 100 號',
                propertyType: '套房',
                roomCount: 2,
                bathroomCount: 1
            }
        },
        {
            landlord: {
                id: 102,
                name: '陳美麗',
                phone: '0987654321',
                avatar: ''
            },
            property: {
                propertyId: 9,
                image: propertyImg,
                rentPrice: 18000,
                title: '晨曦小築',
                city: '台中市',
                district: '西屯區',
                address: '文心路二段 88 號',
                propertyType: '雅房',
                roomCount: 3,
                bathroomCount: 2
            }
        },
        {
            landlord: {
                id: 103,
                name: '王小明',
                phone: '0912345678',
                avatar: ''
            },
            property: {
                propertyId: 10,
                image: propertyImg,
                rentPrice: 15000,
                title: '晨曦小築',
                city: '台北市',
                district: '中正區',
                address: '和平東路一段 100 號',
                propertyType: '套房',
                roomCount: 2,
                bathroomCount: 1
            }
        },
    ]
})

const featuredProperties = ref([])

onMounted(async () => {
    // 模擬 API 抓資料
    featuredProperties.value = [
        {
            propertyId: 11,
            image: propertyImg,
            rentPrice: 15000,
            title: '物件1',
            city: '台北市',
            district: '中正區',
            address: '和平東路一段 100 號',
            propertyType: '套房',
            roomCount: 2,
            bathroomCount: 1
        },
        {
            propertyId: 12,
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
            propertyId: 13,
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
            propertyId: 14,
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
            propertyId: 15,
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
})

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