<template>
  <div class="profile-page">
    <!-- 側邊選單：傳入切換函式與目前選單 -->
    <userSideMenu @change-view="changeMainView" :activeItem="currentView" />
    
    <!-- 主內容區：根據目前選擇元件顯示 -->
    <component :is="currentComponent" class="main-content" />

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 匯入元件
import userSideMenu from '@/components/userhome/user_sidemenu.vue'
import userCenter from '@/views/UserHome/usercenter.vue'
import ChatView from '@/views/chat/ChatView.vue'

// 建立目前頁面名稱（預設是 userCenter）
const currentView = ref('userCenter')

// 建立元件對應表（字串對應元件實體）
const componentMap = {
  userCenter,
  chat: ChatView
}

// 根據目前頁面名稱動態取得元件
const currentComponent = computed(() => componentMap[currentView.value])

// 切換主內容方法（由側邊欄 emit）
function changeMainView(viewName) {
  currentView.value = viewName
}
</script>

<style scoped>
.profile-page {
  display: flex;
  min-height: 100vh;
  background-color: #f0f9f8;
  padding-top: 17px;  /* 設定與上方導覽列相同的高度 */
  box-sizing: border-box;  /* 確保 padding 不會增加元素總高度 */
}

.main-content {
  flex: 1;                      /* 佔滿除側邊欄外所有空間 */
  display: flex;                /* 若有內部要置中也方便 */
  flex-direction: column;       /* 保持直向排版 */
  padding: 24px;                /* 可視需要添加內距 */
  overflow-y: auto;             /* 內容超出時可滾動 */
}

</style>
