<template>
    <div class="profile-page">
      <!-- 引入的側邊選單 -->
      <SideMenu />
  
      <!-- 個人頁面內容 -->
      <div class="main-content">
        <h1>歡迎來到個人頁面</h1>
      </div>
    </div>
  </template>
  
  <script setup>
  // 引入 SideMenu 元件
  import SideMenu from '@/components/login/SideMenu.vue'
  </script>
  
  <style>
  /* 基本排版樣式 */
  .profile-page {
    display: flex;
  }
  
  /* 右側主內容 */
  .main-content {
    flex: 1;
    padding: 20px;
  }


  </style>
  