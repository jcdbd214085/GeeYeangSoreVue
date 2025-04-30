<template>
    <!-- 聊天彈窗元件 -->
    <div v-if="isOpen" class="chat-popup">
        <div class="chat-popup-header">
            <div class="chat-tabs">
                <div v-for="c in openChats" :key="c.id" :class="['chat-tab', { active: c.id === activeChatId }]"
                    @click="switchChat(c.id)">
                    <Avatar :src="c.avatar || avatar1" :alt="c.name" :size="32" />
                </div>
            </div>
            <button class="close-btn" @click="closePopup">✖</button>
        </div>
        <div class="chat-popup-body">
            <ChatWindow :messages="messages" :user="user" />
        </div>
        <ChatInput :showSend="false" @send="sendMessage" />
    </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import { useChatPopupStore } from '@/stores/chatPopup';
import ChatWindow from './ChatWindow.vue';
import ChatInput from './ChatInput.vue';
import avatar1 from '@/assets/images/avatar/avatar1.png';
import default1 from '@/assets/images/avatar/default.png';
import Avatar from '@/components/Avatar.vue';
const chatStore = useChatPopupStore();
const isOpen = computed(() => chatStore.isOpen);
const openChats = computed(() => chatStore.openChats);
const activeChatId = computed(() => chatStore.activeChatId);
const user = computed(() => chatStore.user);
const messages = computed(() => chatStore.activeMessages);

function closePopup() {
    chatStore.close();
}
function switchChat(id) {
    chatStore.switchChat(id);
}
function sendMessage(text) {
    chatStore.sendMessage(text);
}
// 動態取得頭像路徑，若找不到則回傳預設頭像
function getAvatarUrl(filename) {
    try {
        return new URL(`@/assets/images/avatar/${filename}`, import.meta.url).href;
    } catch (e) {
        return new URL('@/assets/images/avatar/default.png', import.meta.url).href;
    }
}
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

.avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
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