<template>
  <span :class="['badge-dot', { 'is-dot': isDot }]" :style="badgeStyle">
    <slot v-if="!isDot">{{ content }}</slot>
  </span>
</template>

<script setup>
const props = defineProps({
  content: { type: [String, Number], default: '' },
  isDot: { type: Boolean, default: false },
  color: { type: String, default: '#ff9800' },
  size: { type: [String, Number], default: 18 }, // px
  top: { type: [String, Number], default: '-6px' },
  right: { type: [String, Number], default: '-6px' },
});
const badgeStyle = {
  background: props.color,
  color: '#fff',
  minWidth: props.isDot ? props.size + 'px' : 'auto',
  height: props.size + 'px',
  fontSize: props.isDot ? '0' : '0.85rem',
  borderRadius: '999px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  top: props.top,
  right: props.right,
  padding: props.isDot ? '0' : '0 6px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  zIndex: 10,
};
</script>

<style scoped>
.badge-dot {
  transition: all 0.2s;
  pointer-events: none;
  user-select: none;
}
.is-dot {
  width: 10px;
  height: 10px;
  min-width: 10px;
  padding: 0;
}
</style> 