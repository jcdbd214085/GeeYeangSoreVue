<template>
  <!-- 標籤列表元件 -->
  <div class="badge-capsule">
    <slot>推薦</slot>
  </div>
</template>
<script setup>
//可支援 slot 傳入自訂內容，預設顯示「推薦」

</script>
<style scoped>
.badge-capsule {
  display: inline-block;
  padding: 0.4em 1.2em;
  background: #ff9800;
  color: #fff;
  border-radius: 999px;
  font-weight: bold;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(255, 152, 0, 0.18);
  letter-spacing: 2px;
  user-select: none;
  transition: box-shadow 0.2s;
}

.badge-capsule:hover {
  box-shadow: 0 4px 16px rgba(255, 152, 0, 0.28);
}
</style>