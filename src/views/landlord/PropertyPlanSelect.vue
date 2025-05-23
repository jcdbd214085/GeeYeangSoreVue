<template>
  <div class="plan-select-container">
    <h2>選擇曝光方案</h2>
    <div class="plan-card-group">
      <div v-for="plan in plans" :key="plan.id"
        :class="['plan-card', { selected: selectedPlan === plan.id, [plan.color]: true }]" @click="selectPlan(plan.id)">
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
    <Alert v-model:show="showAlert" :title="alertConfig.title" :type="alertConfig.type"
      :confirmText="alertConfig.confirmText" :cancelText="alertConfig.cancelText"
      :singleButton="alertConfig.singleButton" :singleButtonText="alertConfig.singleButtonText"
      @confirm="handleAlertConfirm" @cancel="handleAlertCancel" :confirmDisabled="isSubmitting">
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
  cancelText: '取消',
  singleButton: false,
  singleButtonText: '確認'
});
const propertyId = ref(Number(route.query.propertyId) || null);
const propertyData = ref(null);
const unpaidAd = ref(null);
const isSubmitting = ref(false);

const plans = [
  { id: 'vip1', label: '🟡 VIP1 入門方案', price: 100, days: 15, color: 'vip1', features: ['🕒 刊登天數：15 天', '🚫 無排序更新', '🚫 無標籤、無數據報告', '👉 最經濟實惠的選擇，快速上架無負擔！'], desc: '適合剛開始嘗試刊登的房東' },
  { id: 'vip2', label: '🟠 VIP2 推薦方案', price: 200, days: 30, color: 'vip2', features: ['🕒 刊登天數：30 天', '🔁 排序每 3 天自動更新', '🏷 顯示「推薦」標籤', '📈 系統推薦排序優先（更多人看到）', '👉 高 CP 值選擇，適合希望快速出租的房東！'], desc: '提升曝光，加快出租速度' },
  { id: 'vip3', label: '🔴 VIP3 精選方案', price: 300, days: 45, color: 'vip3', features: ['🕒 刊登天數：45 天', '🔁 每日自動更新排序，穩居前排', '🏷 顯示「精選」標籤，最醒目', '📈 頁面置頂推薦 + 首頁優先顯示', '👉 適合高價物件、緊急出租或想最大化曝光的你！'], desc: '最強曝光，讓你的物件霸佔首頁！' },
];

