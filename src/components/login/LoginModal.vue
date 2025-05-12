<template>
  <!-- 單一根元素：用 isRegister 狀態切換 class -->
  <div class="container" :class="{ active: isRegister }">
    <!-- 關閉按鈕 -->
    <button v-if="showCloseBtn" class="close-btn" @click="handleClose">
      ×
    </button>

    <!-- 隱私權政策 -->
    <PrivacyPolicyModal
      :show="showPrivacyModal"
      @close="showPrivacyModal = false"
    />

    <!-- 登入表單 -->
    <div class="form-box login">
      <form @submit.prevent="handleLogin">
        <h1>會員登入</h1>
        <div class="input-box">
          <input
            v-model="login.username"
            type="text"
            placeholder="電子信箱"
            required
          />
          <i class="fa-solid fa-envelope"></i>
        </div>
        <div class="input-box">
          <input
            v-model="login.password"
            :type="showLoginPassword ? 'text' : 'password'"
            placeholder="密碼"
            required
          />
          <div
            class="eye-icon-wrapper"
            @click="showLoginPassword = !showLoginPassword"
          >
            <i
              :class="
                showLoginPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'
              "
            ></i>
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
          <input
            v-model="register.username"
            type="text"
            placeholder="姓名"
            required
          />
          <i class="fa-solid fa-user"></i>
        </div>
        <div class="input-box">
          <input
            v-model="register.userphone"
            type="text"
            placeholder="手機"
            required
            pattern="^09\d{8}$"
            title="請輸入正確的手機號碼（例如：0912345678）"
          />
          <i class="fa-solid fa-phone"></i>
        </div>
        <div class="input-box">
          <input
            v-model="register.email"
            type="email"
            placeholder="電子信箱"
            required
          />
          <i class="fa-solid fa-envelope"></i>
        </div>
        <!-- 註冊表單的密碼欄位 -->
        <div class="input-box">
          <input
            v-model="register.password"
            :type="showRegisterPassword ? 'text' : 'password'"
            placeholder="密碼"
            required
            ref="passwordInputRef"
            @input="
              register.passwordError = '';
              passwordInputRef.setCustomValidity('');
            "
          />
          <div
            class="eye-icon-wrapper"
            @click="showRegisterPassword = !showRegisterPassword"
          >
            <i
              :class="
                showRegisterPassword
                  ? 'fa-solid fa-eye-slash'
                  : 'fa-solid fa-eye'
              "
            ></i>
          </div>
        </div>

        <!-- 同意條款勾選 -->
        <div class="input-box agree-box">
          <label class="agree-label">
            <input
              type="checkbox"
              ref="agreeCheckboxRef"
              required
              @invalid="handleAgreeInvalid"
              @input="handleAgreeInput"
            />
            <span>
              我已閱讀並同意
              <a href="#" @click.prevent="showPrivacyModal = true"
                >隱私權政策</a
              >
            </span>
          </label>
          <!-- 錯誤訊息顯示區塊 -->
          <p v-if="agreeError" class="error-msg">
            {{ agreeError }}
          </p>
        </div>

        <!-- 驗證碼欄位與發送按鈕：並排放置 -->
        <div class="input-box verify-box">
          <input
            v-model="register.verificationCode"
            type="text"
            placeholder="請輸入驗證碼"
            required
          />
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
import { ref, onMounted } from "vue";

//引入隱私權政策
import PrivacyPolicyModal from "@/components/login/PrivacyPolicyModal.vue";
const agreeCheckboxRef = ref(null);
const agreeError = ref("");

// 控制是否顯示註冊頁面（切換用）
const isRegister = ref(false);

// 控制是否顯示右上角關閉按鈕
const showCloseBtn = ref(false);

// 密碼顯示切換
const showLoginPassword = ref(false);
const showRegisterPassword = ref(false);

// 密碼欄 input 的參考
const passwordInputRef = ref(null);

// 驗證碼倒數
const countdown = ref(0); // 初始為 0 表示可按
const resendText = ref("發送驗證碼");
let timer = null;

// 登入表單資料
const login = ref({
  username: "",
  password: "",
});

// 註冊表單資料
const register = ref({
  username: "",
  email: "",
  password: "",
  userphone: "",
  verificationCode: "",
  passwordError: "",
});

// 點擊切換至註冊畫面
const showRegister = () => {
  isRegister.value = true;
  showCloseBtn.value = false;
  setTimeout(() => {
    showCloseBtn.value = true;
  }, 1800);
};

