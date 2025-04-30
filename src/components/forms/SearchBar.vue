<template>
  <!-- 搜尋條元件 -->
  <div class="search-bar">
    <form class="search-form" @submit.prevent="onSearch">
      <select class="form-select city-select" v-model="city">
        <option value="">選擇地區</option>
        <option>台北市</option>
        <option>新北市</option>
        <option>桃園市</option>
        <option>台中市</option>
        <option>台南市</option>
        <option>高雄市</option>
      </select>
      <input type="text" class="form-input" v-model="keyword" placeholder="請輸入關鍵字（社區名，街道名，捷運名稱等）" />
      <Button type="submit" color="primary" class="search-btn">
        <i class="fa-solid fa-magnifying-glass"></i> 搜尋
      </Button>
    </form>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import Button from '@/components/buttons/button.vue';
const city = ref('');
const keyword = ref('');
function onSearch() {
  // 這裡可以加上 emit 或 API 請求
  console.log('搜尋', city.value, keyword.value);
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