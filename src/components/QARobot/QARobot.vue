<script setup>
import { ref } from 'vue'
import Button from "@/components/buttons/button.vue"; // 你的按鈕元件路徑

// 模擬對話資料
const chatData = {
  A: {
    question: "帳號問題，請選擇一個子項目：",
    options: {
      A1: { text: "如何註冊帳號？", answer: "請點選右上角的註冊按鈕，填寫資料即可完成註冊。" },
      A2: { text: "忘記密碼怎麼辦？", answer: "點選登入頁的「忘記密碼」，輸入信箱即可重設。" },
      A3: { text: "我要如何修改我的個人資料？", answer: "請至會員中心 → 編輯個人資料，進行修改。" },
      A4: { text: "可以更換登入的 Email 嗎？", answer: "目前不支援更換 Email，如有需要請聯絡客服。" }
    }
  },
  B: {
    question: "付款問題，請選擇一個子項目：",
    options: {
      B1: { text: "有哪些付款方式？", answer: "我們支援信用卡、LINE Pay、ATM 轉帳等方式。" },
      B2: { text: "付款失敗怎麼辦？", answer: "請聯絡客服，我們會協助您處理。" },
      B3: { text: "付款後多久會入帳？", answer: "通常會在 1～3 分鐘內完成，ATM 則需等銀行處理時間。" },
      B4: { text: "我可以索取發票嗎？", answer: "是的，系統會自動開立電子發票並寄至您註冊信箱。" }
    }
  },
  C: {
    question: "系統使用問題，請選擇一個子項目：",
    options: {
      C1: { text: "這個系統支援哪些瀏覽器？", answer: "建議使用最新版本的 Chrome、Firefox 或 Edge。" },
      C2: { text: "手機也能使用這個系統嗎？", answer: "可以，我們的網站支援手機響應式設計。" },
      C3: { text: "為什麼有些功能無法點擊？", answer: "請確認您已登入，且擁有相對應權限。" }
    }
  }
}

const showChat = ref(false)
const mainKey = ref(null)
const selectedAnswer = ref('')
const subOptions = ref([]) // 子選項

function toggleChat() {
  showChat.value = !showChat.value
  if (!showChat.value) {
    resetChat()
  }
}

function selectMain(key) {
  mainKey.value = key
  selectedAnswer.value = ''
  const data = chatData[key]
  subOptions.value = Object.entries(data.options).map(([k, v]) => ({
    key: k,
    text: v.text,
    answer: v.answer
  }))
}

function selectAnswer(answer) {
  selectedAnswer.value = answer
}

function resetChat() {
  mainKey.value = null
  selectedAnswer.value = ''
  subOptions.value = []
}
</script>

<template>
  <!-- 固定右下角機器人按鈕 -->

  <button class="robot-btn" @click="toggleChat" aria-label="開啟聊天機器人">
    <p class="section-title mb-3">客服機器人</p>
    <img src="https://www.svgrepo.com/show/69693/robot.svg" alt="Robot Icon" />
  </button>

  <!-- 聊天視窗 -->
  <div class="chat-bot" v-if="showChat">
    <header class="chat-header">
      <h2 class="section-title mb-3">客服機器人</h2>
      <button class="close-btn" @click="toggleChat" aria-label="關閉聊天視窗">×</button>
    </header>

    <div class="chat-content">
      <div v-if="!mainKey">
        <p>請選擇一個主題：</p>
        <Button @click="selectMain('A')">帳號問題</Button>
        <Button @click="selectMain('B')">付款問題</Button>
        <Button @click="selectMain('C')">系統使用問題</Button>
      </div>

      <div v-else>
        <p>{{ chatData[mainKey].question }}</p>
        <div class="btn-group">
          <Button
              v-for="opt in subOptions"
              :key="opt.key"
              @click="selectAnswer(opt.answer)"
          >
            {{ opt.text }}
          </Button>
        </div>

        <div class="answer" v-if="selectedAnswer">
          <p><strong>答：</strong>{{ selectedAnswer }}</p>
        </div>

        <div class="back">
          <Button @click="resetChat">返回主選單</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.robot-btn {
  position: fixed;
  bottom: 20px;
  left: 20px;
  width: 48px;

  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 1100;
  padding: 0;
  transition: transform 0.2s;
}
.robot-btn:hover {
  transform: scale(1.1);
}
.robot-btn img {
  width: 100%;
  height: 100%;
}

.chat-bot {
  position: fixed;
  bottom: 80px; /* 按鈕正上方 */
  right: 20px;
  width: 320px;
  max-width: 90vw;
  height: 400px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-shadow: 0 2px 12px rgba(0,0,0,0.15);
  z-index: 1099;
  display: flex;
  flex-direction: column;
  font-family: Arial, sans-serif;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #eee;
  background-color: var(--main-color, #007bff);
  color: white;
  border-radius: 8px 8px 0 0;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  color: white;
  cursor: pointer;
}

.chat-content {
  padding: 1rem;
  overflow-y: auto;
  flex-grow: 1;
}

.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.answer {
  margin-top: 1rem;
  background: #f9f9f9;
  border-radius: 6px;
  padding: 0.75rem;
  color: #333;
}

.back {
  margin-top: 1rem;
}

.back button {
  padding: 0.4rem 1rem;
  font-size: 0.9rem;
}
</style>
