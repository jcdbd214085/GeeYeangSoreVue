<!-- src/components/alert/NotificationList.vue -->
<template>
  <div class="notification-dropdown">
    <div class="dropdown-header">系統通知</div>
    <ul class="dropdown-list">
      <li v-for="(item, index) in notifications" :key="index" class="dropdown-item">
        <p class="message">{{ item.message }}</p>
        <span class="time">{{ item.time }}</span>
      </li>
    </ul>
    <div class="dropdown-footer">
      <Button>查看全部通知</Button>
    </div>
  </div>
</template>

<script setup>
import Button from "@/components/buttons/button.vue";

const props = defineProps({
  notifications: {
    type: Array,
    default: () => []
  }
});
</script>

<style scoped>
.notification-dropdown {
  position: absolute;
  right: 0;
  top: 120%; /* 讓它貼在 bell 下方 */
  background: white;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  width: 320px;
  z-index: 999;
}

.dropdown-header {
  font-weight: bold;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.dropdown-list {
  max-height: 300px;
  overflow-y: auto;
  padding: 0;
  margin: 0;
  list-style: none;
}

.dropdown-item {
  padding: 0.8rem 1rem;
  border-bottom: 1px solid #f5f5f5;
}

.message {
  margin: 0;
  color: #333;
}

.time {
  font-size: 0.85rem;
  color: #888;
}

.dropdown-footer {
  padding: 0.8rem 1rem;
  text-align: right;
  font-size: 0.9rem;
}
</style>
