<template>
  <div class="badge-list" :class="badgeClass">
    <i :class="iconClass" class="me-1"></i>
    {{ type }}
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  type: {
    type: String,
    default: '推薦'
  }
})

const badgeClass = computed(() => ({
  'badge-recommend': props.type === '推薦',
  'badge-featured': props.type === '精選',
  'badge-new': props.type === 'New'
}))

const iconClass = props.type === '推薦'
  ? 'fa-solid fa-star'
  : props.type === '精選'
    ? 'fa-solid fa-fire'
    : 'fa-solid fa-tag'
</script>

<style scoped>
.badge-list {
  position: absolute;
  top: 1px;
  left: 1px;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  font-size: 1rem;
  font-weight: bold;
  padding: 8px 12px;
  border-radius: 999px;
  color: #fff;
  z-index: 10;
  backdrop-filter: blur(2px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  line-height: 1;
  overflow: hidden
}

/* .badge-list::before {
  content: '';
  position: absolute;
  top: 0;
  left: -75%;
  width: 50%;
  height: 100%;
  background: linear-gradient(120deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.6) 50%,
      rgba(255, 255, 255, 0) 100%);
  transform: skewX(-20deg);
  animation: shimmer 4s infinite;
  z-index: 1;
  pointer-events: none;
}

@keyframes shimmer {
  0% {
    left: -75%;
  }

  100% {
    left: 125%;
  }
} */

.badge-list i {
  display: inline-block;
  width: 1.2em;
  text-align: center;
  margin-right: 6px;
}



.badge-recommend {
  background-color: #ff9800;
}

.badge-featured {
  background-color: #ff3d3d;
}

.badge-new {
  background-color: #24B4A8;
  /* background-color: #3f51b5; */
}
</style>
