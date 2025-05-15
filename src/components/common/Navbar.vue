<template>
  <!-- 導航列元件 -->
  <nav
    class="navbar navbar-expand-lg fixed-top"
    id="mainNav"
    :class="{ 'navbar-scrolled': isScrolled }"
  >
    <div class="container">
      <!-- 左側 Logo 與名稱 -->
      <a class="navbar-brand" href="#">
        <img
          src="/image/logo2.png"
          alt="租屋平台"
          class="nav-logo"
          style="height: 48px; width: 48px"
        />
      </a>
      <span class="navbar-brand">居研所</span>

      <!-- 手機版展開按鈕 -->
      <button class="navbar-toggler" type="button" @click="toggleMenu">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- 導覽列內容（主選單與登入區） -->
      <div
        class="collapse navbar-collapse"
        :class="{ show: menuOpen }"
        id="navbarNav"
      >
        <ul class="navbar-nav me-auto">
          <!-- 靜態選單項目 -->
          <li class="nav-item">
            <router-link
              class="nav-link"
              to="/"
              exact-active-class="active"
              @click="closeMenu"
              >首頁</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              to="/PropertySearch"
              exact-active-class="active"
              @click="closeMenu"
              >搜尋房源</router-link
            >
          </li>

          <!-- 聯絡我們（滑鼠移入展開） -->
          <li
            class="nav-item dropdown"
            @mouseenter="isHelpAccordionOpen = true"
            @mouseleave="isHelpAccordionOpen = false"
          >
            <a class="nav-link dropdown-toggle" href="#">資訊專區</a>
            <div class="accordion-menu" v-show="isHelpAccordionOpen">
              <router-link class="dropdown-item" to="/notice" @click="closeMenu">最新公告</router-link>
              <router-link class="dropdown-item" to="/contact" @click="closeMenu">聯絡我們</router-link>
              <router-link class="dropdown-item" to="/guide" @click="closeMenu">指南手冊</router-link>
              <router-link class="dropdown-item" to="/about" @click="closeMenu">關於居研所</router-link>
            </div>
          </li>

          <!-- 房東專區 或 成為房東 -->
          <li v-if="isLogin" class="nav-item dropdown" @mouseenter="isLandlordAccordionOpen = true"
            @mouseleave="isLandlordAccordionOpen = false">
            <template v-if="role === 'landlord' || role === 'both'">
              <a class="nav-link dropdown-toggle" href="#">房東專區</a>
              <div class="accordion-menu" v-show="isLandlordAccordionOpen">
                <router-link
                  class="dropdown-item"
                  to="/landlord/property-manage"
                  @click="closeMenu"
                  >物件管理</router-link
                >
                <router-link
                  class="dropdown-item"
                  to="/landlord/property-stats"
                  @click="closeMenu"
                  >刊登成效追蹤</router-link
                >
              </div>
            </template>
            <template v-else>
              <a
                class="nav-link"
                href="#"
                @click.prevent="showBecomeLandlordModal"
                >成為房東</a
              >
            </template>
          </li>
          <!-- 房源管理（雙重身分顯示） -->
<li v-if="isLogin && role === 'both'" class="nav-item">
  <a class="nav-link" href="#" @click="closeMenu">房源管理</a>