// 點擊切換至登入畫面
const showLogin = () => {
  isRegister.value = false;
  showCloseBtn.value = false;
  setTimeout(() => {
    showCloseBtn.value = true;
  }, 1800);
};

// 登入事件處理
const handleLogin = () => {
  console.log("登入資料", login.value);
  // TODO: 呼叫 API 處理登入
};

// 註冊事件處理
const handleRegister = () => {
  register.value.passwordError = "";
  passwordInputRef.value?.setCustomValidity("");

  // 檢查是否同意隱私權政策
  // 處理 checkbox 被勾選與取消時的錯誤提示
  const handleAgreeInvalid = (e) => {
    e.target.setCustomValidity("請勾選同意隱私權政策");
  };

  const handleAgreeInput = (e) => {
    e.target.setCustomValidity(""); // 清除錯誤
  };

  // 檢查密碼格式
  const passwordError = validatePassword(
    register.value.password,
    register.value.email
  );
  if (passwordError) {
    register.value.passwordError = passwordError;
    passwordInputRef.value?.setCustomValidity(passwordError);
    passwordInputRef.value?.reportValidity();
    return;
  }

  console.log("註冊資料", register.value);
  // TODO: 呼叫 API 處理註冊
};

// 發送驗證碼事件
const sendVerificationCode = () => {
  if (countdown.value > 0) return; // 防止重複點擊

  console.log("發送驗證碼至", register.value.email);
  resendText.value = "重新發送";
  countdown.value = 30;

  timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
};

// 關閉彈窗事件
const handleClose = () => {
  console.log("關閉彈窗");
  // TODO: emit('close') 或控制外層變數
};

// 是否同意隱私權政策
const agreePolicy = ref(false);
const showPrivacy = ref(false);
const showPrivacyModal = ref(false);

// 加入密碼驗證邏輯
const validatePassword = (password, email) => {
  // 密碼正則：至少10字元，含大小寫、數字、特殊符號，不含空白
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[^\s]{10,}$/;

  if (password === email) {
    return "密碼不得與電子信箱相同";
  }

  if (!regex.test(password)) {
    return "密碼需至少10字元，包含大小寫英文字母、數字與特殊符號，且不可含空白";
  }

  return "";
};

onMounted(() => {
  showCloseBtn.value = true;
});
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
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

/* 彈窗響應式調整 */
/* 原本固定寬度 850px 改為百分比 + 最大寬度限制 */
/* .container {
  position: relative;
  width: 90%;
  max-width: 850px;
  height: 550px;
  background: #f0f9f8;
  margin: 20px auto; 
  border-radius: 30px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
} */


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
  transition: 0.6s ease-in-out 1.2s, visibility 0s 1s;
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
  background-color: #ccc; /* 改成灰色背景 */
  cursor: not-allowed; /* 滑鼠顯示禁止 */
  pointer-events: none; /* 避免 hover 效果 */
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
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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
  content: "";
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
  transition: 0.6s ease-in-out;
}

/*  左面板定位 */
.toggle-panel.toggle-left {
  left: 0;
  transition-delay: 1.2s;
}

/*  左面板切換時移出畫面 */
.container.active .toggle-panel.toggle-left {
  left: -50%;
  transition-delay: 0.6s;
}

/*  右面板定位 */
.toggle-panel.toggle-right {
  right: -50%;
  transition-delay: 0.6s;
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
  background-color: #ffffff; /* 白底 */
  color: #4ecdc4; /* 藍綠字 */
  border: 2px solid #4ecdc4; /* 邊框也改成藍綠 */
  transition: all 0.3s ease;
}

/*  Google 登入按鈕 */
.google-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center; /*  垂直置中補強 */
  height: 48px; /*  統一高度為 48px */
  gap: 10px;
  background-color: #f0f9f8;
  color: #db4437;
  border: 2px solid #db4437;
  border-radius: 6px;
  padding: 0 16px; /*  左右 padding 固定，高度由 height 控制 */
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

/*  Google 按鈕 hover 效果 */
.google-btn:hover {
  background-color: #db4437;
  color: #ffffff;
}

/*  Google icon 圓形樣式 */
.icon-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  color: #db4437;
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
  width: 28px; /* 固定寬度 */
  height: 28px; /* 固定高度 */
  background: #ffffff; /* 白色圓底 */
  border: none;
  border-radius: 50%; /* 做成圓形 */
  font-size: 18px; /* 字體大小 */
  font-weight: bold; /* X 加粗 */
  color: #32a49c; /* 字體顏色 */
  cursor: pointer;
  z-index: 10;
  display: flex; /* 讓 X 置中 */
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
