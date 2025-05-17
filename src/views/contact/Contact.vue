<script setup>
import {ref} from 'vue'
import Input from '@/components/input/Input.vue'
import Button from "@/components/buttons/button.vue";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const name = ref('')
const email = ref('')
const phone = ref('')
const subject = ref('')
const message = ref('')

const data=ref({name,email,phone,subject,message})


function handleSubmit() {
  const contactData = {
    hEmail: email.value,
    hPhoneNumber: phone.value,
    hTitle: subject.value,
    hContent: message.value,

  };
  axios.post(`${API_BASE_URL}/api/contact/contact`, contactData, {
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  })

      .then(response => {
        console.log('送出成功', response.data);
      })
      .catch(error => {
        console.error('Error:', error.message);
      });
}



</script>

<template>
  <div class="container-xxl">
    <h3>聯絡我們</h3>
    <br>

    <Input
        v-model="name"
        label="姓名"
        placeholder="請輸入您的姓名"
        prefix-icon="fa fa-user"
        :maxlength="20"
    />


    <Input
        v-model="phone"
        label="手機號碼"
        type="tel"
        placeholder="0912-345-678"
        prefix-icon="fa fa-phone"
        :maxlength="20"
    />

    <Input
        v-model="subject"
        label="標題"
        placeholder="請輸入聯絡標題"
        prefix-icon="fa fa-tag"
        :maxlength="50"
    />

    <!-- 不修改 Input.vue，因此 message 用原生 textarea -->
    <div class="input-wrapper">
      <label for="message" class="input-label">內容</label>
      <div class="input-container">
        <textarea
            id="message"
            v-model="message"
            class="input-field"
            rows="5"
            maxlength="500"
            placeholder="請輸入您的訊息內容"
        ></textarea>
      </div>
      <div class="hint-message">{{ message.length }}/500 字</div>
    </div>
    <Button @click="handleSubmit">
      送出表單
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
</style>
