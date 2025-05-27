<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-wrapper">
      <div class="modal-content">
        <!-- 單一根元素：用 isRegister 狀態切換 class -->
        <div class="container" :class="{ active: isRegister }">
          <!-- 關閉按鈕 -->
          <button v-if="showCloseBtn" class="close-btn" @click="$emit('close')">
            ×
          </button>

          <!-- 隱私權政策 -->
          <PrivacyPolicyModal :show="showPrivacyModal" @close="showPrivacyModal = false" />

          <!-- 登入表單 -->
          <div class="form-box login">
            <form @submit.prevent="handleLogin">
              <h1>會員登入</h1>
              <div class="input-box">
                <input v-model="login.username" type="text" placeholder="電子信箱" required />
                <i class="fa-solid fa-envelope"></i>
              </div>
              <div class="input-box">
                <input v-model="login.password" :type="showLoginPassword ? 'text' : 'password'" placeholder="密碼"
                  required />
                <div class="eye-icon-wrapper" @click="showLoginPassword = !showLoginPassword">
                  <i :class="showLoginPassword
                    ? 'fa-solid fa-eye-slash'
                    : 'fa-solid fa-eye'
                    "></i>
                </div>
              </div>

              <div class="forgot-link">
  <a href="#" @click.prevent="showForgotPasswordModal = true">忘記密碼?</a>
</div>
              <button class="btn">登入</button>
              <p>——使用其他方式登入——</p>
              <div class="social-icons">
                <!-- Google登入按鈕 -->
                <div class="google-btn"></div>
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
                <input v-model="register.userphone" type="text" placeholder="手機" required pattern="^09\d{8}$"
                  title="請輸入正確的手機號碼（例如：0912345678）" />
                <i class="fa-solid fa-phone"></i>
              </div>
              <div class="input-box">
                <input v-model="register.email" type="email" placeholder="電子信箱" required />
                <i class="fa-solid fa-envelope"></i>
              </div>
              <!-- 註冊表單的密碼欄位 -->
              <div class="input-box">
                <input v-model="register.password" :type="showRegisterPassword ? 'text' : 'password'" placeholder="密碼"
                  required ref="passwordInputRef" @input="
                    register.passwordError = '';
                  passwordInputRef.setCustomValidity('');
                  " />
                <div class="eye-icon-wrapper" @click="showRegisterPassword = !showRegisterPassword">
                  <i :class="showRegisterPassword
                    ? 'fa-solid fa-eye-slash'
                    : 'fa-solid fa-eye'
                    "></i>
                </div>
              </div>

              <!-- 同意條款勾選 -->
              <div class="input-box agree-box">
                <label class="agree-label">
                  <input type="checkbox" ref="agreeCheckboxRef" required @invalid="handleAgreeInvalid"
                    @input="handleAgreeInput" />
                  <span>
                    我已閱讀並同意
                    <a href="#" @click.prevent="showPrivacyModal = true">隱私權政策</a>
                  </span>
                </label>
                <!-- 錯誤訊息顯示區塊 -->
                <p v-if="agreeError" class="error-msg">
                  {{ agreeError }}
                </p>
              </div>

              <!-- 驗證碼欄位與發送按鈕：並排放置 -->
              <div class="input-box verify-box">
                <input v-model="register.verificationCode" type="text" placeholder="請輸入驗證碼" required />
                <button type="button" class="verify-btn" :class="{ 'disabled-btn': countdown > 0 }"
                  :disabled="countdown > 0" @click="sendVerificationCode">
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
      </div>
    </div>
  </div>
  <!-- 忘記密碼 -->
<ForgotPasswordModal
  v-if="showForgotPasswordModal"
  @close="handleForgotClose"
/>

</template>

<script setup>
// 引入 Composition API
import { ref, onMounted } from "vue";
import { useToast } from 'vue-toastification';
const toast = useToast();
// 加入 defineEmits
const emit = defineEmits(["close"]);

//加入忘記密碼彈窗 控制回登入畫面刷新
const handleForgotClose = () => {
  showForgotPasswordModal.value = false;
  // 重置登入表單
  login.value = {
    username: '',
    password: ''
  };
  showLogin(); // 回到登入畫面
};


