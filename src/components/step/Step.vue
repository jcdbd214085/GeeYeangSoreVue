<template>
  <div class="step-flow">
    <div
        v-for="(step, index) in steps"
        :key="index"
        class="step-item"
    >
      <div class="step-box" :class="{ active: index === activeStep }">
        <!-- Slot: 傳 step 和 index 給父層 -->
        <slot :step="step" :index="index">
          {{ step }}
        </slot>
      </div>

      <!-- SVG Arrow -->
      <template v-if="index < steps.length - 1">
        <img
            class="arrow-icon"
            src="https://www.svgrepo.com/show/54203/right-arrow.svg"
            alt="arrow"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
defineProps({
  steps: Array,
  activeStep: Number
})
</script>

<style scoped>
.step-flow {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  font-family: sans-serif;
}

.step-item {
  display: flex;
  align-items: center;
}

.step-box {
  width: 140px;
  padding: 1rem;
  border-radius: 10px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  font-weight: bold;
  text-align: center;
  word-break: break-word;
  box-sizing: border-box;
}

.step-box.active {
  background-color: #4ecdc4;
  color: white;
  border-color: #4ecdc4;
}

.arrow-icon {
  width: 24px;
  height: 24px;
  margin: 0 0.5rem;
  opacity: 0.6;
}
</style>
