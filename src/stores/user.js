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
            localStorage.setItem('userRole', role);
            localStorage.setItem('isLogin', 'true');
        },
        logout() {
            this.isLogin = false;
            this.role = '';
            this.username = '';
            localStorage.removeItem('userRole');
            localStorage.removeItem('isLogin');
        },
        setRole(role) {
            this.role = role;
            localStorage.setItem('userRole', role);
        },
        initFromLocalStorage() {
            const savedRole = localStorage.getItem('userRole');
            const savedLogin = localStorage.getItem('isLogin') === 'true';
            if (savedRole) this.role = savedRole;
            this.isLogin = savedLogin;
        }
    }
}); 