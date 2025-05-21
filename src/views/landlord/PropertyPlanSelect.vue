<template>
  <div class="plan-select-container">
    <h2>選擇曝光方案</h2>
    <div class="plan-card-group">
      <div
        v-for="plan in plans"
        :key="plan.id"
        :class="['plan-card', {selected: selectedPlan === plan.id, [plan.color]: true}]"
        @click="selectPlan(plan.id)"
      >
        <div class="plan-title">
          <span class="plan-badge">{{ plan.label }}</span>
        </div>
        <div class="plan-price" :class="plan.color">
          <span class="price">${{ plan.price }}</span>
          <span class="duration">/{{ plan.days }} 天</span>
        </div>
        <div class="plan-features-nomarker">
          <div v-for="(f, idx) in plan.features" :key="idx" v-html="f"></div>
        </div>
        <div class="plan-desc-bottom">{{ plan.desc }}</div>
      </div>
    </div>
    <div class="plan-actions">
      <Button color="outline-secondary" @click="goBack">上一步</Button>
      <Button color="outline-secondary" type="button" @click="onSaveExit">儲存草稿</Button>
      <Button color="primary" :disabled="!selectedPlan" @click="onConfirm">確認刊登</Button>
    </div>

    <!-- Alert 元件 -->
    <Alert
      v-model:show="showAlert"
      :title="alertConfig.title"
      :type="alertConfig.type"
      :confirmText="alertConfig.confirmText"
      :cancelText="alertConfig.cancelText"
      @confirm="handleAlertConfirm"
      @cancel="handleAlertCancel"
    >
      {{ alertConfig.message }}
    </Alert>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Button from '@/components/buttons/button.vue';
import Alert from '@/components/alert/Alert.vue';
import axios from 'axios';

const router = useRouter();
const route = useRoute();
const selectedPlan = ref('');
const showAlert = ref(false);
const alertConfig = reactive({
  title: '',
  message: '',
  type: 'info',
  confirmText: '確認',
  cancelText: '取消'
});

const plans = [
  { id: 'vip1', label: '🟡 VIP1 入門方案', price: 100, days: 15, color: 'vip1', features: ['🕒 刊登天數：15 天','🚫 無排序更新','🚫 無標籤、無數據報告','👉 最經濟實惠的選擇，快速上架無負擔！'], desc: '適合剛開始嘗試刊登的房東' },
  { id: 'vip2', label: '🟠 VIP2 推薦方案', price: 200, days: 30, color: 'vip2', features: ['🕒 刊登天數：30 天','🔁 排序每 3 天自動更新','🏷 顯示「推薦」標籤','📈 系統推薦排序優先（更多人看到）','👉 高 CP 值選擇，適合希望快速出租的房東！'], desc: '提升曝光，加快出租速度' },
  { id: 'vip3', label: '🔴 VIP3 精選方案', price: 300, days: 45, color: 'vip3', features: ['🕒 刊登天數：45 天','🔁 每日自動更新排序，穩居前排','🏷 顯示「精選」標籤，最醒目','📈 頁面置頂推薦 + 首頁優先顯示','👉 適合高價物件、緊急出租或想最大化曝光的你！'], desc: '最強曝光，讓你的物件霸佔首頁！' },
];

onMounted(() => {
  // 從 localStorage 讀取表單資料
  const formData = localStorage.getItem('propertyFormData');
  if (!formData) {
    showAlert.value = true;
    alertConfig.title = '錯誤';
    alertConfig.message = '找不到物件資料，請重新填寫';
    alertConfig.type = 'error';
    alertConfig.confirmText = '確認';
    alertConfig.cancelText = '';
    router.push('/landlord/property-detail-form');
  }
});

function selectPlan(id) {
  selectedPlan.value = id;
}

function goBack() {
  router.push('/landlord/property-detail-form');
}

async function onSaveExit() {
  try {
    const formData = JSON.parse(localStorage.getItem('propertyFormData'));
    if (!formData) {
      showAlert.value = true;
      alertConfig.title = '錯誤';
      alertConfig.message = '找不到物件資料';
      alertConfig.type = 'error';
      alertConfig.confirmText = '確認';
      alertConfig.cancelText = '';
      return;
    }

    showAlert.value = true;
    alertConfig.title = '確認儲存';
    alertConfig.message = '確定要將此物件儲存為草稿嗎？';
    alertConfig.type = 'info';
    alertConfig.confirmText = '確認';
    alertConfig.cancelText = '取消';
  } catch (error) {
    console.error('Error:', error);
    showAlert.value = true;
    alertConfig.title = '錯誤';
    alertConfig.message = error.response?.data?.message || '儲存失敗，請稍後再試';
    alertConfig.type = 'error';
    alertConfig.confirmText = '確認';
    alertConfig.cancelText = '';
  }
}

