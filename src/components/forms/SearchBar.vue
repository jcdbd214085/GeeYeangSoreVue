<template>
  <!-- 搜尋條元件 -->
  <div class="search-bar">
    <form class="search-form" @submit.prevent="onSearch">
      <select class="form-select city-select" v-model="city">
        <option value="">選擇地區</option>
<option>台北市</option>
<option>新北市</option>
<option>基隆市</option>
<option>桃園市</option>
<option>新竹市</option>
<option>新竹縣</option>
<option>苗栗縣</option>
<option>台中市</option>
<option>彰化縣</option>
<option>南投縣</option>
<option>雲林縣</option>
<option>嘉義市</option>
<option>嘉義縣</option>
<option>台南市</option>
<option>高雄市</option>
<option>屏東縣</option>
<option>宜蘭縣</option>
<option>花蓮縣</option>
<option>台東縣</option>
<option>澎湖縣</option>
<option>金門縣</option>
<option>連江縣</option>
      </select>
      <input type="text" class="form-input" v-model="keyword" placeholder="請輸入關鍵字（社區名，街道名，捷運名稱等）" />
      <Button type="submit" color="primary" class="search-btn">
        <i class="fa-solid fa-magnifying-glass"></i> 搜尋
      </Button>
    </form>
  </div>
</template>
<script setup>
import { ref, nextTick } from 'vue';
import Button from '@/components/buttons/button.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const city = ref('');
const keyword = ref('');

function onSearch() {
  // 跳轉到搜尋結果頁面，並帶上搜尋參數
  router.push({
    path: '/PropertySearch',
    query: {
      city: city.value,
      keyword: keyword.value
    }
  }).then(() => {
    // 等待路由跳轉完成後，定位到搜尋結果區域
    nextTick(() => {
      const section = document.getElementById('property-list-section')
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  })
}
</script>
<style scoped>
.search-bar {
  background: var(--bg-light);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 0.5rem 1rem;
  margin-bottom: 24px;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.search-form {
  display: flex;
  align-items: center;
  gap: 0;
}

.city-select {
  border: none;
  border-radius: 0;
  border-right: 1px solid #e0e0e0;
  font-size: 1rem;
  width: 120px;
  background: transparent;
  outline: none;
  box-shadow: none;
}

.form-input {
  flex: 1;
  border: none;
  font-size: 1rem;
  padding: 0.7em 1em;
  outline: none;
  background: transparent;
}

.search-btn {
  background: var(--main-hover);
  color: #fff;
  border: none;
  border-radius: 0 4px 4px 0;
  font-size: 1.1rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5em;
  cursor: pointer;
  transition: background 0.2s;
}

.search-btn:hover {
  background: var(--main-hover);
}
</style>