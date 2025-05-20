<template>
  <div class="property-manage-container">
    <div class="header-row">
      <h2>物件管理</h2>
      <Button color="primary" class="add-btn" @click="onAddProperty">+ 新增物件</Button>
    </div>
    <div class="tab-row">
      <button v-for="tab in tabs" :key="tab.value" :class="['tab-btn', {active: currentTab === tab.value}]" @click="currentTab = tab.value">
        {{ tab.label }}
      </button>
    </div>
    <div class="filter-row">
      <input v-model="search" class="search-input" placeholder="輸入物件標題、地址" />
      <select v-model="filterType" class="filter-select">
        <option value="">全部物件類別</option>
        <option value="公寓">公寓</option>
        <option value="透天">透天</option>
        <option value="套房">套房</option>
      </select>
      <select v-model="sort" class="filter-select">
        <option value="updated">更新時間</option>
        <option value="created">建立時間</option>
        <option value="price">租金高低</option>
      </select>
    </div>

    <!-- 刊登中物件列表 -->
    <div v-if="currentTab === 'active'">
      <div v-if="filteredActiveProperties.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg width="80" height="80" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="64" height="64" rx="16" fill="#F5F5F5"/>
            <path d="M20 44V32L32 22L44 32V44C44 45.1046 43.1046 46 42 46H22C20.8954 46 20 45.1046 20 44Z" fill="#B0BEC5"/>
            <rect x="28" y="36" width="8" height="10" rx="1" fill="#90A4AE"/>
          </svg>
        </div>
        <p>你沒有刊登中的物件，先來刊登一間吧！</p>
      </div>
      <div v-else class="property-list-listview">
        <div v-for="item in filteredActiveProperties" :key="item.id" class="property-list-row">
          <img :src="item.cover" class="property-list-cover" />
          <div class="property-list-info">
            <div class="property-list-title">{{ item.title }}</div>
            <div class="property-list-rent">{{ item.rent ? item.rent + '元/月' : '' }}</div>
            <div class="property-list-address">{{ item.address }}</div>
          </div>
          <div class="property-list-actions">
            <button class="edit-btn" @click="onEdit(item)">編輯</button>
            <button class="edit-btn danger" @click="onDeactivate(item)">下架</button>
            <button class="edit-btn warning" @click="onDraft(item)">設為草稿</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 未審核物件列表 -->
    <div v-if="currentTab === 'inactive'" class="property-list-listview">
      <div v-if="filteredInactiveProperties.length === 0" class="empty-state">
      <div class="empty-icon">
          <svg width="80" height="80" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="64" height="64" rx="16" fill="#F5F5F5"/>
            <path d="M20 44V32L32 22L44 32V44C44 45.1046 43.1046 46 42 46H22C20.8954 46 20 45.1046 20 44Z" fill="#B0BEC5"/>
            <rect x="28" y="36" width="8" height="10" rx="1" fill="#90A4AE"/>
          </svg>
        </div>
        <p>目前沒有未審核的物件</p>
      </div>
      <div v-else v-for="item in filteredInactiveProperties" :key="item.id" class="property-list-row">
        <img :src="item.cover" class="property-list-cover" />
        <div class="property-list-info">
          <div class="property-list-title">{{ item.title }}</div>
          <div class="property-list-rent">{{ item.rent ? item.rent + '元/月' : '' }}</div>
          <div class="property-list-address">{{ item.address }}</div>
        </div>
        <div class="property-list-actions">
          <button class="edit-btn" @click="onEdit(item)">編輯</button>
          <button class="edit-btn success" @click="onReactivate(item)">上架</button>
          <button class="edit-btn warning" @click="onDraft(item)">設為草稿</button>
        </div>
      </div>
    </div>

    <!-- 已出租物件列表 -->
    <div v-if="currentTab === 'rented'" class="property-list-listview">
      <div v-if="filteredRentedProperties.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg width="80" height="80" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="64" height="64" rx="16" fill="#F5F5F5"/>
            <path d="M20 44V32L32 22L44 32V44C44 45.1046 43.1046 46 42 46H22C20.8954 46 20 45.1046 20 44Z" fill="#B0BEC5"/>
            <rect x="28" y="36" width="8" height="10" rx="1" fill="#90A4AE"/>
          </svg>
        </div>
        <p>目前沒有已出租的物件</p>
      </div>
      <div v-else v-for="item in filteredRentedProperties" :key="item.id" class="property-list-row">
        <img :src="item.cover" class="property-list-cover" />
        <div class="property-list-info">
          <div class="property-list-title">{{ item.title }}</div>
          <div class="property-list-rent">{{ item.rent ? item.rent + '元/月' : '' }}</div>
          <div class="property-list-address">{{ item.address }}</div>
        </div>
        <div class="property-list-actions">
          <button class="edit-btn" @click="onEdit(item)">編輯</button>
          <button class="edit-btn danger" @click="onDeactivate(item)">下架</button>
          <button class="edit-btn warning" @click="onDraft(item)">設為草稿</button>
        </div>
      </div>
    </div>

    <!-- 草稿列表 -->
    <div v-if="currentTab === 'draft'" class="property-list-listview">
      <div v-if="filteredDrafts.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg width="80" height="80" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="64" height="64" rx="16" fill="#F5F5F5"/>
            <path d="M20 44V32L32 22L44 32V44C44 45.1046 43.1046 46 42 46H22C20.8954 46 20 45.1046 20 44Z" fill="#B0BEC5"/>
            <rect x="28" y="36" width="8" height="10" rx="1" fill="#90A4AE"/>
          </svg>
        </div>
        <p>目前沒有草稿</p>
      </div>
      <div v-else v-for="item in filteredDrafts" :key="item.id" class="property-list-row">
        <img :src="item.cover" class="property-list-cover" />
        <div class="property-list-info">
          <div class="property-list-title">{{ item.title || '未命名草稿' }}</div>
          <div class="property-list-rent">{{ item.rent ? item.rent + '元/月' : '' }}</div>
          <div class="property-list-address">{{ item.address || '尚未填寫地址' }}</div>
          <div class="property-list-date">最後更新：{{ formatDate(item.updated) }}</div>
        </div>
        <div class="property-list-actions">
          <button class="edit-btn" @click="editDraft(item)">編輯</button>
          <button class="edit-btn success" @click="onReactivate(item)">上架</button>
          <button class="edit-btn danger" @click="deleteDraft(item.id)">刪除</button>
        </div>
      </div>
    </div>
  </div>
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

  <Alert
    v-model:show="showSuccessAlert"
    :title="successAlertConfig.title"
    :type="successAlertConfig.type"
    :showFooter="false"
  >
    {{ successAlertConfig.message }}
  </Alert>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import Button from '@/components/buttons/button.vue';
