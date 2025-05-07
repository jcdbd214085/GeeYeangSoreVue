<template>
  <!-- 導航列元件 -->
  <nav
    class="navbar navbar-expand-lg fixed-top"
    id="mainNav"
    style="z-index:1030;"
  >
    <div class="container">
      <!-- 左側 Logo 與名稱 -->
      <a class="navbar-brand" href="#">
        <img
          src="/image/logo2.png"
          alt="租屋平台"
          class="nav-logo"
          style="height:48px;width:48px;"
        />
      </a>
      <span class="navbar-brand">居研所</span>

      <!-- 手機版展開按鈕 -->
      <button class="navbar-toggler" type="button" @click="toggleMenu">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- 導覽列選單 -->
      <div
        class="collapse navbar-collapse"
        :class="{ show: menuOpen }"
        id="navbarNav"
      >
        <!-- 左側主選單 -->
        <ul class="navbar-nav me-auto">
          <li class="nav-item"><a class="nav-link active" href="#" @click="closeMenu">首頁</a></li>
          <li class="nav-item"><a class="nav-link" href="#" @click="closeMenu">搜尋房源</a></li>
          <li class="nav-item"><a class="nav-link" href="#" @click="closeMenu">我要出租</a></li>
          <li class="nav-item"><a class="nav-link" href="#" @click="closeMenu">聯絡我們</a></li>
          <li class="nav-item dropdown" v-if="userStore.isLogin">
            <template v-if="userStore.role === 'landlord' || userStore.role === 'both'">
              <a class="nav-link dropdown-toggle" href="#" @click.prevent="isLandlordAccordionOpen = !isLandlordAccordionOpen">
                房東專區
              </a>
              <div class="accordion-menu" v-show="isLandlordAccordionOpen">
                <a class="dropdown-item" href="#" @click="closeMenu">物件管理</a>
                <a class="dropdown-item" href="#" @click="closeMenu">刊登管理</a>
                <a class="dropdown-item" href="#" @click="closeMenu">刊登成效追蹤</a>
              </div>
            </template>
            <template v-else>
              <a class="nav-link" href="#" @click="goToLandlordRegister">成為房東</a>
            </template>
          </li>
          <li v-if="userStore.isLogin && userStore.role === 'both'" class="nav-item">
            <a class="nav-link" href="#" @click="closeMenu">房源管理</a>
          </li>
        </ul>

        <!-- 右側登入區 -->
        <ul class="navbar-nav">
          <!-- 未登入 -->
          <template v-if="!userStore.isLogin">
            <li class="nav-item">
              <Button
                color="primary"
                class="me-2"
                @click="loginAsTenant"
              >登入/註冊</Button>
            </li>
          </template>

          <!-- 已登入 -->
          <template v-else>
            <li class="nav-item nav-icon-item">
              <a class="nav-link" href="#" @click="openChatPopup">
                <span class="icon-wrapper">
                  <i class="fa-solid fa-comments"></i>
                  <Badge
                    isDot
                    color="#ff9800"
                    :size="10"
                    :top="'-2px'"
                    :right="'-6px'"
                  />
                </span>
                聊天室
              </a>
            </li>

            <li class="nav-item nav-icon-item">
              <a class="nav-link" href="#" @click="closeMenu">
                <span class="icon-wrapper">
                  <i class="fa-solid fa-heart"></i>
                </span>
                收藏
              </a>
            </li>
            
            <li class="nav-item nav-icon-item">
              <a class="nav-link" href="#" @click="closeMenu">
                <span class="icon-wrapper">
                  <i class="fa-solid fa-bell"></i>
                </span>
                通知
              </a>
            </li>

            <!-- 個人頁面 -->
            <li class="nav-item nav-icon-item">
              <router-link
                class="nav-link"
                to="/userhome"
                @click="closeMenu"
              >
                <span class="icon-wrapper">
                  <Avatar
                    :src="userStore.avatar"
                    alt="個人頭像"
                    :size="32"
                  />
                </span>
                個人頁面
              </router-link>
            </li>

            <li class="nav-item">
              <Button
                color="outline-secondary"
                class="ms-2"
                @click="logout"
              >登出</Button>
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
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();
const chatPopup = useChatPopupStore();
const menuOpen = ref(false);
const showLandlordMenu = ref(false);
const isLandlordAccordionOpen = ref(false);

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}
function closeMenu() {
  if (window.innerWidth < 992) menuOpen.value = false;
}
function loginAsTenant() {
  userStore.login('landlord', '房東A');
  //userStore.login('tenant', '房東房客A');
  // 這邊用來改變是房東或是房客
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
function goToLandlordRegister() {
  router.push('/landlord');
}
function toggleLandlordMenu() {
  showLandlordMenu.value = !showLandlordMenu.value;
}
</script>

<style scoped>
/* 導覽列主區塊樣式 */
#mainNav {

    background: #ffffff; /* 改為實心白色背景 */
    padding: 1.2rem 0;             /* 上下內距 */
    position: fixed;              /* 固定在畫面上方 */
    top: 0;
    left: 0;
    right: 0;
    z-index: 1030;                /* 層級優先顯示 */
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08); /* 陰影效果 */
}

