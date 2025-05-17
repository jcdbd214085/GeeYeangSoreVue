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
    <div v-if="currentTab === 'active' && activeProperties.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg width="80" height="80" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#F5F5F5"/>
          <path d="M20 44V32L32 22L44 32V44C44 45.1046 43.1046 46 42 46H22C20.8954 46 20 45.1046 20 44Z" fill="#B0BEC5"/>
          <rect x="28" y="36" width="8" height="10" rx="1" fill="#90A4AE"/>
        </svg>
      </div>
      <p>你沒有刊登中的物件，先來刊登一間吧！</p>
    </div>
    <div v-if="currentTab === 'active' && activeProperties.length > 0" class="property-list-listview">
      <div v-for="item in filteredActiveProperties" :key="item.id" class="property-list-row">
        <img :src="item.cover" class="property-list-cover" />
        <div class="property-list-info">
          <div class="property-list-title">{{ item.title }}</div>
          <div class="property-list-rent">{{ item.rent ? item.rent + '元/月' : '' }}</div>
        </div>
        <div class="property-list-actions">
          <button class="edit-btn" @click="onEdit(item)">編輯</button>
          <button class="edit-btn danger" @click="onDeactivate(item)">下架</button>
        </div>
      </div>
    </div>
    <div v-if="currentTab === 'draft'">
      <div v-if="drafts.length === 0">目前沒有草稿</div>
      <div v-for="(draft, idx) in drafts" :key="draft.savedAt" class="property-list-row">
        <div class="property-list-info">
          <div class="property-list-title">{{ draft.data.title || '未命名草稿' }}</div>
          <div class="property-list-rent">儲存於：{{ draft.savedAt }}</div>
        </div>
        <div class="property-list-actions">
          <button class="edit-btn" @click="editDraft(draft)">編輯</button>
          <button class="edit-btn danger" @click="deleteDraft(idx)">刪除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import Button from '@/components/buttons/button.vue';
import axios from 'axios';

const router = useRouter();
const userStore = useUserStore();

const tabs = [
  { label: '刊登中', value: 'active' },
  { label: '下架', value: 'inactive' },
  { label: '已出租', value: 'rented' },
  { label: '草稿', value: 'draft' },
];
const currentTab = ref('active');
const search = ref('');
const filterType = ref('');
const sort = ref('updated');

// 只用 activeProperties
const activeProperties = ref([]);
const drafts = ref([]);

const filteredActiveProperties = computed(() => {
  let list = activeProperties.value;
  if (search.value) {
    list = list.filter(p =>
      p.title.includes(search.value) ||
      p.address.includes(search.value)
    );
  }
  if (filterType.value) {
    list = list.filter(p => p.propertyType === filterType.value);
  }
  if (sort.value === 'updated') {
    list = list.sort((a, b) => (b.updated || '').localeCompare(a.updated || ''));
  } else if (sort.value === 'created') {
    list = list.sort((a, b) => (b.created || '').localeCompare(a.created || ''));
  } else if (sort.value === 'price') {
    list = list.sort((a, b) => b.rent - a.rent);
  }
  return list;
});

// 檢查登入狀態和權限
onMounted(async () => {
  try {
    let token = localStorage.getItem('token');
    if (!token) {
      const res = await axios.get('/api/Auth/me', { withCredentials: true });
      if (!res.data.success || !res.data.isLandlord) {
        router.push('/login');
        return;
      }
      token = res.data.token;
      localStorage.setItem('token', token);
    }
    // 取得物件列表
    const propertyRes = await axios.get('/api/landlord/landlordcreate/my-properties', {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true
    });
    activeProperties.value = (propertyRes.data || []).map(p => ({
      id: p.hPropertyId,
      title: p.hPropertyTitle,
      address: p.hAddress,
      rent: p.hRentPrice,
      propertyType: p.hPropertyType,
      updated: p.hLastUpdated,
      created: p.hPublishedDate,
      cover: (p.hPropertyImages && p.hPropertyImages.length > 0) ? p.hPropertyImages[0].hImageUrl : ''
    }));
    // 取得草稿
    drafts.value = JSON.parse(localStorage.getItem('propertyDrafts') || '[]');
  } catch (error) {
    console.error('驗證失敗或取得物件失敗:', error);
    router.push('/login');
  }
});

function onAddProperty() {
  // 使用 router 進行頁面跳轉，而不是 window.location
  router.push('/landlord/property-create');
}
function onEdit(item) {
  // 使用 router 進行頁面跳轉，而不是 window.location
  router.push(`/landlord/property-edit?id=${item.id}`);
}
function onDeactivate(item) {
  alert('下架物件 ' + item.title + '（待串接 API）');
}
function deleteDraft(idx) {
  drafts.value.splice(idx, 1);
  localStorage.setItem('propertyDrafts', JSON.stringify(drafts.value));
}
function editDraft(draft) {
  localStorage.setItem('propertyDetail', JSON.stringify(draft.data));
  router.push('/landlord/property-edit');
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
.property-list-rent {
  color: var(--main-color, #24B4A8);
  font-weight: bold;
  font-size: 1.05rem;
  margin-bottom: 0.2rem;
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
  .property-list-listview {
    gap: 1.2rem;
  }
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
</style> 