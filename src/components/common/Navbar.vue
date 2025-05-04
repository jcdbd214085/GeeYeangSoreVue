<template>
  <!-- 導航列元件 -->
  <nav class="navbar navbar-expand-lg fixed-top" id="mainNav" :class="{ 'navbar-scrolled': isScrolled }"
    style="z-index:1030;">
    <div class="container">
      <a class="navbar-brand" href="#">
        <img src="/image/logo2.png" alt="租屋平台" class="nav-logo" style="height:48px;width:48px;" />
      </a>
      <span class="navbar-brand">居研所</span>
      <button class="navbar-toggler" type="button" @click="toggleMenu">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" :class="{ show: menuOpen }" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item"><a class="nav-link active" href="#" @click="closeMenu">首頁</a></li>
          <li class="nav-item"><a class="nav-link" href="#" @click="closeMenu">搜尋房源</a></li>
          <li class="nav-item"><a class="nav-link" href="#" @click="closeMenu">我要出租</a></li>
          <li class="nav-item"><a class="nav-link" href="#" @click="closeMenu">聯絡我們</a></li>
          <li v-if="userStore.isLogin && userStore.role === 'both'" class="nav-item">
            <a class="nav-link" href="#" @click="closeMenu">房源管理</a>
          </li>
        </ul>
        <ul class="navbar-nav">
          <template v-if="!userStore.isLogin">
            <li class="nav-item">
              <Button color="primary" class="me-2" @click="loginAsTenant">登入/註冊</Button>
            </li>
          </template>
          <template v-else>
            <li class="nav-item nav-icon-item">
              <a class="nav-link" href="#" @click="openChatPopup">
                <span class="icon-wrapper">
                  <i class="fa-solid fa-comments"></i>
                  <Badge isDot color="#ff9800" :size="10" :top="'-2px'" :right="'-6px'" />
                </span>
                聊天室
              </a>
            </li>
            <li class="nav-item nav-icon-item"><a class="nav-link" href="#" @click="closeMenu"><span class="icon-wrapper"><i class="fa-solid fa-heart"></i></span> 收藏</a></li>
            <li class="nav-item nav-icon-item"><a class="nav-link" href="#" @click="closeMenu"><span class="icon-wrapper"><i class="fa-solid fa-bell"></i></span> 通知</a></li>
            <li class="nav-item nav-icon-item"><a class="nav-link" href="#" @click="closeMenu"><span class="icon-wrapper"><Avatar :src="userStore.avatar" alt="個人頭像" :size="32" /></span> 個人頁面</a></li>
            <li class="nav-item">
              <Button color="outline-secondary" class="ms-2" @click="logout">登出</Button>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useChatPopupStore } from '@/stores/chatPopup';
import Button from '@/components/buttons/button.vue';
import Avatar from '@/components/Avatar.vue';
import Badge from '@/components/Badge.vue';
const userStore = useUserStore();
const chatPopup = useChatPopupStore();
const isScrolled = ref(false);
const menuOpen = ref(false);

function handleScroll() {
  isScrolled.value = window.scrollY > 100;
}
function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}
function closeMenu() {
  if (window.innerWidth < 992) menuOpen.value = false;
}
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
function loginAsTenant() {
  userStore.login('tenant', '房客A');
}
function loginAsBoth() {
  userStore.login('tenant', '房東房客A');
}
function logout() {
  userStore.logout();
}
function openChatPopup(e) {
  e.preventDefault();
  chatPopup.open();
}
</script>
<style scoped>
#mainNav {
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 100%);
    transition: all 0.4s ease;
    padding: 1.2rem 0;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1030;
}

#mainNav.navbar-scrolled {
    background: rgba(255, 255, 255, 0.98);
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
    padding: 0.8rem 0;
}

.nav-logo {
    height: 60px;
    width: 60px;
    padding: 0;
    border-radius: 50%;
    border: 3px solid var(--main-color);
    background: none;
    box-shadow: none;
    aspect-ratio: 1;
    object-fit: contain;
    transition: all 0.4s ease;
}

.nav-logo:hover {
    transform: translateY(-2px);
    box-shadow:
        0 6px 20px rgba(60, 221, 210, 0.3),
        0 0 0 3px rgba(60, 221, 210, 0.2);
}

#mainNav.navbar-scrolled .nav-logo {
    height: 50px;
    width: 50px;
    border: 3px solid var(--main-color);
    background: none;
    box-shadow: none;
}

.navbar-nav {
    gap: 0.5rem;
}

.navbar-nav .nav-link {
    color: var(--text-main);
    font-weight: 500;
    padding: 0.6rem 1.2rem;
    transition: all 0.3s ease;
    position: relative;
    text-transform: uppercase;
    font-size: 18px;
    letter-spacing: 1px;
}

.navbar-nav .nav-link:hover {
    color: var(--main-color);
}

.navbar-nav .nav-link.active {
    color: var(--main-color);
}

.navbar-nav .nav-link i {
    margin-right: 6px;
    font-size: 1.1em;
    transition: all 0.3s ease;
}

.navbar-toggler {
    border: none;
    padding: 0.5rem;
    transition: all 0.3s ease;
}

.navbar-toggler:focus {
    box-shadow: none;
    outline: none;
}

.navbar-toggler-icon {
    background-image: none;
    position: relative;
    width: 24px;
    height: 2px;
    background-color: var(--text-main);
    transition: all 0.3s ease;
}

.navbar-toggler-icon::before,
.navbar-toggler-icon::after {
    content: '';
    position: absolute;
    width: 24px;
    height: 2px;
    background-color: var(--text-main);
    transition: all 0.3s ease;
}

.navbar-toggler-icon::before {
    top: -8px;
}

.navbar-toggler-icon::after {
    bottom: -8px;
}

.navbar-toggler[aria-expanded="true"] .navbar-toggler-icon {
    background-color: transparent;
}

.navbar-toggler[aria-expanded="true"] .navbar-toggler-icon::before {
    transform: rotate(45deg);
    top: 0;
}

.navbar-toggler[aria-expanded="true"] .navbar-toggler-icon::after {
    transform: rotate(-45deg);
    bottom: 0;
}

@media (max-width: 991.98px) {
    .navbar-collapse {
        background-color: rgba(255, 255, 255, 0.98);
        padding: 1rem;
        border-radius: 8px;
        margin-top: 1rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    .navbar-nav .nav-link {
        padding: 0.8rem 1.2rem;
    }
}

@media (max-width: 767.98px) {
    #mainNav {
        padding: 0.8rem 0;
        background: rgba(255, 255, 255, 0.98);
    }
    .nav-logo {
        height: 40px;
        width: 40px;
        padding: 0;
    }
    #mainNav.navbar-scrolled .nav-logo {
        height: 32px;
        width: 32px;
        padding: 0;
    }
    .navbar-nav .nav-link {
        color: var(--text-main);
    }
}

.nav-icon-item {
  display: flex;
  align-items: center;
  height: 48px;
}
.nav-icon-item .nav-link {
  display: flex;
  align-items: center;
  padding: 0.6rem 1.2rem;
}
.icon-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  margin-right: 6px;
  vertical-align: middle;
}
</style>
