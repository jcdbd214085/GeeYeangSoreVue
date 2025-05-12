<template>
  <div class="step-item" v-bind="$attrs">
    <div class="step-icon-wrapper">
      <div class="step-icon">
        <slot name="icon" />
      </div>
    </div>
    <h4 class="step-title">
      <slot name="title" />
    </h4>
    <p class="step-desc">
      <slot name="desc" />
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
const isHovered = ref(false);
</script>

<style scoped>
.step-item {
  text-align: center;
  padding: 1rem;
  transition: transform 0.3s, box-shadow 0.3s, z-index 0s;
  position: relative;
  z-index: 1;
}
.step-item:hover {
  transform: translateY(-10px) scale(1.04);
  box-shadow: 0 8px 32px rgba(60, 221, 210, 0.12);
  z-index: 10;
}
.step-icon-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
}
.step-icon {
  position: absolute;
  top: 0;
  left: 0;
  width: 80px;
  height: 80px;
  background-color: #3cddd2;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.step-icon i {
  font-size: 24px;
  color: #fff;
}
</style>
