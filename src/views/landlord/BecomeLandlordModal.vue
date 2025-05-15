<template>
  <div class="modal-mask">
    <div class="container">
      <div class="form-box">
        <!-- 關閉按鈕 -->
        <button class="close-btn" @click="$emit('close')">×</button>

        <form v-if="!showAlert" @submit.prevent="handleRegister">
          <h1>房東註冊</h1>

          <!-- 本名欄位 -->
          <div class="input-box">
            <label for="username">本名</label>
            <input id="username" v-model="register.username" type="text" placeholder="請輸入本名" required />
            <i class="fa-solid fa-user"></i>
            <div v-if="submitted && !register.username" class="error">本名為必填</div>
          </div>
          <!--銀行帳戶名稱 身分證號 -->
          <div class="input-box">
            <label for="bankName">銀行名稱</label>
            <input id="bankName" v-model="register.bankName" type="text" placeholder="請輸入銀行帳戶名稱" required />
            <i class="fa-solid fa-piggy-bank"></i>
            <div v-if="submitted && !register.bankName" class="error">銀行帳戶名稱為必填</div>
          </div>
          <div class="input-box">
            <label for="bank">銀行帳戶</label>
            <input id="bank" v-model="register.bank" type="text" placeholder="請輸入銀行帳戶" required />
            <i class="fa-solid fa-piggy-bank"></i>
            <div v-if="submitted && !register.bank" class="error">銀行帳戶為必填</div>
            <div v-if="submitted && register.bank && !isBankValid" class="error">銀行帳戶格式錯誤</div>
          </div>

          <!-- 上傳圖片 -->
          <div class="upload-row">
            <!-- 身分證正面 -->
            <div class="file-upload">
              <label for="idFront">身分證（正面）</label>
              <div class="image-upload-wrap" :class="{ 'has-image': idCardFrontPreview }">
                <div class="drag-text" v-if="!idCardFrontPreview">
                  <h5>未上傳圖片</h5>
                  <input id="idFront" type="file" accept="image/*" hidden @change="handleImageUpload($event, 'front')" />
                  <label for="idFront" class="upload-btn">點我上傳圖片</label>
                </div>
                <div v-else class="image-preview">
                  <img :src="idCardFrontPreview" alt="身分證正面" />
                  <button type="button" class="remove-image" @click="removeImage('front')">×</button>
                </div>
              </div>
            </div>

            <!-- 身分證反面 -->
            <div class="file-upload">
              <label for="idBack">身分證（反面）</label>
              <div class="image-upload-wrap" :class="{ 'has-image': idCardBackPreview }">
                <div class="drag-text" v-if="!idCardBackPreview">
                  <h5>未上傳圖片</h5>
                  <input id="idBack" type="file" accept="image/*" hidden  @change="handleImageUpload($event, 'back')" />
                  <label for="idBack" class="upload-btn">點我上傳圖片</label>
                </div>
                <div v-else class="image-preview">
                  <img :src="idCardBackPreview" alt="身分證反面" />
                  <button type="button" class="remove-image" @click="removeImage('back')">×</button>
                </div>
              </div>
            </div>
          </div>

          <button class="btn" :disabled="isSubmitting">
            {{ isSubmitting ? '處理中...' : '註冊' }}
          </button>
        </form>
        <Alert
          v-model:show="showAlert"
          title="申請成功"
          message="您的申請已送出，請靜待審核結果。"
          type="success"
          confirmText="知道了"
          cancelText="返回"
          :closeOnClickOverlay="false"
          @confirm="onAlertConfirm"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Alert from '@/components/alert/Alert.vue'
import axios from 'axios'

const router = useRouter()
const emit = defineEmits(['close'])

const register = ref({
  username: '',
  bankName: '',
  bank: '',
  idCardFront: null,
  idCardBack: null
})

const submitted = ref(false)
const showAlert = ref(false)
const isSubmitting = ref(false)
const idCardFrontPreview = ref(null)
const idCardBackPreview = ref(null)

const isBankValid = computed(() => {
  return /^\d{10,14}$/.test(register.value.bank)
})

const handleImageUpload = (event, type) => {
  const file = event.target.files[0]
  if (file) {
    if (type === 'front') {
      register.value.idCardFront = file
      idCardFrontPreview.value = URL.createObjectURL(file)
    } else {
      register.value.idCardBack = file
      idCardBackPreview.value = URL.createObjectURL(file)
    }
  }
}

