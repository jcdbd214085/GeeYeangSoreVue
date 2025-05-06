<template>
    <section class="property-search-view">
        <div class="carousel-wrapper position-relative">
            <Carousel />
            <div class="search-container">
                <SearchBar />
            </div>
        </div>
        <div class="container">
            <h2 class="section-title">房源搜尋</h2>
            <div class="row">
                <div class="col-md-4" v-for="(item, i) in propertyList" :key="i">
                    <PropertyCard :image="item.image" :rentPrice="item.h_RentPrice" :title="item.h_PropertyTitle"
                        :city="item.h_City" :district="item.h_District" :address="item.h_Address"
                        :roomCount="item.h_RoomCount" :bathroomCount="item.h_BathroomCount"
                        :propertyType="item.h_PropertyType" />
                </div>
            </div>
        </div>
        <div class="container my-5">
            <h2 class="section-title">精選房源</h2>
            <PropertyCarousel />
        </div>
    </section>
</template>

<script setup>
import SearchBar from '@/components/searchBar/SearchBar.vue'
import Carousel from '@/components/carousel/Carousel2nd.vue';
import PropertyCarousel from '@/components/carousel/PropertyCarousel.vue'
import PropertyCard from '@/components/cards/PropertyCard.vue';
import propertyImg from '@/assets/images/property/property.jpg';

const propertyList = [
    {
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
    transform: translate(-50%, -50%);
    width: 70%;
    z-index: 1050;
}
</style>