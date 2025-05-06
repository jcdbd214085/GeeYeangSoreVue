<template>
  <div class="input-demo">
    <h1>Input 組件示範</h1>

    <div class="demo-section">
      <h2>基本使用</h2>
      <div class="demo-grid">
        <div class="demo-item">
          <h3>基本輸入框</h3>
          <Input v-model="basicInput" placeholder="請輸入文字" />
          <div class="demo-value">輸入值：{{ basicInput }}</div>
        </div>

        <div class="demo-item">
          <h3>帶標籤的輸入框</h3>
          <Input
            v-model="labeledInput"
            label="使用者名稱"
            placeholder="請輸入使用者名稱"
          />
          <div class="demo-value">輸入值：{{ labeledInput }}</div>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h2>不同狀態</h2>
      <div class="demo-grid">
        <div class="demo-item">
          <h3>禁用狀態</h3>
          <Input
            v-model="disabledInput"
            label="禁用輸入框"
            placeholder="此輸入框已被禁用"
            disabled
          />
        </div>

        <div class="demo-item">
          <h3>唯讀狀態</h3>
          <Input
            v-model="readonlyInput"
            label="唯讀輸入框"
            placeholder="此輸入框為唯讀"
            readonly
          />
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h2>帶圖示的輸入框</h2>
      <div class="demo-grid">
        <div class="demo-item">
          <h3>前綴圖示</h3>
          <Input
            v-model="prefixIconInput"
            placeholder="搜尋..."
            prefixIcon="fas fa-search"
          />
        </div>

        <div class="demo-item">
          <h3>後綴圖示</h3>
          <Input
            v-model="suffixIconInput"
            placeholder="請輸入密碼"
            type="password"
            suffixIcon="fas fa-eye"
          />
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h2>驗證與提示</h2>
      <div class="demo-grid">
        <div class="demo-item">
          <h3>錯誤狀態</h3>
          <Input
            v-model="errorInput"
            label="電子郵件"
            placeholder="請輸入電子郵件"
            error="請輸入有效的電子郵件地址"
          />
        </div>

        <div class="demo-item">
          <h3>提示文字</h3>
          <Input
            v-model="hintInput"
            label="密碼"
            type="password"
            placeholder="請輸入密碼"
            hint="密碼長度至少需要 8 個字元"
          />
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h2>字數限制</h2>
      <div class="demo-grid">
        <div class="demo-item">
          <h3>最大字數限制</h3>
          <Input
            v-model="maxLengthInput"
            label="自我介紹"
            placeholder="請輸入自我介紹"
            :maxlength="50"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Input from '@/components/input/Input.vue';

const basicInput = ref('');
const labeledInput = ref('');
const disabledInput = ref('禁用狀態的值');
const readonlyInput = ref('唯讀狀態的值');
const prefixIconInput = ref('');
const suffixIconInput = ref('');
const errorInput = ref('');
const hintInput = ref('');
const maxLengthInput = ref('');
</script>

<style scoped>
.input-demo {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
}

h1 {
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
}

.demo-section {
  margin-bottom: 3rem;
  padding: 1.5rem;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

h2 {
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.demo-item {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
}

h3 {
  color: #444;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.demo-value {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: #fff;
  border-radius: 0.25rem;
  font-size: 0.9rem;
  color: #666;
}
</style> 