onMounted(async () => {
  console.log('[DEBUG] route.query =', route.query);
  propertyId.value = Number(route.query.propertyId) || null;
  console.log('[DEBUG] propertyId.value (after Number) =', propertyId.value, typeof propertyId.value);

  const formDataRaw = localStorage.getItem('propertyFormData');

  // ✅ 判斷是否為「新增流程」
  const isNewFlow = !!formDataRaw && (!route.query.propertyId || Number(route.query.propertyId) === 0);
  if (isNewFlow) {
    console.log('[INFO] 偵測到 localStorage 且無 propertyId，進入新增流程');
    propertyId.value = null;
  }

  // ✅ 判斷 propertyId 是否有效（僅在非新增流程時檢查）
  if (!isNewFlow && (isNaN(propertyId.value) || propertyId.value <= 0)) {
    console.warn('[WARNING] propertyId 無效，跳回填寫頁面');
    showAlert.value = true;
    alertConfig.title = '錯誤';
    alertConfig.message = '找不到物件編號，請重新操作';
    alertConfig.type = 'error';
    alertConfig.singleButton = true;
    alertConfig.singleButtonText = '確認';
    router.push('/landlord/property-detail-form');
    return;
  }

  if (propertyId.value) {
    try {
      console.log(`[DEBUG] 開始取得房源資料：/api/landlord/property/${propertyId.value}`);
      const res = await axios.get(`/api/landlord/property/${propertyId.value}`);
      console.log('[DEBUG] 房源資料取得成功:', res.data);
      propertyData.value = res.data;

      console.log(`[DEBUG] 查詢未付款廣告：/api/landlord/property/${propertyId.value}/ads?status=未付款`);
      const adRes = await axios.get(`/api/landlord/property/${propertyId.value}/ads?status=未付款`);
      console.log('[DEBUG] 廣告查詢結果:', adRes.data);
      unpaidAd.value = adRes.data?.[0] || null;

    } catch (err) {
      console.error('[ERROR] 載入房源或廣告資料失敗:', err);
      showAlert.value = true;
      alertConfig.title = '錯誤';
      alertConfig.message = err.response?.data?.message || '載入房源或廣告資料失敗';
      alertConfig.type = 'error';
      alertConfig.singleButton = true;
      alertConfig.singleButtonText = '確認';
      router.push('/landlord/property-manage');
    }
  } else {
    // ✅ 新刊登流程：使用 localStorage
    console.log('[DEBUG] 無 propertyId，進入新增物件模式（localStorage）');
    if (!formDataRaw) {
      showAlert.value = true;
      alertConfig.title = '錯誤';
      alertConfig.message = '找不到物件資料，請重新填寫';
      alertConfig.type = 'error';
      alertConfig.singleButton = true;
      alertConfig.singleButtonText = '確認';
      router.push('/landlord/property-detail-form');
    }
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
      alertConfig.singleButton = true;
      alertConfig.singleButtonText = '確認';
      return;
    }
    if (!selectedPlan.value) {
      showAlert.value = true;
      alertConfig.title = '錯誤';
      alertConfig.message = '請選擇方案';
      alertConfig.type = 'error';
      alertConfig.confirmText = '確認';
      alertConfig.cancelText = '';
      alertConfig.singleButton = true;
      alertConfig.singleButtonText = '確認';
      return;
    }
    showAlert.value = true;
    alertConfig.title = '確認儲存';
    alertConfig.message = '確定要將此物件儲存為草稿嗎？';
    alertConfig.type = 'info';
    alertConfig.confirmText = '確認';
    alertConfig.cancelText = '取消';
    alertConfig.singleButton = false;
    alertConfig.singleButtonText = '確認';
  } catch (error) {
    console.error('Error:', error);
    showAlert.value = true;
    alertConfig.title = '錯誤';
    alertConfig.message = error.response?.data?.message || '儲存失敗，請稍後再試';
    alertConfig.type = 'error';
    alertConfig.confirmText = '確認';
    alertConfig.cancelText = '';
    alertConfig.singleButton = true;
    alertConfig.singleButtonText = '確認';
  }
}

