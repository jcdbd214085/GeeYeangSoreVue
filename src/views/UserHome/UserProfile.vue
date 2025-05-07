<template>
  <!-- 外層容器 -->
  <div class="profile-container">
    <div class="profile-content">

      <!-- 左側：大頭照區塊 -->
      <div class="profile-avatar-section">
        <div class="avatar-container">
          <!-- 顯示使用者頭像，若無則使用預設圖 -->
          <img :src="userData.avatar || defaultAvatar" alt="個人照片" class="avatar-image">
          
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
            <input type="text" v-model="userData.name" required>
          </div>

          <!-- 生日 -->
          <div class="form-group">
            <label>生日</label>
            <input type="date" v-model="userData.birthday" required>
          </div>

          <!-- 性別：僅提供男、女 -->
          <div class="form-group">
            <label>性別</label>
            <select v-model="userData.gender" required>
              <option value="">請選擇</option>
              <option value="male">男</option>
              <option value="female">女</option>
            </select>
          </div>

          <!-- 居住地：包含縣市與詳細地址 -->
          <div class="form-group">
            <label>居住地</label>
            <select v-model="userData.city" required>
              <option value="">請選擇縣市</option>
              <!-- 各縣市 -->
              <option>台北市</option>
              <option>新北市</option>
              <option>桃園市</option>
              <option>台中市</option>
              <option>台南市</option>
              <option>高雄市</option>
              <option>基隆市</option>
              <option>新竹市</option>
              <option>嘉義市</option>
              <option>宜蘭縣</option>
              <option>新竹縣</option>
              <option>苗栗縣</option>
              <option>彰化縣</option>
              <option>南投縣</option>
              <option>雲林縣</option>
              <option>嘉義縣</option>
              <option>屏東縣</option>
              <option>台東縣</option>
              <option>花蓮縣</option>
              <option>澎湖縣</option>
              <option>金門縣</option>
              <option>連江縣</option>
            </select>
            <!-- 詳細地址輸入欄 -->
            <input type="text" v-model="userData.address" placeholder="請輸入詳細地址" required>
          </div>

          <!-- 手機 -->
          <div class="form-group">
            <label>手機</label>
            <input type="tel" v-model="userData.phone" pattern="[0-9]{10}" required>
          </div>

          <!-- 信箱 -->
          <div class="form-group">
            <label>信箱</label>
            <input type="email" v-model="userData.email" required>
          </div>

          <!-- 密碼：點擊「我要更改」才顯示欄位 -->
          <div class="form-group">
            <label>
              密碼 
              <button type="button" class="change-password-btn" @click="showPassword = !showPassword">
                我要更改
              </button>
            </label>
            <input v-if="showPassword" type="password" v-model="userData.password" placeholder="輸入新密碼">
          </div>

          <!-- 確認密碼：僅在顯示修改時才出現 -->
          <div class="form-group" v-if="showPassword">
            <label>確認密碼</label>
            <input type="password" v-model="userData.confirmPassword" placeholder="再次輸入新密碼">
          </div>

          <!-- 表單按鈕 -->
          <div class="form-actions">
            <button type="submit" class="save-btn">儲存變更</button>
            <button type="button" class="cancel-btn" @click="resetForm">重設</button>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, reactive } from 'vue'
// 預設頭像圖檔
import defaultAvatar from '@/assets/images/avatar/default.png'

// 檔案選擇輸入參照用
const fileInput = ref(null)

// 控制是否顯示密碼欄位
const showPassword = ref(false)

