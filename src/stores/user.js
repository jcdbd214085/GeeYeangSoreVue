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
            this.logout(); // 防止重複登入
            this.isLogin = true;
            this.role = role;
            this.username = username;
            this.isLandlord = isLandlord;

            localStorage.setItem('userRole', role);
            localStorage.setItem('isLogin', 'true');
            localStorage.setItem('isLandlord', isLandlord.toString());
            localStorage.setItem('username', username);
        },
        logout() {
            this.isLogin = false;
            this.role = '';
            this.username = '';
            this.isLandlord = false;

            localStorage.removeItem('userRole');
            localStorage.removeItem('isLogin');
            localStorage.removeItem('isLandlord');
            localStorage.removeItem('username');
        },
        setRole(role) {
            this.role = role;
            localStorage.setItem('userRole', role);
        },
        initFromLocalStorage() {
            const savedRole = localStorage.getItem('userRole');
            const savedLogin = localStorage.getItem('isLogin') === 'true';
            const savedIsLandlord = localStorage.getItem('isLandlord') === 'true';
            const savedUsername = localStorage.getItem('username');

            if (savedRole) this.role = savedRole;
            this.isLogin = savedLogin;
            this.isLandlord = savedIsLandlord;
            if (savedUsername) this.username = savedUsername;
        },
        async checkAuth() {
            try {
                const res = await fetch('/api/Auth/me', { credentials: 'include' });
                const data = await res.json();

                if (data.success) {
                    this.login(data.role, data.userName, data.isLandlord);
                    return true;
                } else {
                    this.logout();
                    return false;
                }
            } catch (error) {
                console.error('驗證失敗:', error);
                this.logout();
                return false;
            }
        }
    }
}); 