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
    <div v-if="filteredProperties.length === 0" class="empty-state">
      
      <p>你沒有{{ currentTabLabel }}的物件，先來刊登一間吧！</p>
    </div>
    <div v-else class="property-list">
      <PropertyCard
        v-for="item in filteredProperties"
        :key="item.id"
        :image="item.image"
        :rentPrice="item.rentPrice"
        :propertyType="item.propertyType"
        :title="item.title"
        :city="item.city"
        :district="item.district"
        :address="item.address"
        :roomCount="item.roomCount"
        :bathroomCount="item.bathroomCount"
      >
        <template #badge>
          <span v-if="item.status === 'draft'" class="badge badge-draft">草稿</span>
          <span v-else-if="item.status === 'rented'" class="badge badge-rented">已出租</span>
          <span v-else-if="item.status === 'inactive'" class="badge badge-inactive">下架</span>
        </template>
        <template #default>
          <div class="card-actions">
            <Button size="sm" color="outline-secondary" @click.stop="onEdit(item)">編輯</Button>
            <Button v-if="item.status === 'active'" size="sm" color="outline-danger" @click.stop="onDeactivate(item)">下架</Button>
            <Button v-if="item.status === 'inactive'" size="sm" color="primary" @click.stop="onActivate(item)">重新上架</Button>
          </div>
        </template>
      </PropertyCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import PropertyCard from '@/components/cards/PropertyCard.vue';
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

const properties = ref([
  
]);

const filteredProperties = computed(() => {
  let list = properties.value.filter(p => p.status === currentTab.value);
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
    list = list.sort((a, b) => b.updated.localeCompare(a.updated));
  } else if (sort.value === 'created') {
    list = list.sort((a, b) => b.created.localeCompare(a.created));
  } else if (sort.value === 'price') {
    list = list.sort((a, b) => b.rentPrice - a.rentPrice);
  }
  return list;
});

const currentTabLabel = computed(() => {
  const tab = tabs.find(t => t.value === currentTab.value);
  return tab ? tab.label : '';
});

function onAddProperty() {
  // 跳轉到新增物件頁面
  window.location.href = '/landlord/property-create';
}
function onEdit(item) {
  alert('編輯物件 ' + item.title + '（待串接編輯頁）');
}
function onDeactivate(item) {
  alert('下架物件 ' + item.title + '（待串接 API）');
}
function onActivate(item) {
  alert('重新上架 ' + item.title + '（待串接 API）');
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
.property-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem 1.5rem;
}
.card-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}
.badge {
  display: inline-block;
  padding: 0.3rem 0.9rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-right: 0.5rem;
}
.badge-draft {
  background: #eee;
  color: #888;
}
.badge-rented {
  background: #ffe0b2;
  color: #ff9800;
}
.badge-inactive {
  background: #e0f7fa;
  color: #24B4A8;
}
.empty-state {
  text-align: center;
  color: #aaa;
  margin: 4rem 0 2rem 0;
}
.empty-img {
  width: 120px;
  margin-bottom: 1.2rem;
  opacity: 0.7;
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
  }
  .property-list {
    grid-template-columns: 1fr;
  }
}
</style> 