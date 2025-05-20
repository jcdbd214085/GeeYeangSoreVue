<template>
  <div class="property-edit-container">
    <h2 class="main-title">編輯物件</h2>
    <form class="property-form" @submit.prevent="onSubmit">
      <!-- 基本資料區塊 -->
      <section class="section-block">
        <div class="form-title">基本資料</div>
        <div class="form-grid">
          <div class="form-group">
            <label>縣市</label>
            <select v-model="form.HCity" required>
              <option value="">請選擇縣市</option>
              <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>區域</label>
            <input v-model="form.HDistrict" placeholder="請輸入區域" required />
          </div>
          <div class="form-group">
            <label>地址</label>
            <input v-model="form.HAddress" placeholder="請填寫地址" required />
          </div>
          <div class="form-group">
            <label>標題</label>
            <input v-model="form.HPropertyTitle" placeholder="請輸入標題" required />
          </div>
          <div class="form-group">
            <label>郵遞區號</label>
            <input v-model="form.HZipcode" placeholder="請輸入郵遞區號" />
          </div>
          <div class="form-group desc-group">
            <label>簡介</label>
            <textarea v-model="form.HDescription" placeholder="可在此填寫物件的特色描述"></textarea>
          </div>
          <div class="form-group full-width">
            <label>照片上傳</label>
            <input type="file" multiple accept="image/*" @change="onImageChange" />
            <div class="image-preview-list">
              <div v-for="(img, idx) in images" :key="idx" class="image-preview-item">
                <img :src="img.url" />
                <button type="button" class="img-del-btn" @click="removeImage(idx)">刪除</button>
              </div>
            </div>
            <div class="img-tip">最多15張，單張10MB內，支援jpg/png/webp/gif</div>
          </div>
        </div>
      </section>
      <!-- 空間資訊區塊 -->
      <section class="section-block">
        <div class="form-title">空間資訊</div>
        <div class="form-grid">
          <div class="form-group">
            <label>空間型態</label>
            <select v-model="form.HPropertyType">
              <option value="">請選擇</option>
              <option value="整棟住家">整棟住家</option>
              <option value="整層住家">整層住家</option>
              <option value="套房">套房</option>
              <option value="雅房">雅房</option>
            </select>
          </div>
          <div class="form-group">
            <label>建物型態</label>
            <select v-model="form.HBuildingType">
              <option value="">請選擇</option>
              <option value="透天">透天</option>
              <option value="公寓">公寓</option>
              <option value="大樓">大樓</option>
              <option value="華廈">華廈</option>
            </select>
          </div>
          <div class="form-group">
            <label>格局</label>
            <div class="layout-row">
              <input v-model.number="form.HRoomCount" type="number" min="0" placeholder="房" />
              <input v-model.number="form.HBathroomCount" type="number" min="0" placeholder="衛浴" />
              
            </div>
          </div>
          <div class="form-group">
            <label>樓層/總樓層</label>
            <div class="layout-row">
              <input v-model.number="form.HFloor" type="number" min="0" placeholder="樓層" />/
              <input v-model.number="form.HTotalFloors" type="number" min="0" placeholder="總樓層" />
            </div>
          </div>
          <div class="form-group">
            <label>租金</label>
            <input v-model.number="form.HRentPrice" type="number" min="0" placeholder="元/月" />
          </div>
          <div class="form-group">
            <label>出租狀態</label>
            <select v-model="form.HAvailabilityStatus">
              <option value="未出租">未出租</option>
              <option value="已出租">已出租</option>
            </select>
          </div>
          <div class="form-group " >
            <label>坪數</label>
            <input v-model.number="form.HArea" type="number" min="0" placeholder="坪" />
          </div>
          
        </div>
      </section>
      <!-- 房源特色區塊 -->
      <section class="section-block">
        <div class="form-title">房源特色</div>
        <div class="feature-grid">
          <div v-for="feature in features" :key="feature.value" :class="['feature-item', {selected: form.features.includes(feature.value)}]" @click="toggleFeature(feature.value)">
            <img v-if="feature.img" :src="feature.img" alt="" class="feature-img" />
            <span>{{ feature.label }}</span>
          </div>
        </div>
      </section>
      <!-- 按鈕區塊 -->
      <div class="form-actions">
        <button type="button" class="btn-outline" @click="goBack">返回</button>
        <button type="submit" class="btn-outline" @click="onSubmit">儲存退出</button>
      </div>
    </form>
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
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import Alert from '@/components/alert/Alert.vue';

