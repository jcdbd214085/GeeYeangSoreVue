<template>
  <div class="property-detail-container">
    <h2>填寫物件資料</h2>
    <form class="property-form" @submit.prevent="onSubmit">
      <!-- 基本資料卡片 -->
      <section class="form-card">
        <h3 class="form-title">基本資料</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>縣市<span class="required">*</span></label>
            <select v-model="form.city">
              <option disabled value="">請選擇縣市</option>
              <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>區域</label>
            <input v-model="form.district" placeholder="請輸入區域" />
          </div>
          <div class="form-group address-group">
            <label>地址</label>
            <input v-model="form.address" placeholder="請填寫地址" />
          </div>
          <div class="form-group">
            <label>標題</label>
            <input v-model="form.title" placeholder="請輸入標題" />
          </div>
          <div class="form-group full-width">
            <label>簡介</label>
            <textarea v-model="form.description" placeholder="可在此填寫關於出租物件的描述"></textarea>
          </div>
          <div class="form-group full-width">
            <label>照片上傳<span class="required">*</span></label>
            <input type="file" multiple @change="onFileChange" />
            <div class="upload-tip">最少2張，最多15張，拖曳可調整順序。</div>
            <draggable v-model="form.photos" class="photo-preview" item-key="idx" :animation="200">
              <template #item="{ element, index }">
                <img :src="element" class="preview-img" />
              </template>
            </draggable>
          </div>
        </div>
      </section>
      <!-- 空間資訊卡片 -->
      <section class="form-card">
        <h3 class="form-title">空間資訊</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>空間<span class="required">*</span></label>
            <div class="radio-group">
              <label v-for="type in spaceTypes" :key="type" class="radio-label">
                <input type="radio" v-model="form.spaceType" :value="type" /> {{ type }}
              </label>
            </div>
          </div>
          <div class="form-group">
            <label>建物</label>
            <div class="radio-group">
              <label v-for="type in buildingTypes" :key="type" class="radio-label">
                <input type="radio" v-model="form.buildingType" :value="type" /> {{ type }}
              </label>
            </div>
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
            <label>坪數</label>
            <div class="layout-flex">
              <input v-model="form.ping" placeholder="坪數" type="number" min="0" />
              <span>坪</span>
            </div>
          </div>
          <div class="form-group">
            <label>租金</label>
            <div class="layout-flex">
              <div class="layout-item">
                <input v-model="form.rent" type="number" min="0" placeholder="租金金額" />
              </div>
              <div class="layout-item">
                <span>元/月</span>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label>格局</label>
            <div class="layout-flex">
              <div class="layout-item">
                <input v-model="form.room" type="number" min="0" placeholder="房" />房
              </div>
              <div class="layout-item">
                <input v-model="form.bath" type="number" min="0" placeholder="衛浴" />衛浴
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- 按鈕區 -->
      <div class="form-actions center">
        <Button color="outline-secondary" type="button" @click="goBack">上一步</Button>
        <Button color="outline-secondary" type="button" @click="onSaveExit">儲存退出</Button>
        <Button color="primary" type="submit">下一步</Button>
      </div>
      <Alert v-model:show="showAlert" title="儲存提示" message="已儲存並退出" type="success" :confirmText="'確認'"
        :cancelText="'取消'" @confirm="handleAlertConfirm" />
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Button from '@/components/buttons/button.vue';
import Alert from '@/components/alert/Alert.vue';
import draggable from 'vuedraggable';
import { useRouter } from 'vue-router';

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
  imageFiles: [],
  HScore: '',
  HIsVip: false,
  HIsShared: false,
});

const cities = ['台北市', '新北市', '基隆市', '桃園市', '彰化縣', '新竹市', '苗栗縣', '台中市', '宜蘭縣', '南投縣', '雲林縣', '嘉義縣', '台南市', '高雄市', '屏東縣', '花蓮縣', '台東縣', '澎湖縣', '金門縣', '連江縣'];
const spaceTypes = ['整棟住家', '整層住家', '套房', '雅房'];
const buildingTypes = ['透天', '公寓', '大樓', '華廈'];
const showAlert = ref(false);
const router = useRouter();

