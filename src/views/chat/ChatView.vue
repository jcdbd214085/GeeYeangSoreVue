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
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ContactsList from '@/components/chat/ContactsList.vue';
import ChatWindow from '@/components/chat/ChatWindow.vue';
import ChatInput from '@/components/chat/ChatInput.vue';
import defaultAvatar from '@/assets/images/avatar/default.png';

const user = ref({ id: null, name: '我' });
const contacts = ref([]);
const activeContactId = ref(null);
const messages = ref([]);

// 取得聊天室列表
async function fetchChatList() {
    try {
        const res = await axios.get('/api/Chat/chatlist', { withCredentials: true });
        if (res.data.success) {
            // 依據後端回傳SenderName顯示聯絡人名稱
            contacts.value = res.data.data.map(msg => ({
                id: msg.hSenderId, // 聯絡人ID
                name: msg.senderName || `聯絡人${msg.hSenderId}`,
                lastMsg: msg.hContent || '',
                avatar: defaultAvatar,
                time: msg.hTimestamp ? new Date(msg.hTimestamp).toLocaleTimeString() : '',
            }));
            // 取得自己 id
            if (res.data.data.length > 0 && res.data.data[0].hReceiverId) {
                user.value.id = res.data.data[0].hReceiverId;
            }
            // 預設選第一個聯絡人
            if (contacts.value.length > 0) {
                activeContactId.value = contacts.value[0].id;
                fetchMessages(activeContactId.value);
            }
        }
    } catch (e) {
        contacts.value = [];
        messages.value = [];
    }
}

// 取得與指定聯絡人的聊天紀錄
async function fetchMessages(otherId) {
    try {
        const res = await axios.get(`/api/Chat/history/${otherId}`, { withCredentials: true });
        if (res.data.success) {
            messages.value = res.data.data.map(msg => ({
                id: msg.hMessageId,
                from: msg.hSenderId,
                to: msg.hReceiverId,
                text: msg.hContent,
                time: msg.hTimestamp ? new Date(msg.hTimestamp).toLocaleTimeString() : ''
            }));
        } else {
            messages.value = [];
        }
    } catch (e) {
        messages.value = [];
    }
}

function selectContact(id) {
    activeContactId.value = id;
    fetchMessages(id);
}

function sendMessage(text) {
    // 這裡可加上呼叫發送訊息API
    messages.value.push({
        id: Date.now(),
        from: user.value.id,
        to: activeContactId.value,
        text,
        time: new Date().toLocaleTimeString()
    });
}

onMounted(() => {
    fetchChatList();
});
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