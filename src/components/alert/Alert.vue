<template>
  <div v-if="show" class="alert-overlay" @click="onOverlayClick">
    <div class="alert-container" :class="type" @click.stop>
      <div class="alert-header">
        <h3 class="alert-title">{{ title }}</h3>
        <button class="close-btn" @click="onClose">✖</button>
      </div>
      <div class="alert-body">
        <slot>{{ message }}</slot>
      </div>
      <div class="alert-footer">
        <slot name="footer">
          <button class="btn-cancel" @click="onCancel">{{ cancelText }}</button>
          <button class="btn-confirm" @click="onConfirm">{{ confirmText }}</button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '提示'
  },
  message: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'success', 'warning', 'error'].includes(value)
  },
  confirmText: {
    type: String,
    default: '確認'
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  closeOnClickOverlay: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:show', 'confirm', 'cancel', 'close']);

function onClose() {
  emit('update:show', false);
  emit('close');
}

function onConfirm() {
  emit('confirm');
  onClose();
}

function onCancel() {
  emit('cancel');
  onClose();
}

function onOverlayClick() {
  if (props.closeOnClickOverlay) {
    onClose();
  }
}
</script>

<style scoped>
.alert-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
}

.alert-container {
  background: #fff;
  border-radius: 1rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.18);
  animation: alertFadeIn 0.3s ease;
}

.alert-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
}

.alert-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #888;
  cursor: pointer;
  padding: 0.2rem;
  line-height: 1;
}

.alert-body {
  padding: 1.5rem;
  color: #666;
  font-size: 1rem;
  line-height: 1.5;
}

.alert-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-cancel,
.btn-confirm {
  padding: 0.6rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
  border: 1px solid #ddd;
}

.btn-cancel:hover {
  background: #eee;
}

.btn-confirm {
  background: var(--main-color);
  color: #fff;
  border: none;
}

.btn-confirm:hover {
  background: var(--main-hover);
}

/* 不同類型的樣式 */
.alert-container.info {
  border-top: 4px solid #3cddd2;
}

.alert-container.success {
  border-top: 4px solid #4caf50;
}

.alert-container.warning {
  border-top: 4px solid #ff9800;
}

.alert-container.error {
  border-top: 4px solid #f44336;
}

@keyframes alertFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
