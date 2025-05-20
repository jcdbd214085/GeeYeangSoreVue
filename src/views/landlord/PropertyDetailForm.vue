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
            <textarea v-model="form.HDescription" placeholder="可在此填寫關於出租物件的描述"></textarea>
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
                <input type="radio" v-model="form.spaceType" :value="type" /> {{ type }}
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
        </div>
      </section>
      <div class="form-actions center">
        <Button color="outline-secondary" type="button" @click="goBack">上一步</Button>
        <Button color="outline-secondary" type="button" @click="onSaveExit">儲存草稿</Button>
        <Button color="primary" type="submit">下一步</Button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Button from '@/components/buttons/button.vue';
import draggable from 'vuedraggable';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const route = useRoute();
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

onMounted(() => {
  if (route.query.features) {
    form.value.features = JSON.parse(route.query.features);
  }
});

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
  router.back();
}

async function onSaveExit() {
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
      HLongitude: form.value.HLongitude
    };

    formData.append('property', JSON.stringify(propertyData));
    formData.append('propertyFeature', JSON.stringify(form.value.features));
    
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
      router.push('/landlord/property-manage');
    } else {
      alert(response.data.message || '儲存失敗');
    }
  } catch (error) {
    console.error('Error:', error);
    alert(error.response?.data?.message || '儲存失敗，請稍後再試');
  }
}

async function onSubmit() {
  try {
    // 驗證必填欄位
    if (!form.value.HPropertyTitle) {
      alert('請輸入物件標題');
      return;
    }
    if (!form.value.HAddress) {
      alert('請輸入物件地址');
      return;
    }
    if (!form.value.HCity) {
      alert('請選擇城市');
      return;
    }
    if (!form.value.HDistrict) {
      alert('請輸入區域');
      return;
    }
    if (!form.value.HRentPrice || form.value.HRentPrice <= 0) {
      alert('請輸入有效的租金金額');
      return;
    }
    if (!form.value.HPropertyType) {
      alert('請選擇物件類型');
      return;
    }
    if (images.value.length < 2) {
      alert('請至少上傳2張照片');
      return;
    }

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
      HStatus: '未驗證',
      HLatitude: form.value.HLatitude,
      HLongitude: form.value.HLongitude
    };

    formData.append('property', JSON.stringify(propertyData));
    formData.append('propertyFeature', JSON.stringify(form.value.features));
    
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
      // 將物件ID傳遞到下一步
      router.push({
        path: '/landlord/property-plan-select',
        query: {
          id: response.data.propertyId
        }
      });
    } else {
      alert(response.data.message || '儲存失敗');
    }
  } catch (error) {
    console.error('Error:', error);
    alert(error.response?.data?.message || '儲存失敗，請稍後再試');
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
</style>