<template>
  <div class="plan-select-container">
    <h2>付款結果</h2>
    <div v-if="loading" class="loading-text">載入中...</div>
    <div v-else>
      <div class="result-card">
        <div class="result-row">
          <span class="label">訂單編號：</span>
          <span class="value">{{ orderInfo.orderId }}</span>
        </div>
        <div class="result-row">
          <span class="label">商品名稱：</span>
          <span class="value">{{ orderInfo.itemName }}</span>
        </div>
        <div class="result-row">
          <span class="label">金額：</span>
          <span class="value">{{ orderInfo.amount }} 元</span>
        </div>
        <div class="result-row">
          <span class="label">方案天數：</span>
          <span class="value">{{ orderInfo.days }} 天</span>
        </div>
        <div class="result-row">
          <span class="label">付款狀態：</span>
          <span class="value" :class="orderInfo.status === 'Success' ? 'success-text' : 'fail-text'">
            {{ orderInfo.status === 'Success' ? ' 付款成功' : ' 付款失敗或尚未完成' }}
          </span>
        </div>
        <div class="result-row">
          <span class="label">付款時間：</span>
          <span class="value">{{ orderInfo.paymentDate || '-' }}</span>
        </div>
      </div>
      <router-link to="/landlord/ad-manage" class="back-btn">返回刊登管理</router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const orderId = route.params.orderId;

const orderInfo = ref({
  orderId: orderId,
  itemName: '',
  amount: '',
  days: '',
  status: '',
  paymentDate: ''
});
const loading = ref(true);

onMounted(async () => {
  try {
    // 查詢交易狀態與詳細資訊
    const res = await axios.get(`/api/commerce/query-status/${orderId}`);
    const data = res.data;
    orderInfo.value = {
      orderId: orderId,
      itemName: data.itemName || '-',
      amount: data.amount || '-',
      days: data.days || '-',
      status: data.success ? 'Success' : 'Failed',
      paymentDate: data.paymentDate || '-'
    };
  } catch (e) {
    orderInfo.value.status = 'Failed';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.plan-select-container {
  max-width: 480px;
  margin: 40px auto 0 auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 6px 32px rgba(60, 221, 210, 0.08);
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  text-align: center;
}
.result-card {
  background: #fafbfc;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(60, 221, 210, 0.08);
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.result-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
}
.label {
  color: #888;
  font-weight: 600;
}
.value {
  font-weight: 700;
  color: #222;
}
.success-text {
  color: #1abc9c;
  font-weight: bold;
}
.fail-text {
  color: #e74c3c;
  font-weight: bold;
}
.loading-text {
  color: #888;
  font-size: 1.1rem;
  margin: 2rem 0;
}
.back-btn {
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0.7rem 2.2rem;
  background: var(--main-color, #1abc9c);
  color: #fff;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;
}
.back-btn:hover {
  background: #16a085;
}
</style>
