<script setup>
import { ref } from 'vue';
const props = defineProps({
  message: {
    type: Object,
    required: true
  },
  isMe: {
    type: Boolean,
    default: false
  }
});

const msgType = props.message?.type || 'text'; // fallback
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const emit = defineEmits(['delete-message', 'report-message']);

const showReportMenu = ref(false);
const reportReason = ref('');
const reportOptions = [
  '不當言論',
  '騷擾/攻擊',
  '垃圾訊息',
  '色情/暴力',
  '其他'
];

function getImageUrl(rawUrl) {
  if (!rawUrl) return '/images/chat/placeholder.png'; // fallback 預設圖片
  if (rawUrl.startsWith('http')) return rawUrl; // 已是絕對網址
  return VITE_API_BASE_URL + rawUrl; // 拼完整網址
}

function confirmDelete() {
  emit('delete-message', props.message.id || props.message.hMessageId);
}

function openReportMenu() {
  showReportMenu.value = true;
  reportReason.value = '';
}

function handleReport() {
  if (!reportReason.value) {
    alert('請選擇檢舉理由');
    return;
  }
  emit('report-message', {
    messageId: props.message.id || props.message.hMessageId,
    reason: reportReason.value
  });
  showReportMenu.value = false;
}

function cancelReport() {
  showReportMenu.value = false;
}
</script>

<template>
  <div :class="['msg-bubble', isMe ? 'me' : 'other']">
    <!-- 文字訊息 -->
    <pre
      v-if="msgType === 'text' || msgType === '文字'"
      class="msg-text"
    >{{ message.content || message.text || '' }}</pre>

    <!-- 圖片訊息 -->
    <img
      v-else-if="msgType === 'image' || msgType === '圖片'"
      :src="getImageUrl(message.content)"
       alt="圖片訊息"
       class="msg-image"
/>

    <!-- 未來擴充：檔案、語音、貼圖... -->

    <div class="msg-time">{{ message.time }}</div>
    <!-- 刪除/檢舉按鈕 -->
    <div class="bubble-actions">
      <button class="delete-btn" @click="confirmDelete">刪除</button>
      <button class="report-btn" @click="openReportMenu">檢舉</button>
    </div>
    <!-- 檢舉理由選單 -->
    <div v-if="showReportMenu" class="report-menu">
      <div class="report-title">請選擇檢舉理由：</div>
      <select v-model="reportReason">
        <option value="" disabled>請選擇</option>
        <option v-for="opt in reportOptions" :key="opt" :value="opt">{{ opt }}</option>
      </select>
      <div class="report-actions">
        <button class="report-confirm" @click="handleReport">檢舉</button>
        <button class="report-cancel" @click="cancelReport">取消</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.msg-bubble {
  max-width: 70%;
  border-radius: 1.25rem 1.25rem 1.25rem 0.25rem;
  padding: 0.9rem 1.2rem;
  font-size: 1.05rem;
  margin-bottom: 0.4rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  word-break: break-word;
  position: relative;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.msg-bubble.me {
    align-self: flex-end;
    background: #3cddd2;
    color: #fff;
    border-radius: 1.25rem 1.25rem 0.25rem 1.25rem;
}

.msg-bubble.other {
    align-self: flex-start;
    background: #f4f5f7;
    color: #222;
}

.msg-text {
  margin-bottom: 0.3rem;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: inherit;
  font-size: 1.2rem;
}

.msg-image {
  width: 150px;
  height: 150px;
  border-radius: 0.8rem;
  object-fit: cover;
  margin-bottom: 0.3rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.msg-time {
    font-size: 0.85rem;
    color: #888;
    text-align: right;
}

.bubble-actions {
  margin-top: 0.3rem;
  text-align: right;
}

.delete-btn {
  background: transparent;
  color: #ff4d4f;
  border: none;
  border-radius: 4px;
  padding: 2px 10px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.2s;
}

.delete-btn:hover {
  background: rgba(255,77,79,0.08);
  color: #d9363e;
}

.report-btn {
  background: transparent;
  color: #faad14;
  border: none;
  border-radius: 4px;
  padding: 2px 10px;
  font-size: 0.85rem;
  cursor: pointer;
  margin-left: 0.5rem;
  transition: background 0.2s;
}
.report-btn:hover {
  background: rgba(250,173,20,0.08);
  color: #d48806;
}
.report-menu {
  background: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 6px;
  padding: 0.7rem 1rem;
  margin-top: 0.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.report-title {
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  color: #faad14;
}
.report-actions {
  margin-top: 0.5rem;
  text-align: right;
}
.report-confirm {
  background: #faad14;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 2px 10px;
  font-size: 0.85rem;
  cursor: pointer;
  margin-right: 0.5rem;
}
.report-cancel {
  background: transparent;
  color: #888;
  border: none;
  border-radius: 4px;
  padding: 2px 10px;
  font-size: 0.85rem;
  cursor: pointer;
}
.report-confirm:hover {
  background: #d48806;
}
</style> 