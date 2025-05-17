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
      <Button color="outline-secondary" @click="onSaveExit">儲存退出</Button>
      <Button color="primary" :disabled="!selectedPlan" @click="onConfirm">確認刊登</Button>
    </div>
    <Alert
      v-model:show="showSaveAlert"
      title="儲存提示"
      message="已儲存並退出"
      type="success"
      :confirmText="'確認'"
      :cancelText="'取消'"
      @confirm="handleAlertConfirm"
    />
    <Alert
      v-model:show="showPublishAlert"
      title="房源申請通過"
      message="您的房源已成功申請通過，請至物件管理頁面查看。"
      type="info"
      :confirmText="'確認'"
      :cancelText="'取消'"
      @confirm="handleAlertConfirm"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Button from '@/components/buttons/button.vue';
import Alert from '@/components/alert/Alert.vue';
import axios from 'axios';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const selectedPlan = ref('');
const showSaveAlert = ref(false);
const showPublishAlert = ref(false);
const drafts = ref([]);
const userStore = useUserStore();
const plans = [
  {
    id: 'vip1',
    label: '🟡 VIP1 入門方案',
    price: 100,
    days: 15,
    color: 'vip1',
    features: [
      '🕒 刊登天數：15 天',
      '🚫 無排序更新',
      '🚫 無標籤、無數據報告',
      '👉 最經濟實惠的選擇，快速上架無負擔！',
    ],
    desc: '適合剛開始嘗試刊登的房東',
  },
  {
    id: 'vip2',
    label: '🟠 VIP2 推薦方案',
    price: 200,
    days: 30,
    color: 'vip2',
    features: [
      '🕒 刊登天數：30 天',
      '🔁 排序每 3 天自動更新',
      '🏷 顯示「推薦」標籤',
      '📈 系統推薦排序優先（更多人看到）',
      '👉 高 CP 值選擇，適合希望快速出租的房東！',
    ],
    desc: '提升曝光，加快出租速度',
  },
  {
    id: 'vip3',
    label: '🔴 VIP3 精選方案',
    price: 300,
    days: 45,
    color: 'vip3',
    features: [
      '🕒 刊登天數：45 天',
      '🔁 每日自動更新排序，穩居前排',
      '🏷 顯示「精選」標籤，最醒目',
      '📈 頁面置頂推薦 + 首頁優先顯示',
      '👉 適合高價物件、緊急出租或想最大化曝光的你！',
    ],
    desc: '最強曝光，讓你的物件霸佔首頁！',
  },
];
function selectPlan(id) {
  selectedPlan.value = id;
}
function goBack() {
  router.back();
}
function onSaveExit() {
  // 儲存草稿
  const propertyDetail = JSON.parse(localStorage.getItem('propertyDetail') || '{}');
  const draft = {
    step: 'plan',
    data: { ...propertyDetail, selectedPlan: selectedPlan.value },
    savedAt: new Date().toISOString()
  };
  let drafts = JSON.parse(localStorage.getItem('propertyDrafts') || '[]');
  drafts.push(draft);
  localStorage.setItem('propertyDrafts', JSON.stringify(drafts));
  showSaveAlert.value = true;
}
async function onConfirm() {
  // 取得詳細資料
  const propertyDetail = JSON.parse(localStorage.getItem('propertyDetail') || '{}');
  // 取得 landlordId 與 token
  let landlordId = localStorage.getItem('landlordId');
  if (!landlordId && userStore.isLogin) {
    // 若store有user資訊
    const res = await axios.get('/api/Auth/me', { withCredentials: true });
    landlordId = res.data.landlordId;
    localStorage.setItem('landlordId', landlordId);
  }
  const token = localStorage.getItem('token');
  // 1. HProperty
  const property = {
    HLandlordId: landlordId,
    HPropertyTitle: propertyDetail.title,
    HDescription: propertyDetail.description,
    HAddress: propertyDetail.address,
    HCity: propertyDetail.city,
    HDistrict: propertyDetail.district,
    HRentPrice: propertyDetail.rent,
    HPropertyType: propertyDetail.spaceType,
    HRoomCount: propertyDetail.room,
    HBathroomCount: propertyDetail.bath,
    HArea: propertyDetail.ping,
    HFloor: propertyDetail.floor,
    HTotalFloors: propertyDetail.totalFloor,
    HBuildingType: propertyDetail.buildingType,
    HIsDelete: false
  };
  // 2. HPropertyFeature
  const featureMap = {};
  (propertyDetail.features || []).forEach(f => featureMap['H' + f] = true);
  const propertyFeature = {
    HLandlordId: landlordId,
    ...featureMap,
    HIsDelete: false
  };
  // 3. HAd
  const ad = {
    HLandlordId: landlordId,
    HAdName: selectedPlan.value,
    HStatus: 'Active',
    HAdPrice: plans.find(p => p.id === selectedPlan.value)?.price,
    HIsDelete: false
  };
  // FormData
  const formData = new FormData();
  formData.append('property', JSON.stringify(property));
  formData.append('propertyFeature', JSON.stringify(propertyFeature));
  formData.append('ad', JSON.stringify(ad));
  // 圖片檔案
  const imageFiles = window._propertyImageFiles || [];
  imageFiles.forEach(file => {
    formData.append('images', file);
  });
  try {
    const res = await axios.post('/api/landlord/landlordcreate/full-create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    });
    if (res.data.success) {
      localStorage.removeItem('propertyDetail');
      localStorage.removeItem('propertyFeatures');
      window._propertyImageFiles = undefined;
      showPublishAlert.value = true;
    }
  } catch (e) {
    alert('刊登失敗，請稍後再試');
  }
}
function handleAlertConfirm() {
  router.push('/landlord/property-manage');
}
onMounted(() => {
  drafts.value = JSON.parse(localStorage.getItem('propertyDrafts') || '[]');
});
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