import Alert from '@/components/alert/Alert.vue';
import axios from 'axios';

const router = useRouter();
const tabs = [
  { label: '未出租', value: 'active' },
  { label: '已出租', value: 'rented' },
  { label: '下架', value: 'inactive' },
  { label: '草稿', value: 'draft' },
];
const currentTab = ref('active');
const search = ref('');
const filterType = ref('');
const sort = ref('updated');
const activeProperties = ref([]);
const inactiveProperties = ref([]);
const rentedProperties = ref([]);
const drafts = ref([]);

const showAlert = ref(false);
const showSuccessAlert = ref(false);
const alertConfig = reactive({
  title: '',
  message: '',
  type: 'info',
  confirmText: '確認',
  cancelText: '取消'
});

const successAlertConfig = reactive({
  title: '',
  message: '',
  type: 'success'
});

let currentAction = null;
let currentItem = null;

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

const filterAndSort = (list) => {
  let filtered = [...list];
  if (search.value) {
    filtered = filtered.filter(p =>
      p.title?.toLowerCase().includes(search.value.toLowerCase()) ||
      p.address?.toLowerCase().includes(search.value.toLowerCase())
    );
  }
  if (filterType.value) {
    filtered = filtered.filter(p => p.propertyType === filterType.value);
  }
  switch (sort.value) {
    case 'updated':
      filtered.sort((a, b) => new Date(b.updated) - new Date(a.updated));
      break;
    case 'created':
      filtered.sort((a, b) => new Date(b.created) - new Date(a.created));
      break;
    case 'price':
      filtered.sort((a, b) => (b.rent || 0) - (a.rent || 0));
      break;
  }
  return filtered;
};

