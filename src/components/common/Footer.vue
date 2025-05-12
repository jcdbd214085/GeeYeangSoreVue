<!-- Footer 區塊 -->
<template>
  <footer class="footer">
    <div class="container">
      <div class="row">
        <div class="col-md-4">
          <h5>居研所股份有限公司</h5>
          <p>週一至週五 10:00 - 21:00</p>
          <p>高雄市前金區中正四路 211 號 8 樓</p>
<br>
                    <p>Email : support@ju-yan.com</p>
          <p>電話: (02) 2345-6789</p>
        </div>
        <div class="col-md-4">
          <!-- <h5>聯絡資訊</h5>
          <p>Email : support@ju-yan.com</p>
          <p>電話: (02) 2345-6789</p> -->
        </div>

        <div class="col-md-4 footer-center">
          <!-- 改為顯示 LOGO -->
          <img src="/image/logo2.png" alt="GeeYeangSoreVue Logo" class="footer-logo" />
          <div class="social-links">
            <a href="#"><i class="fab fa-facebook"></i></a>
            <a href="#"><i class="fab fa-instagram"></i></a>
            <a href="#"><i class="fab fa-line"></i></a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 居研所租屋平台 版權所有</p>
      </div>
    </div>
  </footer>
</template>


<script setup>
// 目前無邏輯
</script>
<style scoped>
.footer {
  background: #222;
  color: #fff;
  padding: 3rem 0 2rem 0;
  margin-top: 100px;
}

.footer .footer-center {
  display: flex;
  flex-direction: column;
  align-items: center; /* 置中 LOGO 與 icon */
  justify-content: center;
  text-align: center;
}

.footer .container {
  max-width: 1200px;
  margin: 0 auto;
}

.footer .row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

.footer .col-md-4 {
  flex: 1;
  padding: 0 32px;
}

.footer h5 {
  color: var(--main-color);
  margin-bottom: 1rem;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 1.3rem; /* icon 間距 */
  margin-top: 1rem;
}

.social-links a {
  color: #fff;
  font-size: 2rem;
  transition: color 0.2s;
}

.social-links a:hover {
  color: var(--main-color);
}

.footer-logo {
  width: 160px; 
  margin-bottom: 1rem;
}

.footer-bottom {
  border-top: 1px solid #444;
  margin-top: 2.5rem;
  padding-top: 1.2rem;
  text-align: center;
  color: #aaa;
  font-size: 0.95rem;
}
</style>
