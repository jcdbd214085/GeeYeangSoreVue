<template>
  <Navbar />
  <section class="hero-section" style="padding-top:120px;">
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
          <PropertyCard :image="item.image" :title="item.title" :location="item.location" :tags="item.tags">
            <template #badge>
              <BadgeList>推薦</BadgeList>
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
          <PropertyCard :image="item.image" :title="item.title" :location="item.location" :tags="item.tags">
            <template #badge>
              <BadgeList>新增</BadgeList>
            </template>
          </PropertyCard>
        </div>
      </div>
    </div>
  </section>
  <section class="announcement-section">
    <div class="container">
      <h2 class="section-title">最新公告</h2>
      <ul class="announcement-list">
        <li><span class="date">2024/06/01</span>網站全新上線，歡迎體驗！</li>
        <li><span class="date">2024/06/02</span>新增多元搜尋條件，找房更方便！</li>
        <li><span class="date">2024/06/03</span>平台支援手機版瀏覽，行動找屋更輕鬆！</li>
      </ul>
    </div>
  </section>
  <section class="how-it-works-section">
    <div class="container">
      <h2 class="section-title">使用步驟</h2>
      <div class="row text-center">
        <div class="col-md-4 animate__animated animate__fadeInUp animate__delay-1s">
          <StepItem>
            <template #icon><i class="fa-solid fa-magnifying-glass"></i></template>
            <template #title>搜尋適合的房源</template>
            <template #desc>依照需求篩選，快速找到心儀房源</template>
          </StepItem>
        </div>
        <div class="col-md-4 animate__animated animate__fadeInUp animate__delay-2s">
          <StepItem>
            <template #icon><i class="fa-solid fa-comments"></i></template>
            <template #title>與房東聯繫</template>
            <template #desc>線上即時溝通，安排看房時間</template>
          </StepItem>
        </div>
        <div class="col-md-4 animate__animated animate__fadeInUp animate__delay-3s">
          <StepItem>
            <template #icon><i class="fa-solid fa-house"></i></template>
            <template #title>完成租賃</template>
            <template #desc>簽約完成，入住新家</template>
          </StepItem>
        </div>
      </div>
    </div>
  </section>
  <Footer />
</template>
<script setup>
import Navbar from '@/components/common/Navbar.vue';
import Footer from '@/components/common/Footer.vue';
import Carousel from '@/components/Carousel.vue';
import SearchBar from '@/components/forms/SearchBar.vue';
import PropertyCard from '@/components/cards/PropertyCard.vue';
import StepItem from '@/components/StepItem.vue';
import BadgeList from '@/components/BadgeList.vue';
import propertyImg from '@/assets/images/property/property.jpg';

const recommendList = [
  {
    image: propertyImg,
    title: 'NT$ 15,000 / 月',
    location: '台北市大安區',
    tags: ['近捷運', '新裝修', '可養寵物']
  },
  {
    image: propertyImg,
    title: 'NT$ 18,000 / 月',
    location: '高雄市前金區',
    tags: ['近101', '有管理室', '免仲介費']
  },
  {
    image: propertyImg,
    title: 'NT$ 12,000 / 月',
    location: '台中市西屯區',
    tags: ['近公園', '採光好', '家具齊全']
  }
];

const newList = [
  {
    image: propertyImg,
    title: 'NT$ 16,000 / 月',
    location: '台中市西屯區',
    tags: ['近公園', '採光好']
  },
  {
    image: propertyImg,
    title: 'NT$ 20,000 / 月',
    location: '高雄市楠梓區',
    tags: ['近捷運', '有車位']
  },
  {
    image: propertyImg,
    title: 'NT$ 14,000 / 月',
    location: '台北市萬華區',
    tags: ['近夜市', '新裝修']
  }
];
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
  0%, 100% { border-color: var(--main-color); }
  50% { border-color: transparent; }
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
</style>