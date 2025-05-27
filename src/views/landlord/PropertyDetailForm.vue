<template>
  <div class="property-detail-container">
    <h2>填寫物件資料</h2>
    <form class="property-form" @submit.prevent="onSubmit">
      <!-- 基本資料卡片 -->
      <section class="form-card">
        <h3 class="form-title">基本資料</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>縣市</label>
            <select v-model="form.HCity">
              <option disabled value="">請選擇縣市</option>
              <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>區域</label>
            <input v-model="form.HDistrict" placeholder="請輸入區域" />
          </div>
          <div class="form-group">
            <label>郵遞區號</label>
            <input v-model="form.HZipcode" placeholder="請輸入郵遞區號" />
          </div>
          <div class="form-group address-group">
            <label>地址</label>
            <input v-model="form.HAddress" placeholder="請填寫地址" />
          </div>
          <div class="form-group">
            <label>標題</label>
            <input v-model="form.HPropertyTitle" placeholder="請輸入標題" />
          </div>
          <div class="form-group full-width">
            <label>簡介</label>
            <div class="description-container">
              <textarea v-model="form.HDescription" placeholder="可在此填寫關於出租物件的描述  - 請先填寫縣市、區域與標題才能使用AI生成文案"></textarea>
              <div class="button-container">
                <button type="button" class="generate-btn" @click="generateDescription" :disabled="!canGenerate || isGenerating">
                  <span v-if="isGenerating" class="loading-spinner"></span>
                  <i v-else class="fas fa-magic"></i>
                  {{ isGenerating ? '生成中...' : 'AI生成文案' }}
                </button>
              </div>
            </div>
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
      <!-- 空間資訊卡片 -->
      <section class="form-card">
        <h3 class="form-title">空間資訊</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>空間</label>
            <div class="radio-group">
              <label v-for="type in spaceTypes" :key="type" class="radio-label">
                <input type="radio" v-model="form.HPropertyType" :value="type" /> {{ type }}
              </label>
            </div>
          </div>
          <div class="form-group">
            <label>建物</label>
            <div class="radio-group">
              <label v-for="type in buildingTypes" :key="type" class="radio-label">
                <input type="radio" v-model="form.HBuildingType" :value="type" /> {{ type }}
              </label>
            </div>
          </div>
          <div class="form-group">
            <label>樓層</label>
            <div class="floor-flex">
              <select v-model="form.HFloor">
                <option v-for="n in 50" :key="n" :value="n">{{ n }}</option>
              </select>
              <span>/</span>
              <select v-model="form.HTotalFloors">
                <option v-for="n in 50" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>坪數</label>
            <div class="layout-flex">
              <input v-model="form.HArea" placeholder="坪數" type="number" min="0" />
              <span>坪</span>
            </div>
          </div>
          <div class="form-group">
            <label>租金</label>
            <div class="layout-flex">
              <div class="layout-item">
                <input v-model="form.HRentPrice" type="number" min="0" placeholder="租金金額" />
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
                <input v-model="form.HRoomCount" type="number" min="0" placeholder="房" />房
              </div>
              <div class="layout-item">
                <input v-model="form.HBathroomCount" type="number" min="0" placeholder="衛浴" />衛浴
              </div>
            </div>
          </div>
          <div class="ai-analysis-tip">
            填寫空間型態、坪數、格局等資訊再點擊分析系統將產生區域市場趨勢報告。
          </div>
          <div class="form-group analysis-btn-group single-btn">
            <button type="button" class="generate-btn" @click="generateMarketAnalysis" :disabled="!canAnalyze || isAnalyzing">
              <span v-if="isAnalyzing" class="loading-spinner"></span>
              <i v-else class="fas fa-chart-line"></i>
              {{ isAnalyzing ? '分析中...' : 'AI市場分析' }}
            </button>
          </div>
        </div>
      </section>
      <div class="form-actions center">
        <Button color="outline-secondary" type="button" @click="goBack">上一步</Button>
        <Button color="outline-secondary" type="button" @click="onSaveExit">儲存草稿</Button>
        <Button color="primary" type="submit">下一步</Button>
      </div>
    </form>

    <!-- Alert 元件 -->
    <Alert
      v-model:show="showAlert"
      :title="alertConfig.title"
      :type="alertConfig.type"
      :confirmText="alertConfig.confirmText"
      :cancelText="alertConfig.cancelText"
      :singleButton="alertConfig.singleButton"
      :singleButtonText="alertConfig.singleButtonText"
      @confirm="onAlertConfirm"
      @cancel="handleAlertCancel"
    >
      <div class="market-analysis-content">{{ alertConfig.message }}</div>
    </Alert>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import Button from '@/components/buttons/button.vue';
