<script setup>
import {ref} from 'vue'
import Input from '@/components/input/Input.vue'
import Button from "@/components/buttons/button.vue";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const name = ref('')
const phone = ref('')
const subject = ref('')
const message = ref('')
const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref('')

const validateForm = () => {
  if (!phone.value || !subject.value || !message.value) {
    submitError.value = '請填寫所有必填欄位';
    return false;
  }

  // // 驗證 email 格式
  // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // if (!emailRegex.test(email.value)) {
  //   submitError.value = '請輸入有效的電子郵件地址';
  //   return false;
  // }

  // 驗證電話號碼格式 (台灣手機號碼)
  const phoneRegex = /^09\d{8}$/;
  if (!phoneRegex.test(phone.value.replace(/-/g, ''))) {
    submitError.value = '請輸入有效的手機號碼';
    return false;
  }

  return true;
}


// 修改後的 handleSubmit 函數
async function handleSubmit() {
  // 重置提交狀態
  isSubmitting.value = true;
  submitSuccess.value = false;
  submitError.value = '';

  if (!validateForm()) {
    isSubmitting.value = false;
    return;
  }

  try {

    const username = localStorage.getItem('username')

    console.log(username)
    const contactData = {
      HEmail: 'no-email@example.com',
      HPhoneNumber: phone.value,
      HTitle: subject.value,
      HContent: message.value,
      HStatus: true
    };

    const response = await axios.post(
        `${API_BASE_URL}/api/Contact/contact`,
        contactData,
        {
          headers: {'Content-Type': 'application/json'},
          withCredentials: true
        }
    );

    console.log('送出成功', response.data);
    submitSuccess.value = true;

    // 清空表單
    name.value = '';
    phone.value = '';
    subject.value = '';
    message.value = '';

  } catch (error) {
    console.error('Error:', error);
    submitError.value = '提交失敗，請稍後再試或聯繫管理員';
  } finally {
    isSubmitting.value = false;
  }
}

</script>

<template>
  <div class="container-xxl">
    <h3>聯絡我們</h3>
    <br>

    <!-- 添加成功提示 -->
    <div v-if="submitSuccess" class="alert alert-success">
      您的訊息已成功送出！我們會盡快回覆您。
    </div>

    <!-- 添加錯誤提示 -->
    <div v-if="submitError" class="alert alert-danger">
      {{ submitError }}
    </div>

    <Input
        v-model="name"
        label="姓名"
        placeholder="請輸入您的姓名"
        prefix-icon="fa fa-user"
        :maxlength="20"
    />

    <!--    <Input-->
    <!--        v-model="email"-->
    <!--        label="電子郵件"-->
    <!--        type="email"-->
    <!--        placeholder="example@example.com"-->
    <!--        prefix-icon="fa fa-envelope"-->
    <!--        :maxlength="225"-->
    <!--        required-->
    <!--    />-->

    <Input
        v-model="phone"
        label="手機號碼"
        type="tel"
        placeholder="0912-345-678"
        prefix-icon="fa fa-phone"
        :maxlength="20"
        required
    />

    <Input
        v-model="subject"
        label="標題"
        placeholder="請輸入聯絡標題"
        prefix-icon="fa fa-tag"
        :maxlength="50"
        required
    />

    <!-- 不修改 Input.vue，因此 message 用原生 textarea -->
    <div class="input-wrapper">
      <label for="message" class="input-label">內容 <span class="required">*</span></label>
      <div class="input-container">
        <textarea
            id="message"
            v-model="message"
            class="input-field"
            rows="5"
            maxlength="500"
            placeholder="請輸入您的訊息內容"
            required
        ></textarea>
      </div>
      <div class="hint-message">{{ message.length }}/500 字</div>
    </div>
    <Button @click="handleSubmit" :disabled="isSubmitting">
      {{ isSubmitting ? '提交中...' : '送出表單' }}
    </Button>
  </div>
</template>

<style scoped>
.input-wrapper {
  margin-bottom: 1rem;
}

.input-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 0.9rem;
  font-weight: 500;
}

.required {
  color: red;
}

.input-container {
  position: relative;
}

.input-field {
  width: 100%;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  background: #fff;
  transition: all 0.2s;
  resize: vertical;
}

.input-field:focus {
  outline: none;
  border-color: var(--main-color, #3cddd2);
  box-shadow: 0 0 0 3px rgba(60, 221, 210, 0.1);
}

.hint-message {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #666;
}

.alert {
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>