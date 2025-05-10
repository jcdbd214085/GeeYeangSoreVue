<template>
    <div class="modal-overlay" v-if="show">
      <div class="modal-content">
        <h2>隱私權政策</h2>
        <div class="modal-body">
          <p>歡迎您使用【居研所租屋平台】（以下簡稱「本平台」）所提供的各項服務。為了保護您的個人資料與隱私權，本平台依據《個人資料保護法》制定本政策，請您詳閱下列內容。</p>
  
          <h3>一、資料蒐集目的與使用範圍</h3>
          <ul>
            <li>建立與管理會員帳號</li>
            <li>供租屋刊登、搜尋與交易聯繫</li>
            <li>驗證身分與防範詐騙</li>
            <li>推薦合適物件與提供客服服務</li>
            <li>法律或主管機關要求之配合事項</li>
          </ul>
  
          <h3>二、蒐集之個人資料種類</h3>
          <ul>
            <li>基本資料：姓名、手機、電子信箱、居住地</li>
            <li>身分驗證資料：身分證影本、房東證明、房客合約</li>
            <li>交易資訊：租賃紀錄、付款紀錄、訊息往來紀錄</li>
            <li>裝置資訊：IP 位址、裝置類型、瀏覽器、作業系統等</li>
          </ul>
  
          <h3>三、資料保存與保護措施</h3>
          <p>您的個人資料將保存在本平台及其委託廠商設立的資料庫中，並採用防火牆、加密與存取控制等資訊安全技術加以保護。</p>
  
          <h3>四、資料揭露對象與方式</h3>
          <p>僅於以下情況揭露您的個人資料：經您同意、法律要求、完成租賃服務所需。</p>
  
          <h3>五、Cookie 之使用</h3>
          <p>本平台可能使用 Cookie 技術來記錄與追蹤您的偏好與操作行為。</p>
  
          <h3>六、您的權利</h3>
          <ul>
            <li>查詢或請求閱覽</li>
            <li>請求製給複製本</li>
            <li>請求補充或更正</li>
            <li>請求停止蒐集、處理或利用</li>
            <li>請求刪除</li>
          </ul>
          <p>如需行使權利請聯繫：<strong>support@ju-yan.com</strong></p>
  
          <h3>七、政策修訂</h3>
          <p>本平台保留隨時修改本政策內容之權利，建議定期查閱。</p>
  
          <p class="text-sm text-gray-500">更新日期：2025 年 5 月 7 日</p>
        </div>
        <button class="modal-close" @click="$emit('close')">關閉</button>
      </div>
    </div>
  </template>
  
  <script setup>
  // 🐥 傳入 props
  defineProps({
    show: Boolean
  })
  // 🐥 傳出事件
  defineEmits(['close'])
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }
  
  .modal-content {
    background: white;
    padding: 24px;
    width: 90%;
    max-width: 600px;
    border-radius: 10px;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
  }
  
  .modal-content h2 {
    font-size: 24px;
    margin-bottom: 16px;
  }
  
  .modal-content p {
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 20px;
  }
  
  .modal-body h3 {
    margin-top: 16px;
    font-size: 18px;
    font-weight: bold;
  }
  
  .modal-body ul {
    padding-left: 20px;
    margin-top: 8px;
    font-size: 14px;
    line-height: 1.6;
  }
  
  .modal-close {
    margin-top: 20px;
    background-color: #32a49c;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
  }
  
  .modal-close:hover {
    background-color: #ff9800;
  }
  </style>
  