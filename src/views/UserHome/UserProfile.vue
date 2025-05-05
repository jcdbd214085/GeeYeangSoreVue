<template>
  <div class="profile-container">
    <div class="profile-content">
      <!-- 左側：大頭照 -->
      <div class="profile-avatar-section">
        <div class="avatar-container">
          <img :src="userData.avatar || defaultAvatar" alt="個人照片" class="avatar-image">
          <div class="avatar-overlay">
            <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" class="file-input">
            <button class="change-avatar-btn" @click="triggerFileInput">更換照片</button>
          </div>
        </div>
      </div>

      <!-- 右側：個人資料表單 -->
      <div class="profile-form-section">
        <form @submit.prevent="saveProfile" class="profile-form">
          <div class="form-group">
            <label>姓名</label>
            <input type="text" v-model="userData.name" required>
          </div>

          <div class="form-group">
            <label>生日</label>
            <input type="date" v-model="userData.birthday" required>
          </div>

          <div class="form-group">
            <label>性別</label>
            <select v-model="userData.gender" required>
              <option value="">請選擇</option>
              <option value="male">男</option>
              <option value="female">女</option>
              <option value="other">其他</option>
            </select>
          </div>

          <div class="form-group">
            <label>居住地</label>
            <input type="text" v-model="userData.location" required>
          </div>

          <div class="form-group">
            <label>手機</label>
            <input type="tel" v-model="userData.phone" pattern="[0-9]{10}" required>
          </div>

          <div class="form-group">
            <label>信箱</label>
            <input type="email" v-model="userData.email" required>
          </div>

          <div class="form-group">
            <label>密碼</label>
            <input type="password" v-model="userData.password" placeholder="輸入新密碼">
          </div>

          <div class="form-group">
            <label>確認密碼</label>
            <input type="password" v-model="userData.confirmPassword" placeholder="再次輸入新密碼">
          </div>

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
import defaultAvatar from '@/assets/images/avatar/default.png'

const fileInput = ref(null)

// 使用者資料
const userData = reactive({
  avatar: '',
  name: '',
  birthday: '',
  gender: '',
  location: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// 觸發檔案選擇
const triggerFileInput = () => {
  fileInput.value.click()
}

// 處理檔案上傳
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

// 儲存個人資料
const saveProfile = () => {
  // 驗證密碼
  if (userData.password && userData.password !== userData.confirmPassword) {
    alert('兩次輸入的密碼不一致')
    return
  }

  // TODO: 實作 API 呼叫來儲存資料
  console.log('儲存資料:', userData)
  alert('資料已更新')
}

// 重設表單
const resetForm = () => {
  // TODO: 從 API 重新載入使用者資料
  Object.keys(userData).forEach(key => {
    userData[key] = ''
  })
}
</script>

<style scoped>
.profile-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 30px;
}

.profile-content {
  display: flex;
  gap: 40px;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.profile-avatar-section {
  flex: 0 0 300px;
}

.avatar-container {
  position: relative;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  padding: 10px;
  text-align: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.file-input {
  display: none;
}

.change-avatar-btn {
  background: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  color: #333;
}

.profile-form-section {
  flex: 1;
}

.profile-form {
  display: grid;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #555;
}

.form-group input,
.form-group select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4CAF50;
}

.form-actions {
  display: flex;
  gap: 16px;
  margin-top: 20px;
}

.save-btn,
.cancel-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.save-btn {
  background-color: #4CAF50;
  color: white;
}

.save-btn:hover {
  background-color: #45a049;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #333;
}

.cancel-btn:hover {
  background-color: #e0e0e0;
}
</style> 