import '@/assets/css/constant.css';
import { createPinia } from 'pinia';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// v-intersect 指令
const intersect = {
    mounted(el) {
        el.style.opacity = '0';
        const observer = new window.IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    el.classList.add('animate__animated', 'animate__fadeInLeft');
                    el.style.opacity = '1';
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.15 });
        observer.observe(el);
    }
};

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.directive('intersect', intersect)
app.mount('#app')
