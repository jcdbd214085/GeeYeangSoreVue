<template>
  <div class="ad-purchase-container">
    <h2>廣告方案比較</h2>
    <section class="plan-table-section">
      <div class="plan-table-wrapper">
        <table class="plan-table">
          <thead>
            <tr>
              <th></th>
              <th class="plan-head">VIP1 入門方案</th>
              <th class="plan-head">VIP2 推薦方案</th>
              <th class="plan-head">VIP3 精選方案</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="plan-icon">💰</span>價格</td>
              <td class="vip1">$100 / 15天</td>
              <td class="vip2">$200 / 30天</td>
              <td class="vip3">$300 / 45天</td>
            </tr>
            <tr>
              <td><span class="plan-icon">🕒</span>刊登天數</td>
              <td class="vip1">15天</td>
              <td class="vip2">30天</td>
              <td class="vip3">45天</td>
            </tr>
            <tr>
              <td><span class="plan-icon">🔄</span>排序自動更新</td>
              <td class="vip1">⛔ 無</td>
              <td class="vip2">每3天</td>
              <td class="vip3">每日</td>
            </tr>
            <tr>
              <td><span class="plan-icon">🏷️</span>標籤</td>
              <td class="vip1">⛔ 無</td>
              <td class="vip2">推薦</td>
              <td class="vip3">精選</td>
            </tr>
            <tr>
              <td><span class="plan-icon">📈</span>曝光/排序優先</td>
              <td class="vip1">一般</td>
              <td class="vip2">推薦排序</td>
              <td class="vip3">首頁/置頂</td>
            </tr>
            <tr>
              <td><span class="plan-icon">📢</span>適合對象</td>
              <td class="vip1">剛開始嘗試刊登</td>
              <td class="vip2">希望快速出租</td>
              <td class="vip3">高價/急售/極致曝光</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    <section class="faq-section">
      <h3>常見問題 FAQ</h3>
      <div class="faq-accordion">
        <div v-for="(item, idx) in faqs" :key="idx" class="faq-item">
          <div class="faq-question" @click="toggleFaq(idx)">
            <span>{{ item.q }}</span>
            <span class="faq-arrow">{{ openFaq === idx ? '▲' : '▼' }}</span>
          </div>
          <transition name="faq-smooth">
            <div v-show="openFaq === idx" class="faq-answer">{{ item.a }}</div>
          </transition>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const faqs = [
  { q: 'Q: 方案購買後可以更換嗎？', a: 'A: 方案一旦購買並啟用後，無法直接更換為其他方案，但您可以隨時加購升級至更高級的方案（例如由 VIP1 升級至 VIP2 或 VIP3）。升級後會立即套用新的曝光權益與服務，而原本的剩餘天數也會自動整合至新方案，不浪費。若您不確定要購買哪個方案，建議可以先從 VIP1 開始嘗試，若覺得效果不錯，再升級至 VIP2、VIP3 加速出租。' },
  { q: 'Q: 方案到期會怎樣？', a: 'A: 當方案到期後，您的物件會自動轉為下架狀態，不會再被租客看到。您可以隨時再次選擇新的刊登方案並重新上架，不會影響您的物件資料。' },
  { q: 'Q: VIP2/3 方案的排序更新有什麼好處？', a: 'A: 租屋平台的物件排序會根據新鮮度、熱門程度進行調整。VIP2 與 VIP3 方案都擁有自動排序更新功能，可以確保您的物件持續維持在靠前頁面，避免沉到後面頁數。VIP2 會每 3 天自動刷新排序，VIP3 則是每日刷新，確保物件一直處於高曝光位置。這樣能大大增加租客點擊率、提升詢問數，尤其對於想快速出租的房東非常重要。' },
  { q: 'Q: 什麼是「推薦」與「精選」標籤？', a: 'A: 「推薦」與「精選」標籤是平台專為 VIP 物件設計的視覺強化功能。VIP2 會自動加上「推薦」標籤，讓租客第一眼就知道這是熱門物件，提升點擊率。VIP3 則會加上「精選」標籤，並搭配頁面置頂，形成視覺霸榜效果，讓租客更容易點選。這些標籤可以讓您的物件在眾多房源中脫穎而出，提升被選中的機會。' },
  { q: 'Q: 方案期間內可以隨時下架嗎？', a: 'A: 可以。房東可以在方案期間內隨時手動下架物件，例如物件已出租或暫時不開放看屋。但請注意，即使提早下架，廣告費用不會退還，且剩餘的刊登天數也不會延後或保留。建議您確認物件確實出租或不再需要曝光時再進行下架，以免浪費您已購買的廣告權益。如有特殊狀況，也可聯繫平台客服了解處理方式。' },
];
const openFaq = ref(null);
function toggleFaq(idx) {
  openFaq.value = openFaq.value === idx ? null : idx;
}
</script>

