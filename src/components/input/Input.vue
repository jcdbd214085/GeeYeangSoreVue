<template>
  <div class="input-wrapper" :class="{ 'has-error': error }">
    <label v-if="label" :for="id" class="input-label">{{ label }}</label>
    <div class="input-container">
      <i v-if="prefixIcon" :class="['input-icon', 'prefix-icon', prefixIcon]"></i>
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :class="['input-field', { 'has-prefix': prefixIcon, 'has-suffix': suffixIcon }]"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
      />
      <i v-if="suffixIcon" :class="['input-icon', 'suffix-icon', suffixIcon]"></i>
      <span v-if="maxlength" class="input-counter">{{ modelValue.length }}/{{ maxlength }}</span>
    </div>
    <span v-if="error" class="error-message">{{ error }}</span>
    <span v-if="hint" class="hint-message">{{ hint }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  maxlength: {
    type: Number,
    default: null
  },
  prefixIcon: {
    type: String,
    default: ''
  },
  suffixIcon: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'focus', 'blur']);

const id = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`);

function onInput(event) {
  emit('update:modelValue', event.target.value);
}

function onFocus(event) {
  emit('focus', event);
}

function onBlur(event) {
  emit('blur', event);
}
</script>

<style scoped>
.input-wrapper {
  margin-bottom: 1rem;
}

.input-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 0.9rem;
  font-weight: 500;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-field {
  width: 100%;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  background: #fff;
  transition: all 0.2s;
}

.input-field.has-prefix {
  padding-left: 2.5rem;
}

.input-field.has-suffix {
  padding-right: 2.5rem;
}

.input-field:focus {
  outline: none;
  border-color: var(--main-color);
  box-shadow: 0 0 0 3px rgba(60, 221, 210, 0.1);
}

.input-field::placeholder {
  color: #999;
}

.input-field:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.input-icon {
  position: absolute;
  color: #666;
  font-size: 1.1rem;
  z-index: 1;
  pointer-events: none;
}

.prefix-icon {
  left: 0.9rem;
  top: 50%;
  transform: translateY(-50%);
}

.suffix-icon {
  right: 0.9rem;
  top: 50%;
  transform: translateY(-50%);
}

.input-field:has(+ .prefix-icon) {
  padding-left: 3rem;
}

.input-field:has(+ .suffix-icon) {
  padding-right: 3rem;
}

.input-counter {
  position: absolute;
  right: 1rem;
  font-size: 0.8rem;
  color: #999;
}

.error-message {
  display: block;
  margin-top: 0.5rem;
  color: #f44336;
  font-size: 0.85rem;
}

.hint-message {
  display: block;
  margin-top: 0.5rem;
  color: #666;
  font-size: 0.85rem;
}

.has-error .input-field {
  border-color: #f44336;
}

.has-error .input-field:focus {
  box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
}
</style>
