<template>
  <div class="ad-manage-container">
    <h2>刊登管理</h2>
    <div class="filter-row">
      <input v-model="search" class="search-input" placeholder="輸入物件標題、地址" />
      <select v-model="filterStatus" class="filter-select">
        <option value="">全部</option>
        <option value="active">刊登中</option>
        <option value="expired">已過期</option>
        <option value="pending">稍後付款</option>
      </select>
      <select v-model="sort" class="filter-select">
        <option value="title">名稱</option>
        <option value="planDesc">廣告方案（由高到低）</option>
        <option value="planAsc">廣告方案（由低到高）</option>
      </select>
    </div>
    <section class="ad-list-section">
      <h3>刊登列表</h3>
      <div v-if="filteredAds.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg width="80" height="80" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="64" height="64" rx="16" fill="#F5F5F5"/>
            <path d="M20 44V32L32 22L44 32V44C44 45.1046 43.1046 46 42 46H22C20.8954 46 20 45.1046 20 44Z" fill="#B0BEC5"/>
            <rect x="28" y="36" width="8" height="10" rx="1" fill="#90A4AE"/>
          </svg>
        </div>
        <p>目前沒有刊登中的物件</p>
      </div>
      <div v-else>
        <div class="ad-list-listview">
          <div v-for="ad in paginatedAds" :key="ad.id" class="ad-list-row">
            <img :src="ad.cover" class="ad-list-cover" />
            <div class="ad-list-info">
              <div class="ad-list-title">{{ ad.title }}</div>
              <div class="ad-list-plan">
                <span :class="['plan-badge', ad.plan?.toLowerCase()]">{{ ad.planLabel }}</span>
              </div>
              <div class="ad-list-status">
                <span :class="['status', ad.status === '進行中' ? 'active' : ad.status === '稍後付款' ? 'pending' : 'expired']">
                  {{ ad.status === '進行中' ? '刊登中' : ad.status === '稍後付款' ? '稍後付款' : '已過期' }}
                </span>
              </div>
              <div class="ad-list-address">{{ ad.address || '' }}</div>
              <div class="ad-list-price" v-if="ad.price">{{ ad.price }} 元/月</div>
              <div class="ad-list-time">
                <span class="time-label">刊登時間：</span>
                <span>{{ ad.startTime ? new Date(ad.startTime).toLocaleDateString() : '未開始' }}</span>
                <span class="time-separator">至</span>
                <span>{{ ad.endTime ? new Date(ad.endTime).toLocaleDateString() : '未設定' }}</span>
              </div>
            </div>
            <div class="ad-list-actions">
              <button class="upgrade-btn" @click="goToPlanSelect(ad)">選擇方案</button>
            </div>
          </div>
        </div>
        <div class="pagination-container">
          <Pagination
            :totalItems="filteredAds.length"
            :itemsPerPage="itemsPerPage"
            v-model="currentPage"
            :showFirstLastButtons="true"
            :showPageInfo="true"
            @page-changed="handlePageChange"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import Pagination from '@/components/Pagination/Pagination.vue';
import { useRouter } from 'vue-router';

const ads = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10;
const search = ref('');
const filterStatus = ref('');
const sort = ref('title');
const router = useRouter();

const planPriceMap = {
  VIP1: 100,
  VIP2: 200,
  VIP3: 300
};

const filteredAds = computed(() => {
  let filtered = [...ads.value];
  if (search.value) {
    filtered = filtered.filter(ad =>
      (ad.title?.toLowerCase().includes(search.value.toLowerCase()) ||
      ad.address?.toLowerCase().includes(search.value.toLowerCase()))
    );
  }
  if (filterStatus.value) {
    if (filterStatus.value === 'active') {
      filtered = filtered.filter(ad => ad.status === '進行中');
    } else if (filterStatus.value === 'expired') {
      filtered = filtered.filter(ad => ad.status !== '進行中');
    } else if (filterStatus.value === 'pending') {
      filtered = filtered.filter(ad => ad.status === '稍後付款');
    }
  }
  switch (sort.value) {
    case 'title':
      filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      break;
    case 'planDesc':
      filtered.sort((a, b) => (planPriceMap[b.plan] || 0) - (planPriceMap[a.plan] || 0));
      break;
    case 'planAsc':
      filtered.sort((a, b) => (planPriceMap[a.plan] || 0) - (planPriceMap[b.plan] || 0));
      break;
  }
  return filtered;
});

const paginatedAds = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredAds.value.slice(start, end);
});

function handlePageChange({ page }) {
  currentPage.value = page;
}

