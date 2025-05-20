<template>
  <div class="property-create-container">
    <h2>新增物件</h2>
    <form class="property-form" @submit.prevent="onSubmit">
      <div class="form-row">
        <label>您的房源有哪些特色</label>
        <div class="feature-grid">
          <div v-for="feature in features" :key="feature.value" :class="['feature-item', {selected: form.features.includes(feature.value)}]" @click="toggleFeature(feature.value)">
            <img v-if="feature.img" :src="feature.img" alt="" class="feature-img" />
            <i v-else :class="feature.icon"></i>
            <span>{{ feature.label }}</span>
          </div>
        </div>
      </div>
      <div class="form-actions">
        <Button color="outline-secondary" type="button" @click="goBack">返回</Button>
        <Button color="outline-secondary" type="button" @click="onSaveExit">儲存草稿</Button>
        <Button color="primary" type="submit">下一步</Button>
      </div>
    </form>
    <Alert
      v-model:show="showAlert"
      title="儲存提示"
      message="已儲存並退出"
      type="success"
      :confirmText="'確認'"
      :cancelText="'取消'"
      @confirm="handleAlertConfirm"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from '@/components/buttons/button.vue';
import Alert from '@/components/alert/Alert.vue';
import axios from 'axios';

const router = useRouter();
const showAlert = ref(false);
const form = ref({
  features: [],
});
const features = [
  { label: '可養貓', value: 'AllowsCats', img: 'https://img.icons8.com/stickers/100/cat.png' },
  { label: '可養狗', value: 'AllowsDogs', img: 'https://img.icons8.com/stickers/100/corgi.png' },
  { label: '可養其他寵物', value: 'AllowsAnimals', img: 'https://img.icons8.com/stickers/100/chicken.png'},
  { label: '可開伙', value: 'AllowsCooking',  img: 'https://img.icons8.com/stickers/100/gas-burner.png'},
  { label: '附其他家具', value: 'HasFurniture',  img: 'https://img.icons8.com/stickers/100/furniture.png'},
  { label: '附網路', value: 'Internet',  img: 'https://img.icons8.com/stickers/100/wifi-router.png'},
  { label: '附冷氣', value: 'AirConditioning',  img: 'https://img.icons8.com/stickers/100/air-conditioner.png'},
  { label: '附電視', value: 'Tv',  img: 'https://img.icons8.com/stickers/100/retro-tv.png'},
  { label: '附冰箱', value: 'Refrigerator',  img: 'https://img.icons8.com/stickers/100/fridge.png'},
  { label: '附洗衣機', value: 'WashingMachine',  img: 'https://img.icons8.com/stickers/100/washing-machine.png'},
  { label: '附床', value: 'Bed',  img: 'https://img.icons8.com/stickers/100/single-bed.png'},
  { label: '附熱水器', value: 'WaterHeater',  img: 'https://img.icons8.com/stickers/100/water-heater.png'},
  { label: '附瓦斯爐', value: 'GasStove',  img: 'https://img.icons8.com/stickers/100/gas-industry.png'},
  { label: '附第四台', value: 'CableTv',  img: 'https://img.icons8.com/stickers/100/tv-antenna.png'},
  { label: '附飲水機', value: 'WaterDispenser',  img: 'https://img.icons8.com/stickers/100/water-cooler.png'},
  { label: '附停車位', value: 'Parking',  img: 'https://img.icons8.com/stickers/100/garage.png'},
  { label: '社會住宅', value: 'SocialHousing',  img: 'https://img.icons8.com/stickers/100/residence.png'},
  { label: '可短租', value: 'ShortTermRent',  img: 'https://img.icons8.com/stickers/100/rental-house-contract.png'},
  { label: '公共電費', value: 'PublicElectricity',  img: 'https://img.icons8.com/stickers/100/quick-mode-on.png'},
  { label: '公共水費', value: 'PublicWatercharges',  img: 'https://img.icons8.com/stickers/100/water.png'},
  { label: '房東同住', value: 'LandlordShared',  img: 'https://img.icons8.com/stickers/100/caretaker.png'},
  { label: '有陽台', value: 'Balcony',  img: 'https://img.icons8.com/stickers/100/balcony.png'},
  { label: '有公設', value: 'PublicEquipment',  img: 'https://img.icons8.com/stickers/100/outdoor-swimming-pool.png'},
];
function toggleFeature(value) {
  const index = form.value.features.indexOf(value);
  if (index === -1) {
    form.value.features.push(value);
  } else {
    form.value.features.splice(index, 1);
  }
}
function goBack() {
  router.push('/landlord/property-manage');
}
async function onSaveExit() {
  showAlert.value = true;
}
function handleAlertConfirm() {
  router.push('/landlord/property-manage');
}
async function onSubmit() {
  // 將特色資料轉換為 PropertyFeature 格式
  const propertyFeature = {
    HAllowsDogs: form.value.features.includes('AllowsDogs'),
    HAllowsCats: form.value.features.includes('AllowsCats'),
    HAllowsAnimals: form.value.features.includes('AllowsAnimals'),
    HAllowsCooking: form.value.features.includes('AllowsCooking'),
    HHasFurniture: form.value.features.includes('HasFurniture'),
    HInternet: form.value.features.includes('Internet'),
    HAirConditioning: form.value.features.includes('AirConditioning'),
    HTv: form.value.features.includes('Tv'),
    HRefrigerator: form.value.features.includes('Refrigerator'),
    HWashingMachine: form.value.features.includes('WashingMachine'),
    HBed: form.value.features.includes('Bed'),
    HWaterHeater: form.value.features.includes('WaterHeater'),
    HGasStove: form.value.features.includes('GasStove'),
    HCableTv: form.value.features.includes('CableTv'),
    HWaterDispenser: form.value.features.includes('WaterDispenser'),
    HParking: form.value.features.includes('Parking'),
    HSocialHousing: form.value.features.includes('SocialHousing'),
    HShortTermRent: form.value.features.includes('ShortTermRent'),
    HPublicElectricity: form.value.features.includes('PublicElectricity'),
    HPublicWatercharges: form.value.features.includes('PublicWatercharges'),
    HLandlordShared: form.value.features.includes('LandlordShared'),
    HBalcony: form.value.features.includes('Balcony'),
    HPublicEquipment: form.value.features.includes('PublicEquipment')
  };

  // 將資料傳遞到下一步
  router.push({
    path: '/landlord/property-detail-form',
    query: {
      features: JSON.stringify(propertyFeature)
    }
  });
}
</script>

