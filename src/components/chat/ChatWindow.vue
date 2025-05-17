<template>
    <!-- 聊天視窗元件 -->
    <div class="chat-window">
        <MessageBubble
          v-for="msg in messages"
          :key="msg.id"
          :msg="msg"
          :isMe="String(msg.from) === String(user.id)"
        />
    </div>
</template>
<script setup>
import MessageBubble from './MessageBubble.vue'
const props = defineProps(['messages', 'user']);
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