const filteredActiveProperties = computed(() => filterAndSort(activeProperties.value));
const filteredInactiveProperties = computed(() => filterAndSort(inactiveProperties.value));
const filteredRentedProperties = computed(() => filterAndSort(rentedProperties.value));
const filteredDrafts = computed(() => drafts.value);

async function loadProperties() {
  try {
    const response = await axios.get('/api/landlord/property/my', { withCredentials: true });
    const properties = response.data || [];
    
    // 轉換資料格式以符合前端需求
    const formattedProperties = properties.map(p => ({
      id: p.hPropertyId,
      title: p.hPropertyTitle,
      description: p.hDescription,
      address: p.hAddress,
      city: p.hCity,
      district: p.hDistrict,
      zipcode: p.hZipcode,
      rent: p.hRentPrice,
      propertyType: p.hPropertyType,
      roomCount: p.hRoomCount,
      bathroomCount: p.hBathroomCount,
      area: p.hArea,
      floor: p.hFloor,
      totalFloors: p.hTotalFloors,
      availability: p.hAvailabilityStatus,
      buildingType: p.hBuildingType,
      score: p.hScore,
      created: p.hPublishedDate,
      updated: p.hLastUpdated,
      isVip: p.hIsVip,
      isShared: p.hIsShared,
      status: p.hStatus,
      isDelete: p.hIsDelete,
      latitude: p.hLatitude,
      longitude: p.hLongitude,
      cover: p.images && p.images.length > 0 
        ? p.images[0].hImageUrl 
        : '/images/Property/default.jpg',
      feature: p.feature,
      images: p.images,
      ads: p.ads
    }));

    activeProperties.value = formattedProperties.filter(p => p.status === '已驗證' && p.availability === '未出租');
    inactiveProperties.value = formattedProperties.filter(p => p.status === '未驗證');
    rentedProperties.value = formattedProperties.filter(p => p.availability === '已出租');
    drafts.value = formattedProperties.filter(p => p.status === '草稿');
  } catch (e) {
    console.error('Error loading properties:', e);
    activeProperties.value = [];
    inactiveProperties.value = [];
    rentedProperties.value = [];
    drafts.value = [];
  }
}

onMounted(() => {
  loadProperties();
});

function onAddProperty() {
  router.push('/landlord/property-create');
}

function onEdit(item) {
  console.log(item);
  const propertyId = item.hPropertyId || item.id;
  if (!propertyId) {
    alert('找不到物件ID，無法編輯');
    return;
  }
  router.push(`/landlord/property-edit/${propertyId}`);
}

function showSuccessMessage(title, message) {
  successAlertConfig.title = title;
  successAlertConfig.message = message;
  showSuccessAlert.value = true;
  setTimeout(() => {
    showSuccessAlert.value = false;
  }, 2000);
}

function showConfirmDialog(item, action, config) {
  currentAction = action;
  currentItem = item;
  Object.assign(alertConfig, config);
  showAlert.value = true;
}

async function handleAlertConfirm() {
  if (!currentAction || !currentItem) return;
  
  try {
    let successMessage = '';
    switch (currentAction) {
      case 'deactivate':
        await axios.put(`/api/landlord/property/${currentItem.id}/deactivate`, {}, { withCredentials: true });
        successMessage = '物件下架成功';
        break;
      case 'draft':
        await axios.put(`/api/landlord/property/${currentItem.id}/draft`, {}, { withCredentials: true });
        successMessage = '物件已設為草稿';
        break;
      case 'delete':
        await axios.delete(`/api/landlord/property/${currentItem.id}`, { withCredentials: true });
        successMessage = '草稿刪除成功';
        break;
      case 'activate':
        await axios.put(`/api/landlord/property/${currentItem.id}/activate`, {}, { withCredentials: true });
        successMessage = '物件上架成功';
        break;
    }
    await loadProperties();
    showSuccessMessage('成功', successMessage);
  } catch (error) {
    console.error('Error performing action:', error);
    alert('操作失敗，請稍後再試');
  }
}

function handleAlertCancel() {
  currentAction = null;
  currentItem = null;
}

async function onDeactivate(item) {
  showConfirmDialog(item, 'deactivate', {
    title: '下架確認',
    message: '確定要下架此物件嗎？下架後將不會顯示在搜尋結果中。',
    type: 'warning',
    confirmText: '確定下架',
    cancelText: '取消'
  });
}

