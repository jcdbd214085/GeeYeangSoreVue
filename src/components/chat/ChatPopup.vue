<template>
    <div v-if="isOpen" class="chat-popup">
      <div v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>
      <div class="chat-popup-header">
        <div class="chat-tabs">
          <div
            v-for="c in contacts"
            :key="c.id"
            :class="['chat-tab', { active: c.id === activeContactId }]"
            @click="switchChat(c.id)"
          >
            <Avatar :src="c.avatar || defaultAvatar" :alt="c.name" :size="32" />
          </div>
        </div>
        <button class="close-btn" @click="closePopup">✖</button>
      </div>
      <div class="chat-popup-body" ref="chatBodyRef">
        <ChatWindow
          v-if="user.id !== null"
          :messages="messages"
          :user="user"
        />
      </div>
      <ChatInput
        v-if="user.id && activeContactId"
        :receiver-id="activeContactId"
        :receiver-role="'tenant'"
        :chat-id="null"
        @send="sendMessage"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
  import axios from 'axios';
  import * as signalR from '@microsoft/signalr';
  import { useChatPopupStore } from '@/stores/chatPopup';
  import { useUserStore } from '@/stores/user';
  import { storeToRefs } from 'pinia';
  import ChatWindow from './ChatWindow.vue';
  import ChatInput from './ChatInput.vue';
  import Avatar from '@/components/Avatar.vue';
  import defaultAvatar from '@/assets/images/avatar/default.png';
  
  const chatStore = useChatPopupStore();
  const userStore = useUserStore();
  const { isOpen } = storeToRefs(chatStore);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
  const SIGNALR_URL = `${API_BASE_URL}/hub`;
  
  const contacts = ref([]);
  const activeContactId = ref(null);
  const messages = ref([]);
  const errorMsg = ref('');
  const user = ref({ id: null, name: userStore.username || '我' });
  const chatBodyRef = ref(null);
  let connection = null;
  
  async function setupSignalR() {
    connection = new signalR.HubConnectionBuilder()
      .withUrl(SIGNALR_URL, { withCredentials: true })
      .withAutomaticReconnect()
      .build();
  
    connection.on('ReceiveMessage', (msg) => {
      if ((msg.from == user.value.id && msg.to == activeContactId.value) ||
          (msg.from == activeContactId.value && msg.to == user.value.id)) {
        messages.value.push({
          id: msg.id,
          from: msg.from,
          to: msg.to,
          type: msg.messageType || 'text',
          content: msg.text || msg.content,
          time: msg.time
        });
      }
    });
  
    connection.on('ReceiveError', (errMsg) => {
      errorMsg.value = errMsg;
    });
  
    try {
      await connection.start();
    } catch (err) {
      errorMsg.value = 'SignalR 連線失敗';
    }
  }
  
  async function fetchChatList() {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/chat/chatlist`, { withCredentials: true });
      if (res.data.success) {
        contacts.value = res.data.data.map(msg => ({
          id: msg.hSenderId,
          name: msg.senderName || `聯絡人${msg.hSenderId}`,
          lastMsg: msg.hContent || '',
          avatar: defaultAvatar,
          time: msg.hTimestamp ? new Date(msg.hTimestamp).toLocaleTimeString() : '',
        }));
        user.value.id = res.data.selfId;
        user.value.name = userStore.username || '我';
        if (contacts.value.length > 0) {
          activeContactId.value = contacts.value[0].id;
          fetchMessages(activeContactId.value);
        }
      } else {
        errorMsg.value = res.data.message || '取得聊天室列表失敗';
      }
    } catch (e) {
      errorMsg.value = 'API 連線失敗';
      contacts.value = [];
      messages.value = [];
    }
  }
  
  async function fetchMessages(otherId) {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/chat/history/${otherId}`, { withCredentials: true });
      if (res.data.success) {
        messages.value = res.data.data.map(msg => ({
          id: msg.hMessageId,
          from: msg.hSenderId,
          to: msg.hReceiverId,
          type: msg.hMessageType || 'text',
          content: msg.hContent,
          time: msg.hTimestamp ? new Date(msg.hTimestamp).toLocaleTimeString() : ''
        }));
        await nextTick();
        scrollToBottom();
      } else {
        errorMsg.value = res.data.message || '取得聊天紀錄失敗';
        messages.value = [];
      }
    } catch (e) {
      errorMsg.value = 'API 連線失敗';
      messages.value = [];
    }
  }
  
  function switchChat(id) {
    activeContactId.value = id;
    fetchMessages(id);
    scrollToBottom();
  }
  
  function sendMessage(payload) {
    if (!connection || connection.state !== 'Connected') {
      errorMsg.value = 'SignalR 尚未連線';
      return;
    }
    const { type, content } = payload;
    connection.invoke('SendMessage', String(user.value.id), String(activeContactId.value), content)
      .catch(err => {
        errorMsg.value = '送出失敗';
      });
  }
  
  function closePopup() {
    chatStore.close();
  }
  
  function scrollToBottom() {
    nextTick(() => {
      if (chatBodyRef.value) {
        chatBodyRef.value.scrollTop = chatBodyRef.value.scrollHeight;
      }
    });
  }
  
  onMounted(async () => {
    if (!userStore.isLogin) {
      errorMsg.value = '請先登入';
      return;
    }
    try {
      const res = await axios.get(`${API_BASE_URL}/api/chat/chatlist`, { withCredentials: true });
      if (res.data.success && res.data.selfId) {
        user.value.id = res.data.selfId;
      } else {
        const authRes = await axios.get('/api/auth/me', { withCredentials: true });
        if (authRes.data && authRes.data.id) {
          user.value.id = authRes.data.id;
        }
      }
    } catch (e) {
      errorMsg.value = '無法取得登入者資訊';
      return;
    }
    user.value.name = userStore.username || '我';
    fetchChatList();
    setupSignalR();
    scrollToBottom();
  });
  
  onUnmounted(() => {
    if (connection) connection.stop();
  });
  
  watch(messages, () => {
    scrollToBottom();
  }, { deep: true, immediate: true });
  </script>
  
  <style scoped>
  .chat-popup {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 350px;
    max-width: 95vw;
    height: 500px;
    background: #fff;
    border-radius: 1.2rem;
    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.18);
    display: flex;
    flex-direction: column;
    z-index: 2000;
    overflow: hidden;
  }
  
  .chat-popup-header {
    display: flex;
    align-items: center;
    padding: 0.7rem 1rem;
    background: #f7f8fa;
    border-bottom: 1px solid #eee;
  }
  
  .chat-tabs {
    display: flex;
    gap: 0.5rem;
    flex: 1;
  }
  
  .chat-tab {
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid transparent;
    cursor: pointer;
    transition: border 0.2s;
  }
  
  .chat-tab.active {
    border: 2px solid #3cddd2;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #888;
    cursor: pointer;
    margin-left: 0.5rem;
  }
  
  .chat-popup-body {
    flex: 1;
    overflow-y: auto;
    background: #f7f8fa;
  }
  </style>
  