const route = useRoute();
const router = useRouter();
const cities = [
  '台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市',
  '基隆市', '新竹市', '新竹縣', '苗栗縣', '彰化縣', '南投縣',
  '雲林縣', '嘉義市', '嘉義縣', '屏東縣', '宜蘭縣', '花蓮縣',
  '台東縣', '金門縣', '澎湖縣', '連江縣'
];
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

const form = reactive({
  HCity: '',
  HDistrict: '',
  HZipcode: '',
  HAddress: '',
  HPropertyTitle: '',
  HDescription: '',
  HRentPrice: '',
  HPropertyType: '',
  HRoomCount: '',
  HBathroomCount: '',
  HArea: '',
  HFloor: '',
  HTotalFloors: '',
  HAvailabilityStatus: '未出租',
  HBuildingType: '',
  HScore: '',
  HIsVip: false,
  HIsShared: false,
  HLatitude: '',
  HLongitude: '',
  features: [],
});
const images = ref([]);
const loading = ref(false);
const error = ref(null);
const showAlert = ref(false);
const alertConfig = reactive({
  title: '',
  message: '',
  type: 'info',
  confirmText: '確認',
  cancelText: '取消'
});
const alertMode = ref('');

onMounted(async () => {
  const propertyId = route.params.id;
  if (propertyId) {
    await fetchPropertyData(propertyId);
  }
});

async function fetchPropertyData(id) {
  try {
    loading.value = true;
    const response = await axios.get(`/api/landlord/property/${id}`);
    const data = response.data;
    console.log('後端回傳資料', data);
    // 逐一賦值，確保響應式
    form.HCity = data.city || '';
    form.HDistrict = data.district || '';
    form.HZipcode = data.zipcode || '';
    form.HAddress = data.address || '';
    form.HPropertyTitle = data.title || '';
    form.HDescription = data.description || '';
    form.HRentPrice = data.rentPrice || '';
    form.HPropertyType = data.propertyType || '';
    form.HBuildingType = data.buildingType || '';
    form.HRoomCount = data.roomCount || '';
    form.HBathroomCount = data.bathroomCount || '';
    form.HArea = data.area || '';
    form.HFloor = data.floor || '';
    form.HTotalFloors = data.totalFloors || '';
    form.HAvailabilityStatus = data.availabilityStatus || '未出租';
    form.HScore = data.score || '';
    form.HIsVip = !!data.isVip;
    form.HIsShared = !!data.isShared;
    form.HLatitude = data.latitude || '';
    form.HLongitude = data.longitude || '';
    // features
    form.features = [];
    if (data.features) {
      const featureMap = {
        allowsDogs: 'AllowsDogs',
        allowsCats: 'AllowsCats',
        allowsAnimals: 'AllowsAnimals',
        allowsCooking: 'AllowsCooking',
        hasFurniture: 'HasFurniture',
        internet: 'Internet',
        airConditioning: 'AirConditioning',
        sharedRental: 'SharedRental',
        tv: 'Tv',
        refrigerator: 'Refrigerator',
        washingMachine: 'WashingMachine',
        bed: 'Bed',
        waterHeater: 'WaterHeater',
        gasStove: 'GasStove',
        cableTv: 'CableTv',
        waterDispenser: 'WaterDispenser',
        parking: 'Parking',
        socialHousing: 'SocialHousing',
        shortTermRent: 'ShortTermRent',
        publicElectricity: 'PublicElectricity',
        publicWatercharges: 'PublicWatercharges',
        landlordShared: 'LandlordShared',
        balcony: 'Balcony',
        publicEquipment: 'PublicEquipment'
      };
      for (const key in data.features) {
        if (data.features[key] === true && featureMap[key]) {
          form.features.push(featureMap[key]);
        }
      }
    }
    // images
    images.value = [];
    if (data.images && Array.isArray(data.images)) {
      images.value = data.images.map(img => ({
        url: img.url && img.url.startsWith('http') ? img.url : `https://localhost:7022${img.url}`,
        caption: img.Caption || ''
      }));
    }
  } catch (err) {
    error.value = '獲取資料失敗：' + (err.response?.data?.message || err.message);
    console.error('Error fetching property:', err);
  } finally {
    loading.value = false;
  }
}
  // 在 PropertyEdit.vue 中