async function onConfirm() {
  try {
    const formData = JSON.parse(localStorage.getItem('propertyFormData'));
    if (!formData) {
      showAlert.value = true;
      alertConfig.title = '錯誤';
      alertConfig.message = '找不到物件資料';
      alertConfig.type = 'error';
      alertConfig.confirmText = '確認';
      alertConfig.cancelText = '';
      return;
    }

    // 取得選擇的方案
    const plan = plans.find(p => p.id === selectedPlan.value);
    if (!plan) {
      showAlert.value = true;
      alertConfig.title = '錯誤';
      alertConfig.message = '請選擇方案';
      alertConfig.type = 'error';
      alertConfig.confirmText = '確認';
      alertConfig.cancelText = '';
      return;
    }

    // 顯示付款選擇提示
    showAlert.value = true;
    alertConfig.title = '選擇付款方式';
    alertConfig.message = '請選擇付款方式：\n\n立即付款 = 立即付款\n稍後付款 = 稍後付款';
    alertConfig.type = 'info';
    alertConfig.confirmText = '立即付款';
    alertConfig.cancelText = '稍後付款';
  } catch (error) {
    console.error('Error:', error);
    showAlert.value = true;
    alertConfig.title = '錯誤';
    alertConfig.message = error.response?.data?.message || '刊登失敗，請稍後再試';
    alertConfig.type = 'error';
    alertConfig.confirmText = '確認';
    alertConfig.cancelText = '';
  }
}

