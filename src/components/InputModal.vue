<template>
  <div class="container">
    <div class="form-box">
      <!-- 關閉按鈕 -->
      <button class="close-btn" @click="handleClose">×</button>

      <form @submit.prevent="handleRegister">
        <h1>房東註冊</h1>

        <!-- 本名欄位 -->
        <div class="input-box">
          <label for="username">本名</label>
          <input id="username" v-model="register.username" type="text" placeholder="請輸入本名" required />
          <i class="fa-solid fa-user"></i>
        </div>

        <!-- 銀行欄位 -->
        <div class="input-box">
          <label for="bank">銀行帳戶</label>
          <input id="bank" v-model="register.bank" type="text" placeholder="請輸入銀行帳戶" required />
          <i class="fa-solid fa-piggy-bank"></i>
        </div>

        <!-- 上傳圖片 -->
        <div class="upload-row">
          <!-- 身分證正面 -->
          <div class="file-upload">
            <label for="idFront">身分證（正面）</label>
            <div class="image-upload-wrap">
              <div class="drag-text">
                <h5>未上傳圖片</h5>
                <input id="idFront" type="file" hidden @change="handleImageUpload" />
                <label for="idFront" class="upload-btn">點我上傳圖片</label>
              </div>
            </div>
          </div>

          <!-- 身分證反面 -->
          <div class="file-upload">
            <label for="idBack">身分證（反面）</label>
            <div class="image-upload-wrap">
              <div class="drag-text">
                <h5>未上傳圖片</h5>
                <input id="idBack" type="file" hidden @change="handleImageUpload" />
                <label for="idBack" class="upload-btn">點我上傳圖片</label>
              </div>
            </div>
          </div>
        </div>

        <button class="btn">註冊</button>
      </form>
    </div>
  </div>
</template>


  
<script setup>
import { ref } from 'vue'

// 表單資料
const register = ref({
  username: '',
  bank: '',
  verificationCode: ''
})

// 圖片上傳
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    console.log('上傳檔案：', file.name)
  }
}

// 表單送出
const handleRegister = () => {
  console.log('註冊資料', register.value)
}

// 關閉事件（可 emit 或控制外層狀態）
const handleClose = () => {
  console.log('關閉註冊視窗')
  // TODO: emit('close') 或控制父層 v-if
}
</script>

  
  <style>
  /* 全域設定 */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  /* 設定背景與置中 */
  body {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(90deg, #e2e2e2, #c9d6ff);
  }
  
  /* 容器設定 */
  .container {
    width: 900px;
    background: #f0f9f8;
    border-radius: 30px;
    box-shadow: 0 0 30px rgba(0, 0, 0, .2);
    padding: 40px;
  }
  
  /* 表單主體 */
  .form-box {
  position: relative; /* 為了讓 close-btn 定位於其內部 */
  color: #333;
}

  
  /* 輸入框區塊 */
  .input-box {
    position: relative;
    margin: 20px 0;
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
    justify-content: center;        /* 水平置中 */
    gap: 20px;                      /* 區塊之間的間距 */
    margin-bottom: 20px;
    flex-wrap: wrap;                /* 小螢幕時換行 */
  }
  
  /* 單一圖片上傳區塊 */
  .file-upload {
    display: flex;
    flex-direction: column;
  }
  
  /* 圖片上傳虛線框設定 */
  .image-upload-wrap {
    border: 4px dashed #9b9b9b;     /* 虛線框樣式 */
    background-color: #fff;         /* 背景白色 */
    color: #888888;
    padding: 20px;
    text-align: center;
    border-radius: 8px;
  
    width: 300px;                   /* 固定寬度 */
    height: 200px;                  /* 固定高度 */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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

.close-btn:hover {
  color: #ff9800;
}


  </style>
  