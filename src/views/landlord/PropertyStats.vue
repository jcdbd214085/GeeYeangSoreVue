<template>
  <div class="stats-container">
    <h2>刊登成效追蹤</h2>
    <div v-for="item in activeProperties" :key="item.created" class="stats-card">
      <img :src="item.cover" class="stats-cover" />
      <div class="stats-info">
        <div class="stats-title">{{ item.title }}</div>
        <div v-if="item.planId === 'vip2'">
          <div class="stats-row"><span class="icon">📈</span> <b>每週數據報告</b></div>
          <div class="stats-row"><span class="icon">👁‍🗨</span> 7天瀏覽總數：<b>{{ item.weekViews }}</b>　日均：<b>{{ item.avgViews }}</b></div>
          <div class="stats-row"><span class="icon">📬</span> 7天詢問次數：<b>{{ item.weekInquiries }}</b></div>
          <div class="stats-row"><span class="icon">📆</span> 上次排序更新：<b>{{ item.lastSortUpdate }}</b></div>
          <div class="stats-row"><span class="icon">📍</span> 曝光來源分佈：</div>
          <div class="bar-chart">
            <div class="bar-item"><span>搜尋頁</span><div class="bar" :style="{width: item.sourceDist.search + '%'}"></div><span>{{ item.sourceDist.search }}%</span></div>
            <div class="bar-item"><span>推薦頁</span><div class="bar" :style="{width: item.sourceDist.recommend + '%', background:'#ff9800'}"></div><span>{{ item.sourceDist.recommend }}%</span></div>
            <div class="bar-item"><span>分享連結</span><div class="bar" :style="{width: item.sourceDist.share + '%', background:'#42b983'}"></div><span>{{ item.sourceDist.share }}%</span></div>
          </div>
        </div>
        <div v-else-if="item.planId === 'vip3'">
          <div class="stats-row"><span class="icon">📊</span> <b>即時數據</b></div>
          <div class="stats-row"><span class="icon">👁‍🗨</span> 24小時瀏覽：<b>{{ item.views24h }}</b>　7天瀏覽：<b>{{ item.views7d }}</b></div>
          <div class="stats-row"><span class="icon">🧭</span> 熱門瀏覽時段：<b>{{ item.hotHours?.join(', ') }}</b></div>
          <div class="stats-row"><span class="icon">🔍</span> 熱門來源頁：<b>{{ item.hotSources?.join(', ') }}</b></div>
          <div class="stats-row"><span class="icon">📬</span> 即時詢問通知：<b>{{ item.recentInquiries?.join('、') }}</b></div>
          <div class="chart-row">
            <div class="chart-block">
              <span class="icon">📉</span> 近期瀏覽數
              <LineChart :data="item.viewsTrend || []" color="#42b983" label="瀏覽數" />
            </div>
            <div class="chart-block">
              <span class="icon">📬</span> 近期詢問數
              <LineChart :data="item.inquiriesTrend || []" color="#ff9800" label="詢問數" />
            </div>
          </div>
          <div class="stats-row"><span class="icon">🔁</span> 排序更新紀錄：<b>{{ item.sortHistory?.join(' / ') }}</b></div>
        </div>
        <div v-else class="locked-stats">
          <span>升級方案即可查看詳細數據</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import LineChart from '@/components/charts/LineChart.vue';

const activeProperties = ref([]);
onMounted(() => {
  // 直接覆蓋三筆假資料
  const list = [
    {
      title: '台中市西屯區獨立套房 (VIP1)',
      cover: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
      status: 'active',
      planId: 'vip1',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    },
    {
      title: '台北市大安區精選套房 (VIP2)',
      cover: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
      status: 'active',
      planId: 'vip2',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      weekViews: 210,
      avgViews: 30,
      weekInquiries: 4,
      lastSortUpdate: '2024-05-06 09:00',
      sourceDist: { search: 60, recommend: 30, share: 10 },
    },
    {
      title: '新北市板橋區置頂豪宅 (VIP3)',
      cover: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=400&q=80',
      status: 'active',
      planId: 'vip3',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      views24h: 120,
      views7d: 888,
      hotHours: ['19:00', '20:00', '21:00'],
      hotSources: ['社群推播', '猜你喜歡'],
      recentInquiries: ['2024-05-08 14:00', '2024-05-08 20:00'],
      sortHistory: ['2024-05-01 09:00 #1', '2024-05-02 09:00 #1', '2024-05-03 09:00 #1'],
      viewsTrend: [200, 250, 300, 350, 400, 420, 500],
      inquiriesTrend: [3, 4, 2, 5, 6, 7, 8]
    }
  ];
  localStorage.setItem('propertyActive', JSON.stringify(list));
  activeProperties.value = list;
});
</script>

<style scoped>
.stats-container { max-width: 900px; margin: 40px auto; }
.stats-card { display: flex; align-items: center; border: 1px solid #eee; border-radius: 12px; margin-bottom: 1.5rem; background: #fff; box-shadow: 0 2px 8px #eee; overflow: hidden; }
.stats-cover { width: 120px; height: 120px; object-fit: cover; border-right: 1px solid #eee; }
.stats-info { padding: 1rem; flex: 1; }
.stats-title { font-size: 1.2rem; font-weight: bold; margin-bottom: 0.5rem; }
.stats-row { margin-bottom: 0.4rem; display: flex; align-items: center; gap: 0.7rem; font-size: 1rem; }
.locked-stats { color: #aaa; font-style: italic; margin-top: 1rem; }
.icon { font-size: 1.2rem; margin-right: 0.2rem; }
.chart-row { display: flex; gap: 2rem; margin-top: 1rem; }
.chart-block { flex: 1; background: #f9f9f9; border-radius: 8px; padding: 0.7rem 1rem; }
.bar-chart { margin-top: 0.5rem; margin-bottom: 0.5rem; }
.bar-item { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.3rem; }
.bar { height: 16px; background: #bbb; border-radius: 8px; min-width: 20px; transition: width 0.3s; }
</style> 