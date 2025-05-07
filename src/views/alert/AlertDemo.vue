<template>
  <div class="alert-demo">
    <h1>Alert 組件示範</h1>
    
    <div class="demo-section">
      <h2>基本使用</h2>
      <div class="button-group">
        <button class="demo-btn" @click="showBasicAlert">基本提示</button>
        <button class="demo-btn" @click="showCustomAlert">自定義內容</button>
      </div>
    </div>

    <div class="demo-section">
      <h2>不同類型</h2>
      <div class="button-group">
        <button class="demo-btn info" @click="showInfoAlert">資訊提示</button>
        <button class="demo-btn success" @click="showSuccessAlert">成功提示</button>
        <button class="demo-btn warning" @click="showWarningAlert">警告提示</button>
        <button class="demo-btn error" @click="showErrorAlert">錯誤提示</button>
      </div>
    </div>

    <div class="demo-section">
      <h2>自定義按鈕文字</h2>
      <div class="button-group">
        <button class="demo-btn" @click="showCustomButtonAlert">自定義按鈕</button>
      </div>
    </div>

    <div class="demo-section">
      <h2>常見情境</h2>
      <div class="button-group">
        <button class="demo-btn error" @click="showLoginFailAlert">登入失敗</button>
        <button class="demo-btn success" @click="showApplySuccessAlert">申請成功</button>
        <button class="demo-btn info" @click="showHouseApplyResultAlert">房源申請結果</button>
      </div>
    </div>

    <!-- Alert 組件 -->
    <Alert
      v-model:show="showAlert"
      :title="alertConfig.title"
      :type="alertConfig.type"
      :confirmText="alertConfig.confirmText"
      :cancelText="alertConfig.cancelText"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    >
      <template v-if="alertConfig.customContent">
        <div class="custom-content">
          <i class="fas fa-info-circle"></i>
          <p>這是一個自定義內容的示範</p>
          <p>您可以放置任何內容在這裡</p>
        </div>
      </template>
      <template v-else>
        {{ alertConfig.message }}
      </template>
    </Alert>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import Alert from '@/components/alert/Alert.vue';

const showAlert = ref(false);
const alertConfig = reactive({
  title: '',
  message: '',
  type: 'info',
  confirmText: '確認',
  cancelText: '取消',
  customContent: false
});

// 基本提示
function showBasicAlert() {
  alertConfig.title = '基本提示';
  alertConfig.message = '這是一個基本的提示訊息';
  alertConfig.type = 'info';
  alertConfig.customContent = false;
  showAlert.value = true;
}

// 自定義內容
function showCustomAlert() {
  alertConfig.title = '自定義內容';
  alertConfig.type = 'info';
  alertConfig.customContent = true;
  showAlert.value = true;
}

// 不同類型的提示
function showInfoAlert() {
  alertConfig.title = '資訊提示';
  alertConfig.message = '這是一條資訊提示訊息';
  alertConfig.type = 'info';
  alertConfig.customContent = false;
  showAlert.value = true;
}

function showSuccessAlert() {
  alertConfig.title = '成功提示';
  alertConfig.message = '操作已成功完成！';
  alertConfig.type = 'success';
  alertConfig.customContent = false;
  showAlert.value = true;
}

function showWarningAlert() {
  alertConfig.title = '警告提示';
  alertConfig.message = '請注意，此操作可能會有風險！';
  alertConfig.type = 'warning';
  alertConfig.customContent = false;
  showAlert.value = true;
}

function showErrorAlert() {
  alertConfig.title = '錯誤提示';
  alertConfig.message = '操作失敗，請稍後再試！';
  alertConfig.type = 'error';
  alertConfig.customContent = false;
  showAlert.value = true;
}

// 自定義按鈕文字
function showCustomButtonAlert() {
  alertConfig.title = '自定義按鈕';
  alertConfig.message = '這是一個自定義按鈕文字的示範';
  alertConfig.type = 'info';
  alertConfig.confirmText = '好的，我知道了';
  alertConfig.cancelText = '不要';
  alertConfig.customContent = false;
  showAlert.value = true;
}

// 處理確認和取消事件
function handleConfirm() {
  console.log('確認按鈕被點擊');
}

function handleCancel() {
  console.log('取消按鈕被點擊');
}

function showLoginFailAlert() {
  alertConfig.title = '登入失敗';
  alertConfig.message = '帳號或密碼錯誤，請重新輸入。';
  alertConfig.type = 'error';
  alertConfig.confirmText = '重新登入';
  alertConfig.cancelText = '取消';
  alertConfig.customContent = false;
  showAlert.value = true;
}

function showApplySuccessAlert() {
  alertConfig.title = '申請成功';
  alertConfig.message = '您的申請已送出，請靜待審核結果。';
  alertConfig.type = 'success';
  alertConfig.confirmText = '知道了';
  alertConfig.cancelText = '關閉';
  alertConfig.customContent = false;
  showAlert.value = true;
}

function showHouseApplyResultAlert() {
  alertConfig.title = '房源申請結果';
  alertConfig.message = '恭喜您，您的房源申請已通過！';
  alertConfig.type = 'info';
  alertConfig.confirmText = '查看詳情';
  alertConfig.cancelText = '關閉';
  alertConfig.customContent = false;
  showAlert.value = true;
}
</script>

<style scoped>
.alert-demo {
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

.button-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.demo-btn {
  padding: 0.8rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  background: #f5f5f5;
  color: #666;
}

.demo-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.demo-btn.info {
  background: #3cddd2;
  color: #fff;
}

.demo-btn.success {
  background: #4caf50;
  color: #fff;
}

.demo-btn.warning {
  background: #ff9800;
  color: #fff;
}

.demo-btn.error {
  background: #f44336;
  color: #fff;
}

.custom-content {
  text-align: center;
  padding: 1rem;
}

.custom-content i {
  font-size: 2rem;
  color: #3cddd2;
  margin-bottom: 1rem;
}

.custom-content p {
  margin: 0.5rem 0;
  color: #666;
}
</style> 