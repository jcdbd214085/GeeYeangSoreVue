import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        isLogin: false,
        role: '', // '', 'tenant', 'landlord', 'both'
        username: ''
    }),
    actions: {
        login(role = 'tenant', username = '') {
            this.isLogin = true;
            this.role = role;
            this.username = username;
        },
        logout() {
            this.isLogin = false;
            this.role = '';
            this.username = '';
        },
        setRole(role) {
            this.role = role;
        }
    }
}); 