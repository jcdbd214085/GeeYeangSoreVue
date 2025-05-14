


<template>
  <div class="announcement-container">
    <!-- 標題列 -->
    <div class="announcement-header title-bar">
      <h1>📢 公告列表</h1>
      <div class="header-controls">
        <!-- 可以放搜尋、篩選、按鈕等 -->
      </div>
    </div>

    <!-- 標題欄 -->
    <div class="announcement-header table-header">
      <div>標題</div>
      <div>內容</div>
      <div>建立時間</div>
      <div>更新時間</div>
    </div>

    <!-- 公告列表 -->
    <div class="announcement-list">
      <div
          class="announcement-row"
          v-for="(item, index) in announcements"
          :key="index"
      >
        <div>{{ item.hTitle }}</div>
        <div>{{ item.hContent }}</div>
        <div>{{ item.hCreatedAt }}</div>
        <div>{{ item.hUpdatedAt }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {ref, computed, onMounted} from 'vue';
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// 模擬公告資料
const announcements = ref([]);


// 分頁相關
const itemsPerPage = 10;
const currentPage = ref(1);
const totalAnnouncements = computed(() => announcements.value.length);
const totalPages = computed(() => Math.ceil(totalAnnouncements.value / itemsPerPage));

// 計算需要顯示哪些頁碼
const displayedPages = computed(() => {
  const pages = [];
  const maxDisplayedPages = 5;
  let startPage = Math.max(1, currentPage.value - Math.floor(maxDisplayedPages / 2));
  let endPage = Math.min(totalPages.value, startPage + maxDisplayedPages - 1);

  if (endPage - startPage + 1 < maxDisplayedPages) {
    startPage = Math.max(1, endPage - maxDisplayedPages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});

// 搜尋與篩選
const searchKeyword = ref('');
let filteredAnnouncements = ref([...announcements.value]);
const selectedAnnouncement = ref(null);


// 檢查公告是否為新發布（7天內）
const isNew = (announcement) => {
  const publishDate = new Date(announcement.publishDate);
  const currentDate = new Date();
  const diffTime = currentDate - publishDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
};

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

async function fetchData() {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/Notice/news`);
    const newsList = res.data.response
    console.log(newsList)  // 確認 API 返回的資料格式
    announcements.value = newsList
  } catch (error) {
    console.error('取得資料失敗', error)
  }
}

// 初始化
onMounted(() => {


  console.log('元件渲染完成！可以開始抓資料或設定變數')
  fetchData()


  // 默認選中第一條公告
  if (announcements.value.length > 0) {
    selectedAnnouncement.value = announcements.value[0];
  }
})

</script>

<style scoped>
.announcement-container {
  padding: 20px;
  font-family: "Segoe UI", sans-serif;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.title-bar {
  background-color: #3c6df0;
  color: white;
  padding: 15px 20px;
  border-radius: 6px 6px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-bar h1 {
  margin: 0;
  font-size: 24px;
}

.table-header {
  background-color: #e0e7ff;
  color: #333;
  padding: 10px 15px;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr;
  font-weight: bold;
  border-bottom: 1px solid #ccc;
}

.announcement-list {
  display: flex;
  flex-direction: column;
}

.announcement-row {
  background-color: white;
  padding: 10px 15px;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.announcement-row:hover {
  background-color: #f0f4ff;
}

.announcement-row div {
  word-break: break-word;
}
</style>