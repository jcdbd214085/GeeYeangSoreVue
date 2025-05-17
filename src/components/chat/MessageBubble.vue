
<script setup>
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

function getImageUrl(rawUrl) {
  if (!rawUrl) return '/images/chat/placeholder.png'; // fallback 預設圖片
  if (rawUrl.startsWith('http')) return rawUrl; // 已是絕對網址
  return VITE_API_BASE_URL + rawUrl; // 拼完整網址
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
</style> 