<template>
    <!-- 聊天視窗元件 -->
    <div class="chat-window">
        <MessageBubble
        v-for="msg in messages"
            :key="msg.id"
            :message="msg"
            :isMe="msg.from === user.id"
        />
    </div>
  </template>
<script setup>
import MessageBubble from './MessageBubble.vue'
import { defineProps } from 'vue';

const props = defineProps({
  messages: Array,
  user: {
    type: Object,
    default: () => ({ id: null, name: '' })
    
  }
});
</script>
<style scoped>
.chat-window {
    flex: 1;
    overflow-y: auto;
    padding: 1.2rem 1.5rem 1.2rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
}
</style>