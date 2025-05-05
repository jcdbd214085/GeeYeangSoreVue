<template>
    <div class="main-content">
      <div class="welcome-center">
        <img src="/image/logo2.png" alt="Logo" class="logo" />
        <h1 class="welcome-title">歡迎回來！</h1>
        <p class="welcome-subtitle">這是你的專屬個人頁面。</p>
        <p class="welcome-description">在這裡你可以查看個人資料、收藏的房源、聊天紀錄等資訊。</p>
      </div>
    </div>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  .main-content {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .welcome-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    animation: fadeInUp 0.8s ease-out forwards;
    opacity: 0;
    transform: translateY(30px);
  }
  
  .logo {
    width: 250px;
    height: auto;
    margin-bottom: 8px;
    animation: fadeInUp 0.6s ease-out forwards;
    animation-delay: 0.2s;
    opacity: 0;
    transform: translateY(20px);
  }
  
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
  
  .welcome-subtitle {
    font-size: 24px;
    color: #3da19a;
    margin-bottom: 6px;
    animation: fadeInUp 0.6s ease-out forwards;
    animation-delay: 0.6s;
    opacity: 0;
    transform: translateY(20px);
  }
  
  .welcome-description {
    font-size: 18px;
    color: #3da19a;
    animation: fadeInUp 0.6s ease-out forwards;
    animation-delay: 0.8s;
    opacity: 0;
    transform: translateY(20px);
  }
  
  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>
  