//引入隱私權政策
import PrivacyPolicyModal from "@/components/login/PrivacyPolicyModal.vue";
import { useUserStore } from "@/stores/user";
import { useFavoriteStore } from '@/stores/favoriteStore.js'
const favoriteStore = useFavoriteStore()
const userStore = useUserStore();
const agreeCheckboxRef = ref(null);
const agreeError = ref("");

//引入忘記密碼
import ForgotPasswordModal from "@/components/login/ForgotPasswordModal.vue";
const showForgotPasswordModal = ref(false);


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
const isSending = ref(false); // 是否正在發送驗證碼

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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
// 用 base URL 拼接 SignalR Hub 位置
const SIGNALR_URL = `${API_BASE_URL}/hub`;

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
const handleLogin = async () => {
  try {
    // ✅ Step 1：取得 reCAPTCHA token（正式環境：驗證失敗就 return）
    let recaptchaToken = '';
    try {
      await new Promise(resolve => grecaptcha.ready(resolve));
      recaptchaToken = await grecaptcha.execute('6Ldt9T4rAAAAAG-4q6vmfn9XZIcRhjhczfEUNGyw', { action: 'login' });
    } catch (err) {
      console.error('❌ 無法取得 Google reCAPTCHA 驗證，拒絕登入', err);
      toast.error("系統驗證失敗，請重新整理頁面或稍後再試");
      return;
    }


    const res = await fetch(`${API_BASE_URL}/api/Auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 若需帶 cookie/session
      body: JSON.stringify({
        txtAccount: login.value.username,
        txtPassword: login.value.password,
        recaptchaToken: recaptchaToken, // ✅ 加入reCAPTCHA token
      }),
    });

    // 檢查 HTTP 狀態碼
const data = await res.json();
console.log('Backend login success data:', data); // ✅ 新增：印出後端返回的成功資料

if (res.status === 401) {
  console.warn("登入失敗，401 未授權", data);
  toast.error(data.message || "帳號或密碼錯誤");
  return;
}

if (!res.ok) {
  console.error("登入失敗，非 200 回應", data);
  toast.error(data.message || "伺服器錯誤，請稍後再試");
  return;
}

if (data.success) {
  userStore.login(
    data.role || "tenant",
    data.userName || data.user || "",
    data.isLandlord || false
  );
  
  await favoriteStore.fetchFavorites();
  if (favoriteStore.pendingFavoriteId) {
    await favoriteStore.addFavorite(favoriteStore.pendingFavoriteId);
    favoriteStore.pendingFavoriteId = null;
  }

  toast.success("登入成功！歡迎回來");
  emit("close");
} else {
  console.warn("登入回傳 success: false", data);
  toast.error(data.message || "登入失敗");
}
  } catch (err) {
  console.error("登入發生例外錯誤", err);
  toast.error(err.message || "登入時發生錯誤");
}


};

// 註冊事件處理
const handleRegister = async () => {
  register.value.passwordError = "";
  passwordInputRef.value?.setCustomValidity("");

  // ✅ 密碼格式驗證
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

  // ✅ 建立傳送資料物件
  const requestData = {
    userName: register.value.username,
    email: register.value.email,
    password: register.value.password,
    phone: register.value.userphone,
    isAgreePolicy: true, // 勾選隱私權條款後才可送出表單
    verificationCode: register.value.verificationCode,
  };

  try {
    const res = await fetch(`${API_BASE_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(requestData),
    });

if (!res.ok) {
  const errRes = await res.json();
  console.error("註冊失敗", errRes);
  toast.error(errRes.message || "註冊失敗");
  return;
}

const result = await res.json();
if (result.success) {
  console.log("註冊成功", result);
  toast.success(result.message || "註冊成功，請登入");
  showLogin();
} else {
  console.warn("註冊回傳失敗", result);
  toast.error(result.message || "註冊失敗");
}

} catch (err) {
  console.error("註冊發生例外", err);
  toast.error("註冊時發生錯誤，請稍後再試");
}

};

