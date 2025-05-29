<script setup>
import {ref} from 'vue'
import axios from "axios";

const showChat = ref(false)
const userInput = ref('')
const messages = ref([]) // { type: 'user' | 'bot', text: string }
const isTyping = ref(false)

function toggleChat() {
  showChat.value = !showChat.value
  if (!showChat.value) {
    userInput.value = ''
    messages.value = []
  }
}

async function sendMessage() {
  const question = userInput.value.trim()
  if (!question) return

  messages.value.push({type: 'user', text: question})
  userInput.value = ''
  isTyping.value = true

  const answer = await getBotAnswer(question)
  messages.value.push({type: 'bot', text: answer})
  isTyping.value = false
}

async function getBotAnswer(question) {
  try {
    const response = await axios.post('https://llm.jayceeswlrorobot.win/v1/chat/completions', {
      model: 'gemma3:4b',
      messages: [
        {
          role: 'user',
          content: `
你是一個專業的客服機器人，租屋網站名稱為「居研所」，請用親切且清楚的繁體中文回答使用者的問題。

---
網站資料：
【註冊與身分】
- 本網站提供「房東」與「租客」兩種身分註冊選項，註冊後無法自行切換
- 房東需完成身分認證後才可刊登租屋資訊
- 房東帳號可管理多筆物件，租客帳號可收藏與留言詢問

【刊登與廣告方案】
- 房東才能上架物件，租客無法上架
- 上架房屋時可選擇以下方案：
  ▸ 免費方案：基本曝光，刊登 永久 天
  ▸ 100 元方案：首頁推薦15天  適合人群：剛開始嘗試刊登的新手
  ▸ 200 元方案：首頁 + 搜尋推薦30天  適合人群：希望快速出租
  ▸ 300 元方案：全站推薦+至頂廣告 + 精選標章 45天  適合人群：高價/急售/極致曝光
- 僅支援綠界金流信用卡付款，不支援超商付款與匯款
-Q: 方案購買後可以更換嗎？
▲
A: 方案一旦購買並啟用後，無法直接更換為其他方案，但您可以隨時加購升級至更高級的方案（例如由 VIP1 升級至 VIP2 或 VIP3）。升級後會立即套用新的曝光權益與服務，而原本的剩餘天數也會自動整合至新方案，不浪費。若您不確定要購買哪個方案，建議可以先從 VIP1 開始嘗試，若覺得效果不錯，再升級至 VIP2、VIP3 加速出租。
Q: 方案到期會怎樣？
▲
A: 當方案到期後，您的物件會自動轉為下架狀態，不會再被租客看到。您可以隨時再次選擇新的刊登方案並重新上架，不會影響您的物件資料。
A: 租屋平台的物件排序會根據新鮮度、熱門程度進行調整。VIP2 與 VIP3 方案都擁有自動排序更新功能，可以確保您的物件持續維持在靠前頁面，避免沉到後面頁數。VIP2 會每 3 天自動刷新排序，VIP3 則是每日刷新，確保物件一直處於高曝光位置。這樣能大大增加租客點擊率、提升詢問數，尤其對於想快速出租的房東非常重要。
A: 「推薦」與「精選」標籤是平台專為 VIP 物件設計的視覺強化功能。VIP2 會自動加上「推薦」標籤，讓租客第一眼就知道這是熱門物件，提升點擊率。VIP3 則會加上「精選」標籤，並搭配頁面置頂，形成視覺霸榜效果，讓租客更容易點選。這些標籤可以讓您的物件在眾多房源中脫穎而出，提升被選中的機會。
A: 可以。房東可以在方案期間內隨時手動下架物件，例如物件已出租或暫時不開放看屋。但請注意，即使提早下架，廣告費用不會退還，且剩餘的刊登天數也不會延後或保留。建議您確認物件確實出租或不再需要曝光時再進行下架，以免浪費您已購買的廣告權益。如有特殊狀況，也可聯繫平台客服了解處理方式。

【租屋行為與規定】
- 建議雙方簽署正式紙本或電子合約
- 房東如需進入房屋，須提前告知並取得房客同意
- 租客如需裝潢或改建，須取得房東書面同意
- 若發生漏水，請保留證據（拍照）並通知房東處理
- 房東需確保物件資訊真實，否則將被下架並停權

【違規與安全】
- 禁止刊登短租、日租、Airbnb 類型物件
- 若房東被檢舉三次，帳號將被審核並可能停權
- 平台會自動隱藏留言中包含 LINE 或電話的資訊，防詐騙

【客服與支援】
- 客服信箱：geeyeangsore@gmail.com（3 日內回覆）
- 客服電話：0922-123-456（週一至週五 10:00–18:00，免費）
- 平台不提供法律代理或法律諮詢服務

---
使用者問題：${question}
`

        }
      ],
      max_tokens: 500
    });

    const reply = response.data.choices[0].message.content;
    return reply;

  } catch (error) {
    if (error.response) {
      console.error('⚠️ 錯誤狀態碼：', error.response.status);
      console.error('📦 錯誤資料：', error.response.data);
    } else if (error.request) {
      console.error('❌ 無回應，請求物件：', error.request);
    } else {
      console.error('❗ 錯誤訊息：', error.message);
    }
    return '❌ 發生錯誤，請稍後再試';
  }
}


</script>

<template>
  <button class="chat-toggle" @click="toggleChat">
    <img src="https://cdn-icons-png.flaticon.com/512/6134/6134346.png" alt="客服機器人" />
  </button>

  <div v-if="showChat">
    <div class="chat-header">
      <span>客服機器人 - 居研所</span>
      <button class="close-btn" @click="toggleChat">×</button>
    </div>

    <div class="chat-body">
      <div v-for="(msg, idx) in messages" :key="idx" :class="['msg', msg.type]">
        <span>{{ msg.text }}</span>
      </div>
      <div v-if="isTyping" class="msg bot typing">正在輸入中...</div>
    </div>

    <div class="chat-input">
      <input
          v-model="userInput"
          @keyup.enter="sendMessage"
          placeholder="請輸入您的問題..."
      />
      <button @click="sendMessage">送出</button>
    </div>
  </div>
</template>

<style scoped>
:root {
  --main-color: #007bff;
}

.chat-toggle img {
  width: 56px; /* 或其他你想要的大小 */
  height: 56px;
  object-fit: contain;
}



.chat-header {
  background-color: var(--main-color);
  color: white;
  padding: 0.8rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
}

.chat-body {
  flex-grow: 1;
  padding: 1rem;
  overflow-y: auto;
  background: #f5f5f5;
}

.msg {
  margin-bottom: 0.75rem;
  padding: 0.6rem 1rem;
  border-radius: 12px;
  max-width: 85%;
  line-height: 1.5;
  word-wrap: break-word;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.msg.user {
  background-color: #d1ecf1;
  align-self: flex-end;
  text-align: right;
  margin-left: auto;
}

.msg.bot {
  background-color: #e9ecef;
  align-self: flex-start;
  margin-right: auto;
}

.typing {
  font-style: italic;
  color: #888;
}

.chat-input {
  display: flex;
  padding: 0.75rem;
  border-top: 1px solid #ddd;
  background: white;
}

.chat-input input {
  flex-grow: 1;
  padding: 0.55rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-right: 0.5rem;
}

.chat-input button {
  background-color: var(--main-color);
  color: white;
  border: none;
  padding: 0.55rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}
</style>
