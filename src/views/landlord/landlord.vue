<template>
  <Navbar />
  <div class="landlord-page">
    <div class="container">
      <section class="hero-section">
        <h1>成為房東</h1>
        <p class="subtitle">加入我們的房東行列，輕鬆管理您的房源</p>
      </section>

      <section class="form-section">
        <div class="form-container">
          <h2>房東申請表</h2>
          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label>姓名</label>
              <Input v-model="formData.name" placeholder="請輸入您的姓名" />
            </div>

            <div class="form-group">
              <label>電子郵件</label>
              <Input v-model="formData.email" placeholder="請輸入您的電子郵件" type="email" />
            </div>

            <div class="form-group">
              <label>手機號碼</label>
              <Input v-model="formData.phone" placeholder="請輸入您的手機號碼" />
            </div>

            <div class="form-group">
              <label>身分證字號</label>
              <Input v-model="formData.idNumber" placeholder="請輸入您的身分證字號" />
            </div>

            <div class="form-group">
              <label>地址</label>
              <Input v-model="formData.address" placeholder="請輸入您的通訊地址" />
            </div>

            <div class="form-group">
              <label>自我介紹</label>
              <textarea v-model="formData.introduction" placeholder="請簡單介紹一下自己" rows="4"></textarea>
            </div>

            <div class="form-group">
              <label>上傳身分證正反面照片</label>
              <div class="upload-area">
                <div class="upload-box">
                  <i class="fas fa-upload"></i>
                  <p>點擊上傳身分證正面</p>
                </div>
                <div class="upload-box">
                  <i class="fas fa-upload"></i>
                  <p>點擊上傳身分證反面</p>
                </div>
              </div>
            </div>

            <button type="submit" class="submit-btn">送出申請</button>
          </form>
        </div>
      </section>

      <section class="benefits-section">
        <h2>成為房東的好處</h2>
        <div class="benefits-grid">
          <div class="benefit-item">
            <i class="fas fa-chart-line"></i>
            <h3>提高曝光度</h3>
            <p>透過我們的平台，讓您的房源更容易被找到</p>
          </div>
          <div class="benefit-item">
            <i class="fas fa-shield-alt"></i>
            <h3>安全可靠</h3>
            <p>嚴格的房客審核機制，保障您的權益</p>
          </div>
          <div class="benefit-item">
            <i class="fas fa-tools"></i>
            <h3>輕鬆管理</h3>
            <p>直覺的房源管理介面，讓您輕鬆掌握租屋狀況</p>
          </div>
        </div>
      </section>
    </div>
  </div>
  <Footer />
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import Navbar from '@/components/common/Navbar.vue';
import Footer from '@/components/common/Footer.vue';
import Input from '@/components/input/Input.vue';

const router = useRouter();
const userStore = useUserStore();

const formData = ref({
  name: '',
  email: '',
  phone: '',
  idNumber: '',
  address: '',
  introduction: ''
});

const submitForm = async () => {
  try {
    // 這裡應該要呼叫 API 來處理表單提交
    console.log('表單提交:', formData.value);
    
    // 模擬 API 呼叫成功
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 更新用戶角色為房東
    userStore.setRole('landlord');
    
    // 顯示成功訊息
    alert('申請成功！您現在已經是房東了。');
    
    // 導向到首頁
    router.push('/');
  } catch (error) {
    console.error('提交失敗:', error);
    alert('提交失敗，請稍後再試。');
  }
};
</script>

<style scoped>
.landlord-page {
  padding-top: 80px;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.hero-section {
  text-align: center;
  padding: 60px 0;
}

.hero-section h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
}

.form-section {
  padding: 40px 0;
}

.form-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.form-container h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  resize: vertical;
}

.upload-area {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.upload-box {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-box:hover {
  border-color: #3cddd2;
  background: #f8f9fa;
}

.upload-box i {
  font-size: 2rem;
  color: #666;
  margin-bottom: 10px;
}

.upload-box p {
  color: #666;
  margin: 0;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: #3cddd2;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-btn:hover {
  background: #2bc4b8;
  transform: translateY(-2px);
}

.benefits-section {
  padding: 60px 0;
  text-align: center;
}

.benefits-section h2 {
  margin-bottom: 40px;
  color: #333;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.benefit-item {
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.benefit-item i {
  font-size: 2.5rem;
  color: #3cddd2;
  margin-bottom: 20px;
}

.benefit-item h3 {
  color: #333;
  margin-bottom: 15px;
}

.benefit-item p {
  color: #666;
  line-height: 1.6;
}
</style>