async function handleAlertConfirm() {
  try {
    const formData = JSON.parse(localStorage.getItem('propertyFormData'));
    const plan = plans.find(p => p.id === selectedPlan.value);
    
    if (alertConfig.confirmText === '立即付款') {
      // 立即付款：先呼叫金流 API
      const checkoutRes = await axios.post('/api/commerce/ecpay-html', {
        TotalAmount: plan.price,
        ItemName: plan.label,
        formData: formData // 傳遞表單資料到金流 API
      });

      // 開啟付款視窗
      const win = window.open();
      win.document.write(checkoutRes.data);
      win.document.close();

      // 清除 localStorage
      localStorage.removeItem('propertyFormData');
      
      // 跳轉到管理頁面
      router.push('/landlord/property-manage');
    } else if (alertConfig.confirmText === '確認') {
      // 儲存草稿
      const formDataToSend = new FormData();
      formDataToSend.append('property', JSON.stringify({
        ...formData.property,
        HStatus: '草稿'
      }));
      formDataToSend.append('propertyFeature', JSON.stringify(formData.propertyFeature));
      formDataToSend.append('ad', JSON.stringify({
        hAdName: plan.label,
        hCategory: plan.id.toUpperCase(),
        hPlanId: Number(plan.id.replace('vip', ''))
      }));
      
      // 加入圖片
      formData.images.forEach(img => {
        if (img.file) {
          formDataToSend.append('images', img.file);
        }
      });

      // 儲存物件資料
      await axios.post('/api/landlord/property', formDataToSend, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // 清除 localStorage
      localStorage.removeItem('propertyFormData');
      
      // 顯示成功訊息
      showAlert.value = true;
      alertConfig.title = '成功';
      alertConfig.message = '已成功儲存為草稿';
      alertConfig.type = 'success';
      alertConfig.confirmText = '確認';
      alertConfig.cancelText = '';
      
      // 跳轉到管理頁面
      router.push('/landlord/property-manage');
    } else {
      // 稍後付款：直接儲存為草稿並跳轉
      const formDataToSend = new FormData();
      formDataToSend.append('property', JSON.stringify({
        ...formData.property,
        HStatus: '草稿'
      }));
      formDataToSend.append('propertyFeature', JSON.stringify(formData.propertyFeature));
      formDataToSend.append('ad', JSON.stringify({
        hAdName: plan.label,
        hCategory: plan.id.toUpperCase(),
        hPlanId: Number(plan.id.replace('vip', ''))
      }));
      
      // 加入圖片
      formData.images.forEach(img => {
        if (img.file) {
          formDataToSend.append('images', img.file);
        }
      });

      // 儲存物件資料
      await axios.post('/api/landlord/property', formDataToSend, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // 清除 localStorage
      localStorage.removeItem('propertyFormData');
      
      // 跳轉到管理頁面
      router.push('/landlord/property-manage');
    }
  } catch (error) {
    console.error('Error:', error);
    showAlert.value = true;
    alertConfig.title = '錯誤';
    alertConfig.message = error.response?.data?.message || '刊登失敗，請稍後再試';
    alertConfig.type = 'error';
    alertConfig.confirmText = '確認';
    alertConfig.cancelText = '';
  }
}

function handleAlertCancel() {
  // 如果是稍後付款的選項，執行確認刊登的邏輯
  if (alertConfig.confirmText === '立即付款') {
    handleAlertConfirm();
  }
}
</script>

<style scoped>
.plan-select-container {
  max-width: 1200px;
  margin: 40px auto 0 auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 6px 32px rgba(60, 221, 210, 0.08);
  padding: 2.5rem 2.5rem 2rem 2.5rem;
}
h2 {
  color: var(--main-color);
  margin-bottom: 2rem;
  font-weight: bold;
  text-align: center;
}
.plan-card-group {
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  align-items: stretch;
}
.plan-card {
  background: #fafbfc;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(60, 221, 210, 0.08);
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  min-width: 300px;
  max-width: 340px;
  flex: 1 1 320px;
  border: 2px solid #e0e0e0;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100%;
  min-height: 520px;
  position: relative;
}
.plan-card.selected {
  border-color: var(--main-color);
  box-shadow: 0 4px 24px rgba(60, 221, 210, 0.18);
}
.plan-card.vip1 .plan-price { color: #ffd600; }
.plan-card.vip2 .plan-price { color: #ff9800; }
.plan-card.vip3 .plan-price { color: #f44336; }
.plan-card.vip1.selected { border-color: #ffd600; }
.plan-card.vip2.selected { border-color: #ff9800; }
.plan-card.vip3.selected { border-color: #f44336; }
.plan-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.7rem;
}
.plan-badge {
  font-size: 1.1rem;
}
.plan-price {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.7rem;
}
.duration {
  font-size: 1rem;
  color: #888;
  margin-left: 0.3rem;
}
.plan-features-nomarker {
  margin: 0 0 0.7rem 0;
  padding: 0 0 0 0.2rem;
  font-size: 1rem;
  color: #444;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.plan-desc-bottom {
  color: #888;
  font-size: 0.98rem;
  font-weight: 600;
  min-height: 1.5em;
  margin-top: auto;
  width: 100%;
  text-align: left;
}
.plan-actions {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2.5rem;
}
@media (max-width: 900px) {
  .plan-card-group {
    flex-direction: column;
    align-items: stretch;
  }
  .plan-card {
    max-width: 100%;
    min-width: 220px;
    width: 100%;
    height: auto;
    min-height: unset;
  }
  .plan-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 0.7rem;
    margin-top: 1.2rem;
  }
}
@media (max-width: 600px) {
  .plan-select-container {
    padding: 1rem 0.2rem;
  }
  .plan-card-group {
    flex-direction: column;
    gap: 1.2rem;
    margin-bottom: 1.2rem;
  }
  .plan-card {
    max-width: 100%;
    min-width: 0;
    width: 100%;
    padding: 1.2rem 0.7rem 1rem 0.7rem;
    min-height: 420px;
  }
  .plan-title, .plan-badge {
    font-size: 1rem;
  }
  .plan-price {
    font-size: 1.3rem;
  }
  .duration {
    font-size: 0.95rem;
  }
  .plan-features-nomarker {
    font-size: 0.95rem;
  }
  .plan-desc-bottom {
    font-size: 0.93rem;
  }
  .plan-actions {
    flex-direction: column;
    gap: 0.7rem;
    margin-top: 1.2rem;
    align-items: stretch;
  }
}
.property-card {
  display: flex;
  align-items: center;
  border: 1px solid #eee;
  border-radius: 12px;
  margin-bottom: 1rem;
  background: #fff;
  box-shadow: 0 2px 8px #eee;
  overflow: hidden;
}
.property-cover {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-right: 1px solid #eee;
}
.property-info {
  padding: 1rem;
  flex: 1;
}
.property-title {
  font-size: 1.2rem;
  font-weight: bold;
}
</style> 