<template>
  <!-- 聊天訊息視窗 -->
  <div class="chat-window" ref="chatContainer">
    <MessageBubble
      v-for="(msg, index) in messages"
      :key="msg.id ?? index"
      :message="msg"
      :isMe="String(msg.from) === String(user.id)"
      @delete-message="requestDeleteMessage"
      @report-message="requestReportMessage"
    />
    <!-- 滾動錨點（用於 auto scroll） -->
    <div ref="scrollAnchor" style="height: 1px;"></div>
    <!-- 自訂刪除訊息彈窗 -->
    <div v-if="showDeleteDialog" class="custom-modal">
      <div class="modal-content">
        <div class="modal-title">刪除訊息</div>
        <div class="modal-body">確定要刪除此訊息嗎？</div>
        <div class="modal-actions">
          <button class="modal-confirm" @click="confirmDeleteMessage">確定</button>
          <button class="modal-cancel" @click="cancelDelete">取消</button>
        </div>
      </div>
    </div>
    <!-- 自訂檢舉訊息彈窗 -->
    <div v-if="showReportDialog" class="custom-modal">
      <div class="modal-content">
        <div class="modal-title">檢舉訊息</div>
        <div class="modal-body">確定要檢舉此訊息嗎？<br>理由：<span style="color:#faad14">{{ pendingReport.reason }}</span></div>
        <div class="modal-actions">
          <button class="modal-confirm" @click="confirmReportMessage">檢舉</button>
          <button class="modal-cancel" @click="cancelReport">取消</button>
        </div>
      </div>
    </div>
    <!-- 自訂錯誤訊息彈窗 -->
    <div v-if="showErrorDialog" class="custom-modal">
      <div class="modal-content">
        <div class="modal-title">操作失敗</div>
        <div class="modal-body">{{ errorDialogMessage }}</div>
        <div class="modal-actions">
          <button class="modal-confirm" @click="closeErrorDialog">確定</button>
        </div>
      </div>
    </div>
    <!-- 自訂成功訊息彈窗 -->
    <div v-if="showSuccessDialog" class="custom-modal">
      <div class="modal-content">
        <div class="modal-title">操作成功</div>
        <div class="modal-body">{{ successDialogMessage }}</div>
        <div class="modal-actions">
          <button class="modal-confirm" @click="closeSuccessDialog">確定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick, watch } from 'vue';
import MessageBubble from './MessageBubble.vue';
import axios from 'axios';

const props = defineProps({
  messages: {
    type: Array,
    required: true
  },
  user: {
    type: Object,
    default: () => ({ id: null, name: '' })
  }
});

const chatContainer = ref(null);
let hasScrolled = false;

// 刪除訊息彈窗狀態
const showDeleteDialog = ref(false);
const pendingDeleteId = ref(null);

function requestDeleteMessage(messageId) {
  showDeleteDialog.value = true;
  pendingDeleteId.value = messageId;
}

// 錯誤彈窗狀態
const showErrorDialog = ref(false);
const errorDialogMessage = ref('');
function showError(message) {
  errorDialogMessage.value = message;
  showErrorDialog.value = true;
}
function closeErrorDialog() {
  showErrorDialog.value = false;
  errorDialogMessage.value = '';
}

// 成功彈窗狀態
const showSuccessDialog = ref(false);
const successDialogMessage = ref('');
function showSuccess(message) {
  successDialogMessage.value = message;
  showSuccessDialog.value = true;
}
function closeSuccessDialog() {
  showSuccessDialog.value = false;
  successDialogMessage.value = '';
}

async function confirmDeleteMessage() {
  try {
    await axios.post(`/api/chat/delete-message/${pendingDeleteId.value}`);
    const idx = props.messages.findIndex(m => m.id === pendingDeleteId.value || m.hMessageId === pendingDeleteId.value);
    if (idx !== -1) props.messages.splice(idx, 1);
    showSuccess('刪除成功！');
  } catch (e) {
    showError('刪除失敗，請稍後再試');
  }
  showDeleteDialog.value = false;
  pendingDeleteId.value = null;
}

function cancelDelete() {
  showDeleteDialog.value = false;
  pendingDeleteId.value = null;
}

// 檢舉訊息彈窗狀態
const showReportDialog = ref(false);
const pendingReport = ref({ messageId: null, reason: '' });

function requestReportMessage({ messageId, reason }) {
  pendingReport.value = { messageId, reason };
  showReportDialog.value = true;
}

async function confirmReportMessage() {
  try {
    await axios.post('/api/chat/report-message', { messageId: pendingReport.value.messageId, reason: pendingReport.value.reason });
    showSuccess('檢舉成功！');
  } catch (e) {
    showError('檢舉失敗，請稍後再試');
  }
  showReportDialog.value = false;
  pendingReport.value = { messageId: null, reason: '' };
}

function cancelReport() {
  showReportDialog.value = false;
  pendingReport.value = { messageId: null, reason: '' };
}

onMounted(async () => {
  await nextTick();
  if (chatContainer.value && props.messages.length > 0) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    hasScrolled = true;
  }
});

watch(
  () => props.messages,
  async (newVal, oldVal) => {
    if (!hasScrolled && chatContainer.value && newVal.length > 0) {
      await nextTick();
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
      hasScrolled = true;
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.chat-window {
  overflow-y: auto;
  padding: 1.2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  background: #fafafa;
}
.custom-modal {
  position: fixed;
  left: 0; top: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.25);
  display: flex; align-items: center; justify-content: center;
  z-index: 9999;
}
.modal-content {
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem 2rem;
  min-width: 260px;
  max-width: 360px;
  width: 100%;
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
}
.modal-title {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 1rem;
}
.modal-body {
  margin-bottom: 1.2rem;
}
.modal-actions {
  text-align: right;
}
.modal-confirm {
  background: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 18px;
  margin-right: 0.5rem;
  cursor: pointer;
}
.modal-cancel {
  background: #f0f0f0;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 6px 18px;
  cursor: pointer;
}
.modal-confirm:hover { background: #d9363e; }
.modal-cancel:hover { background: #bbb; }
</style>