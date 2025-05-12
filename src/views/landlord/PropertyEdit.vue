<template>
  <div class="property-detail-container">
    <h2>編輯物件</h2>
    <form class="property-form" @submit.prevent="onSubmit">
      <div class="form-row">
        <section class="form-card half-width">
          <!-- 基本資料卡片 -->
          <h3 class="form-title">基本資料</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>縣市<span class="required">*</span></label>
              <select 
                v-model="form.city" 
                :class="{ 'error': formErrors.city }"
                @blur="validateField('city')"
              >
                <option disabled value="">請選擇縣市</option>
                <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
              </select>
              <span class="error-message" v-if="formErrors.city">{{ formErrors.city }}</span>
            </div>
            <div class="form-group">
              <label>區域</label>
              <input v-model="form.district" placeholder="請輸入區域" />
            </div>
            <div class="form-group">
              <label>路段</label>
              <input v-model="form.road" placeholder="請輸入路段" />
            </div>
            <div class="form-group address-group">
              <label>地址</label>
              <input v-model="form.address" placeholder="請填寫地址" />
            </div>
            <div class="form-group">
              <label>標題<span class="required">*</span></label>
              <input 
                v-model="form.title" 
                placeholder="請輸入標題" 
                :class="{ 'error': formErrors.title }"
                @blur="validateField('title')"
              />
              <span class="error-message" v-if="formErrors.title">{{ formErrors.title }}</span>
            </div>
            <div class="form-group full-width">
              <label>簡介<span class="required">*</span></label>
              <textarea 
                v-model="form.description" 
                placeholder="可在此填寫關於出租物件的描述" 
                :class="{ 'error': formErrors.description }"
                @blur="validateField('description')"
              ></textarea>
              <span class="error-message" v-if="formErrors.description">{{ formErrors.description }}</span>
            </div>
            <div class="form-group full-width">
              <label>照片上傳<span class="required">*</span></label>
              <input 
                type="file" 
                multiple 
                @change="onFileChange" 
                :class="{ 'error': formErrors.photos }"
                @blur="validateField('photos')"
              />
              <div class="upload-tip">最少2張，最多15張，拖曳可調整順序。</div>
              <span class="error-message" v-if="formErrors.photos">{{ formErrors.photos }}</span>
              <draggable v-model="form.photos" class="photo-preview" item-key="idx" :animation="200">
                <template #item="{element, index}">
                  <img :src="element" class="preview-img" />
                </template>
              </draggable>
            </div>
          </div>
        </section>
        <section class="form-card half-width">
          <!-- 空間資訊卡片 -->
          <h3 class="form-title">空間資訊</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>空間<span class="required">*</span></label>
              <div 
                class="radio-group" 
                :class="{ 'error': formErrors.spaceType }"
                @blur="validateField('spaceType')"
              >
                <label v-for="type in spaceTypes" :key="type" class="radio-label">
                  <input type="radio" v-model="form.spaceType" :value="type" /> {{ type }}
                </label>
              </div>
              <span class="error-message" v-if="formErrors.spaceType">{{ formErrors.spaceType }}</span>
            </div>
            <div class="form-group">
              <label>建物<span class="required">*</span></label>
              <div 
                class="radio-group" 
                :class="{ 'error': formErrors.buildingType }"
                @blur="validateField('buildingType')"
              >
                <label v-for="type in buildingTypes" :key="type" class="radio-label">
                  <input type="radio" v-model="form.buildingType" :value="type" /> {{ type }}
                </label>
              </div>
              <span class="error-message" v-if="formErrors.buildingType">{{ formErrors.buildingType }}</span>
            </div>
            <div class="form-group">
              <label>樓層</label>
              <div class="floor-flex">
                <select v-model="form.floor">
                  <option v-for="n in 50" :key="n" :value="n">{{ n }}</option>
                </select>
                <span>/</span>
                <select v-model="form.totalFloor">
                  <option v-for="n in 50" :key="n" :value="n">{{ n }}</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>坪數<span class="required">*</span></label>
              <input 
                v-model="form.ping" 
                placeholder="坪數" 
                type="number" 
                min="0" 
                :class="{ 'error': formErrors.ping }"
                @blur="validateField('ping')"
              />
              <span>坪</span>
              <span class="error-message" v-if="formErrors.ping">{{ formErrors.ping }}</span>
            </div>
            <div class="form-group full-width">
              <label>格局</label>
              <div class="layout-flex">
                <div class="layout-item">
                  <input v-model="form.room" type="number" min="0" placeholder="房" />房
                </div>
                <div class="layout-item">
                  <input v-model="form.living" type="number" min="0" placeholder="廳" />廳
                </div>
                <div class="layout-item">
                  <input v-model="form.bath" type="number" min="0" placeholder="衛浴" />衛浴
                </div>
                <div class="layout-item">
                  <input v-model="form.balcony" type="number" min="0" placeholder="陽台" />陽台
                </div>
                <div class="layout-item">
                  <input v-model="form.kitchen" type="number" min="0" placeholder="廚房" />廚房
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <!-- 特色選擇區塊 -->
      <section class="form-card">
        <h3 class="form-title">房源特色</h3>
        <div class="feature-grid">
          <div v-for="feature in features" :key="feature.value" :class="['feature-item', {selected: form.features.includes(feature.value)}]" @click="toggleFeature(feature.value)">
            <input type="checkbox" class="feature-checkbox" :checked="form.features.includes(feature.value)" @change="toggleFeature(feature.value)" />
            <img v-if="feature.img" :src="feature.img" alt="" class="feature-img" />
            <span class="feature-label">{{ feature.label }}</span>
          </div>
        </div>
      </section>
      <div class="form-row">
        <section class="form-card half-width">
          <!-- 聯絡方式卡片 -->
          <h3 class="form-title">聯絡方式</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>身分<span class="required">*</span></label>
              <div 
                class="radio-group" 
                :class="{ 'error': formErrors.identity }"
                @blur="validateField('identity')"
              >
                <label v-for="type in identityTypes" :key="type" class="radio-label">
                  <input type="radio" v-model="form.identity" :value="type" /> {{ type }}
                </label>
              </div>
              <span class="error-message" v-if="formErrors.identity">{{ formErrors.identity }}</span>
            </div>
            <div class="form-group">
              <label>LINE ID</label>
              <input v-model="form.lineId" placeholder="請輸入LINE ID" />
              <div class="input-tip">因海外詐騙集團常用LINE作為詐騙工具，為保障您的資產安全，建議不填寫LINE ID。</div>
            </div>
            <div class="form-group">
              <label>手機號碼</label>
              <input 
                v-model="form.phone" 
                placeholder="請輸入手機號碼" 
                :class="{ 'error': formErrors.phone }"
                @blur="validateField('phone')"
              />
              <span class="error-message" v-if="formErrors.phone">{{ formErrors.phone }}</span>
            </div>
            <div class="form-group">
              <label>市內電話</label>
              <input v-model="form.tel" placeholder="請輸入市內電話" />
            </div>
          </div>
        </section>
        <section class="form-card half-width">
          <!-- 租賃條件卡片 -->
          <h3 class="form-title">租賃條件</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>車位</label>
              <div class="tag-group">
                <span v-for="type in parkingTypes" :key="type" :class="['tag', {selected: form.parking === type}]" @click="toggleParking(type)">{{ type }}</span>
              </div>
            </div>
            <div class="form-group">
              <label>產權登記<span class="required">*</span></label>
              <div 
                class="radio-group" 
                :class="{ 'error': formErrors.ownership }"
                @blur="validateField('ownership')"
              >
                <label class="radio-label"><input type="radio" v-model="form.ownership" value="有" />有</label>
                <label class="radio-label"><input type="radio" v-model="form.ownership" value="無" />無</label>
              </div>
              <span class="error-message" v-if="formErrors.ownership">{{ formErrors.ownership }}</span>
            </div>
            <div class="form-group">
              <label>建物面積<span class="required">*</span></label>
              <input 
                v-model="form.area" 
                type="number" 
                min="0" 
                placeholder="0" 
                :class="{ 'error': formErrors.area }"
                @blur="validateField('area')"
              />
              <span>坪</span>
              <span class="error-message" v-if="formErrors.area">{{ formErrors.area }}</span>
            </div>
            <div class="form-group">
              <label>法定用途</label>
              <select v-model="form.usage">
                <option disabled value="">請選擇</option>
                <option v-for="usage in usageTypes" :key="usage" :value="usage">{{ usage }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>最短租期<span class="required">*</span></label>
              <select 
                v-model="form.minLease" 
                :class="{ 'error': formErrors.minLease }"
                @blur="validateField('minLease')"
              >
                <option v-for="lease in leaseTerms" :key="lease" :value="lease">{{ lease }}</option>
              </select>
              <span class="error-message" v-if="formErrors.minLease">{{ formErrors.minLease }}</span>
            </div>
            <div class="form-group">
              <label>租金<span class="required">*</span></label>
              <input 
                v-model="form.rent" 
                type="number" 
                min="0" 
                placeholder="租金金額" 
                :class="{ 'error': formErrors.rent }"
                @blur="validateField('rent')"
              />
              <span>元/月</span>
              <span class="error-message" v-if="formErrors.rent">{{ formErrors.rent }}</span>
            </div>
            <div class="form-group">
              <label>租金包含</label>
              <div class="tag-group">
                <span v-for="type in rentIncludes" :key="type" :class="['tag', {selected: form.rentIncludes.includes(type)}]" @click="toggleRentInclude(type)">{{ type }}</span>
              </div>
            </div>
            <div class="form-group">
              <label>押金<span class="required">*</span></label>
              <input 
                v-model="form.deposit" 
                type="number" 
                min="0" 
                placeholder="0" 
                :class="{ 'error': formErrors.deposit }"
                @blur="validateField('deposit')"
              />
              <span>元</span>
              <span class="error-message" v-if="formErrors.deposit">{{ formErrors.deposit }}</span>
            </div>
            <div class="form-group">
              <label>管理費</label>
              <input v-model="form.managementFee" type="number" min="0" placeholder="0" />
              <span>元/月</span>
            </div>
          </div>
        </section>
      </div>
      <!-- 按鈕區 -->
      <div class="form-actions center">
        <Button color="outline-secondary" type="button" @click="goBack">返回</Button>
        <Button color="primary" type="submit">儲存變更</Button>
        <Button color="outline-danger" type="button" @click="onDeactivate">下架</Button>
      </div>
      <Alert
        v-model:show="showAlert"
        title="儲存提示"
        message="已儲存變更"
        type="success"
        :confirmText="'確認'"
        :cancelText="'取消'"
        @confirm="handleAlertConfirm"
      />
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Button from '@/components/buttons/button.vue';
import Alert from '@/components/alert/Alert.vue';
import draggable from 'vuedraggable';
import { useRouter } from 'vue-router';

const router = useRouter();
const showAlert = ref(false);
const formErrors = ref({});  // 新增錯誤訊息物件
const touched = ref({});  // 追蹤欄位是否已被觸碰

const form = ref({
  city: '',
  district: '',
  road: '',
  address: '',
  hideAddress: false,
  spaceType: '',
  buildingType: '',
  floor: 1,
  totalFloor: 1,
  ping: '',
  room: 0,
  living: 0,
  bath: 0,
  balcony: 0,
  kitchen: 0,
  title: '',
  description: '',
  photos: [],
  managementFee: '',
  features: [],
  identity: '',
  lineId: '',
  phone: '',
  tel: '',
  parking: '',
  condition: '',
  ownership: '',
  area: '',
  usage: '',
  minLease: '',
  rent: '',
  rentIncludes: [],
  deposit: '',
});

const cities = ['台北市', '新北市', '桃園市'];
const spaceTypes = ['整層', '獨立套房', '分租套房', '雅房'];
const buildingTypes = ['透天', '公寓', '電梯大樓', '別墅'];
const identityTypes = ['房東', '仲介', '代管', '代理人'];
const parkingTypes = ['有機車車位', '有汽車車位'];
const conditionTypes = ['限女性', '限男性'];
const usageTypes = ['住家用', '商業用', '辦公用'];
const leaseTerms = ['一年', '半年', '三個月'];
const rentIncludes = ['電費', '水費', '瓦斯費', '第四台', '網路費', '管理費', '清潔費'];

// 特色選擇
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

function toggleRentInclude(val) {
  const idx = form.value.rentIncludes.indexOf(val);
  if (idx === -1) form.value.rentIncludes.push(val);
  else form.value.rentIncludes.splice(idx, 1);
}
function onFileChange(e) {
  const files = e.target.files;
  for (let i = 0; i < files.length; i++) {
    const reader = new FileReader();
    reader.onload = (event) => {
      form.value.photos.push(event.target.result);
    };
    reader.readAsDataURL(files[i]);
  }
}
function goBack() {
  // 返回上一頁
  window.history.back();
}
function handleAlertConfirm() {
  window.history.back();
}
function toggleParking(type) {
  form.value.parking = (form.value.parking === type) ? '' : type;
}
function toggleFeature(val) {
  const idx = form.value.features.indexOf(val);
  if (idx === -1) form.value.features.push(val);
  else form.value.features.splice(idx, 1);
}

// 驗證單個欄位
function validateField(field) {
  const value = form.value[field];
  touched.value[field] = true;

  switch (field) {
    case 'city':
      return !value ? '請選擇縣市' : '';
    case 'title':
      return !value ? '請輸入標題' : '';
    case 'description':
      return !value ? '請輸入簡介' : '';
    case 'photos':
      if (!value || value.length < 2) return '請至少上傳2張照片';
      if (value.length > 15) return '最多只能上傳15張照片';
      return '';
    case 'spaceType':
      return !value ? '請選擇空間類型' : '';
    case 'buildingType':
      return !value ? '請選擇建物類型' : '';
    case 'ping':
      if (!value) return '請輸入坪數';
      if (value <= 0) return '坪數必須大於0';
      return '';
    case 'identity':
      return !value ? '請選擇身分' : '';
    case 'phone':
      if (value && !/^09\d{8}$/.test(value)) return '請輸入有效的手機號碼';
      return '';
    case 'ownership':
      return !value ? '請選擇產權登記' : '';
    case 'area':
      if (!value) return '請輸入建物面積';
      if (value <= 0) return '建物面積必須大於0';
      return '';
    case 'minLease':
      return !value ? '請選擇最短租期' : '';
    case 'rent':
      if (!value) return '請輸入租金';
      if (value <= 0) return '租金必須大於0';
      return '';
    case 'deposit':
      if (!value) return '請輸入押金';
      if (value <= 0) return '押金必須大於0';
      return '';
    default:
      return '';
  }
}

// 監聽表單變化
watch(() => form.value, (newVal) => {
  Object.keys(newVal).forEach(field => {
    if (touched.value[field]) {
      const error = validateField(field);
      if (error) {
        formErrors.value[field] = error;
      } else {
        delete formErrors.value[field];
      }
    }
  });
}, { deep: true });

function validateForm() {
  const errors = {};
  Object.keys(form.value).forEach(field => {
    const error = validateField(field);
    if (error) {
      errors[field] = error;
    }
  });
  return errors;
}

function onSubmit() {
  const errors = validateForm();
  if (Object.keys(errors).length > 0) {
    formErrors.value = errors;
    return;
  }
  
  // 儲存變更，這裡可串接 API 或 localStorage
  showAlert.value = true;
}
function onDeactivate() {
  alert('下架物件（待串接 API）');
}

// 根據 URL 參數載入物件資料
onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (id) {
    // 這裡可根據 id 從 localStorage 或 API 載入資料
    const all = JSON.parse(localStorage.getItem('propertyActive') || '[]');
    const found = all.find(p => p.id == id);
    if (found) {
      Object.assign(form.value, found);
    }
  }
});
</script>

