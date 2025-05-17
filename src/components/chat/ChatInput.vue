<template>
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
  
      <!-- Emoji 按鈕 -->
      <Button
        v-if="props.showEmoji"
        iconOnly
        class="input-btn emoji-btn"
        @click="togglePicker"
      >
        <i class="far fa-smile"></i>
      </Button>
  
      <!-- Emoji 選擇器 -->
      <div v-if="showPicker" class="emoji-picker">
        <Picker :data="data" :preview="false" @select="insertEmoji" />
      </div>
  
      <!-- 傳送按鈕 -->
      <button
        v-if="props.showSend"
        type="submit"
        class="send-btn"
      >
        傳送 <i class="fas fa-paper-plane"></i>
      </button>
    </form>
  </template>
  
  <script setup>
  import { ref, nextTick } from 'vue';
  import Button from '@/components/buttons/button.vue';
  import data from '@emoji-mart/data';
  import { Picker } from 'emoji-mart-vue-fast';
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
    chatId: Number
  });
  
  const emit = defineEmits(['send']);
  
  function togglePicker() {
    showPicker.value = !showPicker.value;
  }
  
  function insertEmoji(emoji) {
    const el = inputRef.value;
    if (el) {
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const value = el.value;
      text.value = value.slice(0, start) + emoji.native + value.slice(end);
      nextTick(() => {
        el.focus();
        el.selectionStart = el.selectionEnd = start + emoji.native.length;
      });
    } else {
      text.value += emoji.native;
    }
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
    background: #fff5e6;
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
    background: #ffe0b2;
  }
  
  .plus-btn {
    margin-left: 0.2rem;
  }
  
  .emoji-btn {
    color: #3c6df0;
    background: #fff;
    margin-right: 1rem;
    margin-left: 0.2rem;
    padding: 0.2rem;
    width: 20px;
    height: 20px;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }
  
  .emoji-btn:hover {
    background: #e3eaff;
  }
  
  .send-btn {
    background: #fff5e6;
    color: #222;
    border: none;
    border-radius: 0.8rem;
    padding: 0.5rem 1.1rem;
    font-size: 1rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.4em;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .send-btn:hover {
    background: #ffe0b2;
  }
  
  .emoji-picker {
    position: absolute;
    bottom: 60px;
    right: 30px;
    z-index: 999;
  }
  </style>
  