<style scoped>
.ad-purchase-container {
  max-width: 1000px;
  margin: 40px auto 0 auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 6px 32px rgba(60, 221, 210, 0.08);
  padding: 2.5rem 2.5rem 2rem 2.5rem;
}
.plan-table-section {
  margin-bottom: 2.5rem;
}
.plan-table-wrapper {
  overflow-x: auto;
}
.plan-table {
  width: 100%;
  border-collapse: collapse;
  background: #fafbfc;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(60, 221, 210, 0.08);
  margin: 0 auto;
}
.plan-table th, .plan-table td {
  padding: 1.1rem 1.2rem;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
  font-size: 1.08rem;
}
.plan-table th.plan-head {
  background: #e0f7fa;
  color: #24B4A8;
  font-weight: bold;
  font-size: 1.15rem;
  letter-spacing: 1px;
}
.plan-table th {
  font-size: 1.15rem;
  font-weight: bold;
  background: #f0fafd;
}
.plan-table .vip1 { color: #FFD600; font-weight: bold; }
.plan-table .vip2 { color: #FF9800; font-weight: bold; }
.plan-table .vip3 { color: #F44336; font-weight: bold; }
.plan-icon { font-size: 1.2rem; margin-right: 0.2rem; }

.faq-section {
  margin-top: 2.5rem;
}
.faq-accordion {
  margin-top: 1.2rem;
  border-radius: 12px;
  background: #f7fafc;
  box-shadow: 0 2px 8px #eee;
  padding: 1.2rem 1.5rem;
}
.faq-item + .faq-item { border-top: 1px solid #e0e0e0; }
.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 1.08rem;
  padding: 0.7rem 0;
  cursor: pointer;
  color: #24B4A8;
  transition: color 0.2s;
}
.faq-question:hover { color: #1fa89c; }
.faq-answer {
  padding: 0.5rem 0 1rem 0.2rem;
  color: #444;
  font-size: 1rem;
  line-height: 1.7;
  overflow: hidden;
}
.faq-arrow {
  font-size: 1.1rem;
  margin-left: 0.7rem;
}
.faq-smooth-enter-active, .faq-smooth-leave-active {
  transition: max-height 0.35s cubic-bezier(.4,0,.2,1), opacity 0.35s cubic-bezier(.4,0,.2,1);
}
.faq-smooth-enter-from, .faq-smooth-leave-to {
  max-height: 0;
  opacity: 0;
}
.faq-smooth-enter-to, .faq-smooth-leave-from {
  max-height: 200px;
  opacity: 1;
}
@media (max-width: 900px) {
  .plan-table th, .plan-table td {
    padding: 0.7rem 0.5rem;
    font-size: 0.98rem;
  }
}
@media (max-width: 700px) {
  .ad-purchase-container {
    padding: 1rem 0.5rem;
  }
  .plan-table th, .plan-table td {
    padding: 0.5rem 0.2rem;
    font-size: 0.93rem;
  }
}
</style> 