<template>
  <img
    :src="computedSrc"
    :alt="alt"
    :class="['avatar-img', customClass]"
    :style="avatarStyle"
    @error="onError"
  />
</template>

<script setup>
import { ref, computed } from 'vue'

// 讀取環境變數設定的後端 API 網址
const baseUrl = import.meta.env.VITE_API_BASE_URL

// 傳入的屬性
const props = defineProps({
  src: { type: String, default: '' }, // 純檔案名稱，如 "abc.jpg"
  alt: { type: String, default: '頭像' },
  size: { type: [String, Number], default: 40 },
  customClass: { type: String, default: '' },
})

// 失敗時 fallback 的預設頭像（來自後端公開目錄）
const defaultAvatar = `${baseUrl}/images/User/default.png`
const errorFlag = ref(false)

// 動態計算圖片來源
const computedSrc = computed(() => {
  if (errorFlag.value || !props.src) {
    return defaultAvatar
  }
  return `${baseUrl}/images/User/${props.src}`
})

// 樣式處理
const avatarStyle = computed(() => ({
  width: typeof props.size === 'number' ? props.size + 'px' : props.size,
  height: typeof props.size === 'number' ? props.size + 'px' : props.size,
  borderRadius: '50%',
  objectFit: 'cover',
}))

// 若圖片載入失敗，自動改為預設頭像
function onError() {
  errorFlag.value = true
}
</script>

<style scoped>
.avatar-img {
  display: inline-block;
  border-radius: 50%;
  object-fit: cover;
  background: #f4f5f7;
}
</style>
