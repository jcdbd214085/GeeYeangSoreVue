<template>
  <button
      :type="type"
      :class="['custom-btn', colorClass, { 'icon-only': iconOnly }]"
      @click="$emit('click', $event)"
      v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'button'
  },
  color: {
    type: String,
    default: 'primary'
  },
  iconOnly: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['click']);
const colorClass = props.color === 'outline-secondary' ? 'custom-btn-outline-secondary' : 'custom-btn-primary';
</script>

<style scoped>
.custom-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border-radius: 8px;
  padding: 0.5em 1.5em;
  font-size: 1rem;
  transition: background 0.2s, color 0.2s;
  cursor: pointer;
  border: none;

  /* 允許換行，避免文字超出 */
  white-space: normal;
  word-break: break-word;
  max-width: 100%;

  line-height: 1.2;
  box-sizing: border-box;
  min-height: 50px;
  /* 限制最大寬度，避免撐破父容器 */
  max-width: 300px;
}

.custom-btn-primary {
  background-color: var(--main-color);
  color: #fff;
  border: none;
}
.custom-btn-primary:hover {
  background-color: var(--main-hover);
}
.custom-btn-outline-secondary {
  background: #fff;
  color: #666;
  border: 1.5px solid #bbb;
}
.custom-btn-outline-secondary:hover {
  background: #f7f7f7;
  color: var(--main-color);
  border-color: var(--main-color);
}
.icon-only {
  padding: 0;
  width: 2.2rem;
  height: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 1.2rem;
  white-space: nowrap; /* icon-only 通常不需要換行 */
}
</style>
