<!-- SystemAnnouncementPage.vue -->
<template>
  <div class="announcement-container">

    <div class="announcement-content">
      <!-- 左側公告列表 -->
      <div class="announcement-list">
        <div class="search-bar">
          <input
              v-model="searchKeyword"
              placeholder="搜尋公告..."
              @input="filterAnnouncements"
          />
        </div>

        <div class="list-header">
          <span class="header-title">標題</span>
          <span class="header-date">發布日期</span>
        </div>

        <div class="list-body" v-if="filteredAnnouncements.length > 0">
          <div
              v-for="item in filteredAnnouncements"
              :key="item.id"
              class="announcement-item"
              :class="{ active: selectedAnnouncement && selectedAnnouncement.id === item.id }"
              @click="selectAnnouncement(item)"
          >
            <div class="item-badge" v-if="isNew(item)">NEW</div>
            <div class="item-badge important" v-if="item.important">重要</div>
            <div class="item-content">
              <div class="item-title">{{ item.title }}</div>
              <div class="item-date">{{ formatDate(item.publishDate) }}</div>
            </div>
          </div>
        </div>

        <div class="empty-list" v-else>
          <p>沒有找到相關公告</p>
        </div>
      </div>

      <!-- 右側公告詳情 -->
      <div class="announcement-detail">
        <div v-if="selectedAnnouncement" class="detail-content">
          <h2 class="detail-title">{{ selectedAnnouncement.title }}</h2>
          <div class="detail-meta">
            <span class="meta-item">
              <strong>發布日期:</strong> {{ formatDate(selectedAnnouncement.publishDate) }}
            </span>
            <span class="meta-item" v-if="selectedAnnouncement.expiryDate">
              <strong>到期日期:</strong> {{ formatDate(selectedAnnouncement.expiryDate) }}
            </span>
            <span class="meta-item">
              <strong>發布者:</strong> {{ selectedAnnouncement.publisher }}
            </span>
          </div>
          <div class="detail-body" v-html="selectedAnnouncement.content"></div>

          <div class="attachment-section" v-if="selectedAnnouncement.attachments && selectedAnnouncement.attachments.length > 0">
          </div>
        </div>

        <div v-else class="no-selection">
          <div class="placeholder-icon">📢</div>
          <p>請從左側選擇一個公告查看詳情</p>
        </div>
      </div>
    </div>

    <footer class="announcement-footer">
      <div class="pagination" v-if="totalPages > 1">
        <button
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
            class="page-btn"
        >
          上一頁
        </button>

        <div class="page-numbers">
          <span
              v-for="page in displayedPages"
              :key="page"
              :class="{ active: currentPage === page }"
              @click="changePage(page)"
              class="page-number"
          >
            {{ page }}
          </span>
        </div>

        <button
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
            class="page-btn"
        >
          下一頁
        </button>
      </div>

      <div class="footer-info">
        顯示 {{ filteredAnnouncements.length }} 筆公告，共 {{ totalAnnouncements }} 筆
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// 模擬公告資料
const announcements = ref([
  {
    id: 1,
    title: '系統維護通知 - 5月10日 00:00-03:00',
    content: `<p>親愛的用戶：</p>
              <p>我們將於5月10日 00:00-03:00進行系統維護，屆時系統將暫停服務。</p>
              <p>維護內容：</p>
              <ul>
                <li>伺服器升級</li>
                <li>資料庫優化</li>
                <li>安全性更新</li>
              </ul>
              <p>如有不便，敬請見諒。</p>
              <p>感謝您的支持與理解！</p>`,
    publishDate: '2025-05-05',
    expiryDate: '2025-05-11',
    publisher: '系統管理員',
    important: true,
    attachments: [
      { name: '維護時間表.pdf', url: '/files/maintenance-schedule.pdf' }
    ]
  },
  {
    id: 2,
    title: '新功能上線通知 - 個人中心改版',
    content: `<p>我們很高興地通知您，個人中心已完成全面改版！</p>
              <p>新版本提供以下優點：</p>
              <ul>
                <li>優化使用者介面，操作更直覺</li>
                <li>新增數據分析圖表，掌握個人資訊一目了然</li>
                <li>支援深色模式，保護您的視力</li>
              </ul>
              <p>立即體驗全新功能！</p>`,
    publishDate: '2025-05-03',
    publisher: '產品團隊',
    important: false,
    attachments: [
      { name: '使用指南.docx', url: '/files/user-guide.docx' },
      { name: '功能介紹.mp4', url: '/files/feature-intro.mp4' }
    ]
  },
  {
    id: 3,
    title: '重要：隱私政策更新',
    content: `<p>尊敬的用戶：</p>
              <p>我們已經更新了隱私政策，以符合最新的資料保護法規。</p>
              <p>主要變更包括：</p>
              <ul>
                <li>明確資料收集範圍</li>
                <li>強化用戶資料保護措施</li>
                <li>提供更多資料控制選項</li>
              </ul>
              <p>請在2025年5月20日前閱讀並確認新的隱私政策。</p>`,
    publishDate: '2025-04-20',
    expiryDate: '2025-05-20',
    publisher: '法務部門',
    important: true,
    attachments: [
      { name: '隱私政策全文.pdf', url: '/files/privacy-policy.pdf' }
    ]
  },
  {
    id: 4,
    title: '端午節系統優惠活動',
    content: `<p>端午佳節將至，我們特別推出以下優惠：</p>
              <ul>
                <li>VIP用戶升級享8折優惠</li>
                <li>新用戶註冊送300點積分</li>
                <li>限時功能免費試用</li>
              </ul>
              <p>活動時間：2025年6月1日至6月12日</p>
              <p>把握機會，立即參與！</p>`,
    publishDate: '2025-05-01',
    expiryDate: '2025-06-12',
    publisher: '市場部',
    important: false,
    attachments: []
  },
  {
    id: 5,
    title: '應用程式更新至v2.5.0版本',
    content: `<p>最新版本v2.5.0已發布，包含以下更新：</p>
              <ul>
                <li>修復已知問題</li>
                <li>性能優化，啟動速度提升30%</li>
                <li>新增批次處理功能</li>
                <li>介面微調，提升用戶體驗</li>
              </ul>
              <p>建議所有用戶盡快更新至最新版本。</p>`,
    publishDate: '2025-04-15',
    publisher: '開發團隊',
    important: false,
    attachments: [
      { name: '更新日誌.pdf', url: '/files/changelog.pdf' }
    ]
  }
]);

