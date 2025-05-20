<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-wrapper">
      <div class="modal-content small">
        <button class="close-btn" @click="$emit('close')">×</button>

        <template v-if="step === 1">
          <h2>重設密碼</h2>
          <p>請輸入您的電子信箱，<br />我們會寄送驗證碼給您。</p>
          <div class="input-box">
            <input v-model="email" type="email" placeholder="請輸入信箱" required />
            <i class="fa-solid fa-envelope"></i>
          </div>
          <button class="btn" @click="sendCode">發送驗證碼</button>
        </template>

        <template v-else-if="step === 2">
          <h2>輸入驗證碼</h2>
          <p>驗證碼已發送至 {{ email }}，請於 {{ countdown }} 秒內輸入。</p>
          <div class="input-box">
            <input v-model="code" type="text" placeholder="請輸入驗證碼" required />
            <i class="fa-solid fa-key"></i>
          </div>
          <button class="btn" @click="verifyCode">送出驗證碼</button>
        </template>

        <template v-else-if="step === 3">
          <h2>設定新密碼</h2>
          <p>請輸入符合規則的新密碼。</p>
          <div class="input-box">
<input
  v-model="newPassword"
  :type="showPassword ? 'text' : 'password'" 
  placeholder="請輸入新密碼"
  required
  @input="passwordError = ''"
/>

            <i class="fa-solid fa-lock"></i>

<!-- 眼睛圖示按鈕 -->
<button
  type="button"
  class="toggle-eye-btn"
  @click="showPassword = !showPassword"
>
  <i 
  :class="[
    showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye',
    'eye-icon'
  ]"
></i>
</button>

          </div>
          <p v-if="passwordError" class="error-msg">{{ passwordError }}</p>
          <button class="btn" @click="resetPassword">重設密碼</button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
//引入吐司提示
import { useToast } from 'vue-toastification';
const toast = useToast();


const emit = defineEmits(['close']);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const step = ref(1);
const email = ref('');
const code = ref('');
const newPassword = ref('');
const passwordError = ref('');
const countdown = ref(600); // 5分鐘倒數
let timer = null;

const router = useRouter();

const showPassword = ref(false); // 控制密碼顯示/隱藏

const startCountdown = () => {
  timer = setInterval(() => {
    countdown.value--;
if (countdown.value <= 0) {
  clearInterval(timer);
  if (step.value === 2) {
    console.warn("驗證碼過期");
    toast.warning("驗證碼已過期，請重新申請。");
    step.value = 1;
  }
}
  }, 1000);
};

const sendCode = async () => {
  if (!email.value) {
  toast.warning('請輸入信箱');
  return;
}

try {
  const res = await fetch(`${API_BASE_URL}/api/forgot-password/send-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.value })
  });

  const result = await res.json();

  if (res.ok && result.success) {
    console.log("驗證碼發送成功", result);
    toast.success('驗證碼已發送，請至信箱查收');
    step.value = 2;
    countdown.value = 600;
    startCountdown();
  } else {
    console.warn("發送失敗", result);
    toast.error(result.message || '發送失敗');
  }
} catch (err) {
  console.error("發送驗證碼錯誤", err);
  toast.error('發送失敗，請稍後再試');
}
};

const verifyCode = async () => {
  try {
  const res = await fetch(`${API_BASE_URL}/api/forgot-password/verify-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.value, code: code.value })
  });

  const result = await res.json();

  if (res.ok && result.success) {
    step.value = 3;
  } else {
    console.warn("驗證碼錯誤", result);
    toast.error(result.message || '驗證失敗');
  }
} catch (err) {
  console.error("驗證碼驗證失敗", err);
  toast.error('驗證失敗，請稍後再試');
}
};

const validatePassword = (password, email) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[^\s]{10,}$/;
  if (password === email) return '密碼不得與電子信箱相同';
  if (!regex.test(password))
    return '密碼需至少10字元，包含大小寫英文字母、數字與特殊符號，且不可含空白';
  return '';
};


const resetPassword = async () => {
  passwordError.value = validatePassword(newPassword.value, email.value);
  if (passwordError.value) return;

  try {
  const res = await fetch(`${API_BASE_URL}/api/forgot-password/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email.value,
      code: code.value,
      newPassword: newPassword.value
    })
  });

  const result = await res.json();

  if (res.ok && result.success) {
    console.log("密碼重設成功", result);
    toast.success('密碼重設成功，請重新登入');
    emit('close');
  } else {
    console.warn("密碼重設失敗", result);
    toast.error(result.message || '密碼重設失敗');
  }
} catch (err) {
  console.error("密碼重設發生錯誤", err);
  toast.error('密碼重設失敗，請稍後再試');
}
};
</script>

<style scoped>
.modal-content.small {
  padding: 30px;
  border-radius: 12px;
  max-width: 400px;
  width: 100%;
}
input {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border-radius: 6px;
  border: 1px solid #ccc;
}

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
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: #f0f9f8;
  padding: 40px;
  border-radius: 30px;
  width: 400px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
  position: relative;
  text-align: center;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 20px;
  width: 28px;
  height: 28px;
  background: #ffffff;
  border: none;
  border-radius: 50%;
  font-size: 18px;
  font-weight: bold;
  color: #32a49c;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, color 0.3s;
}

.close-btn:hover {
  color: #ff9800;
}

h2 {
  font-size: 28px;
  margin-bottom: 10px;
  color: #333;
}

p {
  font-size: 15px;
  color: #666;
  margin-bottom: 20px;
}

input[type="email"] {
  width: 100%;
  padding: 13px 20px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  background: #fff;
  color: #333;
  font-weight: 500;
  margin-bottom: 20px;
  outline: none;
}

input::placeholder {
  color: #888;
  font-weight: 400;
}

.btn {
  width: 100%;
  height: 48px;
  background: #ff4800;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #f0f9f8;
  font-weight: 600;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #ff9800;
  color: #ffffff;
}

.input-box {
  position: relative;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.input-box input {
  width: 100%;
  padding: 13px 48px 13px 60px; /* 預留右側48px空間放眼睛 */
  background: #ffffff;
  border-radius: 8px;
  border: none;
  outline: none;
  font-size: 16px;
  color: #333;
  font-weight: 500;
  line-height: 1.4;
  height: 48px;
  display: block;
  margin: 0;
}

.input-box i {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #b2ddd8;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  color: #32a49c;
  font-size: 18px;
  pointer-events: none;
  box-sizing: border-box;
}

/* 眼睛 */
.toggle-eye-btn {
  position: absolute;
  right: 0;
  top: 0;
  width: 48px;
  height: 100%;
  border: none;
  background: none;
  color: #999;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
}

.eye-icon {
  background: none !important; /* 移除背景 */
  pointer-events: none;
}


</style>