/* 導覽列左上圖標（Logo） */
.nav-logo {
    height: 50px;
    width: 50px;
    padding: 0;
    border-radius: 50%;                        /* 圓形邊角 */
    border: 3px solid var(--main-color);       /* 外框主色 */
    background: none;
    box-shadow: none;
    aspect-ratio: 1;                           /* 長寬等比 */
    object-fit: contain;
    transition: all 0.4s ease;
}

/* 導覽列內選單區域（整體 ul） */
.navbar-nav {
    gap: 0.5rem; /* 選單間距 */

}

/* 每一個選單連結樣式 */
.navbar-nav .nav-link {
    color: var(--text-main);       /* 主要文字色 */
    font-weight: 500;
    padding: 0.6rem 0.6rem;        /* 上下左右內距 */
    transition: all 0.3s ease;     /* 滑入平滑效果 */
    position: relative;
    text-transform: uppercase;     /* 英文大寫 */
    font-size: 1rem;
    letter-spacing: 1px;           /* 字距 */
}

/* 滑鼠懸停變色 */
.navbar-nav .nav-link:hover {
    color: var(--main-color); /* 主色 */
}

/* 當前頁面連結高亮 */
.navbar-nav .nav-link.active {
  color: var(--main-color);
}

/* 選單內的 icon 大小與間距設定 */
.navbar-nav .nav-link i {
  margin-right: 6px;
  font-size: 1.1em;
  transition: all 0.3s ease;
}

/* 導覽列展開按鈕（行動裝置用） */
.navbar-toggler {
  border: none;
  padding: 0.5rem;
  transition: all 0.3s ease;
}

/* 當按鈕聚焦時移除藍框 */
.navbar-toggler:focus {
  box-shadow: none;
  outline: none;
}

/* 三條線漢堡 icon 主體 */
.navbar-toggler-icon {
  background-image: none;
  position: relative;
  width: 24px;
  height: 2px;
  background-color: var(--text-main);
  transition: all 0.3s ease;
}

/* 上下兩條線 */
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

/* 點擊展開後的旋轉效果（變叉叉） */
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

/* RWD：平板寬度以下導覽列內容樣式 */
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

/* RWD：手機寬度樣式 */
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

/* icon + badge 包裝外層，調整對齊 */
.nav-icon-item {
    display: flex;
    align-items: center;
    height: 48px;
}


/* 聊天室、收藏等 icon 對齊設定 */
.nav-icon-item .nav-link {
    display: flex;
    align-items: center;
    padding: 0.6rem 1.2rem;
}

/* icon 外圍圓形區塊 */
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

.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 0;
  min-width: 200px;
  z-index: 1000;
}

.dropdown-item {
  padding: 0.8rem 1.2rem;
  color: var(--text-main);
  text-decoration: none;
  display: block;
  transition: all 0.3s ease;
}

.dropdown-item:hover {
  background-color: rgba(60, 221, 210, 0.1);
  color: var(--main-color);
}

.dropdown-toggle::after {
  display: inline-block;
  margin-left: 0.5em;
  vertical-align: middle;
  content: "";
  border-top: 0.3em solid;
  border-right: 0.3em solid transparent;
  border-bottom: 0;
  border-left: 0.3em solid transparent;
}

.accordion-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 0;
  min-width: 200px;
  z-index: 1000;
  animation: fadeInAccordion 0.3s;
}
@keyframes fadeInAccordion {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
/* 品牌名稱（居研所）字體大小 */
.navbar-brand {
    font-size: 24px;
}

</style>
