<script setup>
import axios from "axios";
import {onMounted, ref} from "vue";
//
// const Titles = ['常見問題標題1', '常見問題標題2', '常見問題標題3']
// const Context = ['常見問題內文1', '常見問題內文1', '常見問題內文1']


let Titles = ref([]);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
async function fetchData() {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/Guide/guide`)
    const newsList = res.data.response
    Titles.value=newsList;

    console.log(newsList)  // 確認 API 返回的資料格式

  } catch (error) {
    console.error('取得資料失敗', error)
  }
}
onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="container mt-4">
    <div
        v-for="(item, index) in Titles"
        :key="index"
        class="custom-card mb-3 shadow-sm bg-white rounded"
    >
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="mb-0">{{ item.hTitle }}</h5>
        <img
            class="toggle-icon"
            width="25"
            height="25"
            src="https://img.icons8.com/ios/50/down-squared--v1.png"
            alt="toggle"
            role="button"
            :data-bs-toggle="'collapse'"
            :data-bs-target="'#collapse-' + index"
            :aria-controls="'collapse-' + index"
            aria-expanded="false"
        />
      </div>

      <transition name="slide">
        <div :id="'collapse-' + index" class="collapse mt-2">
          <div class="card card-body border-0 bg-light">
            {{ Titles[index].hContent }} {/*//為何這裡加上.hContent 畫面就會空白 }}
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
/* ... 其他樣式 ... */

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
  height: auto; /* 確保內容高度正確 */
}

.slide-enter-from,
.slide-leave-to {
  height: 0;
  opacity: 0;
}
</style>

<style scoped>
.container {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f8f9fa; /* 淡灰色背景 */
  border-radius: 8px;
}

.custom-card {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.custom-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
}

.d-flex {
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

h5 {
  color: #333;
  font-weight: 600;
}

.toggle-icon {
  cursor: pointer;
  width: 30px;
  height: 30px;
  opacity: 0.7;
  transition: transform 0.2s ease-in-out;
}

.toggle-icon:hover {
  transform: rotate(180deg) scale(1.1);
  opacity: 1;
}

.collapse-inner {
  padding: 1rem;
  background-color: #f0f8ff; /* 淡藍色背景 */
  border-radius: 0 0 6px 6px;
  color: #555;
}
</style>