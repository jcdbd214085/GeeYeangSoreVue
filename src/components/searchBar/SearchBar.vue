<template>
  <div class="search-container position-absolute">
    <!-- 搜尋欄 -->
    <form class="search-bar d-flex bg-white p-2 rounded-pill" @click.stop="showFilter = true"
      @submit.prevent="emitSearch">
      <input class="form-control" v-model="searchKeyword" placeholder="輸入物件標題或地址" />
      <button class="btn btn-primary" type="submit">
        <i class="fa-solid fa-magnifying-glass"></i>
      </button>
    </form>

    <!-- 篩選欄 -->
    <div class="filter-options p-4 border rounded shadow" v-show="showFilter" ref="filterOptions">
      <h4 class="fw-bold mb-4">篩選條件</h4>
      <form @submit.prevent="emitSearch">
        <!-- 位置 -->
        <div class="mb-3">
          <label class="fw-bold mb-1">位置</label>
          <div class="d-flex">
            <select class="form-select me-2" v-model="city" @change="updateDistrictOptions">
              <option v-for="c in Object.keys(districts)" :key="c" :value="c">{{ c }}</option>
            </select>
            <select class="form-select" v-model="district" :disabled="!districtOptions.length">
              <option v-for="d in districtOptions" :key="d" :value="d">{{ d }}</option>
            </select>
          </div>
        </div>

        <!-- 類型與型態 -->
        <div class="mb-3 d-flex">
          <div class="w-50 me-2">
            <label class="fw-bold mb-1">類型</label>
            <select class="form-select" v-model="type">
              <option>不限</option>
              <option>整層住家</option>
              <option>整棟住家</option>
              <option>套房</option>
              <option>雅房</option>
              <option>其他</option>
            </select>
          </div>
          <div class="w-50">
            <label class="fw-bold mb-1">型態</label>
            <select class="form-select" v-model="buildingType">
              <option>不限</option>
              <option>公寓</option>
              <option>大樓</option>
              <option>透天</option>
              <option>華廈</option>
            </select>
          </div>
        </div>

        <!-- 租金與坪數 -->
        <div class="mb-3 d-flex">
          <div class="w-50 me-2">
            <label class="fw-bold mb-1">租金 (元)</label>
            <select class="form-select" v-model="rentRange" @change="toggleCustomRent">
              <option>不限</option>
              <option>5000元以下</option>
              <option>5000~10000元</option>
              <option>10000元以上</option>
              <option value="custom">自訂金額</option>
            </select>
            <div class="d-flex mt-2" v-if="showCustomRent">
              <input type="number" class="form-control me-2" placeholder="最低" v-model.number="customRent.min">
              <span class="align-self-center">~</span>
              <input type="number" class="form-control ms-2" placeholder="最高" v-model.number="customRent.max">
            </div>
          </div>
          <div class="w-50">
            <label class="fw-bold mb-1">坪數</label>
            <select class="form-select" v-model="areaRange" @change="toggleCustomArea">
              <option>不限</option>
              <option>10坪以下</option>
              <option>10~20坪</option>
              <option>20~30坪</option>
              <option>30坪以上</option>
              <option value="custom">自訂坪數</option>
            </select>
            <div class="d-flex mt-2" v-if="showCustomArea">
              <input type="number" class="form-control me-2" placeholder="最小" v-model.number="customArea.min">
              <span class="align-self-center">~</span>
              <input type="number" class="form-control ms-2" placeholder="最大" v-model.number="customArea.max">
            </div>
          </div>
        </div>

        <!-- 特色 -->
        <div class="mb-3">
          <label class="fw-bold mb-1">特色</label>
          <div class="d-flex flex-wrap gap-2">
            <button v-for="feature in featureOptions" :key="feature" type="button" class="feature-btn"
              :class="{ active: selectedFeatures.includes(feature) }" @click="toggleFeature(feature)">
              {{ feature }}
            </button>
          </div>
        </div>

        <!-- 操作按鈕 -->
        <div class="d-flex justify-content-end mt-3">
          <button type="submit" class="btn custom-search-btn me-2">搜尋</button>
          <button type="button" class="btn btn-outline-secondary me-2" @click="resetFilter">清空</button>
          <button type="button" class="btn btn-secondary" @click="showFilter = false">關閉</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const showFilter = ref(false)
