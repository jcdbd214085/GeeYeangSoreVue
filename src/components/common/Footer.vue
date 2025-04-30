<template>
  <!-- 頁尾元件 -->
  <footer class="footer">
    <div class="container">
      <div class="row">
        <div class="col-md-4">
          <h5>關於我們</h5>
          <p>智慧租屋平台致力於提供最優質的租屋服務</p>
        </div>
        <div class="col-md-4">
          <h5>聯絡資訊</h5>
          <p>Email: contact@rental.com</p>
          <p>電話: (02) 2345-6789</p>
        </div>
        <div class="col-md-4">
          <h5>追蹤我們</h5>
          <div class="social-links">
            <a href="#"><i class="fab fa-facebook"></i></a>
            <a href="#"><i class="fab fa-instagram"></i></a>
            <a href="#"><i class="fab fa-line"></i></a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 智慧租屋平台 版權所有</p>
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

.social-links a {
    color: #fff;
    margin-right: 1rem;
    font-size: 1.3rem;
    transition: color 0.2s;
}

.social-links a:hover {
    color: var(--main-color);
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
