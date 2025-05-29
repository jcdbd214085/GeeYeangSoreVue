<template>
  <section class="hero-section" style="padding-top:100px;">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-6">
          <h1>
            <span class="static-text">用數據找到</span>
            <span class="typing-text">理想的家</span>
          </h1>
          <div class="hero-text">智慧推薦．精準媒合．打造你的理想居所</div>
        </div>
        <div class="col-lg-6">
          <div class="animate__animated animate__fadeInUp animate__delay-2s">
            <Carousel />
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="search-section">
    <div class="container">
      <SearchBar />
    </div>
  </section>
  <section class="recommended-section">
    <div class="container">
      <h2 class="section-title">推薦房源</h2>
      <div class="row">
        <div class="col-md-4" v-for="(item, i) in recommendList" :key="'rec' + i">
          <PropertyCard :propertyId="item.propertyId" :image="item.image" :rentPrice="item.rentPrice" :propertyType="item.propertyType"
            :title="item.title" :city="item.city" :district="item.district" :address="item.address"
            :roomCount="item.roomCount" :bathroomCount="item.bathroomCount" @open-login="handleOpenLogin">
            <template #badge v-if="item.badgeType">
                            <BadgeList :type="item.badgeType" />
                        </template>
          </PropertyCard>
        </div>
      </div>
    </div>
  </section>
  <section class="new-listings-section">
    <div class="container">
      <h2 class="section-title">最新上架</h2>
      <div class="row">
        <div class="col-md-4" v-for="(item, i) in newList" :key="'new' + i">
          <PropertyCard :propertyId="item.propertyId" :image="item.image" :rentPrice="item.rentPrice" :propertyType="item.propertyType"
            :title="item.title" :city="item.city" :district="item.district" :address="item.address"
            :roomCount="item.roomCount" :bathroomCount="item.bathroomCount" @open-login="handleOpenLogin">
            <!-- <template #badge v-if="item.badgeType">
                            <BadgeList :type="item.badgeType" />
                        </template> -->
                        <template #badge>
              <BadgeList type="New" />
            </template>
          </PropertyCard>
        </div>
      </div>
    </div>
  </section>
  <section class="announcement-section">
    <NewsAnnouncement />
  </section>
  <section class="how-it-works-section">
    <div class="container">
      <h2 class="section-title">使用步驟</h2>
      <div class="row text-center">
        <div class="col-md-4 animate__animated animate__fadeInUp animate__delay-1s">
          <StepItem>
            <template #icon><i class="fa-solid fa-magnifying-glass my-icon"></i></template>
            <template #title>搜尋適合的房源</template>
            <template #desc>依照需求篩選，快速找到心儀房源</template>
          </StepItem>
        </div>
        <div class="col-md-4 animate__animated animate__fadeInUp animate__delay-2s">
          <StepItem>
            <template #icon><i class="fa-solid fa-comments my-icon"></i></template>
            <template #title>與房東聯繫</template>
            <template #desc>線上即時溝通，安排看房時間</template>
          </StepItem>
        </div>
        <div class="col-md-4 animate__animated animate__fadeInUp animate__delay-3s">
          <StepItem>
            <template #icon><i class="fa-solid fa-house my-icon"></i></template>
            <template #title>完成租賃</template>
            <template #desc>簽約完成，入住新家</template>
          </StepItem>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
import Carousel from '@/components/Carousel.vue';
import SearchBar from '@/components/forms/SearchBar.vue';
import PropertyCard from '@/components/cards/PropertyCard.vue';
import StepItem from '@/components/StepItem.vue';
import BadgeList from '@/components/BadgeList.vue';
import NewsAnnouncement from '@/components/common/NewsAnnouncement.vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const recommendList = ref([]);
const newList = ref([]);

const emit = defineEmits(['open-login']);

function handleOpenLogin() {
  emit('open-login');
}

onMounted(async () => {
  try {
    // 獲取推薦房源
    const recommendRes = await axios.get(`${API_BASE_URL}/api/PropertySearch/featuredProperties`);
    recommendList.value = recommendRes.data;

    // 獲取最新上架房源
    const newRes = await axios.get(`${API_BASE_URL}/api/PropertySearch/propertyList`);
    newList.value = newRes.data.slice(0, 3); // 只取前3筆作為最新上架
  } catch (error) {
    console.error('載入房源資料失敗:', error);
  }
});
</script>
<style scoped>
.recommended-section,
.new-listings-section,
.announcement-section,
.how-it-works-section {
  margin-bottom: 100px;
}

.hero-section {
  padding: 180px 0 100px;
  background: linear-gradient(to bottom, var(--bg-light) 0%, white 100%);
  position: relative;
  margin-bottom: 60px;
}

.hero-section h1,
.hero-section .hero-text {
  color: var(--text-main);
}

.hero-section h1 {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
}

.hero-section .static-text {
  color: var(--text-main);
  display: inline-block;
}

.hero-section .typing-text {
  color: var(--main-color);
  overflow: hidden;
  display: inline-block;
  position: relative;
  margin-left: 10px;
  white-space: nowrap;
  border-right: 2px solid var(--main-color);
  animation: typing-loop 4s steps(4, end) infinite, blink-caret 0.75s step-end infinite;
  letter-spacing: +0.1em;
}

@keyframes typing-loop {

  0%,
  100% {
    width: 0;
  }

  50%,
  90% {
    width: 4.5em;
  }
}

@keyframes blink-caret {

  0%,
  100% {
    border-color: var(--main-color);
  }

  50% {
    border-color: transparent;
  }
}

.hero-section .hero-text {
  font-size: 1.4rem;
}

.announcement-section {
  background: #f8f9fa;
  padding: 32px 0 24px 0;
}

.announcement-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.announcement-list li {
  padding: 8px 0;
  font-size: 1.1rem;
  border-bottom: 1px solid #e0e0e0;
}

.announcement-list .date {
  color: var(--main-color);
  font-weight: bold;
  margin-right: 8px;
}

.section-title {
  margin-bottom: 32px;
}

.my-icon {
  color: #fff;
  font-size: 28px;
}
</style>