const removeImage = (type) => {
  if (type === 'front') {
    register.value.idCardFront = null
    idCardFrontPreview.value = null
  } else {
    register.value.idCardBack = null
    idCardBackPreview.value = null
  }
}

const handleRegister = async () => {
  submitted.value = true
  if (!register.value.username || !register.value.bankName || !register.value.bank || !isBankValid.value) return
  if (!register.value.idCardFront || !register.value.idCardBack) {
    alert('請上傳身分證正反面照片')
    return
  }

  try {
    isSubmitting.value = true
    const formData = new FormData()
    formData.append('username', register.value.username)
    formData.append('bankName', register.value.bankName)
    formData.append('bank', register.value.bank)
    formData.append('idCardFront', register.value.idCardFront)
    formData.append('idCardBack', register.value.idCardBack)

    const response = await axios.post('/api/BecomeLandlord/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    })

    if (response.data) {
      showAlert.value = true
    }
  } catch (error) {
    alert(error.response?.data?.message || '註冊失敗，請稍後再試')
  } finally {
    isSubmitting.value = false
  }
}

function onAlertConfirm() {
  showAlert.value = false
  emit('close')
}

function onAlertCancel() {
  showAlert.value = false
}
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 容器設定 */
.container {
  width: 800px;
  max-width: 90vw;
  background: #f0f9f8;
  border-radius: 30px;
  box-shadow: 0 0 30px rgba(0, 0, 0, .2);
  padding: 16px;
  margin: 20px;
}

/* 表單主體 */
.form-box {
position: relative; /* 為了讓 close-btn 定位於其內部 */
color: #333;
}

/* 輸入框區塊 */
.input-box {
  position: relative;
  margin: 10px 0;
}

/* 輸入框上標籤 */
label {
display: block;         /* 單獨一行 */
margin-bottom: 8px;     /* 與輸入/上傳框間距 */
color: #333;            /* 字體顏色 */
font-weight: bold;      /* 字體加粗 */
}

/* 輸入框樣式 */
.input-box input {
  width: 100%;
  padding: 13px 50px 13px 20px;
  background: #ffffff;
  border-radius: 8px;
  border: none;
  outline: none;
  font-size: 16px;
}

/* 輸入框內的圖示 */
.input-box i {
  position: absolute;
  right: 20px;
  top: 65%;
  transform: translateY(-50%);
  font-size: 20px;
  color: #32a49c;
}

/* 按鈕樣式 */
.btn {
  width: 100%;
  height: 48px;
  background: #32a49c;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s, color 0.3s;
}

/* 按鈕懸停效果 */
.btn:hover {
  background-color: #ff9800;
  color: #fff;
}

/* 上傳區塊橫向排列並置中 */
.upload-row {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

/* 單一圖片上傳區塊 */
.file-upload {
  display: flex;
  flex-direction: column;
}

/* 圖片上傳虛線框設定 */
.image-upload-wrap {
  position: relative;
  border: 4px dashed #9b9b9b;
  background-color: #fff;
  color: #888888;
  padding: 20px;
  text-align: center;
  border-radius: 8px;
  width: 300px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.image-upload-wrap.has-image {
  border-style: solid;
  border-color: #32a49c;
}

.image-preview {
  position: relative;
  width: 100%;
  height: 100%;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  color: #ff4d4f;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.remove-image:hover {
  background: rgba(255, 255, 255, 1);
}

.btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* 上傳按鈕樣式 */
.upload-btn {
  display: inline-block;
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #ffb26ef5;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
  text-decoration: none;
}

/* 上傳按鈕懸停效果 */
.upload-btn:hover {
  background-color: #ff9800;
}

/* 關閉按鈕樣式 */
.close-btn {
position: absolute;
top: 0px;
right: 0px;
width: 28px;
height: 28px;
background: #ffffff;
border: none;
border-radius: 50%;
font-size: 18px;
font-weight: bold;
color: #32a49c;
cursor: pointer;
z-index: 10;
display: flex;
justify-content: center;
align-items: center;
box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
transition: background-color 0.3s, color 0.3s;
}

.error {
  color: #ff4d4f;
  font-size: 14px;
  margin-top: 4px;
}
</style> 