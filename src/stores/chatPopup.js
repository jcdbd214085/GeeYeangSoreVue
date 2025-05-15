import { defineStore } from 'pinia';

export const useChatPopupStore = defineStore('chatPopup', {
    state: () => ({
        isOpen: false,
        user: { id: null, name: '' }, // 加回 user
        messagesMap: {}, // 你的訊息會存在這裡
        activeChatId: null
    }),
    getters: {
        activeMessages(state) {
            return state.messagesMap[state.activeChatId] || [];
        }
    },
    actions: {
        open() { this.isOpen = true; },
        close() { this.isOpen = false; },
        switchChat(id) { this.activeChatId = id; },
        sendMessage(text) {
            const msg = {
                id: Date.now(),
                from: this.user.id,
                to: this.activeChatId,
                text,
                time: new Date().toLocaleTimeString()
            };
            if (!this.messagesMap[this.activeChatId]) this.messagesMap[this.activeChatId] = [];
            this.messagesMap[this.activeChatId].push(msg);
        }
    }
});