<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Announcement data
const announcements = ref([]);
const loading = ref(true);
const error = ref(null);

// Pagination
const itemsPerPage = 10;
const currentPage = ref(1);
const totalAnnouncements = computed(() => announcements.value.length);
const totalPages = computed(() => Math.ceil(totalAnnouncements.value / itemsPerPage));

// Displayed pages for pagination
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

// Search and filter
const searchKeyword = ref('');
const filteredAnnouncements = computed(() => {
  if (!searchKeyword.value) return announcements.value;
  return announcements.value.filter(item =>
      item.hTitle.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      item.hContent.toLowerCase().includes(searchKeyword.value.toLowerCase())
  );
});

// Check if announcement is new (within 7 days)
const isNew = (announcement) => {
  const publishDate = new Date(announcement.hCreatedAt);
  const currentDate = new Date();
  const diffTime = currentDate - publishDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return '未知';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Fetch data
async function fetchData() {
  try {
    loading.value = true;
    const res = await axios.get(`${API_BASE_URL}/api/Notice/news`);
    const newsList = res.data.response;
    console.log("取得公告資料:", newsList);
    announcements.value = newsList;
  } catch (error) {
    console.error('取得資料失敗', error);
    error.value = '無法載入公告資料，請稍後再試';
  } finally {
    loading.value = false;
  }
}

// Initialize
onMounted(() => {
  fetchData();
});
</script>

<template>
  <section class="announcement-section">
    <div class="container">
      <!-- Header Section -->
      <header class="header-section text-center">
        <h2 class="section-title">公告列表</h2>
        <div class="section-divider"></div>
        <p class="section-subtitle">查看最新的公告與資訊</p>
        <div class="header-controls">
          <input
              v-model="searchKeyword"
              type="text"
              class="search-input"
              placeholder="搜尋公告..."
              aria-label="搜尋公告"
          >
        </div>
      </header>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state text-center">
        <div class="spinner"></div>
        <p class="loading-text">資料載入中...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <i class="bi bi-exclamation-triangle-fill"></i>
        {{ error }}
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredAnnouncements.length === 0" class="empty-state text-center">
        <i class="bi bi-info-circle"></i>
        <h4>暫無公告</h4>
        <p class="text-muted">目前沒有可顯示的公告</p>
      </div>

      <!-- Announcement List -->
      <div v-else class="announcement-list">
        <article
            v-for="(item, index) in filteredAnnouncements.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)"
            :key="item.hAboutId || index"
            class="announcement-card"
        >
          <div class="card-content">
            <div class="image-container" v-if="item.hImagePath">
              <img
                  :src="`data:image/jpeg;base64,${item.hImagePath}`"
                  alt="公告圖片"
                  class="announcement-image"
              >
            </div>
            <div class="text-content">
              <header class="card-header">
                <h5 class="card-title">
                  {{ item.hTitle }}
                  <span v-if="isNew(item)" class="new-badge">新</span>
                </h5>
              </header>
              <p class="announcement-text">{{ item.hContent }}</p>
              <footer class="announcement-meta">
                <div class="meta-item">
                  <i class="bi bi-calendar"></i>
                  <span>建立：{{ formatDate(item.hCreatedAt) }}</span>
                </div>
                <div class="meta-item">
                  <i class="bi bi-clock-history"></i>
                  <span>更新：{{ formatDate(item.hUpdatedAt) }}</span>
                </div>
              </footer>
            </div>
          </div>
        </article>
      </div>

      <!-- Pagination -->
      <nav v-if="totalPages > 1" class="pagination-section">
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="currentPage = 1" :disabled="currentPage === 1">
              <i class="bi bi-chevron-double-left"></i>
            </button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="currentPage -= 1" :disabled="currentPage === 1">
              <i class="bi bi-chevron-left"></i>
            </button>
          </li>
          <li v-for="page in displayedPages" :key="page" class="page-item" :class="{ active: page === currentPage }">
            <button class="page-link" @click="currentPage = page">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="currentPage += 1" :disabled="currentPage === totalPages">
              <i class="bi bi-chevron-right"></i>
            </button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="currentPage = totalPages" :disabled="currentPage === totalPages">
              <i class="bi bi-chevron-double-right"></i>
            </button>
          </li>

        </ul>
      </nav>
    </div>
  </section>
</template>

<style scoped>
/* Base styles */
.announcement-section {
  background: white;
  padding: 5rem 0;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Header styles */
.header-section {
  margin-bottom: 4rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 1rem;
  letter-spacing: -0.025em;
}

.section-divider {
  width: 80px;
  height: 5px;
  background: #3CDDD2;
  margin: 0 auto 1.5rem;
  border-radius: 3px;
}

.section-subtitle {
  font-size: 1.25rem;
  color: #666666;
  max-width: 600px;
  margin: 0 auto 1.5rem;
}

.header-controls {
  max-width: 400px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #3CDDD2;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Loading state */
.loading-state {
  padding: 4rem 0;
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid #3b82f6;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  color: #4b5563;
  font-size: 1.1rem;
}

/* Error state */
.error-state {
  background: #fee2e2;
  color: #b91c1c;
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
}

/* Empty state */
.empty-state {
  padding: 5rem 0;
  color: #6b7280;
}

.empty-state i {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.empty-state h4 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

/* Announcement card */
.announcement-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}


.announcement-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.announcement-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
}

.card-content {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  border: 1px solid #3CDDD2;
}

.image-container {
  flex: 0 0 auto;
}

.announcement-image {
  max-width: 200px;
  max-height: 200px;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.text-content {
  flex: 1;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #222222;
  margin: 0;
}

.new-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #10b981;
  color: #666666;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.announcement-text {
  color: #374151;
  line-height: 1.75;
  font-size: 1.05rem;
  margin-bottom: 1.5rem;
}

.announcement-meta {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  color: #6b7280;
  font-size: 0.9rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Pagination */
.pagination-section {
  margin-top: 3rem;
  display: flex;
  justify-content: center;
}

.pagination {
  display: flex;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
}

.page-item {
  display: flex;
}

.page-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-link:hover {
  background: #f1f5f9;
  border-color: #3b82f6;
}

.page-item.active .page-link {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.page-item.disabled .page-link {
  color: #d1d5db;
  cursor: not-allowed;
  background: #f8fafc;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .announcement-section {
    padding: 3rem 0;
  }

  .section-title {
    font-size: 2rem;
  }

  .card-content {
    flex-direction: column;
    padding: 1.5rem;
    gap: 1.5rem;
  }

  .announcement-image {
    max-width: 100%;
  }

  .announcement-meta {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 576px) {
  .search-input {
    font-size: 0.95rem;
  }

  .page-link {
    width: 2rem;
    height: 2rem;
    font-size: 0.85rem;
  }
}
</style>