// 分頁相關
const itemsPerPage = 10;
const currentPage = ref(1);
const totalAnnouncements = computed(() => announcements.value.length);
const totalPages = computed(() => Math.ceil(totalAnnouncements.value / itemsPerPage));

// 計算需要顯示哪些頁碼
const displayedPages = computed(() => {
  const pages = [];
  const maxDisplayedPages = 5;
  let startPage = Math.max(1, currentPage.value - Math.floor(maxDisplayedPages / 2));
  let endPage = Math.min(totalPages.value, startPage + maxDisplayedPages - 1);

  if (endPage - startPage + 1 < maxDisplayedPages) {
    startPage = Math.max(1, endPage - maxDisplayedPages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});

// 搜尋與篩選
const searchKeyword = ref('');
const filteredAnnouncements = ref([...announcements.value]);
const selectedAnnouncement = ref(null);

// 檢查公告是否為新發布（7天內）
const isNew = (announcement) => {
  const publishDate = new Date(announcement.publishDate);
  const currentDate = new Date();
  const diffTime = currentDate - publishDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
};

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// 按關鍵字搜尋公告
const filterAnnouncements = () => {
  if (!searchKeyword.value) {
    filteredAnnouncements.value = [...announcements.value];
  } else {
    const keyword = searchKeyword.value.toLowerCase();
    filteredAnnouncements.value = announcements.value.filter(item =>
        item.title.toLowerCase().includes(keyword) ||
        item.content.toLowerCase().includes(keyword)
    );
  }
  currentPage.value = 1;
  // 如果篩選後沒有結果，清空選中項
  if (filteredAnnouncements.value.length === 0) {
    selectedAnnouncement.value = null;
  }
};

// 選擇公告查看詳情
const selectAnnouncement = (announcement) => {
  selectedAnnouncement.value = announcement;
};

// 切換頁面
const changePage = (page) => {
  currentPage.value = page;
};

// 重新獲取公告數據
const refreshAnnouncements = () => {
  // 實際使用時，這裡應該調用API重新獲取數據
  // 模擬重新獲取
  announcements.value = [...announcements.value];
  filterAnnouncements();
  selectedAnnouncement.value = null;
};

// 下載附件
const downloadAttachment = (attachment) => {
  // 實際使用時，這裡應該處理文件下載邏輯
  console.log(`正在下載: ${attachment.name}, URL: ${attachment.url}`);
  alert(`模擬下載文件: ${attachment.name}`);
};

// 初始化
onMounted(() => {
  // 實際使用時，這裡應該調用API獲取公告數據
  // fetchAnnouncements();

  // 默認選中第一條公告
  if (announcements.value.length > 0) {
    selectedAnnouncement.value = announcements.value[0];
  }
});
</script>

<style scoped>
.announcement-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 600px;
  background-color: #f5f7fa;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.announcement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
}

.announcement-header h1 {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.header-controls {
  display: flex;
  align-items: center;
}

.refresh-btn {
  display: flex;
  align-items: center;
  background-color: #f0f2f5;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: all 0.3s;
}

.refresh-btn:hover {
  background-color: #e6e9ed;
}

.refresh-icon {
  margin-right: 6px;
  font-size: 16px;
}

.announcement-content {
  display: flex;
  flex: 1;
  min-height: 0;
}

.announcement-list {
  width: 35%;
  border-right: 1px solid #e8e8e8;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.search-bar {
  padding: 12px 16px;
  border-bottom: 1px solid #e8e8e8;
}

.search-bar input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.search-bar input:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.list-header {
  display: flex;
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e8e8e8;
  font-weight: bold;
  color: #666;
  font-size: 14px;
}

.header-title {
  flex: 1;
}

.header-date {
  width: 100px;
  text-align: right;
}

.list-body {
  flex: 1;
  overflow-y: auto;
}

.announcement-item {
  position: relative;
  display: flex;
  padding: 12px 16px;
  border-bottom: 1px solid #e8e8e8;
  cursor: pointer;
  transition: all 0.3s;
}

.announcement-item:hover {
  background-color: #f5f7fa;
}

.announcement-item.active {
  background-color: #e6f7ff;
  border-left: 3px solid #1890ff;
}

.item-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: #1890ff;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  margin-right: 8px;
}

.item-badge.important {
  background-color: #ff4d4f;
}

.item-content {
  flex: 1;
  padding-left: 16px;
}

.item-title {
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
}

.item-date {
  font-size: 12px;
  color: #999;
  text-align: right;
}

.empty-list {
  padding: 32px;
  text-align: center;
  color: #999;
}

.announcement-detail {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: #fff;
}

.detail-content {
  max-width: 800px;
  margin: 0 auto;
}

.detail-title {
  font-size: 22px;
  margin-bottom: 16px;
  color: #333;
}

.detail-meta {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 24px;
  font-size: 14px;
  color: #666;
  border-bottom: 1px solid #e8e8e8;
  padding-bottom: 16px;
}

.meta-item {
  margin-right: 24px;
  margin-bottom: 8px;
}

.detail-body {
  font-size: 15px;
  line-height: 1.6;
  color: #333;
}

.detail-body p {
  margin-bottom: 16px;
}

.detail-body ul, .detail-body ol {
  margin-bottom: 16px;
  padding-left: 24px;
}

.detail-body li {
  margin-bottom: 8px;
}

.attachment-section {
  margin-top: 32px;
  border-top: 1px solid #e8e8e8;
  padding-top: 16px;
}

.attachment-section h3 {
  font-size: 16px;
  margin-bottom: 12px;
  color: #333;
}

.attachment-list {
  display: flex;
  flex-direction: column;
}

.attachment-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 8px;
}

.attachment-icon {
  font-size: 20px;
  margin-right: 12px;
  color: #666;
}

.attachment-name {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.download-btn {
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.download-btn:hover {
  background-color: #40a9ff;
}

.no-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
}

.placeholder-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.announcement-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: #fff;
  border-top: 1px solid #e8e8e8;
}

.pagination {
  display: flex;
  align-items: center;
}

.page-btn {
  background-color: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 6px 12px;
  margin: 0 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  color: #1890ff;
  border-color: #1890ff;
}

.page-btn:disabled {
  color: #d9d9d9;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  margin: 0 8px;
}

.page-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin: 0 4px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.page-number:hover {
  color: #1890ff;
}

.page-number.active {
  background-color: #1890ff;
  color: white;
}

.footer-info {
  font-size: 14px;
  color: #666;
}
</style>