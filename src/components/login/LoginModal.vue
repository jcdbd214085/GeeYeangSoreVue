<template>

    <!-- 隱私權政策 Modal -->
<div class="modal-overlay" v-if="showPrivacyModal">
  <div class="modal-content">
    <h2>隱私權政策</h2>
    <div class="modal-body">
      <p>歡迎您使用【居研所租屋平台】（以下簡稱「本平台」）所提供的各項服務。為了保護您的個人資料與隱私權，本平台依據《個人資料保護法》制定本政策，請您詳閱下列內容。</p>

      <h3>一、資料蒐集目的與使用範圍</h3>
      <ul>
        <li>建立與管理會員帳號</li>
        <li>供租屋刊登、搜尋與交易聯繫</li>
        <li>驗證身分與防範詐騙</li>
        <li>推薦合適物件與提供客服服務</li>
        <li>法律或主管機關要求之配合事項</li>
      </ul>

      <h3>二、蒐集之個人資料種類</h3>
      <ul>
        <li>基本資料：姓名、手機、電子信箱、居住地</li>
        <li>身分驗證資料：身分證影本、房東證明、房客合約</li>
        <li>交易資訊：租賃紀錄、付款紀錄、訊息往來紀錄</li>
        <li>裝置資訊：IP 位址、裝置類型、瀏覽器、作業系統等</li>
      </ul>

      <h3>三、資料保存與保護措施</h3>
      <p>您的個人資料將保存在本平台及其委託廠商設立的資料庫中，並採用防火牆、加密與存取控制等資訊安全技術加以保護。</p>

      <h3>四、資料揭露對象與方式</h3>
      <p>僅於以下情況揭露您的個人資料：經您同意、法律要求、完成租賃服務所需。</p>

      <h3>五、Cookie 之使用</h3>
      <p>本平台可能使用 Cookie 技術來記錄與追蹤您的偏好與操作行為。</p>

      <h3>六、您的權利</h3>
      <ul>
        <li>查詢或請求閱覽</li>
        <li>請求製給複製本</li>
        <li>請求補充或更正</li>
        <li>請求停止蒐集、處理或利用</li>
        <li>請求刪除</li>
      </ul>
      <p>如需行使權利請聯繫：<strong>support@ju-yan.com</strong></p>

      <h3>七、政策修訂</h3>
      <p>本平台保留隨時修改本政策內容之權利，建議定期查閱。</p>

      <p class="text-sm text-gray-500">更新日期：2025 年 5 月 7 日</p>
    </div>
    <button class="modal-close" @click="showPrivacyModal = false">關閉</button>
  </div>
</div>


    <!-- 單一根元素：用 isRegister 狀態切換 class -->
    <div class="container" :class="{ active: isRegister }">
      <!-- 關閉按鈕 -->
      <button v-if="showCloseBtn" class="close-btn" @click="handleClose">×</button>
  
      <!-- 登入表單 -->
      <div class="form-box login">
        <form @submit.prevent="handleLogin">
          <h1>會員登入</h1>
          <div class="input-box">
            <input v-model="login.username" type="text" placeholder="電子信箱" required />
            <i class="fa-solid fa-envelope"></i>
          </div>
          <div class="input-box">
            <input
              v-model="login.password"
              :type="showLoginPassword ? 'text' : 'password'"
              placeholder="密碼"
              required
            />
            <div class="eye-icon-wrapper" @click="showLoginPassword = !showLoginPassword">
              <i :class="showLoginPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
            </div>
          </div>
  
          <div class="forgot-link"><a href="#">忘記密碼?</a></div>
          <button class="btn">登入</button>
          <p>——使用其他方式登入——</p>
          <div class="social-icons">
            <!-- Google登入icon -->
            <button class="social-btn google-btn">
              <span class="icon-circle">
                <i class="fa-brands fa-google"></i>
              </span>
              <span class="btn-text">使用 Google 登入</span>
            </button>
          </div>
        </form>
      </div>
  
      <!-- 註冊表單 -->
      <div class="form-box register">
        <form @submit.prevent="handleRegister">
          <h1>會員註冊</h1>
          <div class="input-box">
            <input v-model="register.username" type="text" placeholder="姓名" required />
            <i class="fa-solid fa-user"></i>
          </div>
          <div class="input-box">
            <input v-model="register.userphone" type="text" placeholder="手機" required />
            <i class="fa-solid fa-phone"></i>
          </div>
          <div class="input-box">
            <input v-model="register.email" type="email" placeholder="電子信箱" required />
            <i class="fa-solid fa-envelope"></i>
          </div>
          <div class="input-box">
            <input
              v-model="register.password"
              :type="showRegisterPassword ? 'text' : 'password'"
              placeholder="密碼"
              required
            />
            <div class="eye-icon-wrapper" @click="showRegisterPassword = !showRegisterPassword">
              <i :class="showRegisterPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
            </div>
          </div>