import Alert from '@/components/alert/Alert.vue';
import draggable from 'vuedraggable';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const route = useRoute();
const showAlert = ref(false);
const alertMode = ref('');
const alertConfig = reactive({
  title: '',
  message: '',
  type: 'info',
  confirmText: '確認',
  cancelText: '取消',
  singleButton: false,
  singleButtonText: '確認'
});
const form = ref({
  // HProperty 所有欄位
  HPropertyTitle: '',
  HDescription: '',
  HAddress: '',
  HCity: '',
  HDistrict: '',
  HZipcode: '',
  HRentPrice: 0,
  HPropertyType: '',
  HRoomCount: 0,
  HBathroomCount: 0,
  HArea: 0,
  HFloor: 1,
  HTotalFloors: 1,
  HAvailabilityStatus: '未出租',
  HBuildingType: '',
  HScore: 1,
  HIsVip: false,
  HIsShared: false,
  HStatus: '未驗證',
  HLatitude: '',
  HLongitude: '',
  // 其他欄位
  features: [],
  photos: [],
  imageFiles: [],
});

const images = ref([]);

onMounted(async () => {
  const id = route.query.id;
  if (id) {
    // 編輯模式，自動載入資料
    await fetchPropertyData(id);
  }
  if (route.query.features) {
    form.value.features = JSON.parse(route.query.features);
  }
});

async function fetchPropertyData(id) {
  try {
    const res = await axios.get(`/api/landlord/property/${id}`);
    if (res.data && res.data.property) {
      Object.assign(form.value, res.data.property);
      // 還原房源特色
      if (res.data.propertyFeature && typeof res.data.propertyFeature === 'object') {
        form.value.features = Object.keys(res.data.propertyFeature)
          .filter(key => res.data.propertyFeature[key]);
      }
      // 還原圖片
      if (res.data.images && Array.isArray(res.data.images)) {
        images.value = res.data.images.map(img => ({
          url: img.url,
          file: null
        }));
      } else if (res.data.propertyImages && Array.isArray(res.data.propertyImages)) {
        images.value = res.data.propertyImages.map(img => ({
          url: img.url,
          file: null
        }));
      }
    }
  } catch (e) {
    alert('載入物件資料失敗');
  }
}

const cities = ['台北市', '新北市', '基隆市', '桃園市', '彰化縣', '新竹市', '苗栗縣', '台中市', '宜蘭縣', '南投縣', '雲林縣', '嘉義縣', '台南市', '高雄市', '屏東縣', '花蓮縣', '台東縣', '澎湖縣', '金門縣', '連江縣'];
const spaceTypes = ['整棟住家', '整層住家', '套房', '雅房'];
const buildingTypes = ['透天', '公寓', '大樓', '華廈'];

function onImageChange(e) {
  const files = e.target.files;
  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  // 檢查檔案數量
  if (images.value.length + files.length > 15) {
    alert('最多只能上傳15張照片');
    return;
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    // 檢查檔案類型
    if (!allowedTypes.includes(file.type)) {
      alert(`檔案 ${file.name} 格式不支援，請上傳 JPG、PNG、GIF 或 WEBP 格式的圖片`);
      continue;
    }
    
    // 檢查檔案大小
    if (file.size > maxFileSize) {
      alert(`檔案 ${file.name} 太大，請上傳小於 10MB 的圖片`);
      continue;
    }

    form.value.imageFiles.push(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      images.value.push({
        url: event.target.result,
        file: file
      });
    };
    reader.readAsDataURL(file);
  }
}

