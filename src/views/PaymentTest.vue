<template>
  <div>
    <h2>金流 API 測試</h2>
    <form @submit.prevent="submit">
      <label>商品名稱(ItemName)：<input v-model="form.ItemName" /></label><br />
      <label>金額(TotalAmount)：<input v-model.number="form.TotalAmount" type="number" /></label><br />
      <label>廣告ID(AdId)：<input v-model.number="form.AdId" type="number" /></label><br />
      <label>物件ID(PropertyId)：<input v-model.number="form.PropertyId" type="number" /></label><br />
      <button type="submit">送出測試</button>
    </form>
    <div v-if="ecpayHtml" v-html="ecpayHtml"></div>
    <pre v-else>{{ result }}</pre>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';

const form = ref({
  ItemName: '測試商品',
  TotalAmount: 100,
  AdId: 1,
  PropertyId: 101 // <-- 你可以輸入任何現有的 HPropertyId
});

const result = ref('');
const ecpayHtml = ref('');

async function submit() {
  try {
    const res = await fetch('/api/commerce/ecpay-html', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    });
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      ecpayHtml.value = await res.text();
      result.value = '';
    } else {
      result.value = await res.text();
      ecpayHtml.value = '';
    }
  } catch (e) {
    result.value = '發生錯誤：' + e;
    ecpayHtml.value = '';
  }
}

// 自動送出表單
watch(ecpayHtml, async (val) => {
  if (val) {
    await nextTick();
    const form = document.getElementById('ecpay-form');
    if (form) form.submit();
  }
});
</script>