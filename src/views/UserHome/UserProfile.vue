<template>
  <!-- 外層容器 -->
  <div class="profile-container">
    <div class="profile-content">

      <!-- 左側：大頭照區塊 -->
      <div class="profile-avatar-section">
        <div class="avatar-container">
          <!-- 顯示使用者頭像，若無則使用預設圖 -->
          <img 
            :src="previewImage || getAvatarUrl(userData.avatar)" 
            @error="handleImageError" 
            alt="" 
            class="avatar-image"
          >
          
          <!-- 遮罩層：滑鼠移入時顯示更換按鈕 -->
          <div class="avatar-overlay">
            <!-- 隱藏的檔案輸入欄位，點擊按鈕觸發 -->
            <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" class="file-input">
            <!-- 更換照片按鈕 -->
            <button class="change-avatar-btn" @click="triggerFileInput">更換照片</button>
          </div>
        </div>
      </div>

      <!-- 右側：個人資料表單 -->
      <div class="profile-form-section">
        <form @submit.prevent="saveProfile" class="profile-form">
          
          <!-- 姓名 -->
          <div class="form-group">
            <label>姓名</label>
            <input type="text" v-model="userData.name">
          </div>

          <!-- 生日 -->
          <div class="form-group">
            <label>生日</label>
            <input type="date" v-model="userData.birthday">
          </div>

          <!-- 性別：僅提供男、女 -->
          <div class="form-group">
            <label>性別</label>
            <select v-model="userData.gender">
              <option value="">請選擇</option>
              <option value="male">男</option>
              <option value="female">女</option>
            </select>
          </div>

          <!-- 居住地：單一輸入框 -->
          <div class="form-group">
            <label>居住地</label>
            <input type="text" v-model="userData.address" placeholder="請輸入完整地址">
          </div>

          <!-- 手機 -->
          <div class="form-group">
            <label>手機</label>
            <input type="tel" v-model="userData.phone" pattern="[0-9]{10}">
          </div>

          <!-- 信箱欄，若是 Google 登入顯示標籤與唯讀 -->
          <div class="form-group">
            <label>
              信箱
              <span v-if="userData.isGoogleLogin" style="color: #888; font-size: 14px;">（Google 登入）</span>
            </label>
            <input
              type="email"
              v-model="userData.email"
              disabled
            >
          </div>

          <!-- 密碼與確認密碼：僅本地帳號顯示 -->
          <div class="form-group" v-if="!userData.isGoogleLogin">
            <label>
              密碼 
              <button type="button" class="change-password-btn" @click="showPassword = !showPassword">
                我要更改
              </button>
            </label>
            <div class="password-input-container">
              <input
                v-if="showPassword"
                :type="showNewPassword ? 'text' : 'password'"
                v-model="userData.password"
                placeholder="輸入新密碼"
              >
              <button 
                v-if="showPassword" 
                type="button" 
                class="toggle-password-btn"
                @click="showNewPassword = !showNewPassword"
              >
                <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <div class="form-group" v-if="!userData.isGoogleLogin && showPassword">
            <label>確認密碼</label>
            <div class="password-input-container">
              <input 
                :type="showConfirmPassword ? 'text' : 'password'" 
                v-model="userData.confirmPassword" 
                placeholder="再次輸入新密碼"
              >
              <button 
                type="button" 
                class="toggle-password-btn"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <!-- 表單操作按鈕 -->
          <div class="form-actions">
            <!-- 刪除帳號按鈕 -->
  <button type="button" class="delete-btn" @click="showDeleteModal = true">刪除帳號</button>
            <button type="submit" class="save-btn">儲存變更</button>
            <button type="button" class="cancel-btn" @click="resetForm">重設</button>
          </div>

        </form>
      </div>
    </div>
  </div>

  <!-- 🆕 刪除帳號確認彈窗 -->
<div v-if="showDeleteModal" class="modal-overlay">
  <div class="modal-content">
    <h2>確定要刪除帳號嗎？</h2>
    <p>刪除後資料將無法復原，請再次確認。</p>
    <div class="modal-actions">
      <button class="confirm-btn" @click="deleteAccount">確定刪除</button>
      <button class="cancel-btn" @click="showDeleteModal = false">取消</button>
    </div>
  </div>
</div>


</template>



<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

import { useToast } from 'vue-toastification' // 引入 Toast 套件
const toast = useToast() // 初始化 Toast


// 引入 router 和 userStore
const router = useRouter()
const userStore = useUserStore()

// 設定預設頭像路徑
const defaultAvatar = `${import.meta.env.VITE_API_BASE_URL}/images/User/default.png`

// 檔案輸入引用
const fileInput = ref(null)

// 是否顯示密碼輸入區塊
const showPassword = ref(false)
// 是否顯示新密碼
const showNewPassword = ref(false)
// 是否顯示確認密碼
const showConfirmPassword = ref(false)

// 刪除帳號彈窗控制
const showDeleteModal = ref(false)

// 新增預覽圖片狀態
const previewImage = ref(null)

