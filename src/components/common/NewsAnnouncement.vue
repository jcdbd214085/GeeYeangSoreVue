<template>
  <div class="announcement-section">
    <div class="container">
      <h2 class="section-title">最新公告</h2>
      <div class="announcement-carousel">
        <div class="announcement-list" ref="announcementList">
          <div v-for="(item, index) in visibleNews" :key="index" 
               class="announcement-item" 
               @click="navigateToNotice"
               role="button"
               tabindex="0"
               @keyup.enter="navigateToNotice">
            <span class="date">{{ formatDate(item.hCreatedAt) }}</span>
            <span class="content">{{ item.hTitle }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const news = ref([]);
const currentIndex = ref(0);
let scrollInterval = null;

const navigateToNotice = () => {
  router.push('/notice');
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  
  // 處理 DateTime 格式
  const date = new Date(dateString);
  
  // 檢查日期是否有效
  if (isNaN(date.getTime())) {
    console.error('無效的日期格式:', dateString);
    return '';
  }

  // 使用台灣地區的日期格式
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '/');
};

const visibleNews = computed(() => {
  if (news.value.length === 0) return [];
  
  const result = [];
  for (let i = 0; i < 3; i++) {
    const index = (currentIndex.value + i) % news.value.length;
    result.push(news.value[index]);
  }
  return result;
});

const fetchNews = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/Notice/news`);
    news.value = response.data.response;
  } catch (error) {
    console.error('載入公告失敗:', error);
  }
};

const startScroll = () => {
  if (news.value.length <= 3) return;
  
  scrollInterval = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % news.value.length;
  }, 3000);
};

onMounted(async () => {
  await fetchNews();
  startScroll();
});

onUnmounted(() => {
  if (scrollInterval) {
    clearInterval(scrollInterval);
  }
});
</script>

<style scoped>
.announcement-section {
  background: #f8f9fa;
  padding: 32px 0 24px 0;
  margin-bottom: 100px;
}

.announcement-carousel {
  position: relative;
}

.announcement-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.announcement-item {
  padding: 8px 0;
  font-size: 1.1rem;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  transition: all 0.5s ease-in-out;
  cursor: pointer;
}

.announcement-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.announcement-item:focus {
  outline: 2px solid var(--main-color);
  outline-offset: -2px;
}

.announcement-item:last-child {
  border-bottom: none;
}

.announcement-item .date {
  color: var(--main-color);
  font-weight: bold;
  margin-right: 8px;
  min-width: 100px;
}

.announcement-item .content {
  flex: 1;
}

.section-title {
  margin-bottom: 32px;
}
</style> 