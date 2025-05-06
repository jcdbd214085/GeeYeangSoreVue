<!--<template>-->
<!--  <div class="home-page">-->
<!--    <section class="service-process">-->
<!--      <div class="container">-->
<!--        <h2 class="section-title">我們的服務流程</h2>-->
<!--        <div class="steps-container">-->
<!--          <StepItem-->
<!--              number="1"-->
<!--              title="需求分析"-->
<!--              description="我們與您討論並深入了解您的業務需求和目標，確保我們能夠提供最合適的解決方案。"-->
<!--              :isActive="currentStep === 1"-->
<!--              :isCompleted="currentStep > 1">-->
<!--            <button v-if="currentStep === 1" class="learn-more-btn">了解更多</button>-->
<!--          </StepItem>-->

<!--          <StepItem-->
<!--              number="2"-->
<!--              title="方案設計"-->
<!--              description="根據需求分析，我們的專業團隊將為您量身定制最佳解決方案，包括功能規劃和界面設計。"-->
<!--              :isActive="currentStep === 2"-->
<!--              :isCompleted="currentStep > 2">-->
<!--            <button v-if="currentStep === 2" class="learn-more-btn">了解更多</button>-->
<!--          </StepItem>-->

<!--          <StepItem-->
<!--              number="3"-->
<!--              title="開發實施"-->
<!--              description="我們的技術團隊將高效、高質量地完成開發工作，並進行嚴格的測試，確保產品的穩定性和安全性。"-->
<!--              :isActive="currentStep === 3"-->
<!--              :isCompleted="currentStep > 3">-->
<!--            <button v-if="currentStep === 3" class="learn-more-btn">了解更多</button>-->
<!--          </StepItem-->>-->

<!--          <StepItem-->
<!--              number="4"-->
<!--              title="交付上線"-->
<!--              description="完成所有測試後，我們將協助您順利部署上線，並提供完整的技術文檔和使用培訓。"-->
<!--              :isActive="currentStep === 4"-->
<!--              :isCompleted="currentStep > 4">-->
<!--            <button v-if="currentStep === 4" class="learn-more-btn">了解更多</button>-->
<!--          </StepItem>-->

<!--          <StepItem-->
<!--              number="5"-->
<!--              title="持續支持"-->
<!--              description="我們提供持續的技術支持和維護服務，確保您的系統持續高效運行，並根據業務發展進行必要的更新升級。"-->
<!--              :isActive="currentStep === 5"-->
<!--              :isCompleted="currentStep > 5">-->
<!--            <button v-if="currentStep === 5" class="learn-more-btn">了解更多</button>-->
<!--          </StepItem>-->
<!--        </div>-->
<!--      </div>-->
<!--    </section>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import StepItem from '@/components/StepItem.vue'-->

<!--export default {-->
<!--  name: 'HomePage',-->
<!--  components: {-->
<!--    StepItem-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      currentStep: 2 // 假設當前位於第2步-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->
<!--.home-page {-->
<!--  padding: 60px 0;-->
<!--}-->

<!--.container {-->
<!--  max-width: 1200px;-->
<!--  margin: 0 auto;-->
<!--  padding: 0 15px;-->
<!--}-->

<!--.section-title {-->
<!--  text-align: center;-->
<!--  margin-bottom: 40px;-->
<!--  font-size: 2rem;-->
<!--  color: #333;-->
<!--}-->

<!--.steps-container {-->
<!--  max-width: 800px;-->
<!--  margin: 0 auto;-->
<!--}-->

<!--.learn-more-btn {-->
<!--  display: inline-block;-->
<!--  margin-top: 12px;-->
<!--  padding: 8px 16px;-->
<!--  background-color: #4a90e2;-->
<!--  color: white;-->
<!--  border: none;-->
<!--  border-radius: 4px;-->
<!--  cursor: pointer;-->
<!--  font-size: 14px;-->
<!--  transition: background-color 0.3s;-->
<!--}-->

<!--.learn-more-btn:hover {-->
<!--  background-color: #3579c6;-->
<!--}-->
<!--</style>-->