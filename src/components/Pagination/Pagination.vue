<template>
    <div class="pagination-container">
      <div class="pagination">
        <button
            class="pagination-btn pagination-nav"
            @click="prevPage"
            :disabled="currentPage === 1"
            :class="{ 'disabled': currentPage === 1 }"
        >
          <svg class="pagination-icon" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>
  
        <button
            v-if="showFirstLastButtons && currentPage > 3"
            class="pagination-btn"
            :class="{ 'active': currentPage === 1 }"
            @click="changePage(1)"
        >
          1
        </button>
  
        <span v-if="showFirstLastButtons && currentPage > 4" class="pagination-ellipsis">...</span>
  
        <button
            v-for="page in visiblePageNumbers"
            :key="page"
            class="pagination-btn"
            :class="{ 'active': currentPage === page }"
            @click="changePage(page)"
        >
          {{ page }}
        </button>
  
        <span v-if="showFirstLastButtons && currentPage < totalPages - 3" class="pagination-ellipsis">...</span>
  
        <button
            v-if="showFirstLastButtons && currentPage < totalPages - 2"
            class="pagination-btn"
            :class="{ 'active': currentPage === totalPages }"
            @click="changePage(totalPages)"
        >
          {{ totalPages }}
        </button>
  
        <button
            class="pagination-btn pagination-nav"
            @click="nextPage"
            :disabled="currentPage === totalPages"
            :class="{ 'disabled': currentPage === totalPages }"
        >
          <svg class="pagination-icon" viewBox="0 0 24 24">
            <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
          </svg>
        </button>
      </div>
  
      <div v-if="showPageInfo" class="pagination-info">
        第 {{ currentPage }}/{{ totalPages }} 頁，共 {{ props.totalItems }} 項
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch, defineProps, defineEmits } from 'vue'
  
  const props = defineProps({
    totalItems: {
      type: Number,
      required: true
    },
    itemsPerPage: {
      type: Number,
      default: 10
    },
    modelValue: {
      type: Number,
      default: 1
    },
    maxVisibleButtons: {
      type: Number,
      default: 5
    },
    showFirstLastButtons: {
      type: Boolean,
      default: true
    },
    showPageInfo: {
      type: Boolean,
      default: true
    }
  })
  
  const emit = defineEmits(['update:modelValue', 'page-changed'])
  
  const currentPage = ref(props.modelValue)
  
  const totalPages = computed(() => {
    return Math.ceil(props.totalItems / props.itemsPerPage) || 1
  })
  
  const visiblePageNumbers = computed(() => {
    const maxButtons = props.maxVisibleButtons
    const halfWay = Math.floor(maxButtons / 2)
  
    let startPage = Math.max(currentPage.value - halfWay, 1)
    let endPage = Math.min(startPage + maxButtons - 1, totalPages.value)
  
    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(endPage - maxButtons + 1, 1)
    }
  
    const pages = []
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
  
    return pages
  })
  
  watch(() => props.modelValue, (newValue) => {
    if (newValue !== currentPage.value) {
      currentPage.value = newValue
    }
  })
  
  watch(totalPages, (newValue) => {
    if (currentPage.value > newValue) {
      changePage(newValue)
    }
  })
  
  function changePage(page) {
    currentPage.value = page
    emit('update:modelValue', page)
    emit('page-changed', {
      page: page,
      pageSize: props.itemsPerPage,
      offset: (page - 1) * props.itemsPerPage
    })
  }
  
  function prevPage() {
    if (currentPage.value > 1) {
      changePage(currentPage.value - 1)
    }
  }
  
  function nextPage() {
    if (currentPage.value < totalPages.value) {
      changePage(currentPage.value + 1)
    }
  }
  </script>
  
  <style scoped>
  .pagination-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

/* 初始狀態：白底 + #4ecdc4 字 + 邊框 */
.pagination-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  height: 2.5rem;
  padding: 0 0.75rem;
  border: 1px solid #4ecdc4;
  background-color: white;
  color: #4ecdc4;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

/* 滑鼠移入狀態：#ff9800 底 + 白字 */
.pagination-btn:hover:not(.active, .disabled) {
  background-color: #ff9800;
  border-color: #ff9800;
  color: white;
}

/* 選中狀態：#4ecdc4 底 + 白字 */
.pagination-btn.active {
  background-color: #4ecdc4;
  border-color: #4ecdc4;
  color: white;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(66, 153, 225, 0.4);
}

/* 無法點擊狀態 */
.pagination-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* 上一頁、下一頁圖示按鈕寬度統一 */
.pagination-nav {
  padding: 0;
  width: 2.5rem;
}

/* SVG 圖示樣式 */
.pagination-icon {
  width: 1.25rem;
  height: 1.25rem;
  fill: currentColor;
}

/* 省略號樣式 */
.pagination-ellipsis {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.5rem;
  padding: 0 0.5rem;
  color: #a0aec0;
  font-weight: 600;
}

/* 顯示目前頁數訊息 */
.pagination-info {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: #718096;
}

/* 響應式調整：小螢幕按鈕更小 */
@media (max-width: 640px) {
  .pagination {
    gap: 0.25rem;
  }

  .pagination-btn {
    min-width: 2.25rem;
    height: 2.25rem;
    padding: 0 0.5rem;
    font-size: 0.75rem;
  }

  .pagination-nav {
    width: 2.25rem;
  }

  .pagination-icon {
    width: 1rem;
    height: 1rem;
  }
}

/* 點擊漣漪效果 */
.pagination-btn:after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%);
  transform-origin: 50% 50%;
}

.pagination-btn:not(.disabled):active:after {
  animation: ripple 0.4s ease-out;
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }
  20% {
    transform: scale(25, 25);
    opacity: 0.3;
  }
  100% {
    opacity: 0;
    transform: scale(40, 40);
  }
}
  </style>
  