<!-- 同意條款勾選 -->
<div class="input-box agree-box">
  <label class="agree-label">
    <input type="checkbox" v-model="agreePolicy" />
    <span>
      我已閱讀並同意
      <a href="#" @click.prevent="showPrivacyModal = true">隱私權政策</a>
    </span>
  </label>
</div>


          <!-- 驗證碼欄位與發送按鈕：並排放置 -->
          <div class="input-box verify-box">
            <input v-model="register.verificationCode" type="text" placeholder="請輸入驗證碼" required />
            <button
  type="button"
  class="verify-btn"
  :class="{ 'disabled-btn': countdown > 0 }"
  :disabled="countdown > 0"
  @click="sendVerificationCode"
>
<span v-if="countdown > 0">
  <div>{{ countdown }} 秒後</div>
  <div>可重新發送</div>
</span>
<span v-else>
  {{ resendText }}
</span>

</button>
          </div>
  
          <button class="btn">註冊</button>
        </form>
      </div>
  
      <!-- 切換面板 -->
      <div class="toggle-box">
        <div class="toggle-panel toggle-left">
          <h1>居研所</h1>
          <p>用心研究每一個家的可能性。</p>
          <button class="btn" @click="showRegister">註冊會員</button>
        </div>
        <div class="toggle-panel toggle-right">
          <h1>居研所</h1>
          <p>讓數據，帶你回家。</p>
          <button class="btn" @click="showLogin">登入會員</button>
        </div>
      </div>
    </div>
  </template>
  
  

  <script setup>
  // 引入 Composition API
  import { ref, onMounted } from 'vue'
  
  // 控制是否顯示註冊頁面（切換用）
  const isRegister = ref(false)
  
  // 控制是否顯示右上角關閉按鈕
  const showCloseBtn = ref(false)
  
  // 密碼顯示切換
  const showLoginPassword = ref(false)
  const showRegisterPassword = ref(false)
  
  // 驗證碼倒數
  const countdown = ref(0) // 初始為 0 表示可按
  const resendText = ref('發送驗證碼')
  let timer = null
  
  // 登入表單資料
  const login = ref({
    username: '',
    password: ''
  })
  
  // 註冊表單資料
  const register = ref({
    username: '',
    email: '',
    password: '',
    userphone: '',
    verificationCode: ''
  })
  
  // 點擊切換至註冊畫面
  const showRegister = () => {
    isRegister.value = true
    showCloseBtn.value = false
    setTimeout(() => {
      showCloseBtn.value = true
    }, 1800)
  }
  
  // 點擊切換至登入畫面
  const showLogin = () => {
    isRegister.value = false
    showCloseBtn.value = false
    setTimeout(() => {
      showCloseBtn.value = true
    }, 1800)
  }
  
  // 登入事件處理
  const handleLogin = () => {
    console.log('登入資料', login.value)
    // TODO: 呼叫 API 處理登入
  }
  
  // 註冊事件處理
  const handleRegister = () => {
  if (!agreePolicy.value) {
    alert('請勾選同意隱私權政策')
    return
  }

  console.log('註冊資料', register.value)
  // TODO: 呼叫 API 處理註冊
}

  
  // 發送驗證碼事件
  const sendVerificationCode = () => {
    if (countdown.value > 0) return // 防止重複點擊
  
    console.log('發送驗證碼至', register.value.email)
    resendText.value = '重新發送'
    countdown.value = 30
  
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  }
  
  // 關閉彈窗事件
  const handleClose = () => {
    console.log('關閉彈窗')
    // TODO: emit('close') 或控制外層變數
  }
  
// 是否同意隱私權政策
const agreePolicy = ref(false)
const showPrivacy = ref(false)
const showPrivacyModal = ref(false)



  onMounted(() => {
    showCloseBtn.value = true
  })
  </script>
  



