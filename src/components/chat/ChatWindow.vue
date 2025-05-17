<template>
  <!-- 聊天訊息視窗 -->
  <div class="chat-window" ref="chatContainer">
    <MessageBubble
      v-for="(msg, index) in messages"
      :key="msg.id ?? index"
      :message="msg"
      :isMe="String(msg.from) === String(user.id)"
    />
    <!-- 滾動錨點（用於 auto scroll） -->
    <div ref="scrollAnchor" style="height: 1px;"></div>
  </div>
</template>

<script setup>
import { onUpdated, ref, watch, nextTick } from 'vue';
import MessageBubble from './MessageBubble.vue';

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

const scrollAnchor = ref(null);
const chatContainer = ref(null);

// 自動滾到底（每次訊息更新）
watch(
  () => props.messages.length,
  async () => {
    await nextTick();
    scrollAnchor.value?.scrollIntoView({ behavior: 'smooth' });
  }
);
</script>

<style scoped>
.chat-window {
  flex: 1;
  overflow-y: auto;
  padding: 1.2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  background: #fafafa;
}
</style>