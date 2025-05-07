<template>
    <!-- 頁面 HTML 結構 -->
    <div class="container">
        <h1>歡迎來到租屋平台</h1>
        <p>這是一個 Vue 3 的元件範本</p>
    </div>
</template>

<script setup>
// 引入 Composition API（已自動啟用）
// 可以在這裡定義 reactive、ref、method 等

import { ref, onMounted } from 'vue' // 引入必要功能

const message = ref('Hello Vue 3!') // 定義 reactive 變數

onMounted(() => {
    console.log('元件已掛載') // 元件掛載時的事件
})
</script>

<style scoped>
/* 元件專屬樣式（scoped 避免污染其他元件） */
.container {
    padding: 20px;
    background-color: #f9f9f9;
}
</style>