<style>
/*  基本通用樣式初始化 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    text-decoration: none;
    list-style: none;
}

/*  設定整體頁面背景與置中 */
body {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(90deg, #e2e2e2, #c9d6ff);
}

/*  整個表單容器 */
.container {
    position: relative;
    width: 850px;
    height: 550px;
    background: #f0f9f8;
    margin: 20px;
    border-radius: 30px;
    box-shadow: 0 0 30px rgba(0, 0, 0, .2);
    overflow: hidden;
}

/*  表單內 h1 標題大小 */
.container h1 {
    font-size: 36px;
    margin: -10px 0;
}

/*  表單內 p 說明文字 */
.container p {
    font-size: 14.5px;
    margin: 15px 0;
}

/*  表單本體 */
form {
    width: 100%;
}

/*  登入/註冊表單框架 */
.form-box {
    position: absolute;
    right: 0;
    width: 50%;
    height: 100%;
    background: #f0f9f8;
    display: flex;
    align-items: center;
    color: #333;
    text-align: center;
    padding: 40px;
    z-index: 1;
    transition: .6s ease-in-out 1.2s, visibility 0s 1s;
}

/*  當 container 加上 active 類別時，表單往左移 */
.container.active .form-box {
    right: 50%;
}

/*  預設註冊表單隱藏 */
.form-box.register {
    visibility: hidden;
}

/*  切換為註冊模式後顯示註冊表單 */
.container.active .form-box.register {
    visibility: visible;
}

/*  單一輸入區塊容器 */
.input-box {
    position: relative;
    margin: 16px 0;
}

/*  文字輸入框 */
.input-box input {
    width: 100%;
    padding: 13px 50px 13px 20px;
    background: #ffffff; /*  改成白底 */
    border-radius: 8px;
    border: none;
    outline: none;
    font-size: 16px;
    color: #333;
    font-weight: 500;
}

/* 密碼眼睛 icon 的小網底容器 */
.eye-icon-wrapper {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 60px; /* 依需要調整寬度 */
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(163, 222, 215, 0.5); /* 白色半透明網底 */
  cursor: pointer;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  transition: background-color 0.3s;
}

/* 驗證碼倒數按鈕呈現唯讀狀態 */
.verify-btn.disabled-btn {
  background-color: #ccc;           /* 改成灰色背景 */
  cursor: not-allowed;              /* 滑鼠顯示禁止 */
  pointer-events: none;             /* 避免 hover 效果 */
  color: #727171;
}

/* 當滑鼠滑過 .eye-icon-wrapper 時的樣式 */
.eye-icon-wrapper:hover {
  background-color: #f8dfc6; /* 滑過時淡黃色提示 */
}


/* 設定 .eye-icon-wrapper 裡面的 <i> 標籤樣式 */
.eye-icon-wrapper i {
  font-size: 18px;
  color: #32a49c;
}


/*  placeholder 樣式 */
.input-box input::placeholder {
    color: #888;
    font-weight: 400;
}

/*  icon 圖示位置與大小 */
.input-box i {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 20px;
}

/*  忘記密碼連結容器 */
.forgot-link {
    margin: -15px 0 15px;
    text-align: right;
}

/*  忘記密碼連結樣式 */
.forgot-link a {
    font-size: 14.5px;
    color: #4ecdc4;
    font-weight: 500;
    transition: color 0.3s;
}

/*  滑鼠移上忘記密碼變橘色 */
.forgot-link a:hover {
    color: #ff9800;
}

/*  共用按鈕樣式 */
.btn {
    width: 100%;
    height: 48px;
    background: #32a49c;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .1);
    border: none;
    cursor: pointer;
    font-size: 16px;
    color: #f0f9f8;
    font-weight: 600;
}

/*  按鈕滑鼠懸停變橘色 */
.btn:hover {
    background-color: #ff9800;
    color: #ffffff;
}

/*  第三方登入圖示容器 */
.social-icons {
    display: flex;
    justify-content: center;
}

/*  註冊/登入 切換背景框 */
.toggle-box {
    position: absolute;
    width: 100%;
    height: 100%;
}

/*  切換動畫圓形背景 */
.toggle-box::before {
    content: '';
    position: absolute;
    left: -250%;
    width: 300%;
    height: 100%;
    background: #4ecdc4;
    border-radius: 150px;
    z-index: 2;
    transition: 1.8s ease-in-out;
}

/*  切換時背景移動 */
.container.active .toggle-box::before {
    left: 50%;
}

/*  左右切換面板（內含 logo、標語、按鈕） */
.toggle-panel {
    position: absolute;
    width: 50%;
    height: 100%;
    color: #f0f9f8;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 2;
    transition: .6s ease-in-out;
}

/*  左面板定位 */
.toggle-panel.toggle-left {
    left: 0;
    transition-delay: 1.2s;
}

/*  左面板切換時移出畫面 */
.container.active .toggle-panel.toggle-left {
    left: -50%;
    transition-delay: .6s;
}

/*  右面板定位 */
.toggle-panel.toggle-right {
    right: -50%;
    transition-delay: .6s;
}

/*  右面板切換時移入畫面 */
.container.active .toggle-panel.toggle-right {
    right: 0;
    transition-delay: 1.2s;
}

/*  面板內標語字體調整 */
.toggle-panel p {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 20px;
}

/*  面板內的切換按鈕 */
.toggle-panel .btn {
    width: 160px;
    height: 46px;
    background: transparent;
    border: 2px solid #f0f9f8;
    box-shadow: none;
}

/*  註冊 / 登入切換按鈕 hover：白底藍綠字 */
.toggle-panel .btn:hover {
    background-color: #ffffff;     /* 白底 */
    color: #4ecdc4;                /* 藍綠字 */
    border: 2px solid #4ecdc4;     /* 邊框也改成藍綠 */
    transition: all 0.3s ease;
}

/*  Google 登入按鈕 */
.google-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center; /*  垂直置中補強 */
    height: 48px;            /*  統一高度為 48px */
    gap: 10px;
    background-color: #f0f9f8;
    color: #DB4437;
    border: 2px solid #DB4437;
    border-radius: 6px;
    padding: 0 16px;          /*  左右 padding 固定，高度由 height 控制 */
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}