<style scoped>
.property-create-container {
  max-width: 1300px;
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
}
.property-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.form-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
input, select {
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-size: 1rem;
}
.feature-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1.3rem;
}
@media (max-width: 1100px) {
  .feature-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media (max-width: 700px) {
  .property-create-container {
    padding: 1rem 0.5rem;
  }
  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.8rem;
  }
}
.form-actions {
  display: flex;
  justify-content: center !important;
  align-items: center !important;
  gap: 1rem;
  margin-top: 2rem;
  position: static;
  background: none;
  box-shadow: none;
  border-radius: 0;
  padding: 0;
  width: 100%;
}
@media (max-width: 900px) {
  .form-actions {
    flex-direction: column;
    align-items: stretch !important;
    gap: 0.7rem;
    margin-top: 1.2rem;
  }
}
.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 2.8rem 0.5rem 1.7rem 0.5rem;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
  color: #888;
  font-size: 1.3rem;
  background: #fafbfc;
}
.feature-item.selected {
  border-color: var(--main-color);
  color: var(--main-color);
  background: #f0fafd;
}
.feature-item i {
  font-size: 1.3rem;
  margin-bottom: 1rem;
}
.feature-img {
  width: 60px;
  height: 60px;
  object-fit: contain;
  margin-bottom: 1rem;
}
</style> 