<style scoped>
.property-detail-container {
  max-width: 90%;
  margin: 40px auto 0 auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 6px 32px rgba(60, 221, 210, 0.10);
  padding: 2.5rem 2.5rem 2rem 2.5rem;
}
h2 {
  color: var(--main-color, #24B4A8);
  margin-bottom: 2rem;
  font-weight: bold;
  text-align: center;
  letter-spacing: 1px;
}
.property-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.form-row {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.2rem;
}
.half-width {
  flex: 1 1 0;
  min-width: 0;
}
.form-card {
  background: #f9fafb;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(60, 221, 210, 0.08);
  padding: 1.2rem 1.5rem 1rem 1.5rem;
  margin-bottom: 0;
}
.form-title {
  color: var(--main-color, #24B4A8);
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
  letter-spacing: 1px;
}
.form-grid {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  align-items: center;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  width: 100%;
  max-width: 400px;
}
label {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.2rem;
}
input, select, textarea {
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-size: 1rem;
  background: #fafbfc;
  transition: border 0.2s;
  width: 100%;
  box-sizing: border-box;
}
input:focus, select:focus, textarea:focus {
  outline: 2px solid var(--main-color, #24B4A8);
  border-color: var(--main-color, #24B4A8);
  background: #f0fafd;
}
textarea {
  min-height: 80px;
  resize: vertical;
  max-width: 100%;
}
.layout-flex {
  display: flex;
  gap: 1.2rem;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
}
.layout-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  min-width: 110px;
  max-width: 140px;
}
.layout-item input {
  width: 60px;
  min-width: 0;
  text-align: center;
  padding: 0.5rem 0.5rem;
}
.radio-group {
  display: flex;
  gap: 1.2rem;
  flex-wrap: wrap;
}
.radio-label {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.form-actions.center {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;
}
button, .btn, .Button {
  border-radius: 8px !important;
  font-size: 1rem !important;
  padding: 0.7rem 1.5rem !important;
  font-weight: 600 !important;
  box-shadow: 0 2px 8px #e0f7fa;
  border: none;
  background: var(--main-color, #24B4A8);
  color: #fff;
  transition: background 0.2s;
}
button:hover, .btn:hover, .Button:hover {
  background: #1fa89c;
}
@media (max-width: 900px) {
  .form-row {
    flex-direction: column;
    gap: 1.2rem;
  }
  .half-width {
    width: 100%;
  }
}
.feature-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem 2.2rem;
  margin-top: 0.5rem;
}
.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  width: 70px;
  margin-bottom: 0.5rem;
  position: relative;
  border: 2px solid transparent;
  border-radius: 10px;
  transition: border 0.2s, background 0.2s;
}
.feature-item.selected {
  border: 2px solid var(--main-color, #24B4A8);
  background: #e0f7fa;
}
.feature-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
  margin-bottom: 0.2rem;
}
.feature-checkbox {
  margin-bottom: 0.2rem;
  pointer-events: none;
}
.feature-label {
  font-size: 0.85rem;
  color: #444;
  text-align: center;
  margin-top: 0.1rem;
}
.tag-group {
  display: flex;
  gap: 0.7rem;
  flex-wrap: wrap;
}
.tag {
  padding: 0.4rem 1.2rem;
  border-radius: 1rem;
  background: #f5f5f5;
  color: #666;
  border: 1px solid #ddd;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
  user-select: none;
}
.tag.selected {
  background: var(--main-color, #24B4A8);
  color: #fff;
  border: none;
}
.photo-preview {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}
.preview-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #eee;
  cursor: grab;
}
.error {
  border-color: #ff4d4f !important;
  background-color: #fff2f0 !important;
}

.error-message {
  color: #ff4d4f;
  font-size: 0.85rem;
  margin-top: 0.2rem;
}

.radio-group.error {
  border: 1px solid #ff4d4f;
  border-radius: 8px;
  padding: 0.5rem;
  background-color: #fff2f0;
}
</style> 