function toggleRentInclude(val) {
  const idx = form.value.rentIncludes.indexOf(val);
  if (idx === -1) form.value.rentIncludes.push(val);
  else form.value.rentIncludes.splice(idx, 1);
}
function onFileChange(e) {
  const files = e.target.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    form.value.imageFiles.push(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      form.value.photos.push(event.target.result);
    };
    reader.readAsDataURL(file);
  }
}
function goBack() {
  // 返回上一頁
  window.history.back();
}
function onSaveExit() {
  // 儲存草稿
  const features = JSON.parse(localStorage.getItem('propertyFeatures') || '[]');
  const draft = {
    step: 'detail',
    data: { ...form.value, features, HScore: '', HIsVip: false, HIsShared: false },
    savedAt: new Date().toISOString()
  };
  let drafts = JSON.parse(localStorage.getItem('propertyDrafts') || '[]');
  drafts.push(draft);
  localStorage.setItem('propertyDrafts', JSON.stringify(drafts));
  showAlert.value = true;
}
function handleAlertConfirm() {
  window.history.back();
}
function toggleParking(type) {
  form.value.parking = (form.value.parking === type) ? '' : type;
}
function onSubmit() {
  // 取得features
  const features = JSON.parse(localStorage.getItem('propertyFeatures') || '[]');
  // 整合資料
  const propertyDetail = {
    ...form.value,
    features,
    photos: form.value.photos,
    imageFiles: form.value.imageFiles.map(f => ({ name: f.name })),
    HScore: '',
    HIsVip: false,
    HIsShared: false
  };
  localStorage.setItem('propertyDetail', JSON.stringify(propertyDetail));
  // 圖片檔案暫存於window
  window._propertyImageFiles = form.value.imageFiles;
  // 跳轉到曝光方案選擇頁面
  router.push('/landlord/property-plan-select');
}
</script>

<style scoped>
.property-detail-container {
  max-width: 90%;
  margin: 40px auto 0 auto;
  background: #f7fafc;
  border-radius: 18px;
  padding: 2.5rem 2.5rem 2rem 2.5rem;
}

h2 {
  color: var(--main-color);
  margin-bottom: 2rem;
  font-weight: bold;
  text-align: center;
}

.form-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(60, 221, 210, 0.10);
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  margin-bottom: 2.2rem;
}

.form-title {
  color: var(--main-color);
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
  letter-spacing: 1px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem 2.2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.full-width {
  grid-column: 1 / 3;
}

label {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.2rem;
}

.required {
  color: #f44336;
  margin-left: 0.2rem;
}

input,
select,
textarea {
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-size: 1rem;
  background: #fafbfc;
}

input:focus,
select:focus,
textarea:focus {
  outline: 2px solid var(--main-color);
  border-color: var(--main-color);
  background: #f0fafd;
}

textarea {
  min-height: 80px;
  resize: vertical;
  max-width: 100%;
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

.layout-flex {
  display: flex;
  gap: 0.7rem;
  flex-wrap: wrap;
  align-items: center;
}

.layout-item {
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

.floor-flex {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.upload-tip {
  color: #888;
  font-size: 0.95rem;
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
}

.tag.selected {
  background: var(--main-color);
  color: #fff;
  border: none;
}

.input-tip {
  color: #888;
  font-size: 0.95rem;
  margin-top: 0.2rem;
}

.form-actions.center {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2.5rem;
}

@media (max-width: 900px) {
  .property-detail-container {
    padding: 1rem 0.5rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .full-width {
    grid-column: 1 / 2;
  }

  .form-actions.center {
    flex-direction: column;
    align-items: stretch;
    gap: 0.7rem;
    margin-top: 1.2rem;
  }
}
</style>