// 使用者資料模型
const userData = reactive({
  avatar: '',
  name: '',
  birthday: '',
  gender: '',
  city: '',
  address: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// 點擊按鈕後觸發檔案輸入
const triggerFileInput = () => {
  fileInput.value.click()
}

// 處理圖片上傳，轉為 base64 儲存暫存頭像
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      userData.avatar = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// 儲存使用者資料，包含密碼驗證
const saveProfile = () => {
  if (userData.password && userData.password !== userData.confirmPassword) {
    alert('兩次輸入的密碼不一致')
    return
  }

  // TODO: 呼叫 API 實際儲存資料
  console.log('儲存資料:', userData)
  alert('資料已更新')
}

// 重設表單，清除所有欄位
const resetForm = () => {
  Object.keys(userData).forEach(key => {
    userData[key] = ''
  })
}
</script>

<style scoped>
/* 🟡 外層容器：設定寬度與內距 */
.profile-container {
  padding: 20px;                  /* 元件內距 */
  max-width: 1200px;              /* 最大寬度限制 */
  margin: 0 auto;                 /* 置中 */
}

/* 🟡 頁面標題樣式 */
.page-title {
  font-size: 24px;                /* 字體大小 */
  color: #333;                    /* 字體顏色 */
  margin-bottom: 30px;           /* 下方間距 */
}

/* 🟡 主要內容區：表單與大頭照排版 */
.profile-content {
  display: flex;                  /* 使用 flex 排列左右區塊 */
  gap: 40px;                      /* 區塊之間的間距 */
  background: white;             /* 背景色 */
  padding: 30px;                 /* 內距 */
  border-radius: 12px;           /* 圓角邊框 */
  /* box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); */ /* 原陰影已註解 */
}

/* 🟡 大頭照區塊：設定固定寬度 */
.profile-avatar-section {
  flex: 0 0 300px;                /* 固定寬度，不伸縮 */
}

/* 🟡 大頭照容器 */
.avatar-container {
  position: relative;            /* 讓遮罩層可以絕對定位 */
  width: 250px;                  /* 寬度固定 */
  height: 250px;                 /* 高度固定 */
  border-radius: 50%;           /* 製作圓形容器 */
  overflow: hidden;             /* 超出裁切 */
  margin: 0 auto;               /* 水平置中 */
}

/* 🟡 大頭照圖片 */
.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;             /* 圖片填滿但不變形 */
}

/* 🟡 大頭照滑入遮罩層 */
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

/* 🟡 滑鼠移入時顯示遮罩 */
.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

/* 🟡 檔案輸入欄位隱藏（由按鈕觸發） */
.file-input {
  display: none;
}

/* 🟡 更換照片按鈕樣式 */
.change-avatar-btn {
  background: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  color: #333;
}

/* 🟡 表單區塊（右側） */
.profile-form-section {
  flex: 1;                        /* 撐滿剩下空間 */
}

/* 🟡 表單排列方式：使用 grid 間隔排列 */
.profile-form {
  display: grid;
  gap: 20px;                      /* 每欄間距 */
}

/* 🟡 單一欄位容器（label + input） */
.form-group {
  display: flex;
  flex-direction: column;        /* 垂直排列 */
  gap: 8px;                      /* label 與 input 間距 */
}

/* 🟡 表單標籤樣式 */
.form-group label {
  font-weight: 500;
  color: #555;
}

/* 🟡 表單輸入與下拉選單共用樣式 */
.form-group input,
.form-group select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
}

/* 🟡 輸入框聚焦樣式：改變邊框色 */
.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4CAF50;
}

/* 🟡 表單操作按鈕區 */
.form-actions {
  display: flex;
  gap: 16px;
  margin-top: 20px;
}

/* 🟡 儲存與取消按鈕共用樣式 */
.save-btn,
.cancel-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

/* 🟢 儲存按鈕樣式（綠色） */
.save-btn {
  background-color: #4CAF50;
  color: white;
}

/* 🟢 儲存按鈕 hover 效果 */
.save-btn:hover {
  background-color: #45a049;
}

/* 🔘 取消按鈕樣式（灰底） */
.cancel-btn {
  background-color: #f5f5f5;
  color: #333;
}

/* 🔘 取消按鈕 hover 效果 */
.cancel-btn:hover {
  background-color: #e0e0e0;
}

/* 🟡「我要更改」按鈕樣式 */
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

/* 🟡「我要更改」按鈕 hover 效果 */
.change-password-btn:hover {
  background-color: #ffcc00;     /* 明黃色 */
  color: #fff;
}
</style>