const searchKeyword = ref('')
const city = ref('不限')
const district = ref('不限')
const type = ref('不限')
const buildingType = ref('不限')
const rentRange = ref('不限')
const areaRange = ref('不限')
const customRent = ref({ min: null, max: null })
const customArea = ref({ min: null, max: null })
const selectedFeatures = ref([])
const showCustomRent = ref(false)
const showCustomArea = ref(false)

const districts = {
  不限: [],
  基隆市: ['不限', '仁愛區', '信義區', '中正區', '中山區', '安樂區', '暖暖區', '七堵區'],
  台北市: ['不限', '中正區', '大同區', '中山區', '松山區', '大安區', '萬華區', '信義區', '士林區', '北投區', '內湖區', '南港區', '文山區'],
  新北市: ['不限', '板橋區', '新莊區', '中和區', '永和區', '三重區', '新店區', '土城區', '樹林區', '蘆洲區', '汐止區', '鶯歌區', '三峽區', '五股區', '泰山區', '林口區', '八里區', '淡水區', '三芝區', '石門區', '金山區', '萬里區', '瑞芳區', '貢寮區', '平溪區', '雙溪區', '深坑區', '石碇區', '坪林區', '烏來區'],
  桃園市: ['不限', '桃園區', '中壢區', '平鎮區', '八德區', '楊梅區', '蘆竹區', '大溪區', '龍潭區', '龜山區', '大園區', '觀音區', '新屋區', '復興區'],
  新竹市: ['不限', '東區', '北區', '香山區'],
  新竹縣: ['不限', '竹北市', '竹東鎮', '新埔鎮', '關西鎮', '湖口鄉', '新豐鄉', '芎林鄉', '橫山鄉', '北埔鄉', '寶山鄉', '峨眉鄉', '尖石鄉', '五峰鄉'],
  宜蘭縣: ['不限', '宜蘭市', '羅東鎮', '蘇澳鎮', '頭城鎮', '礁溪鄉', '壯圍鄉', '員山鄉', '冬山鄉', '五結鄉', '三星鄉', '大同鄉', '南澳鄉'],
  苗栗縣: ['不限', '苗栗市', '頭份市', '苑裡鎮', '通霄鎮', '竹南鎮', '後龍鎮', '卓蘭鎮', '大湖鄉', '公館鄉', '銅鑼鄉', '南庄鄉', '頭屋鄉', '三義鄉', '西湖鄉', '造橋鄉', '三灣鄉', '獅潭鄉', '泰安鄉'],
  台中市: ['不限', '中區', '東區', '南區', '西區', '北區', '北屯區', '西屯區', '南屯區', '太平區', '大里區', '霧峰區', '烏日區', '豐原區', '后里區', '石岡區', '東勢區', '和平區', '新社區', '潭子區', '大雅區', '神岡區', '大肚區', '沙鹿區', '龍井區', '梧棲區', '清水區', '大甲區', '外埔區', '大安區'],
  彰化縣: ['不限', '彰化市', '鹿港鎮', '和美鎮', '員林市', '溪湖鎮', '田中鎮', '北斗鎮', '花壇鄉', '芬園鄉', '大村鄉', '永靖鄉', '伸港鄉', '線西鄉', '福興鄉', '秀水鄉', '埔心鄉', '埔鹽鄉', '大城鄉', '芳苑鄉', '竹塘鄉', '社頭鄉', '二水鄉', '田尾鄉', '埤頭鄉', '溪州鄉'],
  南投縣: ['不限', '南投市', '埔里鎮', '草屯鎮', '竹山鎮', '集集鎮', '名間鄉', '鹿谷鄉', '中寮鄉', '魚池鄉', '國姓鄉', '水里鄉', '信義鄉', '仁愛鄉'],
  雲林縣: ['不限', '斗六市', '斗南鎮', '虎尾鎮', '西螺鎮', '土庫鎮', '北港鎮', '莿桐鄉', '林內鄉', '古坑鄉', '大埤鄉', '崙背鄉', '二崙鄉', '麥寮鄉', '東勢鄉', '褒忠鄉', '臺西鄉', '元長鄉', '四湖鄉', '口湖鄉', '水林鄉'],
  嘉義市: ['不限', '東區', '西區'],
  嘉義縣: ['不限', '太保市', '朴子市', '布袋鎮', '大林鎮', '民雄鄉', '溪口鄉', '新港鄉', '六腳鄉', '東石鄉', '義竹鄉', '鹿草鄉', '水上鄉', '中埔鄉', '竹崎鄉', '梅山鄉', '番路鄉', '大埔鄉', '阿里山鄉'],
  台南市: ['不限', '中西區', '東區', '南區', '北區', '安平區', '安南區', '永康區', '歸仁區', '新化區', '左鎮區', '玉井區', '楠西區', '南化區', '仁德區', '關廟區', '龍崎區', '官田區', '麻豆區', '佳里區', '西港區', '七股區', '將軍區', '學甲區', '北門區', '新營區', '後壁區', '白河區', '東山區', '六甲區', '下營區', '柳營區', '鹽水區', '善化區', '大內區', '山上區', '新市區', '安定區'],
  高雄市: ['不限', '楠梓區', '左營區', '鼓山區', '三民區', '鹽埕區', '前金區', '新興區', '苓雅區', '前鎮區', '旗津區', '小港區', '鳳山區', '林園區', '大寮區', '大樹區', '大社區', '仁武區', '鳥松區', '岡山區', '橋頭區', '燕巢區', '田寮區', '阿蓮區', '路竹區', '湖內區', '茄萣區', '永安區', '彌陀區', '梓官區', '旗山區', '美濃區', '六龜區', '甲仙區', '杉林區', '內門區', '茂林區', '桃源區', '那瑪夏區'],
  屏東縣: ['不限', '屏東市', '潮州鎮', '東港鎮', '恆春鎮', '萬丹鄉', '長治鄉', '麟洛鄉', '九如鄉', '里港鄉', '鹽埔鄉', '高樹鄉', '萬巒鄉', '內埔鄉', '竹田鄉', '新埤鄉', '枋寮鄉', '新園鄉', '崁頂鄉', '林邊鄉', '南州鄉', '佳冬鄉', '琉球鄉', '車城鄉', '滿州鄉', '枋山鄉', '三地門鄉', '霧台鄉', '瑪家鄉', '泰武鄉', '來義鄉', '春日鄉', '獅子鄉', '牡丹鄉'],
  台東縣: ['不限', '台東市', '成功鎮', '關山鎮', '卑南鄉', '鹿野鄉', '池上鄉', '東河鄉', '長濱鄉', '太麻里鄉', '大武鄉', '綠島鄉', '蘭嶼鄉', '延平鄉', '金峰鄉', '達仁鄉', '海端鄉'],
  花蓮縣: ['不限', '花蓮市', '鳳林鎮', '玉里鎮', '新城鄉', '吉安鄉', '壽豐鄉', '光復鄉', '豐濱鄉', '瑞穗鄉', '萬榮鄉', '卓溪鄉', '秀林鄉'],
  澎湖縣: ['不限', '馬公市', '湖西鄉', '白沙鄉', '西嶼鄉', '望安鄉', '七美鄉'],
  金門縣: ['不限', '金城鎮', '金沙鎮', '金湖鎮', '金寧鄉', '烈嶼鄉', '烏坵鄉'],
  連江縣: ['不限', '南竿鄉', '北竿鄉', '莒光鄉', '東引鄉']
}
const districtOptions = ref([])

