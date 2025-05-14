import '@/assets/css/constant.css';
import { createPinia } from 'pinia';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useUserStore } from '@/stores/user';



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
app.directive('intersect', intersect)

// 確保 pinia 初始化後再呼叫 useUserStore
const userStore = useUserStore();
(async () => {
    try {
        const res = await fetch('/api/Auth/me', { credentials: 'include' })
        const data = await res.json()
        if (data.success) {
            userStore.login('tenant', data.userName || data.user || '')
        } else {
            userStore.logout()
        }
    } catch {
        userStore.logout()
    }
})();

// ✅ 啟動時初始化使用者狀態
userStore.initFromLocalStorage();

app.mount('#app')