/*  Google 按鈕 hover 效果 */
.google-btn:hover {
    background-color: #DB4437;
    color: #ffffff;
}

/*  Google icon 圓形樣式 */
.icon-circle {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    color: #DB4437;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    font-size: 16px;
}

/*  驗證碼欄位容器（輸入+按鈕） */
.input-box.verify-box {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
}

/*  驗證碼輸入欄 */
.input-box.verify-box input {
    flex: 2;
    padding: 13px 20px;
}

/*  發送驗證碼按鈕 */
.verify-btn {
    flex: 1;
    height: 46px;
    background-color: #32a49c;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s;
}

/*  發送驗證碼按鈕 hover */
.verify-btn:hover {
    background-color: #ff9800;
}

/*  所有 fa-solid 圖示（如鎖頭、信封、人頭等）設定橘色 */
.fa-solid {
    color: #32a49c;
}

/*  關閉按鈕樣式 */
.close-btn {
  position: absolute;
  top: 15px;
  right: 20px;
  width: 28px;                     /* 固定寬度 */
  height: 28px;                    /* 固定高度 */
  background: #ffffff;            /* 白色圓底 */
  border: none;
  border-radius: 50%;             /* 做成圓形 */
  font-size: 18px;                /* 字體大小 */
  font-weight: bold;              /* X 加粗 */
  color: #32a49c;                 /* 字體顏色 */
  cursor: pointer;
  z-index: 10;
  display: flex;                  /* 讓 X 置中 */
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); /* 陰影感 */
  transition: background-color 0.3s, color 0.3s;
}

/* 當滑鼠滑過 .close-btn 時的樣式 */
.close-btn:hover {
  color: #ff9800;
}

/* 勾選隱私權條款區塊樣式 */
.input-box.agree-box {
  text-align: left;
  margin-top: 4px;
  margin-bottom: 10px;
  font-size: 14px;
  color: #555;
}

/* 包裹整個 checkbox 與文字 */
.agree-label {
  display: flex;
  align-items: center;
  gap: 8px;
  line-height: 1.6;
}

/* checkbox 本體樣式 */
.agree-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

/* 條款連結樣式 */
.agree-label a {
  color: #4e87cd;
  text-decoration: underline;
}

.agree-label a:hover {
  color: #ff9800;
}

/* Modal 內容區塊樣式 */
.modal-content {
  background: white;
  padding: 24px;
  width: 90%;
  max-width: 600px;
  border-radius: 10px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

/* Modal 區塊子標題 */
.modal-content p {
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20px;
}

/* Modal 背景遮罩樣式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}


.modal-content h2 {
  font-size: 24px;
  margin-bottom: 16px;
}

.modal-body h3 {
  margin-top: 16px;
  font-size: 18px;
  font-weight: bold;
}

.modal-body ul {
  padding-left: 20px;
  margin-top: 8px;
  font-size: 14px; /* ← 自訂字體大小 */
  line-height: 1.6; /* 建議加入行高，讓段落更清楚 */
}

/* 關閉按鈕效果 */
.modal-close {
  margin-top: 20px;
  background-color: #32a49c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}

.modal-close:hover {
  background-color: #ff9800;
}


/*  響應式設計：中小尺寸調整 */
@media screen and (max-width: 650px) {
    .container {
        height: calc(100vh - 40px);
    }

    .form-box {
        bottom: 0;
        width: 100%;
        height: 70%;
    }

    .container.active .form-box {
        right: 0;
        bottom: 30%;
    }

    .toggle-box::before {
        left: 0;
        top: -270%;
        width: 100%;
        height: 300%;
        border-radius: 20vw;
    }

    .container.active .toggle-box::before {
        left: 0;
        top: 70%;
    }

    .container.active .toggle-panel.toggle-left {
        left: 0;
        top: -30%;
    }

    .toggle-panel {
        width: 100%;
        height: 30%;
    }

    .toggle-panel.toggle-left {
        top: 0;
    }

    .toggle-panel.toggle-right {
        right: 0;
        bottom: -30%;
    }

    .container.active .toggle-panel.toggle-right {
        bottom: 0;
    }
}

/*  響應式設計：超小尺寸標題縮小 */
@media screen and (max-width: 400px) {
    .form-box {
        padding: 20px;
    }

    .toggle-panel h1 {
        font-size: 30px;
    }
}

</style>