import '@/assets/css/constant.css';
import { createPinia } from 'pinia';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { useUserStore } from '@/stores/user';
import { useChatPopupStore } from '@/stores/chatPopup';

// v-intersect 指令
const intersect = {
    mounted(el, binding) {
        const animationClass = binding.value || 'fadeInLeft';
        el.style.opacity = '0';
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    el.classList.add('animate__animated', `animate__${animationClass}`);
                    el.style.opacity = '1';
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.15 });
        observer.observe(el);
    }
};

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.directive('intersect', intersect);

// 初始化 Pinia store
const userStore = useUserStore();
const chatPopupStore = useChatPopupStore();

// 初始化登入狀態與聊天使用者
userStore.initFromLocalStorage();

(async () => {
    try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        const data = await res.json();
        console.log('[登入初始化] /api/auth/me 回傳資料：', data);

        if (data.success) {
            userStore.login(data.role, data.userName || data.user || '', data.isLandlord);

            // 設定 chatPopupStore.user 
            chatPopupStore.user = {
                id: data.tenantId,
                name: data.userName || data.user || ''
            };
        } else {
            userStore.logout();
            chatPopupStore.$reset(); // 登入失敗時清空聊天狀態
        }
    } catch (e) {
        console.error('驗證登入失敗', e);
        userStore.logout();
        chatPopupStore.$reset();
    }
})();

app.mount('#app');