const deletedImageUrls = ref([]); // 確保這行在 setup 中

function removeImage(index) {
  const img = images.value[index];
  if (img.url) {
    // 只取相對路徑
    const url = img.url.replace('https://localhost:7022', '');
    deletedImageUrls.value.push(url);
    console.log("已加入刪除清單:", url);
    console.log("目前刪除清單:", deletedImageUrls.value);
  }
  images.value.splice(index, 1);
}
// 提交表單
async function onSubmit() {
  // 先顯示確認對話框
  alertConfig.title = '確認修改';
  alertConfig.message = '請問真的要修改嗎？';
  alertConfig.type = 'warning';
  alertConfig.confirmText = '確定';
  alertConfig.cancelText = '取消';
  alertMode.value = 'confirm';
  showAlert.value = true;
}

// 處理 Alert 確認事件
async function handleAlertConfirm() {
  if (alertMode.value === 'confirm') {
    try {
      await saveData();
    } catch (err) {
      alertConfig.title = '錯誤';
      alertConfig.message = '更新失敗：' + (err.response?.data?.message || err.message);
      alertConfig.type = 'error';
      alertConfig.confirmText = '確定';
      alertConfig.cancelText = '';
      alertMode.value = 'error';
      showAlert.value = true;
    }
  } else if (alertMode.value === 'success') {
    showAlert.value = false;
    router.push('/landlord/property-manage');
  } else {
    showAlert.value = false;
  }
}

