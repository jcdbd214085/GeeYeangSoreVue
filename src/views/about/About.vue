<script setup>

import axios from "axios";
import { onMounted, ref } from "vue";

const receiveData = ref([]);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
async function fetchData() {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/About/about`);
    const newsList = res.data.response;
    console.log(newsList); // 確認 API 返回的資料格式
    receiveData.value = newsList;
  } catch (error) {
    console.error("取得資料失敗", error);
  }
}

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="container">
    <div v-if="receiveData.length > 0" class="news-list">
      <div v-for="item in receiveData" :key="item.hAboutId" class="news-item">
        <h2 class="news-title">{{ item.hTitle }}</h2>
        <p class="news-content">{{ item.hContent }}</p>
        <div class="news-meta">
          <span class="created-at">Created at: {{ new Date(item.hCreatedAt).toLocaleString() }}</span>
          <span class="updated-at">Updated at: {{ new Date(item.hUpdatedAt).toLocaleString() }}</span>
        </div>
      </div>
    </div>
    <div v-else class="loading">
      <p>Loading data...</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f7f7f7;
}

.news-list {
  width: 100%;
  max-width: 800px;
}

.news-item {
  background-color: #fff;
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.news-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.news-content {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
}

.news-meta {
  font-size: 14px;
  color: #999;
}

.news-meta span {
  display: block;
  margin-bottom: 5px;
}

.loading {
  font-size: 18px;
  color: #666;
}
</style>
