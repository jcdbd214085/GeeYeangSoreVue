import '@/assets/css/constant.css';
import { createPinia } from 'pinia';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useUserStore } from '@/stores/user';

// Toast 配置選項
const toastOptions = {
    position: "top-right",
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false
};

// v-intersect 指令
const intersect = {
    mounted(el, binding) {
        const animationClass = binding.value || 'fadeInLeft'; // 預設為 fadeInLeft

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
}

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(Toast, toastOptions)
app.directive('intersect', intersect)

// 確保 pinia 初始化後再呼叫 useUserStore
const userStore = useUserStore();

// 初始化登入狀態
userStore.initFromLocalStorage();

(async () => {
    try {
        const res = await fetch('/api/Auth/me', { credentials: 'include' })
        const data = await res.json()
        if (data.success) {
            userStore.login(data.role, data.userName || data.user || '', data.isLandlord);
        } else {
            userStore.logout();
        }
    } catch (e) {
        console.error('驗證登入失敗', e);
        userStore.logout();
    }
})();

// ✅ 啟動時初始化使用者狀態
userStore.initFromLocalStorage();

app.mount('#app')
