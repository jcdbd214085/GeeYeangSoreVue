<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import QARobot from "@/components/QARobot/QARobot.vue";

const receiveData = ref([]);
const loading = ref(true);
const error = ref(null);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Format date consistently
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

// Toggle card expansion
const expandedItems = ref({});
const toggleExpand = (id) => {
  expandedItems.value[id] = !expandedItems.value[id];
};

async function fetchData() {
  try {
    loading.value = true;
    const res = await axios.get(`${API_BASE_URL}/api/About/about`, {
      withCredentials: true //加入此行可以帶入登入者資訊，傳給後端做驗證
    });
    const newsList = res.data.response;
    console.log("取得關於我們資料:", newsList);
    receiveData.value = newsList;
  } catch (error) {
    console.error("取得資料失敗", error);
    error.value = '無法載入關於我們的資料，請稍後再試';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchData();
});
</script>

<template>
  <section class="about-section">
    <div class="container">
      <!-- Header Section -->
      <header class="header-section text-center">
        <h2 class="section-title">關於我們</h2>
        <div class="section-divider"></div>
        <p class="section-subtitle">探索我們的故事與使命</p>
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
      <div v-else-if="receiveData.length === 0" class="empty-state text-center">
        <i class="bi bi-info-circle"></i>
        <h4>暫無內容</h4>
        <p class="text-muted">目前沒有關於我們的資料</p>
      </div>

      <!-- About Content -->
      <div v-else class="about-content">
        <div v-for="(item, index) in receiveData" :key="item.hAboutId" class="about-card-wrapper">
          <article class="about-card">
            <header class="card-header">
              <div class="card-title-group">
                <span class="about-number">{{ index + 1 }}</span>
                <h5 class="card-title">{{ item.hTitle }}</h5>
              </div>

              <button

                  class="toggle-btn"
                  @click="toggleExpand(item.hAboutId || index)"
                  :aria-expanded="expandedItems[item.hAboutId || index]"
                  :aria-controls="`content-${item.hAboutId || index}`"
              >
                <i class="bi" :class="expandedItems[item.hAboutId || index] ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
              </button>

            </header>
            <div
                class="card-content"
                :class="{ 'collapsed': !expandedItems[item.hAboutId || index] }"
                :id="`content-${item.hAboutId || index}`"
            >
              <p class="about-text">{{ item.hContent }}</p>
              <hr>
              <footer class="about-meta">
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
          </article>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* Base styles */
.about-section {
  background:white;
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
  width: auto;
  height: 5px;
  background: #3CDDD2;
  margin: 0 auto 1.5rem;
  border-radius: 3px;
}

.section-subtitle {
  font-size: 1.25rem;
  max-width: 600px;
  margin: 0 auto;
}


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

/* About card */
.about-card-wrapper {
  margin-bottom: 1.5rem;
}

.about-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.about-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #ffffff, #f8fafc);
}

.card-title-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #222222;
}

.about-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  background: #3CDDD2;
  color: white;
  border-radius: 50%;
  font-weight: 700;
  font-size: 1rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}
.toggle-btn {
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12 6l-4 4-4-4"/></svg>') no-repeat center center;
  background-size: 50%;
  border: none;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}


.toggle-btn:hover {
  background: #e2e8f0;
}

/* Card content */
.card-content {
  max-height: 2000px;
  padding: 0 2rem 2rem;
  overflow: hidden;
  transition: max-height 0.5s ease, padding 0.5s ease, opacity 0.5s ease;
  opacity: 1;
}

.card-content.collapsed {
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  opacity: 0;
}

.about-text {
  color: #666666;
  line-height: 1.75;
  font-size: 1.05rem;
  margin-bottom: 1.5rem;
}

hr {
  border-color: #e5e7eb;
  margin: 1.5rem 0;
}

.about-meta {
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

.contact-section h4 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .about-section {
    padding: 3rem 0;
  }

  .section-title {
    font-size: 2rem;
  }

  .about-card {
    margin: 0 0.5rem;
  }

  .card-header {
    padding: 1.25rem 1.5rem;
  }

  .card-content {
    padding: 0 1.5rem 1.5rem;
  }

  .about-meta {
    flex-direction: column;
    align-items: flex-start;
  }

  .contact-section {
    padding: 2rem;
  }
}

@media (max-width: 576px) {
  .contact-buttons {
    flex-direction: column;
    gap: 0.75rem;
  }

  .btn {
    width: 100%;
  }
}
</style>