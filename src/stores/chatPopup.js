import { defineStore } from 'pinia';

export const useChatPopupStore = defineStore('chatPopup', {
    state: () => ({
        isOpen: false,
        openChats: [
            { id: 2, name: 'Jane Doe', avatar: '/image/avatar1.png' },
            { id: 3, name: 'Janet Adebayo', avatar: '/image/avatar2.png' },
        ],
        activeChatId: 2,
        user: { id: 1, name: '我' },
        messagesMap: {
            2: [
                { id: 1, from: 2, to: 1, text: '組長，打算甚麼時候就要寫好vue(非api)', time: '12:55 am' },
                { id: 2, from: 1, to: 2, text: '甚麼時候寫api控制器?' },
                { id: 3, from: 2, to: 1, text: '還有甚麼時候串上api?', time: '12:56 am' },
            ],
            3: [
                { id: 1, from: 3, to: 1, text: '各位加油!', time: '13:00 pm' },
            ]
        }
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