<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import Button from "@/components/buttons/button.vue";

let Titles = ref([]);
const loading = ref(true);
const error = ref(null);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function fetchData() {
  try {
    loading.value = true;
    const res = await axios.get(`${API_BASE_URL}/api/Guide/guide`);
    Titles.value = res.data.response;
    console.log(Titles.value); // 確認 API 返回的資料格式
  } catch (error) {
    console.error('取得資料失敗', error);
    error.value = '無法載入資料，請稍後再試';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="faq-section py-5">
    <div class="container">
      <!-- Header Section -->
      <div class="row mb-5">
        <div class="col-lg-12 text-center">
          <h2 class="section-title mb-3">常見問題解答</h2>
          <div class="section-divider"></div>
          <p class="section-subtitle">找到您需要的所有解答</p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">載入中...</span>
        </div>
        <p class="mt-2">資料載入中，請稍候...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-danger" role="alert">
        {{ error }}
      </div>

      <!-- FAQ Content -->
      <div v-else class="row">
        <div class="col-lg-12">
          <div class="accordion custom-accordion" id="faqAccordion">
            <div
                v-for="(item, index) in Titles"
                :key="index"
                class="accordion-item mb-4 shadow-sm"
            >
              <h2 class="accordion-header" :id="'heading-' + index">
                <button
                    class="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    :data-bs-target="'#collapse-' + index"
                    aria-expanded="false"
                    :aria-controls="'collapse-' + index"
                >
                  <div class="d-flex align-items-center">
                    <div class="faq-number">{{ index + 1 }}</div>
                    <span class="ms-3" style="color: #222222;">{{ item.hTitle }}</span>

                  </div>
                </button>
              </h2>
              <div
                  :id="'collapse-' + index"
                  class="accordion-collapse collapse"
                  :aria-labelledby="'heading-' + index"
                  data-bs-parent="#faqAccordion"
              >
                <div class="accordion-body">
                  <div class="row">
                    <div class="col-md-8">
                      <p class="faq-content">{{ item.hContent }}</p>
                    </div>
                    <div v-if="item.hImagePath" class="col-md-4">
                      <div class="faq-image-container">
                        <img
                            :src="`data:image/jpeg;base64,${item.hImagePath}`"
                            class="img-fluid faq-image"
                            alt="說明圖片"
                            @click="openImageModal(item.hImagePath)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="Titles.length === 0" class="text-center py-5">
            <div class="empty-state">
              <i class="bi bi-question-circle empty-icon"></i>
              <h4 class="mt-3">沒有常見問題</h4>
              <p class="text-muted">目前沒有任何常見問題資料</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Section with Contact Info -->
<!--      <div class="row mt-5">-->
<!--        <div class="col-12 text-center">-->
<!--          <div class="additional-help p-4">-->
<!--            <h5>沒有找到您的問題?</h5>-->
<!--            <p>請聯繫我們的客戶服務團隊</p>-->
<!--            <Button>聯繫我們</Button>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
    </div>
  </div>
</template>

<style scoped>
.faq-section {
  background-color: white;
}

.section-title {
  color: #2c3e50;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.section-subtitle {
  color: #6c757d;
  font-size: 1.1rem;
}

.section-divider {
  height: 4px;
  width: auto;
  background: #3CDDD2;
  margin: 0 auto 20px;
  border-radius: 2px;
}

/* Accordion Styling */
.custom-accordion .accordion-item {
  border-radius: 10px;
  overflow: hidden;
  border: none;
  transition: all 0.3s ease;
}

.custom-accordion .accordion-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.custom-accordion .accordion-button {
  padding: 1.2rem 1.5rem;
  font-weight: 600;
  background-color: white;
  color: #343a40;
  border: none;
}

.custom-accordion .accordion-button:not(.collapsed) {
  color: #2c3e50;
  background-color: #e8f4ff;
  box-shadow: none;
}

.custom-accordion .accordion-button:focus {
  box-shadow: none;
  border-color: rgba(0, 123, 255, 0.25);
}

.custom-accordion .accordion-button::after {
  background-size: 1.2rem;
  transition: all 0.3s ease;
}

.custom-accordion .accordion-body {
  background-color: #f8f9fa;
  padding: 1.5rem;
  line-height: 1.8;
}

/* Number Badge */
.faq-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: #3CDDD2;
  color: white;
  border-radius: 50%;
  font-size: 0.85rem;
  font-weight: 600;
}

/* FAQ Content */
.faq-content {
  color: #666666;
}

/* Image Styling */
.faq-image-container {
  display: flex;
  justify-content: center;
  padding: 10px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.faq-image {
  max-height: 200px;
  object-fit: contain;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.faq-image:hover {
  transform: scale(1.05);
}

/* Empty State */
.empty-state {
  padding: 3rem 0;
}

.empty-icon {
  font-size: 3rem;
  color: #6c757d;
}

/* Additional Help Section */
.additional-help {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  margin-top: 2rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .accordion-button {
    padding: 1rem;
  }

  .faq-content, .accordion-body {
    padding: 1rem;
  }

  .faq-image-container {
    margin-top: 1rem;
  }
}

/* Loading spinner */
.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>