// 發送驗證碼事件
const sendVerificationCode = async () => {
  if (countdown.value > 0 || isSending.value) return; // 防止重複點擊

if (!register.value.email) {
  console.warn("使用者尚未輸入 email");
  toast.warning("請先輸入電子信箱");
  return;
}

  isSending.value = true; // 鎖定按鈕

  try {
    const res = await fetch(`${API_BASE_URL}/api/EmailToken/send-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userEmail: register.value.email,
        device: "web", // 裝置資訊可選
      }),
    });

const result = await res.text(); // 回傳是字串

if (!res.ok) {
  console.error("驗證碼 API 回傳錯誤", result);
  throw new Error(result || "發送驗證碼失敗");
}

console.log("驗證碼發送成功", result);
toast.success(result || "驗證碼已發送，請查看信箱 📩");


    // ✅ 開始倒數
    resendText.value = "重新發送";
    countdown.value = 30;
    timer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        clearInterval(timer);
      }
    }, 1000);
  } catch (err) {
  console.error("發送驗證碼錯誤", err);
  toast.error(err.message || "寄送驗證碼時發生錯誤");
  } finally {
    isSending.value = false; // 發送結束解除鎖定
  }
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

// Google Sign-In 相關
const handleGoogleLogin = async (response) => {
console.log('Google response credential:', response.credential); // <-- 加入這行
  try {
    const res = await fetch(`${API_BASE_URL}/api/Auth/google-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        IdToken: response.credential
      }),
      credentials: 'include'
    });

    if (!res.ok) {
      throw new Error('登入失敗');
    }

    const data = await res.json();
    userStore.login(data.role, data.userName, data.isLandlord);
    toast.success("登入成功");
    emit("close");
  } catch (error) {
    console.error('Google 登入失敗:', error);
    toast.error("登入失敗，請稍後再試");
  }
};

onMounted(() => {
  showCloseBtn.value = true;
  // 初始化 Google Sign-In
  google.accounts.id.initialize({
    client_id: '835488722462-hhtddl6onev0cp4m8fvpb6v5tq59a0gu.apps.googleusercontent.com', // 請替換成您的 Google Client ID
    callback: handleGoogleLogin,
    auto_select: false,
    cancel_on_tap_outside: true
  });

  // 渲染 Google 登入按鈕
  google.accounts.id.renderButton(
    document.querySelector('.google-btn'),
    { 
      type: 'standard',
      theme: 'outline',
      size: 'large',
      width: '100%',
      text: 'signin_with'
    }
  );
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-wrapper {
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  box-shadow: none;
  border: none;
  background-color: transparent;
}

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
  background: #ffffff;
  /*  改成白底 */
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
  width: 60px;
  /* 依需要調整寬度 */
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(163, 222, 215, 0.5);
  /* 白色半透明網底 */
  cursor: pointer;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  transition: background-color 0.3s;
}

/* 驗證碼倒數按鈕呈現唯讀狀態 */
.verify-btn.disabled-btn {
  background-color: #ccc;
  /* 改成灰色背景 */
  cursor: not-allowed;
  /* 滑鼠顯示禁止 */
  pointer-events: none;
  /* 避免 hover 效果 */
  color: #727171;
}

/* 當滑鼠滑過 .eye-icon-wrapper 時的樣式 */
.eye-icon-wrapper:hover {
  background-color: #f8dfc6;
  /* 滑過時淡黃色提示 */
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

/* Google 登入按鈕樣式 */
.google-btn {
  transition: all 0.3s ease;
}

.google-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
  background-color: #ffffff;
  /* 白底 */
  color: #4ecdc4;
  /* 藍綠字 */
  border: 2px solid #4ecdc4;
  /* 邊框也改成藍綠 */
  transition: all 0.3s ease;
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
  width: 28px;
  /* 固定寬度 */
  height: 28px;
  /* 固定高度 */
  background: #ffffff;
  /* 白色圓底 */
  border: none;
  border-radius: 50%;
  /* 做成圓形 */
  font-size: 18px;
  /* 字體大小 */
  font-weight: bold;
  /* X 加粗 */
  color: #32a49c;
  /* 字體顏色 */
  cursor: pointer;
  z-index: 10;
  display: flex;
  /* 讓 X 置中 */
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  /* 陰影感 */
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

/* 隱藏 Chrome/Edge 的密碼顯示按鈕 */
input[type="password"]::-ms-reveal,
input[type="password"]::-ms-clear,
input[type="password"]::-webkit-credentials-auto-fill-button,
input[type="password"]::-webkit-input-password-toggle-button {
  display: none !important;
}
</style>
