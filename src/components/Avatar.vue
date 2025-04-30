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
import { ref, computed } from 'vue';
const props = defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: '頭像' },
  size: { type: [String, Number], default: 40 }, // px
  customClass: { type: String, default: '' },
});
const defaultAvatar = new URL('@/assets/images/avatar/default.png', import.meta.url).href;
const errorFlag = ref(false);
const computedSrc = computed(() => (errorFlag.value || !props.src) ? defaultAvatar : props.src);
const avatarStyle = computed(() => ({
  width: typeof props.size === 'number' ? props.size + 'px' : props.size,
  height: typeof props.size === 'number' ? props.size + 'px' : props.size,
  borderRadius: '50%',
  objectFit: 'cover',
}));
function onError() {
  errorFlag.value = true;
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
