<script setup>
import {ref} from 'vue'
import Input from '@/components/input/Input.vue'
import Button from "@/components/buttons/button.vue";

const name = ref('')
const email = ref('')
const phone = ref('')
const subject = ref('')
const message = ref('')
//ver1

function handleSubmit() {
  alert('模擬聯絡送出...')
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
        v-model="email"
        label="Email"
        type="email"
        placeholder="example@mail.com"
        prefix-icon="fa fa-envelope"
        :maxlength="50"
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
