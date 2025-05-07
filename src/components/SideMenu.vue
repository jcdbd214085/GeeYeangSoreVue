<template>
  <!-- 側邊欄外層包裹容器 -->
  <div class="side-menu-wrapper">
    <ul class="ul">
      <li class="li">
        <button class="button">
          <p class="p">個人資料</p>
        </button>
      </li>
      <li class="li">
        <button class="button">
          <p class="p">收藏</p>
        </button>
      </li>
      <li class="li">
        <button class="button">
          <p class="p">聊天室</p>
        </button>
      </li>
    </ul>
  </div>
</template>


<script setup>
// 引入 Composition API
import { ref } from 'vue'

</script>

<style>
/* 管理整體側邊列 UL 容器 */
.ul {
  width: 220px;                           /* 明確指定固定寬度給整個選單 */    
  height: fit-content;                   /* 自動適應內容高度 */
  background-color: #4ecdc4;             /* 背景色（藍綠色） */
  list-style: none;                      /* 移除列表圓點 */
}

/* 管理每一列選單項目 LI */
.li {
  margin-bottom: 0px;                    /* 每個項目之間沒有垂直間距 */
}

/* 管理每個按鈕（選單項目） */
.button {
  background-color: transparent;         /* 背景透明 */
  color: #ffffff;                        /* 文字白色 */
  border: none;                          /* 移除按鈕邊框 */
  font-size: 18px;                       /* 文字大小 */
  font-weight: 700;                      /* 文字加粗 */
  padding: 10px 30px;                    /* 上下 10px、左右 30px */
  padding-left: 11px;                    /* 左側內距調整（配合小圖形） */
  cursor: pointer;                       /* 滑鼠變手指 */
  position: relative;                    /* 為偽元素定位準備 */
  text-align: center;                    /* 文字置中對齊 */
  transition: 0.1s;                      /* 整體轉場動畫時間 */
  z-index: 1;                            /* 為了讓偽元素背景在下層 */
  width: 100%;                           /* 每個 button 撐滿 li 與 ul */
  display: block;                        /* 讓 button 撐滿寬度 */
  text-align: left;                     /* 將文字改為靠左對齊 */
}

/* 管理按鈕內文字 P */
.p {
  z-index: 2;                            /* 保持在背景偽元素之上 */
  position: relative;                    /* 為了 z-index 生效 */
  text-indent: 1em;                      /* 每段開頭縮排一個字元寬度 */
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

/* 側邊欄外層容器：撐滿整個畫面高度 */
.side-menu-wrapper {
  height: 100vh;            /* 高度填滿整個瀏覽器視窗 */
  background-color: #4ecdc4; /* 背景與選單一致 */
  display: flex;            /* 若需要置中 ul 可加 align-items */
  flex-direction: column;
}

/* 內層選單 ul 的高度撐滿父層 */
.ul {
  flex: 1;                  /* 撐滿父層高度 */
  list-style: none;
  padding: 0;
  margin: 0;
}


</style>
