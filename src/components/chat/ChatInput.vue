<template>
  <div>
    <!-- 展開按鈕 -->
    <button class="quick-reply-toggle" @click="showQuickReply = !showQuickReply">
       快速回覆
    </button>
    <!-- 預設回復區塊 -->
    <div v-if="showQuickReply && presetReplies.length" class="preset-replies">
      <div v-if="isLandlord" class="role-switch">
        <button :class="{active: replyRole==='tenant'}" @click="replyRole='tenant'">房客預設</button>
        <button :class="{active: replyRole==='landlord'}" @click="replyRole='landlord'">房東預設</button>
      </div>
      <div class="replies-list">
        <button v-for="r in presetReplies" :key="r" @click="setReply(r)">{{ r }}</button>
      </div>
    </div>
    <form class="chat-input" @submit.prevent="sendText">
      <!-- 圖片上傳（隱藏 input） -->
      <input
        type="file"
        accept="image/*"
        ref="fileInput"
        @change="handleFileChange"
        style="display: none"
      />
  
      <!-- + 按鈕：觸發圖片上傳 -->
      <Button iconOnly class="input-btn plus-btn" @click="triggerFileInput">
        <i class="fas fa-plus"></i>
      </Button>
  
      <!-- 訊息輸入框 -->
      <input
        v-model="text"
        ref="inputRef"
        type="text"
        placeholder="請輸入訊息，按下Enter傳送"
      />
  
      <!-- emoji 按鈕 -->
      <div class="emoji-btn-wrap">
        <V3Emoji @clickEmoji="insertEmoji" />
      </div>
  
      <!-- 傳送按鈕 -->
      <button
        v-if="props.showSend"
        type="submit"
        class="send-btn"
      >傳送</button>
    </form>
  </div>
</template>
  
<script setup>
import { ref, nextTick, computed, watch } from 'vue';
import Button from '@/components/buttons/button.vue';
import V3Emoji from 'vue3-emoji';
import 'vue3-emoji/dist/style.css';
import axios from 'axios';
  
const text = ref('');
const inputRef = ref(null);
const showPicker = ref(false);
const fileInput = ref(null);
  
const props = defineProps({
  showSend: { type: Boolean, default: true },
  showEmoji: { type: Boolean, default: true },
  receiverId: Number,
  receiverRole: String,
  chatId: Number,
  isLandlord: { type: Boolean, default: false },
  quickReplyDefaultOpen: { type: Boolean, default: true }
});
  
const emit = defineEmits(['send']);
  
const replyRole = ref('tenant'); // 'tenant' or 'landlord'
  
const tenantReplies = [
  '請問最近有空可以看房嗎？',
  '想詢問這間房目前還有嗎？',
  '請問租金是多少？有包含其他費用嗎？'
];
const landlordReplies = [
  '這週我有空，可安排看房，有需要請告知時間。',
  '這間房還在，有興趣可以了解看看。',
  '租金資訊都在頁面上，有問題歡迎詢問喔！'
];
  
const presetReplies = computed(() => {
  if (props.isLandlord) {
    return replyRole.value === 'tenant' ? tenantReplies : landlordReplies;
  }
  return tenantReplies;
});
  
const showQuickReply = ref(props.quickReplyDefaultOpen);
watch(() => props.quickReplyDefaultOpen, (val) => { showQuickReply.value = val; });
  
function setReply(reply) {
  text.value = reply;
  nextTick(() => {
    inputRef.value && inputRef.value.focus();
  });
}
  
function togglePicker() {
  showPicker.value = !showPicker.value;
}
  
function insertEmoji(emoji) {
  const el = inputRef.value;
  if (el) {
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const value = el.value;
    text.value = value.slice(0, start) + emoji + value.slice(end);
    nextTick(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = start + emoji.length;
    });
  } else {
    text.value += emoji;
  }
  showPicker.value = false;
}
  
function sendText() {
  if (text.value.trim()) {
    emit('send', { type: 'text', content: text.value });
    text.value = '';
  }
}
  
function triggerFileInput() {
  fileInput.value?.click();
}
  
async function handleFileChange(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const maxSize = 10 * 1024 * 1024;
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  
  if (!allowedTypes.includes(file.type)) {
    alert('不支援的圖片格式');
    return;
  }
  
  if (file.size > maxSize) {
    alert('圖片大小請勿超過 10MB');
    return;
  }
  
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('receiverId', props.receiverId);
    formData.append('receiverRole', props.receiverRole);
    if (props.chatId) formData.append('chatId', props.chatId);
  
    const res = await axios.post('/api/chat/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true
    });
  
    if (res.data.success && res.data.imageUrl) {
      emit('send', { type: 'image', content: res.data.imageUrl });
    } else {
      alert('上傳失敗');
    }
  } catch (err) {
    alert('上傳圖片發生錯誤');
    console.error(err);
  } finally {
    fileInput.value.value = ''; // 清空 input
  }
}
</script>
  
<style scoped>
.chat-input {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background: #fff;
  border-top: 1px solid #eee;
  gap: 0.5rem;
}
  
.chat-input input {
  flex: 1;
  border: none;
  border-radius: 1.25rem;
  padding: 0.8rem 1.2rem;
  font-size: 1.05rem;
  background: #fff;
  outline: none;
}
  
.input-btn {
  background: #3CDDD2;
  color: #444;
  border: none;
  border-radius: 0.8rem;
  width: 2.2rem;
  height: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  margin: 0 0.2rem;
  transition: background 0.2s;
  box-sizing: content-box;
}
  
.input-btn:hover {
  background: #24B4A8;
}
  
.plus-btn {
  margin-left: 0.2rem;
}
  
.emoji-btn-wrap {
  display: flex;
  align-items: center;
  margin: 0 0.5rem;
}
  
.send-btn {
  background:#3CDDD2;
  color: #222;
  border: none;
  border-radius: 0.8rem;
  padding: 0.5rem 1.1rem;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4em;
  cursor: pointer;
  transition: background 0.2s;
  writing-mode: horizontal-tb;
}
  
.send-btn:hover {
  background:  #24B4A8;
}

.preset-replies {
  margin-bottom: 0.5rem;
  margin-left: 15px;
}
.role-switch {
  margin-bottom: 0.3rem;
}
.role-switch button {
  margin-right: 0.5rem;
  padding: 0.3rem 1.2rem;
  border-radius: 8px;
  border: 1px solid #3cddd2;
  background: #fff;
  color: #3cddd2;
  font-weight: 600;
  cursor: pointer;
}
.role-switch button.active {
  background: #3cddd2;
  color: #fff;
}
.replies-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.replies-list button {
  background: #f4f5f7;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0.3rem 0.8rem;
  font-size: 0.98rem;
  color: #333;
  cursor: pointer;
  transition: background 0.2s;
}
.replies-list button:hover {
  background: #e0f7fa;
}

.quick-reply-toggle {
  margin-left: 15px;
  margin-bottom: 0.3rem;
  background: #e0f7fa;
  border: none;
  border-radius: 8px;
  padding: 0.3rem 1.2rem;
  color: #32a49c;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
}
.quick-reply-toggle:hover {
  background: #b2ebf2;
}
</style>
  