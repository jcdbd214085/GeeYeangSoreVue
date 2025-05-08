<script setup>

import Footer from "@/components/common/Footer.vue";
import Step from "@/components/step/Step.vue";

const steps = ["第一格", "第二格", "第三格"]
</script>

<template>

  <div class="main-content">
  </div>

  <Step :steps="steps" :activeStep="1">
    <template #default="{ step, index }">
      <div>
        <div><strong>第 {{ index + 1 }} 步</strong></div>
        <div style="font-size: 12px;">{{ step }}</div>
      </div>
    </template>
  </Step>

  <Footer>
  </Footer>

</template>


<style scoped>
.main-content {
  padding-top: 80px; /* 根據 Navbar 實際高度調整 */
}
</style>
