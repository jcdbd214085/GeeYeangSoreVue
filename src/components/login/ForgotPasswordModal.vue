<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-wrapper">
      <div class="modal-content small">
        <button class="close-btn" @click="$emit('close')">×</button>
        <h2>重設密碼</h2>
        <p>請輸入您的電子信箱，<br />我們會寄送重設密碼的連結給您。</p>
        <div class="input-box">
          <input
            v-model="email"
            type="email"
            placeholder="請輸入信箱"
            required
          />
          <i class="fa-solid fa-envelope"></i>
        </div>

        <button class="btn" @click="sendReset">發送</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const emit = defineEmits(["close"]);
const email = ref("");
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const sendReset = async () => {
  if (!email.value) {
    alert("請輸入信箱");
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/Auth/send-reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.value }),
    });

    const result = await res.json();
    if (res.ok && result.success) {
      alert("已發送重設信件，請至信箱確認");
      emit("close");
    } else {
      alert(result.message || "發送失敗");
    }
  } catch (err) {
    alert("發送失敗，請稍後再試");
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
  padding: 13px 20px 13px 60px;
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
</style>