async function onReactivate(item) {
  showConfirmDialog(item, 'activate', {
    title: '上架確認',
    message: '確定要上架此物件嗎？上架後將顯示在搜尋結果中。',
    type: 'info',
    confirmText: '確定上架',
    cancelText: '取消'
  });
}

async function onDraft(item) {
  showConfirmDialog(item, 'draft', {
    title: '設為草稿確認',
    message: '確定要將此物件設為草稿嗎？設為草稿後將不會顯示在搜尋結果中。',
    type: 'warning',
    confirmText: '確定設為草稿',
    cancelText: '取消'
  });
}

function editDraft(draft) {
  console.log(draft);
  const propertyId = draft.HPropertyId || draft.id;
  if (!propertyId) {
    alert('找不到物件ID，無法編輯');
    return;
  }
  router.push(`/landlord/property-edit/${propertyId}`);
}

async function deleteDraft(id) {
  const item = drafts.value.find(d => d.id === id);
  if (!item) return;
  
  showConfirmDialog(item, 'delete', {
    title: '刪除確認',
    message: '確定要刪除此草稿嗎？刪除後將無法復原。',
    type: 'error',
    confirmText: '確定刪除',
    cancelText: '取消'
  });
}
</script>

<style scoped>
.property-manage-container {
  max-width: 1100px;
  margin: 40px auto 0 auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 6px 32px rgba(60, 221, 210, 0.08);
  padding: 2.5rem 2.5rem 2rem 2.5rem;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.add-btn {
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.6rem 1.6rem;
}

.tab-row {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.2rem;
}

.tab-btn {
  background: none;
  border: none;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-main);
  padding: 0.5rem 1.2rem;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}

.tab-btn.active {
  color: var(--main-color);
  border-bottom: 3px solid var(--main-color);
}

.filter-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
}

.search-input {
  flex: 1;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-size: 1rem;
}

.filter-select {
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-size: 1rem;
}

.property-list-listview {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.property-list-row {
  display: flex;
  align-items: center;
  border: 1px solid #eee;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 8px #eee;
  overflow: hidden;
  padding: 1rem;
}

.property-list-cover {
  width: 120px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 1.2rem;
}

.property-list-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.property-list-title {
  font-size: 1.1rem;
  font-weight: bold;
}

.property-list-rent {
  color: var(--main-color, #24B4A8);
  font-weight: bold;
  font-size: 1.05rem;
}

.property-list-address {
  color: #666;
  font-size: 0.9rem;
}

.property-list-actions {
  display: flex;
  flex-direction: row;
  gap: 0.7rem;
  align-items: center;
  margin-left: auto;
}

.edit-btn {
  background: none;
  border: none;
  color: var(--main-color, #24B4A8);
  font-size: 1rem;
  padding: 0.2rem 0.7rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.edit-btn:hover {
  background: #e0f7fa;
}

.edit-btn.danger {
  color: #f44336;
}

.edit-btn.danger:hover {
  background: #ffeaea;
}

.edit-btn.success {
  color: #4caf50;
}

.edit-btn.success:hover {
  background: #e8f5e9;
}

.edit-btn.warning {
  color: #ff9800;
}

.edit-btn.warning:hover {
  background: #fff3e0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 3rem;
  color: #888;
}

.empty-icon {
  margin-bottom: 1.2rem;
}

.empty-state p {
  text-align: center;
  font-size: 1.08rem;
  margin: 0.2rem 0;
}

@media (max-width: 700px) {
  .property-manage-container {
    padding: 1rem 0.5rem;
  }
  
  .header-row {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .tab-row {
    gap: 0.5rem;
    flex-wrap: wrap;
    row-gap: 0.5rem;
  }
  
  .tab-btn {
    font-size: 1rem;
    padding: 0.4rem 0.7rem;
  }
  
  .filter-row {
    flex-direction: column;
    align-items: stretch;
    gap: 0.7rem;
    margin-bottom: 1.2rem;
  }
  
  .search-input, .filter-select {
    width: 100%;
    font-size: 0.98rem;
    padding: 0.5rem 0.8rem;
  }
  
  .property-list-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .property-list-cover {
    width: 100%;
    height: 200px;
    margin-right: 0;
    margin-bottom: 1rem;
  }
  
  .property-list-actions {
    margin-top: 1rem;
    justify-content: flex-end;
  }
}
</style> 