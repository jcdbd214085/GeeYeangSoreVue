<template>
    <!-- 單一根元素：用 isRegister 狀態切換 class -->
    <div class="container" :class="{ active: isRegister }">

        <!-- 登入表單 -->
        <div class="form-box login">
            <form @submit.prevent="handleLogin">
                <h1>會員登入</h1>
                <div class="input-box">
                    <input v-model="login.username" type="text" placeholder="電子信箱" required />
                    <i class="fa-solid fa-envelope"></i>
                </div>
                <div class="input-box">
                    <input v-model="login.password" type="password" placeholder="密碼" required />
                    <i class="fa-solid fa-lock"></i>
                </div>
                <div class="forgot-link"><a href="#">忘記密碼?</a></div>
                <button class="btn">登入</button>
                <p>——使用其他方式登入——</p>
                <div class="social-icons">
                    <!-- Google登入icon -->
                    <button class="social-btn google-btn">
                        <span class="icon-circle">
                            <i class="fa-brands fa-google"></i>
                        </span>
                        <span class="btn-text">使用 Google 登入</span>
                    </button>

                </div>
            </form>
        </div>

        <!-- 註冊表單 -->
        <div class="form-box register">
            <form @submit.prevent="handleRegister">
                <h1>會員註冊</h1>
                <div class="input-box">
                    <input v-model="register.username" type="text" placeholder="姓名" required />
                    <i class="fa-solid fa-user"></i>
                </div>
                <div class="input-box">
                    <input v-model="register.userphone" type="text" placeholder="手機" required />
                    <i class="fa-solid fa-phone"></i>
                </div>
                <div class="input-box">
                    <input v-model="register.email" type="email" placeholder="電子信箱" required />
                    <i class="fa-solid fa-envelope"></i>
                </div>
                <div class="input-box">
                    <input v-model="register.password" type="password" placeholder="密碼" required />
                    <i class="fa-solid fa-lock"></i>
                </div>
                <!-- 🐥驗證碼欄位與發送按鈕：並排放置 -->
                <div class="input-box verify-box">
                    <input v-model="register.verificationCode" type="text" placeholder="請輸入驗證碼" required />
                    <button type="button" class="verify-btn" @click="sendVerificationCode">發送驗證碼</button>
                </div>


                <button class="btn">註冊</button>
            </form>
        </div>

        <!-- 切換面板 -->
        <div class="toggle-box">
            <div class="toggle-panel toggle-left">
                <h1>居研所</h1>
                <p>用心研究每一個家的可能性。</p>
                <button class="btn" @click="showRegister">註冊會員</button>
            </div>
            <div class="toggle-panel toggle-right">
                <h1>居研所</h1>
                <p>讓數據，帶你回家。</p>
                <button class="btn" @click="showLogin">登入會員</button>
            </div>
        </div>
    </div>
</template>

<script setup>
// 引入 Composition API
import { ref } from 'vue'

// 切換畫面狀態
const isRegister = ref(false) // false = 顯示登入, true = 顯示註冊

// 登入表單資料
const login = ref({
    username: '',
    password: ''
})

// 註冊表單資料
const register = ref({
    username: '',
    email: '',
    password: ''
})

// 切換至註冊畫面
const showRegister = () => {
    isRegister.value = true
}

// 切換至登入畫面
const showLogin = () => {
    isRegister.value = false
}

// 登入事件
const handleLogin = () => {
    console.log('登入資料', login.value)
    // TODO: 呼叫 API 處理登入
}

// 註冊事件
const handleRegister = () => {
    console.log('註冊資料', register.value)
    // TODO: 呼叫 API 處理註冊
}
</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    text-decoration: none;
    list-style: none;
}