const plans = [
  {
    id: 'VIP1',
    label: 'VIP1 入門方案',
    price: 100,
    days: 15,
    color: '#FFD600',
    features: [
      '🕒 刊登天數：15天',
      '⛔ 無排序更新',
      '⛔ 無標籤、無數據報告',
      '👉 最經濟實惠的選擇，快速上架無負擔！',
    ],
    desc: '適合剛開始嘗試刊登的房東',
  },
  {
    id: 'VIP2',
    label: 'VIP2 推薦方案',
    price: 200,
    days: 30,
    color: '#FF9800',
    features: [
      '🕒 刊登天數：30天',
      '🔄 排序每3天自動更新',
      '🏷️ 顯示「推薦」標籤',
      '📈 系統推薦排序優先（更多人看到）',
      '👉 高CP值選擇，適合希望快速出租的房東！',
    ],
    desc: '提升曝光，加快出租速度',
  },
  {
    id: 'VIP3',
    label: 'VIP3 精選方案',
    price: 300,
    days: 45,
    color: '#F44336',
    features: [
      '🕒 刊登天數：45天',
      '🔄 每日自動更新排序，穩居前排',
      '🏷️ 顯示「精選」標籤，最醒目',
      '📢 頁面置頂推薦＋首頁優先顯示',
      '👉 適合高價物件、緊急出租或想最大化曝光的你！',
    ],
    desc: '最強曝光，讓你的物件霸佔首頁！',
  },
];

async function loadAds() {
  try {
    const response = await axios.get('/api/landlord/ads', { withCredentials: true });
    const data = response.data || [];
    
    // 轉換資料格式以符合前端需求
    ads.value = data.map(ad => ({
      id: ad.id,
      propertyId: ad.propertyId,
      title: ad.propertyTitle,
      address: ad.address || '',
      propertyType: ad.propertyType || '',
      price: ad.rentPrice || ad.price || '',
      plan: ad.plan,
      planLabel: plans.find(p => p.id === ad.plan)?.label || '未知方案',
      status: ad.status,
      updated: ad.updatedAt || ad.updated || '',
      created: ad.createdAt || ad.created || '',
      startTime: ad.startDate || ad.startDate || '',
      endTime: ad.endDate || ad.endDate || '',
      cover: ad.coverImage && ad.coverImage.startsWith('http') 
        ? ad.coverImage 
        : `https://localhost:7022${ad.coverImage}` || '/images/Property/default.jpg',
    }));
  } catch (error) {
    console.error('Error loading ads:', error);
    ads.value = [];
  }
}

function goToPlanSelect(ad) {
  console.log('[DEBUG] ad:', ad); // 👈 確認有 propertyId
  if (!ad.propertyId) {
    alert('無效的物件，無法升級廣告');
    return;
  }

  router.push({
    path: `/landlord/property-plan-select`,
    query: {
      id: ad.id,
      propertyId: ad.propertyId
    }
  });
}

onMounted(() => {
  loadAds();
});
</script>

<style scoped>
.ad-manage-container {
  max-width: 1100px;
  margin: 40px auto 0 auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 6px 32px rgba(60, 221, 210, 0.08);
  padding: 2.5rem 2.5rem 2rem 2.5rem;
}

.ad-list-listview {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.ad-list-row {
  display: flex;
  align-items: center;
  border: 1px solid #eee;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 8px #eee;
  overflow: hidden;
  padding: 1rem;
}

.ad-list-cover {
  width: 120px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 1.2rem;
}

.ad-list-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ad-list-title {
  font-size: 1.1rem;
  font-weight: bold;
}

.ad-list-plan {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.2rem;
}

.plan-badge {
  font-weight: bold;
  padding: 0.2rem 0.8rem;
  border-radius: 1rem;
  font-size: 1rem;
  background: #f5f5f5;
}

.plan-badge.vip1 { 
  color: #FFD600;
  background: rgba(255, 214, 0, 0.1);
  border: 1px solid #FFD600;
}

.plan-badge.vip2 { 
  color: #FF9800;
  background: rgba(255, 152, 0, 0.1);
  border: 1px solid #FF9800;
}

.plan-badge.vip3 { 
  color: #F44336;
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid #F44336;
}

.ad-list-status {
  margin-top: 0.2rem;
}

.status {
  font-weight: 500;
  padding: 0.2rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.9rem;
}

.status.active { 
  color: #24B4A8;
  background: rgba(36, 180, 168, 0.1);
  border: 1px solid #24B4A8;
}

.status.expired { 
  color: #f44336;
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid #f44336;
}

.status.pending {
  color: #FF9800;
  background: rgba(255, 152, 0, 0.1);
  border: 1px solid #FF9800;
}


.ad-list-actions {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  align-items: flex-end;
  margin-left: auto;
}

.upgrade-btn {
  background: #24B4A8;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1.2rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: background 0.2s;
}

.upgrade-btn:hover { background: #1fa89c; }

.ad-list-section {
  margin-top: 2.5rem;
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

@media (max-width: 900px) {
  .ad-manage-container {
    padding: 1rem 0.5rem;
  }
  .ad-list-cover {
    width: 80px;
    height: 60px;
  }
}

@media (max-width: 700px) {
  .ad-manage-container {
    padding: 1rem 0.5rem;
  }
  .ad-list-cover {
    width: 80px;
    height: 60px;
  }
}

.pagination-container {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
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
.ad-list-address {
  color: #666;
  font-size: 0.9rem;
}
.ad-list-price {
  color: var(--main-color, #24B4A8);
  font-weight: bold;
  font-size: 1.05rem;
}
.ad-list-time {
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.3rem;
}

.time-label {
  color: #888;
}

.time-separator {
  margin: 0 0.5rem;
  color: #888;
}
</style> 