// 使用者資料模型
const userData = reactive({
  avatar: '',
  name: '',
  birthday: null,
  gender: '',
  address: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  isGoogleLogin: false,
  newAvatarFile: null
})

// 計算頭像URL
const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) return defaultAvatar
  // 確保只使用檔名來組合完整路徑
  return `${import.meta.env.VITE_API_BASE_URL}/images/User/${avatarPath}`
}

// 處理圖片載入失敗
const handleImageError = (event) => {
  event.target.src = defaultAvatar
}

// 觸發圖片選擇
const triggerFileInput = () => {
  fileInput.value.click()
}

// 上傳頭像並更新 userData.avatar
const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // 建立預覽
  const reader = new FileReader()
  reader.onload = (e) => {
    previewImage.value = e.target.result
  }
  reader.readAsDataURL(file)

  // 先不上傳，等待使用者點擊儲存
  userData.newAvatarFile = file
}

// 載入個人資料
const loadProfile = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/UserProfile/profile`,
      { withCredentials: true }
    )

    console.log('原始後端生日資料:', res.data.hBirthday);

    // 處理日期格式：若後端傳回 null 或空字串，則設定為 null，否則截取字串前10個字元
    const birthday = res.data.hBirthday ? res.data.hBirthday.substring(0, 10) : null;

    console.log('處理後的前端生日資料:', birthday);

    Object.assign(userData, {
      name: res.data.hUserName,
      birthday: birthday,
      gender: res.data.gender,
      address: res.data.address || '',
      phone: res.data.hPhoneNumber,
      email: res.data.hEmail,
      avatar: res.data.avatar,
      isGoogleLogin: res.data.isGoogleLogin
    })

    console.log('userData.isGoogleLogin:', userData.isGoogleLogin);

  } catch (err) {
    console.error('載入個人資料失敗', err)
    toast.error('載入失敗，請重新整理或重新登入')
  }
}

// 儲存更新個資
const saveProfile = async () => {
  try {
    // 密碼驗證
    if (userData.password) {
      if (userData.password !== userData.confirmPassword) {
        toast.error('兩次輸入的密碼不一致')
        return
      }
    }

    // 驗證手機號碼格式（如果有填寫）
    if (userData.phone && !/^09\d{8}$/.test(userData.phone)) {
      toast.error('手機號碼格式不正確，請輸入正確的手機號碼')
      return
    }

    // 如果有新上傳的頭像，先上傳頭像
    if (userData.newAvatarFile) {
      const formData = new FormData()
      formData.append('file', userData.newAvatarFile)

      try {
        const uploadRes = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/UserProfile/upload-avatar`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
          }
        )
        // 只儲存檔名到 userData.avatar
        userData.avatar = uploadRes.data.fileName
      } catch (err) {
        console.error('上傳圖片失敗', err)
        toast.error('頭像上傳失敗')
        return
      }
    }

    const updateData = {
      name: userData.name,
      birthday: userData.birthday,
      gender: userData.gender,
      address: userData.address,
      phone: userData.phone,
      password: userData.password,
      confirmPassword: userData.confirmPassword,
      avatar: userData.avatar // 這裡只傳送檔名
    }

    console.log('要傳送給後端的資料：', updateData)

    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/UserProfile/save-profile`,
      updateData,
      { withCredentials: true }
    )

    // 清除預覽和新上傳的檔案
    previewImage.value = null
    userData.newAvatarFile = null

    toast.success('更新成功')
    // 重置密碼相關欄位
    userData.password = ''
    userData.confirmPassword = ''
    showPassword.value = false
  } catch (err) {
    console.error('更新個人資料失敗', err)
    if (err.response?.data?.message) {
      toast.error(err.response.data.message)
    } else {
      toast.error('更新失敗，請稍後再試')
    }
  }
}

// 刪除帳號
const deleteAccount = async () => {
  try {
    const res = await axios.delete(
      `${import.meta.env.VITE_API_BASE_URL}/api/UserProfile/delete-account`,
      { withCredentials: true }
    )
    
    toast.success('帳號已成功刪除')
    // 清除用戶狀態
    userStore.logout()
    // 使用 router 進行導航
    router.push('/')
  } catch (err) {
    console.error('刪除帳號失敗', err)
    if (err.response?.data?.message) {
      toast.error(err.response.data.message)
    } else {
      toast.error('刪除失敗，請稍後再試')
    }
  } finally {
    showDeleteModal.value = false
  }
}

// 重設表單
const resetForm = () => {
  loadProfile()
  userData.password = ''
  userData.confirmPassword = ''
  showPassword.value = false
  // 清除預覽圖片和新上傳的檔案
  previewImage.value = null
  userData.newAvatarFile = null
  // 重置檔案輸入欄位，確保可以重新選擇相同的檔案
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 頁面載入時獲取資料
onMounted(() => {
  // 檢查使用者是否已登入才載入個人資料
  if (userStore.isLogin) {
    loadProfile()
  } else {
    // 如果未登入，導向登入頁面 (這應該不會發生，因為刪除帳號後已經導向，但作為一個安全措施)
    router.push('/login')
  }
})
</script>


<style scoped>
/*  外層容器：設定寬度與內距 */
.profile-container {
  padding: 20px;                  /* 元件內距 */
  max-width: 1200px;              /* 最大寬度限制 */
  margin: 0 auto;                 /* 置中 */
}

/*  頁面標題樣式 */
.page-title {
  font-size: 24px;                /* 字體大小 */
  color: #333;                    /* 字體顏色 */
  margin-bottom: 30px;           /* 下方間距 */
}

/*  主要內容區：表單與大頭照排版 */
.profile-content {
  display: flex;                  /* 使用 flex 排列左右區塊 */
  gap: 40px;                      /* 區塊之間的間距 */
  background: white;             /* 背景色 */
  padding: 30px;                 /* 內距 */
  border-radius: 12px;           /* 圓角邊框 */
  /* box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); */ /* 原陰影已註解 */
}

/*  大頭照區塊：設定固定寬度 */
.profile-avatar-section {
  flex: 0 0 300px;                /* 固定寬度，不伸縮 */
}

/*  大頭照容器 */
.avatar-container {
  position: relative;            /* 讓遮罩層可以絕對定位 */
  width: 250px;                  /* 寬度固定 */
  height: 250px;                 /* 高度固定 */
  border-radius: 50%;           /* 製作圓形容器 */
  overflow: hidden;             /* 超出裁切 */
  margin: 0 auto;               /* 水平置中 */
}

/*  大頭照圖片 */
.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;             /* 圖片填滿但不變形 */
}

/*  大頭照滑入遮罩層 */
.avatar-overlay {
  position: absolute;            /* 絕對定位 */
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5); /* 半透明黑底 */
  padding: 10px;
  text-align: center;
  opacity: 0;                    /* 預設不顯示 */
  transition: opacity 0.3s;      /* 滑入漸顯 */
}

/*  滑鼠移入時顯示遮罩 */
.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

/*  檔案輸入欄位隱藏（由按鈕觸發） */
.file-input {
  display: none;
}

/*  更換照片按鈕樣式 */
.change-avatar-btn {
  background: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  color: #333;
}

/*  表單區塊（右側） */
.profile-form-section {
  flex: 1;                        /* 撐滿剩下空間 */
}

/*  表單排列方式：使用 grid 間隔排列 */
.profile-form {
  display: grid;
  gap: 20px;                      /* 每欄間距 */
}

/*  單一欄位容器（label + input） */
.form-group {
  display: flex;
  flex-direction: column;        /* 垂直排列 */
  gap: 8px;                      /* label 與 input 間距 */
}

/*  表單標籤樣式 */
.form-group label {
  font-weight: 500;
  color: #555;
}

/*  表單輸入與下拉選單共用樣式 */
.form-group input,
.form-group select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
}

/*  輸入框聚焦樣式：改變邊框色 */
.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4CAF50;
}

/*  針對 disabled 的 input 欄位顯示灰階 */
.form-group input:disabled {
  color: #888; /* 文字顏色變灰 */
  background-color: #f0f0f0; /* 背景顏色變淺灰 */
  cursor: default; /* 鼠標變為預設箭頭 */
}

/*  表單操作按鈕區 */
.form-actions {
  display: flex;
  gap: 16px;
  margin-top: 20px;
}

/*  儲存與取消按鈕共用樣式 */
.save-btn,
.cancel-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

/*  儲存按鈕樣式（綠色） */
.save-btn {
  background-color: #4CAF50;
  color: white;
}

/*  儲存按鈕 hover 效果 */
.save-btn:hover {
  background-color: #45a049;
}

/*  取消按鈕樣式（灰底） */
.cancel-btn {
  background-color: #c6c6c6;
  color: #333;
}

/*  取消按鈕 hover 效果 */
.cancel-btn:hover {
  background-color: #e0e0e0;
}

/* 「我要更改」按鈕樣式 */
.change-password-btn {
  background-color: #ffb700;     /* 深黃色 */
  border: none;
  color: #fff;
  padding: 4px 12px;
  margin-left: 10px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

/* 「我要更改」按鈕 hover 效果 */
.change-password-btn:hover {
  background-color: #ffcc00;     /* 明黃色 */
  color: #fff;
}

/*  刪除帳號按鈕樣式 */
.delete-btn {
  background-color: #e45454;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #d42d2d;
}

/*  確認刪除彈窗樣式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 400px;
  max-width: 90%;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.modal-actions {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.confirm-btn {
  background-color: #e45454;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
}

.confirm-btn:hover {
  background-color: #d42d2d;
}

/* 密碼輸入容器 */
.password-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

/* 密碼輸入框 */
.password-input-container input {
  flex: 1;
  padding-right: 40px; /* 為小眼睛按鈕留出空間 */
}

/* 切換密碼顯示按鈕 */
.toggle-password-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 5px;
}

.toggle-password-btn:hover {
  color: #333;
}

.toggle-password-btn i {
  font-size: 16px;
}



</style>

