<template>
  <div class="profile-page">
    <!-- 側邊選單 -->
    <userSideMenu />
    <userCenter />
  </div>
</template>

<script setup>
// 引入側邊欄元件
import userSideMenu from '@/components/userhome/user_sidemenu.vue'
import userCenter from '@/components/userhome/usercenter.vue'
</script>

<style scoped>
/* 頁面整體排版 */
.profile-page {
  display: flex;
  min-height: 100vh;               /* 頁面撐滿畫面高度 */
  background-color: #f0f9f8;       /* 企業背景色 */
}

/* 主內容區塊（右邊） */
.main-content {
  flex: 1;
  display: flex;
  justify-content: center;         /* 水平置中 */
  align-items: center;             /* 垂直置中 */
}

/* 中央歡迎區塊 */
.welcome-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
}

/* LOGO 漸入動畫 */
.logo {
  width: 250px;
  height: auto;
  margin-bottom: 8px;

  animation: fadeInUp 0.6s ease-out forwards;
  animation-delay: 0.2s;
  opacity: 0;
  transform: translateY(20px);
}

/* 主標題動畫 */
.welcome-title {
  font-size: 28px;
  color: #3da19a;
  font-weight: bold;
  margin-bottom: 8px;

  animation: fadeInUp 0.6s ease-out forwards;
  animation-delay: 0.4s;
  opacity: 0;
  transform: translateY(20px);
}

/* 副標題動畫 */
.welcome-subtitle {
  font-size: 24px;
  color: #3da19a;
  margin-bottom: 6px;

  animation: fadeInUp 0.6s ease-out forwards;
  animation-delay: 0.6s;
  opacity: 0;
  transform: translateY(20px);
}

/* 說明文字動畫 */
.welcome-description {
  font-size: 18px;
  color: #3da19a;

  animation: fadeInUp 0.6s ease-out forwards;
  animation-delay: 0.8s;
  opacity: 0;
  transform: translateY(20px);
}

/* 動畫定義 */
@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>
