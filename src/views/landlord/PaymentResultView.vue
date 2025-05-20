<template>
  <div class="payment-result-container">
    <h2>付款結果</h2>
    <div v-if="loading">載入中...</div>
    <div v-else>
      <p>訂單編號：<strong>{{ orderId }}</strong></p>
      <p v-if="status === 'Success'" class="success-text">✅ 付款成功！</p>
      <p v-else class="fail-text">❌ 付款失敗或尚未完成。</p>
    </div>
    <router-link to="/">返回首頁</router-link>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const orderId = route.params.orderId;

const status = ref(null); // 'Success' 或 'Failed'
const loading = ref(true);

onMounted(async () => {
  try {
    // 呼叫後端 API 查詢交易狀態（這段要你後端支援查詢）
    const res = await axios.get(`/api/ecpay/query-status/${orderId}`);
    status.value = res.data?.success ? 'Success' : 'Failed';
  } catch (e) {
    status.value = 'Failed';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.payment-result-container {
  padding: 2rem;
  text-align: center;
}
.success-text {
  color: green;
  font-weight: bold;
}
.fail-text {
  color: red;
  font-weight: bold;
}
</style>