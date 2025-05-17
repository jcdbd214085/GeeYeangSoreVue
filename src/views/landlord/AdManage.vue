<template>
  <div class="ad-manage-container">
    <h2>刊登管理</h2>
    <section class="ad-list-section">
      <h3>刊登列表</h3>
      <div class="ad-list-listview">
        <div v-for="ad in ads" :key="ad.id" class="ad-list-row">
          <img :src="ad.cover" class="ad-list-cover" />
          <div class="ad-list-info">
            <div class="ad-list-title">{{ ad.title }}</div>
            <div class="ad-list-plan">
              <span :class="['plan-badge', ad.plan]">{{ ad.planLabel }}</span>
              <span class="plan-days">剩餘 {{ ad.daysLeft }} 天</span>
            </div>
            <div class="ad-list-status">
              <span :class="['status', ad.status]">{{ ad.status === 'active' ? '刊登中' : '到期' }}</span>
              <span v-if="ad.daysLeft <= 3 && ad.status === 'active'" class="expire-warning">即將到期</span>
            </div>
          </div>
          <div class="ad-list-actions">
            <button class="upgrade-btn" @click="onUpgrade(ad)">升級廣告</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const ads = ref([
  { id: 1, title: '台中市西屯區獨立套房', plan: 'vip1', planLabel: 'VIP1 入門方案', daysLeft: 2, status: 'active', cover: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' },
  { id: 2, title: '台北市大安區精選套房', plan: 'vip2', planLabel: 'VIP2 推薦方案', daysLeft: 10, status: 'active', cover: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80' },
  { id: 3, title: '新北市板橋區精選豪宅', plan: 'vip3', planLabel: 'VIP3 精選方案', daysLeft: 0, status: 'expired', cover: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=400&q=80' },
]);
const plans = [
  {
    id: 'vip1',
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
    id: 'vip2',
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
    id: 'vip3',
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
function onUpgrade(ad) {
  alert('升級廣告功能（待串接）');
}
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
.plan-badge.vip1 { color: #FFD600; }
.plan-badge.vip2 { color: #FF9800; }
.plan-badge.vip3 { color: #F44336; }
.plan-days {
  color: #888;
  font-size: 0.98rem;
}
.ad-list-status {
  margin-top: 0.2rem;
}
.status.active { color: #24B4A8; font-weight: bold; }
.status.expired { color: #f44336; }
.expire-warning { color: #ff9800; font-size: 0.95rem; margin-left: 0.5rem; }
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
</style> 