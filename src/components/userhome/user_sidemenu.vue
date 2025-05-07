<template>
  <!-- 側邊欄外層包裹容器 -->
  <div class="side-menu-wrapper" :class="{ active: isMenuOpen }">
    <!-- 選單控制按鈕 -->
    <button class="menu-toggle" @click="toggleMenu">
      <span class="menu-icon"></span>
    </button>
    
    <ul class="ul">
      <li class="li">
        <button class="button" @click="goTo('profile')">
          <p class="p">個人資料</p>
        </button>
      </li>
      <li class="li">
        <button class="button" @click="goTo('favorite')">
          <p class="p">我的收藏</p>
        </button>
      </li>
      <li class="li">
        <button class="button" @click="goTo('chat')">
          <p class="p">聊天室</p>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['change-view'])
const isMenuOpen = ref(false)

function goTo(viewName) {
  emit('change-view', viewName)
  // 在移動端點擊選單項目後自動關閉選單
  if (window.innerWidth <= 768) {
    isMenuOpen.value = false
  }
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

  
  <style>
  /* 管理整體側邊列 UL 容器 */
  .ul {
    width: 100%;                           /* 改為相對寬度 */
    max-width: 220px;                      /* 最大寬度限制 */
    height: fit-content;                   
    background-color: #4ecdc4;             
    list-style: none;                      
    flex: 1;                              
    padding: 0;
    margin: 0;
  }

  /* 管理每一列選單項目 LI */
  .li {
    margin-bottom: 0;                    
    width: 100%;                          /* 確保項目寬度填滿容器 */
  }
  
  /* 管理每個按鈕（選單項目） */
  .button {
    background-color: transparent;         
    color: #ffffff;                        
    border: none;                          
    font-size: clamp(1rem, 2vw, 1.125rem); /* 響應式字體大小 */
    font-weight: 700;                      
    padding: clamp(0.5rem, 2vw, 0.625rem) clamp(0.75rem, 2vw, 1.875rem); /* 響應式內距 */
    cursor: pointer;                       
    position: relative;                    
    text-align: left;                     
    transition: 0.1s;                      
    z-index: 1;                            
    width: 100%;                           
    display: block;                        
  }
  
  /* 管理按鈕內文字 P */
  .p {
    z-index: 2;                            
    position: relative;                    
    text-indent: 1em;                      
    white-space: nowrap;                   /* 防止文字換行 */
    overflow: hidden;                      /* 超出部分隱藏 */
    text-overflow: ellipsis;               /* 顯示省略號 */
  }
  
  /* 側邊欄外層容器 */
  .side-menu-wrapper {
    height: 100vh;            
    background-color: #4ecdc4; 
    display: flex;            
    flex-direction: column;
    position: relative;       /* 為移動端定位做準備 */
  }

  /* 響應式設計 */
  @media screen and (max-width: 768px) {
    .side-menu-wrapper {
      position: fixed;        /* 在移動端固定位置 */
      left: 0;
      top: 0;
      z-index: 1000;         /* 確保在其他元素之上 */
      transform: translateX(-100%); /* 預設隱藏 */
      transition: transform 0.3s ease;
    }

    .side-menu-wrapper.active {
      transform: translateX(0); /* 顯示選單 */
    }

    .ul {
      max-width: 100%;       /* 在移動端佔滿寬度 */
    }
  }

  /* 平板裝置 */
  @media screen and (min-width: 769px) and (max-width: 1024px) {
    .ul {
      max-width: 180px;      /* 平板裝置稍微縮小寬度 */
    }
  }

  /* 大螢幕 */
  @media screen and (min-width: 1025px) {
    .ul {
      max-width: 220px;      /* 大螢幕保持原始寬度 */
    }
  }
  
  /* 滑鼠懸停按鈕時的文字顏色變化 */
  .button:hover {
    color: #4ecdc4;                        /* 文字變藍綠色 */
    text-align: center;                    /* 文字保持置中 */
  }
  
  /* 滑鼠懸停時：偽元素變大當成背景效果 */
  .button:hover::before {
    width: 100%;                           /* 撐滿整個按鈕寬度 */
  }
  
  /* 按鈕左側小圖形初始狀態（偽元素）與滑入背景 */
  .button::before {
    content: "";                           /* 偽元素產生內容 */
    position: absolute;                    /* 絕對定位 */
    top: 0;                                /* 貼齊上緣 */
    left: 0;                               /* 貼齊左緣 */
    width: 0%;                             /* 初始寬度為 0 */
    height: 100%;                          /* 高度覆蓋整個按鈕 */
    background-color: #ffffff;             /* 初始背景色為白色 */
    transition: all 0.3s ease;             /* 平滑動畫 */
    z-index: -1;                           /* 放在下層 */
  }
  
  /* 按鈕點擊時：偽元素顏色變亮橘 */
  .button:active::before {
    background-color: #ff9800;             /* 點擊後變成亮橘色 */
  }
  
  /* 按鈕點擊時：文字變白 */
  .button:active {
    color: #ffffff;                        /* 點擊時文字改成白色 */
  }
  
  /* 選單控制按鈕樣式 */
  .menu-toggle {
    display: none;  /* 預設隱藏，只在移動端顯示 */
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 1001;
    background: #4ecdc4;
    border: none;
    border-radius: 4px;
    padding: 0.5rem;
    cursor: pointer;
    width: 40px;
    height: 40px;
  }

  /* 漢堡選單圖示 */
  .menu-icon {
    position: relative;
    display: block;
    width: 24px;
    height: 2px;
    background: white;
    margin: 0 auto;
  }

  .menu-icon::before,
  .menu-icon::after {
    content: '';
    position: absolute;
    width: 24px;
    height: 2px;
    background: white;
    transition: transform 0.3s ease;
  }

  .menu-icon::before {
    top: -8px;
  }

  .menu-icon::after {
    bottom: -8px;
  }

  /* 選單開啟時的漢堡圖示動畫 */
  .active .menu-icon {
    background: transparent;
  }

  .active .menu-icon::before {
    transform: rotate(45deg);
    top: 0;
  }

  .active .menu-icon::after {
    transform: rotate(-45deg);
    bottom: 0;
  }

  /* 在移動端顯示選單控制按鈕 */
  @media screen and (max-width: 768px) {
    .menu-toggle {
      display: block;
    }
    
    /* 選單開啟時添加遮罩層 */
    .side-menu-wrapper.active::after {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: -1;
    }
  }
  
  </style>
  