function updateDistrictOptions() {
  district.value = '不限'
  districtOptions.value = city.value ? districts[city.value] : []
}

function toggleCustomRent() {
  showCustomRent.value = rentRange.value === 'custom'
}
function toggleCustomArea() {
  showCustomArea.value = areaRange.value === 'custom'
}

function resetFilter() {
  searchKeyword.value = ''
  city.value = '不限'
  district.value = '不限'
  type.value = '不限'
  buildingType.value = '不限'
  rentRange.value = '不限'
  areaRange.value = '不限'
  customRent.value = { min: null, max: null }
  customArea.value = { min: null, max: null }
  selectedFeatures.value = []
  showCustomRent.value = false
  showCustomArea.value = false
  districtOptions.value = []
}

function toggleFeature(feature) {
  const index = selectedFeatures.value.indexOf(feature)
  if (index > -1) {
    selectedFeatures.value.splice(index, 1)
  } else {
    selectedFeatures.value.push(feature)
  }
}

const emit = defineEmits(['search'])

function emitSearch() {
  const query = {
    keyword: searchKeyword.value,
    city: city.value === '不限' ? '' : city.value,
    district: district.value === '不限' ? '' : district.value,
    type: type.value === '不限' ? '' : type.value,
    buildingType: buildingType.value === '不限' ? '' : buildingType.value,
    rentMin: showCustomRent.value ? customRent.value.min : getRentMin(),
    rentMax: showCustomRent.value ? customRent.value.max : getRentMax(),
    areaMin: showCustomArea.value ? customArea.value.min : getAreaMin(),
    areaMax: showCustomArea.value ? customArea.value.max : getAreaMax(),
    features: selectedFeatures.value
  }

  emit('search', query)

  nextTick(() => {
    const section = document.getElementById('property-list-section')
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  })
}

