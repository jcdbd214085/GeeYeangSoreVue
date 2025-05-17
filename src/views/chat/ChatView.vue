<template>
    <div class="chat-view">
      <!-- 左側聯絡人列表 -->
      <div class="chat-contacts">
        <ContactsList
          :contacts="contacts"
          :activeContactId="activeContactId"
          @select="selectContact"
        />
      </div>
  
      <!-- 右側聊天區域 -->
      <div class="chat-main">
        <ChatWindow :messages="messages" :user="user" />
        <ChatInput
          :receiver-id="activeContactId"
          :receiver-role="activeReceiverRole"
          :chat-id="activeChatId"
          @send="sendMessage"
        />
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
  const SIGNALR_URL = `${API_BASE_URL}/hub`;
  
  const user = ref({ id: null, name: '我' });
  const contacts = ref([]);
  const activeContactId = ref(null);
  const activeChatId = ref(null);
  const activeReceiverRole = ref('tenant');
  const messages = ref([]);
  let connection = null;
  
  async function setupSignalR() {
    connection = new signalR.HubConnectionBuilder()
      .withUrl(SIGNALR_URL, { withCredentials: true })
      .withAutomaticReconnect()
      .build();
  
    connection.on('ReceiveMessage', (msg) => {
      if (
        (msg.from == user.value.id && msg.to == activeContactId.value) ||
        (msg.from == activeContactId.value && msg.to == user.value.id)
      ) {
        messages.value.push({
          id: msg.id,
          from: msg.from,
          to: msg.to,
          type: msg.type || msg.messageType || 'text',
          content: msg.content,
          time: msg.time
        });
      }
    });
  
    connection.on('ReceiveError', (errMsg) => {
      alert(errMsg);
    });
  
    try {
      await connection.start();
    } catch (err) {
      alert('SignalR 連線失敗');
    }
  }
  
  async function fetchChatList() {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/chat/chatlist`, {
        withCredentials: true
      });
  
      if (res.data.success) {
        contacts.value = res.data.data.map((msg) => ({
          id: msg.hSenderId,
          name: msg.senderName || `聯絡人${msg.hSenderId}`,
          lastMsg: (msg.hMessageType === 'image' || msg.hMessageType === '圖片' || (msg.hContent && msg.hContent.startsWith('/images/chat/'))) ? '[圖片]' : (msg.hContent || ''),
          avatar: defaultAvatar,
          time: msg.hTimestamp
            ? new Date(msg.hTimestamp).toLocaleTimeString()
            : '',
          unread: msg.unread || 0
        }));
  
        if (res.data.selfId) {
          user.value.id = res.data.selfId;
        }
  
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
  
  async function fetchMessages(otherId) {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/chat/history/${otherId}`,
        { withCredentials: true }
      );
  
      if (res.data.success) {
        messages.value = res.data.data.map((msg) => ({
          id: msg.hMessageId,
          from: msg.hSenderId,
          to: msg.hReceiverId,
          type: msg.hMessageType || '文字',
          content: msg.hContent,
          time: msg.hTimestamp
            ? new Date(msg.hTimestamp).toLocaleTimeString()
            : ''
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
  
  function sendMessage(payload) {
    if (!connection || connection.state !== 'Connected') {
      alert('SignalR 尚未連線');
      return;
    }
    const { type, content } = payload;
    if (type !== 'text' && type !== '文字') return;
    connection
      .invoke(
        'SendMessage',
        String(user.value.id),
        String(activeContactId.value),
        content
      )
      .catch((err) => {
        console.error('送出失敗：', err);
      });
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
    height: 100vh;
    background: #f7f8fa;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    overflow: hidden;
  }
  
  .chat-contacts {
    width: 260px;
    background: #fff;
    border-right: 1px solid #eee;
    overflow-y: auto;
  }
  
  .chat-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #f7f8fa;
    min-height: 0;
  }
  </style>