</li>
        </ul>

        <!-- 右側登入與個人區域 -->
        <ul class="navbar-nav">
          <!-- 未登入狀態 -->
          <template v-if="!isLogin">
            <li class="nav-item">
              <Button color="primary" class="me-2" @click="$emit('open-login')">
                登入/註冊
              </Button>
            </li>
          </template>

          <!-- 已登入狀態 -->
          <template v-else>
            <!-- 聊天室 -->
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

            <!-- 收藏 -->
            <li class="nav-item nav-icon-item position-relative">
              <a class="nav-link" href="#" @click="toggleFavoritePopup">
                <span class="icon-wrapper"
                  ><i class="fa-solid fa-heart"></i
                ></span>
                收藏
              </a>
              <FavoritePopup
                :visible="showFavoritePopup"
                :favorites="favoriteList"
                @remove="removeFavorite"
                @close="showFavoritePopup = false"
              />
            </li>

            <!-- 通知 -->
            <li
              class="nav-item nav-icon-item dropdown"
              style="position: relative"
            >
              <a
                class="nav-link dropdown-toggle"
                href="#"
                @click.prevent="toggleNotification"
              >
                <span class="icon-wrapper"
                  ><i class="fa-solid fa-bell"></i
                ></span>
                通知
              </a>

              <!-- 顯示通知清單 -->
              <NewAlert
                v-if="isNotificationOpen"
                :notifications="notifications"
              />
            </li>
            <!-- 個人頁面（滑鼠移入展開） -->
            <li
              class="nav-item nav-icon-item dropdown"
              @mouseenter="isProfileAccordionOpen = true"
              @mouseleave="isProfileAccordionOpen = false"
            >
              <a class="nav-link dropdown-toggle" href="#">
                <span class="icon-wrapper">
                  <Avatar :src="userStore.avatar" alt="個人頭像" :size="32" />
                </span>
                個人頁面
              </a>
              <div class="accordion-menu" v-show="isProfileAccordionOpen">
                <router-link
                  class="dropdown-item"
                  to="/UserHome/UserProfile"
                  @click="closeMenu"
                  >個人資料</router-link
                >
                <router-link
                  class="dropdown-item"
                  to="/user/favorite"
                  @click="closeMenu"
                  >我的收藏</router-link
                >
                <router-link class="dropdown-item" to="/chat" @click="closeMenu"
                  >聊天室</router-link
                >
              </div>
            </li>

            <!-- 登出按鈕 -->
            <li class="nav-item">
              <Button color="outline-secondary" class="ms-2" @click="logout"
                >登出</Button
              >
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
  <Teleport to="body">
    <BecomeLandlordModal v-if="showModal" @close="closeModal" />
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineEmits } from "vue";
import { useUserStore } from "@/stores/user";
import { useChatPopupStore } from "@/stores/chatPopup";
import Button from "@/components/buttons/button.vue";
import Avatar from "@/components/Avatar.vue";
import Badge from "@/components/Badge.vue";
import { useRouter } from "vue-router";
import BecomeLandlordModal from "@/views/landlord/BecomeLandlordModal.vue";
import NewAlert from "@/components/alert/NewAlert.vue";
import FavoritePopup from '@/components/favorite/FavoritePopup.vue'
import propertyImg from '@/assets/images/property/property.jpg'
import axios from 'axios'
import { storeToRefs } from 'pinia';


const router = useRouter();
const userStore = useUserStore();
const { role, isLogin } = storeToRefs(userStore);
const chatPopup = useChatPopupStore();
const menuOpen = ref(false);
const showLandlordMenu = ref(false);
const isLandlordAccordionOpen = ref(false);
const showModal = ref(false);
const showAlert = ref(false);
const isScrolled = ref(false);

//通知專用
const isNotificationOpen = ref(false);
const notifications = ref([]);

function toggleNotification() {
  isNotificationOpen.value = !isNotificationOpen.value;
}

// 模擬通知資料
onMounted(() => {
  notifications.value = [
    { message: "你有一筆新房源申請", time: "10 分鐘前" },
    { message: "系統將於今晚維護", time: "30 分鐘前" },
    { message: "房東已接受你的申請", time: "2 小時前" },
  ];
});
//通知專用

function handleScroll() {
  isScrolled.value = window.scrollY > 100;
}
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}
function closeMenu() {
  if (window.innerWidth < 992) menuOpen.value = false;
}
function loginAsTenant() {
  // 觸發父層事件，請父層開啟登入彈窗
  // 這裡用 emit
  emit("open-login");
}
function loginAsBoth() {
  userStore.login("tenant", "房東房客A");
}
function logout() {
  userStore.logout();
}
function openChatPopup(e) {
  e.preventDefault();
  chatPopup.open();
}
function goToLandlordRegister() {
  router.push("/landlord");
}
function toggleLandlordMenu() {
  showLandlordMenu.value = !showLandlordMenu.value;
}

const isProfileAccordionOpen = ref(false);

function goToProfile() {
  router.push("/user/profile");
  closeMenu();
}
function goToFavorite() {
  router.push("/user/favorite");
  closeMenu();
}

const isHelpAccordionOpen = ref(false);

