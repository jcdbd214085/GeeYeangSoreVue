<template>
    <div class="chat-view">
        <div class="chat-contacts">
            <ContactsList :contacts="contacts" :activeContactId="activeContactId" @select="selectContact" />
        </div>
        <div class="chat-main">
            <ChatWindow :messages="messages" :user="user" />
            <ChatInput @send="sendMessage" />
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import ContactsList from '@/components/chat/ContactsList.vue';
import ChatWindow from '@/components/chat/ChatWindow.vue';
import ChatInput from '@/components/chat/ChatInput.vue';
import avatar1 from '@/assets/images/avatar/avatar1.png';
import default1 from '@/assets/images/avatar/default.png';

const user = ref({ id: 1, name: '我' });
const contacts = ref([
    { id: 2, name: '成員1', lastMsg: '有問題問組長', avatar: avatar1, unread: 2 },
    { id: 3, name: '成員2', lastMsg: '組長最棒了', avatar: avatar1, unread: 0 },
]);
const activeContactId = ref(2);
const messages = ref([
    { id: 1, from: 2, to: 1, text: '各位加油寫vue', time: '12:55 am' },
    { id: 2, from: 1, to: 2, text: '加油', time: '12:56 am' },
]);
function selectContact(id) {
    activeContactId.value = id;
    // 這裡可根據 id 載入對應訊息
}
function sendMessage(text) {
    messages.value.push({ id: Date.now(), from: user.value.id, to: activeContactId.value, text, time: new Date().toLocaleTimeString() });
}
</script>
<style scoped>
.chat-view {
    display: flex;
    height: 100%;
    background: #f7f8fa;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    overflow: hidden;
}

.chat-contacts {
    width: 260px;
    background: #fff;
    border-right: 1px solid #eee;
    padding: 0;
    overflow-y: auto;
}

.chat-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #f7f8fa;
}
</style>