body {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(90deg, #e2e2e2, #c9d6ff);
}

.container {
    position: relative;
    width: 850px;
    height: 550px;
    background: #f0f9f8;
    margin: 20px;
    border-radius: 30px;
    box-shadow: 0 0 30px rgba(0, 0, 0, .2);
    overflow: hidden;
}

.container h1 {
    font-size: 36px;
    margin: -10px 0;
}

.container p {
    font-size: 14.5px;
    margin: 15px 0;
}

form {
    width: 100%;
}

.form-box {
    position: absolute;
    right: 0;
    width: 50%;
    height: 100%;
    background: #f0f9f8;
    display: flex;
    align-items: center;
    color: #333;
    text-align: center;
    padding: 40px;
    z-index: 1;
    transition: .6s ease-in-out 1.2s, visibility 0s 1s;
}

.container.active .form-box {
    right: 50%;
}

.form-box.register {
    visibility: hidden;
}

.container.active .form-box.register {
    visibility: visible;
}

.input-box {
    position: relative;
    margin: 30px 0;
}

.input-box input {
    width: 100%;
    padding: 13px 50px 13px 20px;
    background: #eee;
    border-radius: 8px;
    border: none;
    outline: none;
    font-size: 16px;
    color: #333;
    font-weight: 500;
}

.input-box input::placeholder {
    color: #888;
    font-weight: 400;
}

.input-box i {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 20px;
}

.forgot-link {
    margin: -15px 0 15px;
    text-align: right;
    /* 文字靠右對齊 */
}

.forgot-link a {
    font-size: 14.5px;
    color: #333;
}

.btn {
    width: 100%;
    height: 48px;
    background: #4ecdc4;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .1);
    border: none;
    cursor: pointer;
    font-size: 16px;
    color: #f0f9f8;
    font-weight: 600;
}

.btn:hover {
    background-color: #ff9800;
    /* 滑鼠懸停變橘色 */
    color: #ffffff;
    /* 文字保持白色 */
}

.social-icons {
    display: flex;
    justify-content: center;
}

.social-icons a {
    display: inline-flex;
    padding: 10px;
    border: 2px solid #ccc;
    border-radius: 8px;
    font-size: 24px;
    color: #333;
    margin: 0 8px;
}

.toggle-box {
    position: absolute;
    width: 100%;
    height: 100%;
}

.toggle-box::before {
    content: '';
    position: absolute;
    left: -250%;
    width: 300%;
    height: 100%;
    background: #4ecdc4;
    /* border: 2px solid red; */
    border-radius: 150px;
    z-index: 2;
    transition: 1.8s ease-in-out;
}

.container.active .toggle-box::before {
    left: 50%;
}

.toggle-panel {
    position: absolute;
    width: 50%;
    height: 100%;
    /* background: seagreen; */
    color: #f0f9f8;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 2;
    transition: .6s ease-in-out;
}

.toggle-panel.toggle-left {
    left: 0;
    transition-delay: 1.2s;
}

.container.active .toggle-panel.toggle-left {
    left: -50%;
    transition-delay: .6s;
}

.toggle-panel.toggle-right {
    right: -50%;
    transition-delay: .6s;
}

.container.active .toggle-panel.toggle-right {
    right: 0;
    transition-delay: 1.2s;
}

.toggle-panel p {
    margin-bottom: 20px;
}

.toggle-panel .btn {
    width: 160px;
    height: 46px;
    background: transparent;
    border: 2px solid #f0f9f8;
    box-shadow: none;
}

/* Google 登入icon樣式 */
/* 整體按鈕：紅底白字 */
.google-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background-color: #DB4437;
    /* Google 紅 */
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 10px 16px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s;
}

/* icon 外圈白底 */
.icon-circle {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    color: #DB4437;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    font-size: 16px;
}

/* hover 效果（可選） */
.google-btn:hover {
    background-color: #c1351d;
}

/* 🐥 驗證碼欄位：橫向排列 */
.input-box.verify-box {
    display: flex;
    align-items: center;
    gap: 10px;
}

/* 🐥 驗證碼輸入欄位：佔比 2/3 */
.input-box.verify-box input {
    flex: 2;
    padding: 13px 20px;
}

/* 🐥 發送按鈕：佔比 1/3 */
.verify-btn {
    flex: 1;
    height: 46px;
    background-color: #4ecdc4;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s;
}

.verify-btn:hover {
    background-color: #ff9800;
}



@media screen and (max-width: 650px) {
    .container {
        height: calc(100vh - 40px);
    }

    .form-box {
        bottom: 0;
        width: 100%;
        height: 70%;
    }

    .container.active .form-box {
        right: 0;
        bottom: 30%;
    }

    .toggle-box::before {
        left: 0;
        top: -270%;
        width: 100%;
        height: 300%;
        border-radius: 20vw;
    }

    .container.active .toggle-box::before {
        left: 0;
        top: 70%;
    }

    .container.active .toggle-panel.toggle-left {
        left: 0;
        top: -30%;
    }

    .toggle-panel {
        width: 100%;
        height: 30%;
    }

    .toggle-panel.toggle-left {
        top: 0;
    }

    .toggle-panel.toggle-right {
        right: 0;
        bottom: -30%;
    }

    .container.active .toggle-panel.toggle-right {
        bottom: 0;
    }


}

@media screen and (max-width: 400px) {
    .form-box {
        padding: 20px;
    }

    .toggle-panel h1 {
        font-size: 30px;
    }
}
</style>