function getRentMin() {
  switch (rentRange.value) {
    case '5000元以下': return 0
    case '5000~10000元': return 5000
    case '10000元以上': return 10000
    default: return null
  }
}
function getRentMax() {
  switch (rentRange.value) {
    case '5000元以下': return 5000
    case '5000~10000元': return 10000
    case '10000元以上': return null
    default: return null
  }
}
function getAreaMin() {
  switch (areaRange.value) {
    case '10坪以下': return 0
    case '10~20坪': return 10
    case '20~30坪': return 20
    case '30坪以上': return 30
    default: return null
  }
}
function getAreaMax() {
  switch (areaRange.value) {
    case '10坪以下': return 10
    case '10~20坪': return 20
    case '20~30坪': return 30
    case '30坪以上': return null
    default: return null
  }
}

onMounted(() => {
  document.addEventListener('click', (e) => {
    const filterBox = document.querySelector('.filter-options')
    const searchBar = document.querySelector('.search-bar')
    if (!filterBox?.contains(e.target) && !searchBar?.contains(e.target)) {
      showFilter.value = false
    }
  })
})

// 特色對應文字
const featureOptions = [
  '可養狗', '可養貓', '可養其他寵物',
  '可開伙', '有家具', '有床', '有陽台', '公設', '車位',
  '有冷氣', '有電視', '有冰箱', '有洗衣機', '有飲水機', '有熱水器', '有天然瓦斯',
  '有網路', '有第四台', '公家電費', '公家水費',
  '短期租賃', '社會住宅', '房東同住'
]
</script>

<style scoped>
.search-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  z-index: 1050;
}

.search-bar {
  position: relative;
  width: 100%;
}

.search-bar input {
  border-radius: 50px;
  border: 1px solid #ccc;
  width: 100%;
  height: 40px;
  outline: none;
}

.search-bar button {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #3CDDD2;
  border: none;
  color: white;
}

.search-bar button:hover {
  background-color: #24B4A8;
}

.search-bar button:active {
  background-color: #007A75 !important;
}

.custom-search-btn {
  background-color: #3CDDD2;
  border: none;
  color: white;
}

.custom-search-btn:hover {
  background-color: #24B4A8;
}

.custom-search-btn:active {
  background-color: #007A75 !important;
}

.filter-options {
  position: absolute;
  top: 100%;
  left: -10%;
  min-width: 120%;
  max-width: 500px;
  background-color: #fff;
  border-radius: 10px;
  z-index: 2000 !important;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.feature-btn {
  border: 1px solid #3CDDD2;
  background-color: transparent;
  color: #3CDDD2;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.feature-btn.active,
.feature-btn:hover {
  background-color: #3CDDD2;
  color: white;
}
</style>