function removeImage(index) {
  images.value.splice(index, 1);
  form.value.imageFiles.splice(index, 1);
}

function goBack() {
  router.push('/landlord/property-create');
}

async function onSaveExit() {
  alertMode.value = 'save';
  showAlert.value = true;
  alertConfig.title = '確認儲存';
  alertConfig.message = '確定要將此物件儲存為草稿嗎？';
  alertConfig.type = 'info';
  alertConfig.confirmText = '確認';
  alertConfig.cancelText = '取消';
  alertConfig.singleButton = false;
}

async function handleAlertConfirm() {
  try {
    const formData = new FormData();
    
    // 組裝 property 資料
    const propertyData = {
      HPropertyTitle: form.value.HPropertyTitle,
      HDescription: form.value.HDescription,
      HAddress: form.value.HAddress,
      HCity: form.value.HCity,
      HDistrict: form.value.HDistrict,
      HZipcode: form.value.HZipcode,
      HRentPrice: form.value.HRentPrice,
      HPropertyType: form.value.HPropertyType,
      HRoomCount: form.value.HRoomCount,
      HBathroomCount: form.value.HBathroomCount,
      HArea: form.value.HArea,
      HFloor: form.value.HFloor,
      HTotalFloors: form.value.HTotalFloors,
      HAvailabilityStatus: '未出租',
      HBuildingType: form.value.HBuildingType,
      HIsVip: form.value.HIsVip,
      HIsShared: form.value.HIsShared,
      HStatus: '草稿',
      HLatitude: form.value.HLatitude,
      HLongitude: form.value.HLongitude,
      HIsDelete: false
    };

    formData.append('property', JSON.stringify(propertyData));
    formData.append('propertyFeature', JSON.stringify(form.value.features));
    formData.append('ad', JSON.stringify({}));
    
    // 加入圖片
    form.value.imageFiles.forEach(file => {
      formData.append('images', file);
    });

    const response = await axios.post('/api/landlord/property', formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.data.success) {
      showAlert.value = true;
      alertConfig.title = '成功';
      alertConfig.message = '已成功儲存為草稿';
      alertConfig.type = 'success';
      alertConfig.confirmText = '確認';
      alertConfig.cancelText = '';
      alertConfig.singleButton = true;
      alertConfig.singleButtonText = '確認';
      router.push('/landlord/property-manage');
    } else {
      showAlert.value = true;
      alertConfig.title = '錯誤';
      alertConfig.message = response.data.message || '儲存失敗';
      alertConfig.type = 'error';
      alertConfig.confirmText = '確認';
      alertConfig.cancelText = '';
      alertConfig.singleButton = true;
      alertConfig.singleButtonText = '確認';
    }
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

function handleAlertCancel() {
  showAlert.value = false;
}

async function onSubmit() {
  try {
    // 驗證必填欄位
    if (!form.value.HPropertyTitle) {
      alertMode.value = 'error';
      showAlert.value = true;
      alertConfig.title = '錯誤';
      alertConfig.message = '請輸入物件標題';
      alertConfig.type = 'error';
      alertConfig.confirmText = '確認';
      alertConfig.cancelText = '';
      alertConfig.singleButton = true;
      alertConfig.singleButtonText = '確認';
      return;
    }
    if (!form.value.HAddress) {
      alertMode.value = 'error';
      showAlert.value = true;
      alertConfig.title = '錯誤';
      alertConfig.message = '請輸入物件地址';
      alertConfig.type = 'error';
      alertConfig.confirmText = '確認';
      alertConfig.cancelText = '';
      alertConfig.singleButton = true;
      alertConfig.singleButtonText = '確認';
      return;
    }
    if (!form.value.HCity) {
      alertMode.value = 'error';
      showAlert.value = true;
      alertConfig.title = '錯誤';
      alertConfig.message = '請選擇城市';
      alertConfig.type = 'error';
      alertConfig.confirmText = '確認';
      alertConfig.cancelText = '';
      alertConfig.singleButton = true;
      alertConfig.singleButtonText = '確認';
      return;
    }
    if (!form.value.HDistrict) {
      alertMode.value = 'error';
      showAlert.value = true;
      alertConfig.title = '錯誤';
      alertConfig.message = '請輸入區域';
      alertConfig.type = 'error';
      alertConfig.confirmText = '確認';
      alertConfig.cancelText = '';
      alertConfig.singleButton = true;
      alertConfig.singleButtonText = '確認';
      return;
    }
    if (!form.value.HRentPrice || form.value.HRentPrice <= 0) {
      alertMode.value = 'error';
      showAlert.value = true;
      alertConfig.title = '錯誤';
      alertConfig.message = '請輸入有效的租金金額';
      alertConfig.type = 'error';
      alertConfig.confirmText = '確認';
      alertConfig.cancelText = '';
      alertConfig.singleButton = true;
      alertConfig.singleButtonText = '確認';
      return;
    }
    if (!form.value.HPropertyType) {
      alertMode.value = 'error';
      showAlert.value = true;
      alertConfig.title = '錯誤';
      alertConfig.message = '請選擇物件類型';
      alertConfig.type = 'error';
      alertConfig.confirmText = '確認';
      alertConfig.cancelText = '';
      alertConfig.singleButton = true;
      alertConfig.singleButtonText = '確認';
      return;
    }
    if (images.value.length < 2) {
      alertMode.value = 'error';
      showAlert.value = true;
      alertConfig.title = '錯誤';
      alertConfig.message = '請至少上傳2張照片';
      alertConfig.type = 'error';
      alertConfig.confirmText = '確認';
      alertConfig.cancelText = '';
      alertConfig.singleButton = true;
      alertConfig.singleButtonText = '確認';
      return;
    }

    // 將表單資料存入 localStorage
    const formData = {
      property: {
        HPropertyTitle: form.value.HPropertyTitle,
        HDescription: form.value.HDescription,
        HAddress: form.value.HAddress,
        HCity: form.value.HCity,
        HDistrict: form.value.HDistrict,
        HZipcode: form.value.HZipcode,
        HRentPrice: form.value.HRentPrice,
        HPropertyType: form.value.HPropertyType,
        HRoomCount: form.value.HRoomCount,
        HBathroomCount: form.value.HBathroomCount,
        HArea: form.value.HArea,
        HFloor: form.value.HFloor,
        HTotalFloors: form.value.HTotalFloors,
        HAvailabilityStatus: '未出租',
        HBuildingType: form.value.HBuildingType,
        HIsVip: form.value.HIsVip,
        HIsShared: form.value.HIsShared,
        HStatus: '草稿',
        HLatitude: form.value.HLatitude,
        HLongitude: form.value.HLongitude,
        HIsDelete: false
      },
      propertyFeature: form.value.features,
      images: images.value
    };

    // 儲存到 localStorage
    localStorage.setItem('propertyFormData', JSON.stringify(formData));

    // 直接跳轉到方案選擇頁面
    router.push('/landlord/property-plan-select');
  } catch (error) {
    alertMode.value = 'error';
    console.error('Error:', error);
    showAlert.value = true;
    alertConfig.title = '錯誤';
    alertConfig.message = error.response?.data?.message || '發生錯誤，請稍後再試';
    alertConfig.type = 'error';
    alertConfig.confirmText = '確認';
    alertConfig.cancelText = '';
    alertConfig.singleButton = true;
    alertConfig.singleButtonText = '確認';
  }
}

async function onAlertConfirm() {
  if (alertMode.value === 'save') {
    await handleAlertConfirm();
  }
  showAlert.value = false;
  alertMode.value = '';
}

const isGenerating = ref(false);
const isAnalyzing = ref(false);

// 新增計算屬性來判斷是否可以生成文案
const canGenerate = computed(() => {
  return form.value.HPropertyTitle && form.value.HCity && form.value.HDistrict;
});

// 新增計算屬性來判斷是否可以進行市場分析
const canAnalyze = computed(() => {
  return form.value.HCity && 
         form.value.HDistrict && 
         form.value.HPropertyType && 
         form.value.HArea > 0 && 
         form.value.HRoomCount > 0 &&
         form.value.HRentPrice > 0;
});

// 新增生成文案的方法
async function generateDescription() {
  try {
    isGenerating.value = true;
    const response = await axios.post('/api/landlord/property/generate-description', {
      title: form.value.HPropertyTitle,
      city: form.value.HCity,
      district: form.value.HDistrict
    });

    if (response.data.success) {
      form.value.HDescription = response.data.description;
    } else {
      alertConfig.title = '錯誤';
      alertConfig.message = response.data.message || '生成文案失敗';
      alertConfig.type = 'error';
      alertConfig.confirmText = '確認';
      alertConfig.cancelText = '';
      alertConfig.singleButton = true;
      alertConfig.singleButtonText = '確認';
      showAlert.value = true;
    }
  } catch (error) {
    console.error('生成文案失敗:', error);
    alertConfig.title = '錯誤';
    alertConfig.message = error.response?.data?.message || '生成文案失敗';
    alertConfig.type = 'error';
    alertConfig.confirmText = '確認';
    alertConfig.cancelText = '';
    alertConfig.singleButton = true;
    alertConfig.singleButtonText = '確認';
    showAlert.value = true;
  } finally {
    isGenerating.value = false;
  }
}

// 新增市場分析方法
async function generateMarketAnalysis() {
  try {
    isAnalyzing.value = true;
    const response = await axios.post('/api/landlord/property/market-analysis', {
      city: form.value.HCity,
      district: form.value.HDistrict,
      propertyType: form.value.HPropertyType,
      area: form.value.HArea,
      roomCount: form.value.HRoomCount,
      rentPrice: form.value.HRentPrice
    });

    if (response.data.success) {
      alertConfig.title = '市場趨勢分析';
      alertConfig.message = response.data.analysis;
      alertConfig.type = 'info';
      alertConfig.singleButton = true;
      alertConfig.singleButtonText = '確認';
      showAlert.value = true;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error('市場分析失敗:', error);
    alertConfig.title = '錯誤';
    alertConfig.message = error.response?.data?.message || '市場分析失敗';
    alertConfig.type = 'error';
    alertConfig.singleButton = true;
    alertConfig.singleButtonText = '確認';
    showAlert.value = true;
  } finally {
    isAnalyzing.value = false;
  }
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
  gap: 1.5rem;
}

.upload-tip {
  color: #888;
  font-size: 0.95rem;
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

.description-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  position: relative;
}

.description-container textarea {
  min-height: 160px;
  resize: vertical;
  font-size: 1.1rem;
  width: 100%;
}

.button-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  justify-content: flex-end;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--main-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.generate-btn {
  background: var(--main-color);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(60,221,210,0.08);
  transition: background 0.2s;
}

.generate-btn:hover {
  background: #1a9c92;
}

.generate-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.generate-btn i {
  font-size: 1.2rem;
}

.market-analysis-content {
  max-height: 60vh;
  overflow-y: auto;
  padding: 16px 32px;
  white-space: pre-line;
  word-break: break-all;
  font-size: 1.12rem;
  line-height: 1.8;
}

:deep(.alert-modal), :deep(.alert-root), :deep(.alert-container) {
  max-width: 600px !important;
  width: 95vw !important;
}

.analysis-btn-group.single-btn {
  grid-column: 2 / 3;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  margin-top: auto;
  margin-bottom: 0;
  height: 100%;
}

@media (max-width: 900px) {
  .analysis-btn-group.single-btn {
    grid-column: 1 / 2;
    justify-content: flex-end;
    margin-top: 12px;
  }
}

.ai-analysis-tip {
  color: #888;
  font-size: 0.98rem;
  margin-bottom: 2px;
  margin-top: 8px;
  text-align: right;
}
</style>