function goToNotice() {
  router.push("/notice");
  closeMenu();
}
function goToContact() {
  router.push("/contact");
  closeMenu();
}
function goToFAQ() {
  router.push("/faq");
  closeMenu();
}
function goToAbout() {
  router.push("/about");
  closeMenu();
}

function goToPropertyManage() {
  router.push("/landlord/property-manage");
  closeMenu();
}

function goToPropertyStats() {
  router.push("/landlord/property-stats");
  closeMenu();
}

function showBecomeLandlordModal() {
  showModal.value = true;
  closeMenu();
}

function closeModal() {
  showModal.value = false;
}

const showFavoritePopup = ref(false);
const favoriteList = ref([
  {
    propertyId: 1,
    image: propertyImg,
    title: "文青套房",
    city: "台中市",
    district: "西區",
    address: "公益路二段 88 號",
    rentPrice: 16800,
  },
  {
    propertyId: 2,
    image: propertyImg,
    title: "海景套房",
    city: "高雄市",
    district: "前鎮區",
    address: "海岸路 100 號",
    rentPrice: 16500,
  },
]);
// onMounted(async () => {
//   try {
//     const res = await axios.get('https://localhost:7167/api/Favorites/byUser/1')
//     favoriteList.value = res.data.slice(0, 5)
//   } catch (error) {
//     console.warn('取得收藏清單失敗，使用假資料', error)
//   }
// })


// onMounted(async () => {
//   try {
//     const res = await axios.get('https://localhost:7167/api/Favorites/byUser/1')
//     favoriteList.value = res.data.slice(0, 5) 
//   } catch (error) {
//     console.warn('取得收藏清單失敗，使用假資料', error)
//   }
// })

// onMounted(async () => {
//   try {
//     const res = await axios.get('https://localhost:7167/api/Favorites/byUser/1')
//     favoriteList.value = res.data.slice(0, 5) 
//   } catch (error) {
//     console.warn('取得收藏清單失敗，使用假資料', error)
//   }
// })

function toggleFavoritePopup(e) {
  e.preventDefault();
  showFavoritePopup.value = !showFavoritePopup.value;
}

function removeFavorite(id) {
  favoriteList.value = favoriteList.value.filter((f) => f.propertyId !== id);
}

const emit = defineEmits(["open-login"]);
</script>

<style scoped>
/* 導覽列主區塊樣式 */
#mainNav {
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.6) 40%,
    rgba(255, 255, 255, 0) 100%
  );
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
  padding: 0.8rem 0;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
}

/* 導覽列左上圖標（Logo） */
.nav-logo {
  height: 50px;
  width: 50px;
  padding: 0;
  border-radius: 50%;
  /* 圓形邊角 */
  border: 3px solid var(--main-color);
  /* 外框主色 */
  background: none;
  box-shadow: none;
  aspect-ratio: 1;
  /* 長寬等比 */
  object-fit: contain;
  transition: all 0.4s ease;
}

.nav-logo:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(60, 221, 210, 0.3),
    0 0 0 3px rgba(60, 221, 210, 0.2);
}

/* 導覽列內選單區域（整體 ul） */
.navbar-nav {
  gap: 0.5rem;
  /* 選單間距 */
}

/* 每一個選單連結樣式 */
.navbar-nav .nav-link {
  color: var(--text-main);
  /* 主要文字色 */
  font-weight: 500;
  padding: 0.6rem 0.6rem;
  /* 上下左右內距 */
  transition: all 0.3s ease;
  /* 滑入平滑效果 */
  position: relative;
  text-transform: uppercase;
  /* 英文大寫 */
  font-size: 1rem;
  letter-spacing: 1px;
  /* 字距 */
}

/* 滑鼠懸停變色 */
.navbar-nav .nav-link:hover {
  color: var(--main-color);
  /* 主色 */
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
  content: "";
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
    /* background: rgba(255, 255, 255, 0.98); */
    background: none;
  }

  .nav-logo {
    height: 60px;
    width: 60px;
  }

  #mainNav.navbar-scrolled .nav-logo {
    height: 50px;
    width: 50px;
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
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 品牌名稱（居研所）字體大小 */
.navbar-brand {
  font-size: 24px;
}
</style>

