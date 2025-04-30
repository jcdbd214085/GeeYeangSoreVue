<template>
  <div :class="['msg-bubble', isMe ? 'me' : 'other']">
    <div class="msg-text">{{ msg.text }}</div>
    <div class="msg-time">{{ msg.time }}</div>
  </div>
</template>
<script setup>
const props = defineProps({
  msg: { type: Object, required: true },
  isMe: { type: Boolean, default: false }
});
</script>
<style scoped>
.msg-bubble {
    max-width: 70%;
    border-radius: 1.25rem 1.25rem 1.25rem 0.25rem;
    padding: 0.9rem 1.2rem;
    font-size: 1.05rem;
    margin-bottom: 0.2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    word-break: break-word;
    position: relative;
    background: #fff;
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
}

.msg-time {
    font-size: 0.85rem;
    color: #888;
    text-align: right;
}
</style> 