async function onConfirm() {
  try {
    let formDataRaw = localStorage.getItem('propertyFormData');
    let formData = null;

    if (formDataRaw) {
      console.log('[INFO] 使用 localStorage（新增流程）');
      formData = JSON.parse(formDataRaw);
    } else if (propertyData.value && propertyData.value.propertyId) {
      console.log('[INFO] 使用 API 的 propertyData（升級流程）');
      formData = {
        property: propertyData.value,
        propertyFeature: propertyData.value.features || {},
        images: []
      };
    } else {
      showAlert.value = true;
      alertConfig.title = '錯誤';
      alertConfig.message = '找不到物件資料';
      alertConfig.type = 'error';
      alertConfig.confirmText = '確認';
      return;
    }

    // 成功取得資料後，顯示付款選擇彈窗
    showAlert.value = true;
    alertConfig.title = '選擇付款方式';
    alertConfig.message = '請選擇付款方式：\n\n立即付款 = 立即付款\n稍後付款 = 稍後付款';
    alertConfig.type = 'info';
    alertConfig.confirmText = '立即付款';
    alertConfig.cancelText = '稍後付款';
  } catch (error) {
    console.error('onConfirm error:', error);
    showAlert.value = true;
    alertConfig.title = '錯誤';
    alertConfig.message = error?.message || '刊登失敗，請稍後再試';
    alertConfig.type = 'error';
    alertConfig.confirmText = '確認';
  }
}
async function handleAlertConfirm() {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  try {
    const isUpgradeMode = !!propertyId.value;

    let formDataRaw = localStorage.getItem('propertyFormData');
    let formData = null;

    console.log('[DEBUG] localStorage propertyFormData =', formDataRaw);
    console.log('[DEBUG] propertyData.value =', propertyData.value);
    console.log('[DEBUG] propertyData.value?.propertyId =', propertyData.value?.propertyId);

    if (formDataRaw) {
      console.log('[INFO] 使用 localStorage 資料（新增流程）');
      formData = JSON.parse(formDataRaw);
    } else if (propertyData.value && propertyData.value.propertyId) {
      console.log('[INFO] 使用 API 取得的房源資料（升級流程）');
      formData = {
        property: propertyData.value,
        propertyFeature: propertyData.value.features || {},
        images: []
      };
    } else {
      console.warn('[ERROR] 無法取得物件資料！');
      showAlert.value = true;
      alertConfig.title = '錯誤';
      alertConfig.message = '找不到物件資料，請重新填寫或重新載入';
      alertConfig.type = 'error';
      alertConfig.singleButton = true;
      alertConfig.singleButtonText = '確認';
      isSubmitting.value = false;
      return;
    }

    const plan = plans.find(p => p.id === selectedPlan.value);
    let adId = null;

    // === 立即付款 ===
    if (alertConfig.confirmText === '立即付款') {
      if (isUpgradeMode) {
        const res = await axios.put(`/api/landlord/property/${propertyId.value}/activate`, {
          hAdName: plan.label,
          hCategory: plan.id.toUpperCase(),
          hPlanId: Number(plan.id.replace('vip', ''))
        });
        adId = res.data?.adId;
      } else {
        const formDataToSend = new FormData();
        formDataToSend.append('property', JSON.stringify({
          ...formData.property,
          HStatus: '已驗證'
        }));
        formDataToSend.append('propertyFeature', JSON.stringify(formData.propertyFeature));
        formDataToSend.append('ad', JSON.stringify({
          hAdName: plan.label,
          hCategory: plan.id.toUpperCase(),
          hPlanId: Number(plan.id.replace('vip', ''))
        }));

        // 處理圖片上傳
        if (formData.images && formData.images.length > 0) {
          console.log('[DEBUG] 開始處理圖片上傳，圖片數量:', formData.images.length);
          console.log('[DEBUG] 圖片數據:', JSON.stringify(formData.images, null, 2));
          
          for (const img of formData.images) {
            console.log(`[DEBUG] 處理圖片:`, img);
            
            if (img.url && img.url.startsWith('data:')) {
              // 處理 base64 圖片
              try {
                const response = await fetch(img.url);
                const blob = await response.blob();
                const file = new File([blob], `image_${Date.now()}.jpg`, { type: 'image/jpeg' });
                console.log(`[INFO] 轉換 base64 圖片為檔案: ${file.name}`);
                formDataToSend.append('images', file);
              } catch (error) {
                console.error('[ERROR] 轉換 base64 圖片失敗:', error);
              }
            } else if (img.file) {
              console.log(`[INFO] 上傳新圖片: ${img.file.name}`);
              formDataToSend.append('images', img.file);
            } else if (img.url) {
              console.log(`[INFO] 跳過已有圖片: ${img.url}`);
            } else {
              console.warn(`[WARNING] 圖片數據格式不正確:`, img);
            }
          }
        } else {
          console.log('[INFO] 沒有圖片需要上傳');
        }

        const res = await axios.post('/api/landlord/property', formDataToSend, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        adId = res.data?.adId;
      }

      if (!adId) {
        throw new Error('後端未回傳 adId，無法進行付款');
      }

      // ✅ 等 adId 確定存在後才觸發金流
      const paymentRes = await axios.post('/api/commerce/ecpay-html', {
        TotalAmount: plan.price,
        ItemName: plan.label,
        AdId: adId
      });

      const payWin = window.open();
      if (payWin) {
        payWin.document.write(paymentRes.data);
        payWin.document.close();
      } else {
        alert('付款視窗被瀏覽器擋下，請允許跳出視窗。');
      }

      localStorage.removeItem('propertyFormData');
      router.push('/landlord/property-manage');

      // === 儲存草稿 ===
    } else if (alertConfig.confirmText === '確認') {
      if (isUpgradeMode) {
        showAlert.value = true;
        alertConfig.title = '提醒';
        alertConfig.message = '此物件已存在，無法再次儲存草稿';
        alertConfig.type = 'warning';
        alertConfig.singleButton = true;
        alertConfig.singleButtonText = '確認';
        return;
      }

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

      // 處理圖片上傳
      if (formData.images && formData.images.length > 0) {
        console.log('[DEBUG] 開始處理圖片上傳，圖片數量:', formData.images.length);
        console.log('[DEBUG] 圖片數據:', JSON.stringify(formData.images, null, 2));
        
        for (const img of formData.images) {
          console.log(`[DEBUG] 處理圖片:`, img);
          
          if (img.url && img.url.startsWith('data:')) {
            // 處理 base64 圖片
            try {
              const response = await fetch(img.url);
              const blob = await response.blob();
              const file = new File([blob], `image_${Date.now()}.jpg`, { type: 'image/jpeg' });
              console.log(`[INFO] 轉換 base64 圖片為檔案: ${file.name}`);
              formDataToSend.append('images', file);
            } catch (error) {
              console.error('[ERROR] 轉換 base64 圖片失敗:', error);
            }
          } else if (img.file) {
            console.log(`[INFO] 上傳新圖片: ${img.file.name}`);
            formDataToSend.append('images', img.file);
          } else if (img.url) {
            console.log(`[INFO] 跳過已有圖片: ${img.url}`);
          } else {
            console.warn(`[WARNING] 圖片數據格式不正確:`, img);
          }
        }
      } else {
        console.log('[INFO] 沒有圖片需要上傳');
      }

      await axios.post('/api/landlord/property', formDataToSend, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      localStorage.removeItem('propertyFormData');
      showAlert.value = true;
      alertConfig.title = '成功';
      alertConfig.message = '已成功儲存為草稿';
      alertConfig.type = 'success';
      alertConfig.singleButton = true;
      alertConfig.singleButtonText = '確認';
      router.push('/landlord/property-manage');

      // === 稍後付款 ===
    } else {
      if (isUpgradeMode) {
        await axios.put(`/api/landlord/property/${propertyId.value}/activate`, {
          hAdName: plan.label,
          hCategory: plan.id.toUpperCase(),
          hPlanId: Number(plan.id.replace('vip', ''))
        });
      } else {
        const formDataToSend = new FormData();
        formDataToSend.append('property', JSON.stringify({
          ...formData.property,
          HStatus: '已驗證'
        }));
        formDataToSend.append('propertyFeature', JSON.stringify(formData.propertyFeature));
        formDataToSend.append('ad', JSON.stringify({
          hAdName: plan.label,
          hCategory: plan.id.toUpperCase(),
          hPlanId: Number(plan.id.replace('vip', ''))
        }));

        // 處理圖片上傳
        if (formData.images && formData.images.length > 0) {
          console.log('[DEBUG] 開始處理圖片上傳，圖片數量:', formData.images.length);
          console.log('[DEBUG] 圖片數據:', JSON.stringify(formData.images, null, 2));
          
          for (const img of formData.images) {
            console.log(`[DEBUG] 處理圖片:`, img);
            
            if (img.url && img.url.startsWith('data:')) {
              // 處理 base64 圖片
              try {
                const response = await fetch(img.url);
                const blob = await response.blob();
                const file = new File([blob], `image_${Date.now()}.jpg`, { type: 'image/jpeg' });
                console.log(`[INFO] 轉換 base64 圖片為檔案: ${file.name}`);
                formDataToSend.append('images', file);
              } catch (error) {
                console.error('[ERROR] 轉換 base64 圖片失敗:', error);
              }
            } else if (img.file) {
              console.log(`[INFO] 上傳新圖片: ${img.file.name}`);
              formDataToSend.append('images', img.file);
            } else if (img.url) {
              console.log(`[INFO] 跳過已有圖片: ${img.url}`);
            } else {
              console.warn(`[WARNING] 圖片數據格式不正確:`, img);
            }
          }
        } else {
          console.log('[INFO] 沒有圖片需要上傳');
        }

        await axios.post('/api/landlord/property', formDataToSend, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      localStorage.removeItem('propertyFormData');
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
  } finally {
    isSubmitting.value = false;
  }
}

function handleAlertCancel() {
  alertConfig.confirmText = '稍後付款'; //  強制改為「稍後付款」
  handleAlertConfirm(); //  執行正常流程
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

.plan-card.vip1 .plan-price {
  color: #ffd600;
}

.plan-card.vip2 .plan-price {
  color: #ff9800;
}

.plan-card.vip3 .plan-price {
  color: #f44336;
}

.plan-card.vip1.selected {
  border-color: #ffd600;
}

.plan-card.vip2.selected {
  border-color: #ff9800;
}

.plan-card.vip3.selected {
  border-color: #f44336;
}

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

  .plan-title,
  .plan-badge {
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