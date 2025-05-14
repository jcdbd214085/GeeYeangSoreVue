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
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import * as signalR from '@microsoft/signalr';
import ContactsList from '@/components/chat/ContactsList.vue';
import ChatWindow from '@/components/chat/ChatWindow.vue';
import ChatInput from '@/components/chat/ChatInput.vue';
import defaultAvatar from '@/assets/images/avatar/default.png';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const SIGNALR_URL = `${import.meta.env.VITE_API_BASE_URL}/hub`;


const user = ref({ id: null, name: '我' });
const contacts = ref([]);
const activeContactId = ref(null);
const messages = ref([]);

// SignalR 連線物件
let connection = null;

// 建立 SignalR 連線
async function setupSignalR() {
    connection = new signalR.HubConnectionBuilder()
        .withUrl(SIGNALR_URL, { withCredentials: true })
        .withAutomaticReconnect()
        .build();

    // 接收訊息
    connection.on('ReceiveMessage', (msg) => {
        // 僅顯示與目前聊天對象的訊息
        if ((msg.from == user.value.id && msg.to == activeContactId.value) ||
            (msg.from == activeContactId.value && msg.to == user.value.id)) {
            messages.value.push({
                id: msg.id,
                from: msg.from,
                to: msg.to,
                text: msg.text,
                senderRole: msg.senderRole,
                receiverRole: msg.receiverRole,
                messageType: msg.messageType,
                isRead: msg.isRead,
                source: msg.source,
                time: msg.time
            });
        }
    });
    // 接收錯誤
    connection.on('ReceiveError', (errMsg) => {
        alert(errMsg);
    });

    try {
        await connection.start();
        // console.log('SignalR Connected!');
    } catch (err) {
        alert('SignalR 連線失敗');
    }
}

// 取得聊天室列表
async function fetchChatList() {
    try {
        const res = await axios.get(`${API_BASE_URL}/api/Chat/chatlist`, { withCredentials: true });
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
        const res = await axios.get(`${API_BASE_URL}/api/Chat/history/${otherId}`, { withCredentials: true });
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
    if (!connection || connection.state !== 'Connected') {
        alert('SignalR 尚未連線');
        return;
    }
    // 呼叫 SignalR Hub 發送訊息（角色由後端自動判斷）
    connection.invoke('SendMessage', String(user.value.id), String(activeContactId.value), text)
        .then(() => {
            console.log('訊息送出成功');
        })
        .catch(err => {
            console.error(' 送出失敗：', err);
        });
}

function formatTime(time) {
    // 支援字串或 Date 物件，統一顯示 24 小時制
    const date = new Date(time);
    return date.toLocaleTimeString('zh-TW', { hour12: false, hour: '2-digit', minute: '2-digit' });
}

onMounted(() => {
    fetchChatList();
    setupSignalR();
});
onUnmounted(() => {
    if (connection) connection.stop();
});
</script>
<style scoped>
.chat-view {
    display: flex;
    height: 100vh; /* 讓 chatview 滿版 */
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
    min-height: 0;
}

.chat-main > .chat-window {
    flex: 1 1 auto;
    overflow-y: auto;
    min-height: 0;
}

.chat-main > .chat-input {
    flex-shrink: 0;
    border-top: 1px solid #eee;
    background: #fff;
}

.bubble {
    max-width: 60%;
    margin: 8px 0;
    padding: 12px 16px;
    border-radius: 16px;
    clear: both;
    word-break: break-all;
}
.bubble.right {
    background: #2ee0d5;
    color: #fff;
    float: right;
    text-align: right;
}
.bubble.left {
    background: #f5f6fa;
    color: #222;
    float: left;
    text-align: left;
}
.time {
    font-size: 12px;
    color: #888;
    margin-top: 4px;
}
</style>