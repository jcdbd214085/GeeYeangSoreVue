import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        isLogin: false,
        role: '', // '', 'tenant', 'landlord', 'both'
        username: '',
        isLandlord: false
    }),
    actions: {
        login(role = 'tenant', username = '', isLandlord = false) {
            this.isLogin = true;
            this.role = role;
            this.username = username;
            this.isLandlord = isLandlord;
            localStorage.setItem('userRole', role);
            localStorage.setItem('isLogin', 'true');
            localStorage.setItem('isLandlord', isLandlord.toString());
        },
        logout() {
            this.isLogin = false;
            this.role = '';
            this.username = '';
            this.isLandlord = false;
            localStorage.removeItem('userRole');
            localStorage.removeItem('isLogin');
            localStorage.removeItem('isLandlord');
        },
        setRole(role) {
            this.role = role;
            localStorage.setItem('userRole', role);
        },
        initFromLocalStorage() {
            const savedRole = localStorage.getItem('userRole');
            const savedLogin = localStorage.getItem('isLogin') === 'true';
            const savedIsLandlord = localStorage.getItem('isLandlord') === 'true';
            if (savedRole) this.role = savedRole;
            this.isLogin = savedLogin;
            this.isLandlord = savedIsLandlord;
        }
    }
}); 