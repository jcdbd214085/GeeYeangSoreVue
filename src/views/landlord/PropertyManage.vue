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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Button from '@/components/buttons/button.vue';

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
const activeProperties = ref([
  {
    id: 1,
    title: '台中市西屯區獨立套房 (VIP1)',
    cover: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    rent: 11400,
    status: 'active',
    city: '台中市',
    district: '西屯區',
    address: '逢甲路100號',
    created: '2024-05-10T10:00:00Z',
  },
  {
    id: 2,
    title: '台北市大安區精選套房 (VIP2)',
    cover: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    rent: 16800,
    status: 'active',
    city: '台北市',
    district: '大安區',
    address: '信義路三段200號',
    created: '2024-05-09T09:00:00Z',
  },
  {
    id: 3,
    title: '新北市板橋區置頂豪宅 (VIP3)',
    cover: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=400&q=80',
    rent: 32000,
    status: 'active',
    city: '新北市',
    district: '板橋區',
    address: '文化路一段300號',
    created: '2024-05-08T08:00:00Z',
  },
]);

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

function onAddProperty() {
  window.location.href = '/landlord/property-create';
}
function onEdit(item) {
  window.location.href = `/landlord/property-edit?id=${item.id}`;
}
function onDeactivate(item) {
  alert('下架物件 ' + item.title + '（待串接 API）');
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
</style> 