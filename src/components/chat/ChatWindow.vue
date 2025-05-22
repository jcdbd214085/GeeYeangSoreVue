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
import { onMounted, ref, nextTick, watch } from 'vue';
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

const chatContainer = ref(null);
let hasScrolled = false;

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
</style>