// 實際儲存資料的函數
async function saveData() {
  loading.value = true;
  try {
    const propertyId = route.params.id;
    const formData = new FormData();
    // 組裝 property
    const propertyData = {
      HPropertyTitle: form.HPropertyTitle,
      HDescription: form.HDescription,
      HAddress: form.HAddress,
      HCity: form.HCity,
      HDistrict: form.HDistrict,
      HZipcode: form.HZipcode,
      HRentPrice: form.HRentPrice,
      HPropertyType: form.HPropertyType,
      HRoomCount: form.HRoomCount,
      HBathroomCount: form.HBathroomCount,
      HArea: form.HArea,
      HFloor: form.HFloor,
      HTotalFloors: form.HTotalFloors,
      HAvailabilityStatus: form.HAvailabilityStatus,
      HBuildingType: form.HBuildingType,
      HIsVip: form.HIsVip,
      HIsShared: form.HIsShared,
      HStatus: '已驗證',
      HLatitude: form.HLatitude,
      HLongitude: form.HLongitude
    };
    // 組裝 features
    const featureData = {
      HAllowsDogs: form.features.includes('AllowsDogs'),
      HAllowsCats: form.features.includes('AllowsCats'),
      HAllowsAnimals: form.features.includes('AllowsAnimals'),
      HAllowsCooking: form.features.includes('AllowsCooking'),
      HHasFurniture: form.features.includes('HasFurniture'),
      HInternet: form.features.includes('Internet'),
      HAirConditioning: form.features.includes('AirConditioning'),
      HSharedRental: form.features.includes('SharedRental'),
      HTv: form.features.includes('Tv'),
      HRefrigerator: form.features.includes('Refrigerator'),
      HWashingMachine: form.features.includes('WashingMachine'),
      HBed: form.features.includes('Bed'),
      HWaterHeater: form.features.includes('WaterHeater'),
      HGasStove: form.features.includes('GasStove'),
      HCableTv: form.features.includes('CableTv'),
      HWaterDispenser: form.features.includes('WaterDispenser'),
      HParking: form.features.includes('Parking'),
      HSocialHousing: form.features.includes('SocialHousing'),
      HShortTermRent: form.features.includes('ShortTermRent'),
      HPublicElectricity: form.features.includes('PublicElectricity'),
      HPublicWatercharges: form.features.includes('PublicWatercharges'),
      HLandlordShared: form.features.includes('LandlordShared'),
      HBalcony: form.features.includes('Balcony'),
      HPublicEquipment: form.features.includes('PublicEquipment')
    };
    formData.append('propertyJson', JSON.stringify(propertyData));
    formData.append('propertyFeatureJson', JSON.stringify(featureData));

    // 加入要刪除的圖片
    if (deletedImageUrls.value.length > 0) {
      formData.append('deletedImageUrls', JSON.stringify(deletedImageUrls.value));
    }
    // 加入新上傳的圖片
    images.value.forEach(img => {
      if (img.file) {
        formData.append('images', img.file);
      }
    });

    await axios.put(`/api/landlord/property/${propertyId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    // 顯示成功提示
    alertConfig.title = '成功';
    alertConfig.message = '資料儲存成功！';
    alertConfig.type = 'success';
    alertConfig.confirmText = '確定';
    alertConfig.cancelText = '返回';
    alertMode.value = 'success';
    showAlert.value = true;
  } catch (err) {
    console.error('更新失敗:', err);
    throw err; // 向上傳遞錯誤，讓 handleAlertConfirm 處理
  } finally {
    loading.value = false;
  }
}

function handleAlertCancel() {
  showAlert.value = false;
}

function goBack() {
  router.back();
}

function toggleFeature(feature) {
  const index = form.features.indexOf(feature);
  if (index === -1) {
    form.features.push(feature);
  } else {
    form.features.splice(index, 1);
  }
}

function onImageChange(event) {
  const files = event.target.files;
  if (!files) return;
  if (images.value.length + files.length > 15) {
    alert('最多只能上傳15張圖片');
    return;
  }
  Array.from(files).forEach(file => {
    if (file.size > 10 * 1024 * 1024) {
      alert(`檔案 ${file.name} 超過10MB限制`);
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      alert(`檔案 ${file.name} 格式不支援`);
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      images.value.push({
        url: e.target.result,
        file: file,
        caption: ''
      });
    };
    reader.readAsDataURL(file);
  });
}

</script>

<style scoped>
.property-edit-container {
  max-width: 1300px;
  margin: 40px auto;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 6px 32px rgba(60, 221, 210, 0.08);
  padding: 2.5rem;
}
h2 {
  color: var(--main-color);
  margin-bottom: 2rem;
  font-weight: bold;
  text-align: center;
}
.form-title {
  color: var(--main-color);
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
  letter-spacing: 1px;
}
.section-block {
  background: #f8fcfc;
  border-radius: 15px;
  margin-bottom: 2.2rem;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(60, 221, 210, 0.04);
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.2rem 2.2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-size: 1rem;
  color: #333;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.8rem 1rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-size: 1rem;
  background: #fff;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #24b4a8;
  outline: none;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.form-group.desc-group {
  grid-column: span 2;
}

.form-group.full-width {
  grid-column: span 2;
}

.image-preview-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  margin-top: 0.7rem;
}

.image-preview-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0.7rem;
  background: #fff;
  position: relative;
}

.image-preview-item img {
  width: 120px;
  height: 90px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.image-preview-item input {
  width: 120px;
  margin-bottom: 0.3rem;
}

.img-del-btn {
  background: #fff;
  color: #e74c3c;
  border: 1px solid #e74c3c;
  border-radius: 6px;
  padding: 0.3rem 0.8rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.img-del-btn:hover {
  background: #e74c3c;
  color: #fff;
}

.img-tip {
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.layout-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem 0.5rem 0.5rem;
  min-height: 100px;
  cursor: pointer;
  transition: all 0.2s;
  color: #666;
  font-size: 0.9rem;
  background: #fff;
}

.feature-item:hover {
  border-color: #24b4a8;
  color: #24b4a8;
}

.feature-item.selected {
  border-color: #24b4a8;
  color: #24b4a8;
  background: #f0fafd;
}

.feature-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
  margin-bottom: 0.5rem;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-outline {
  background: #fff;
  color: #24b4a8;
  border: 2px solid #24b4a8;
  border-radius: 8px;
  padding: 0.8rem 2rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.btn-outline:hover {
  background: #f0fafd;
}

.btn-main {
  background: #24b4a8;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 2rem;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.btn-main:hover {
  background: #1a9c92;
}

@media (max-width: 900px) {
  .property-edit-container {
    padding: 1.5rem;
    margin: 0;
    border-radius: 0;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .form-actions {
    flex-direction: column;
    gap: 0.8rem;
  }
  
  .btn-outline,
  .btn-main {
    width: 100%;
  }
}
</style> 