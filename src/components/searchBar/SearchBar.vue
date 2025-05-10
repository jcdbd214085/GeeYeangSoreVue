<template>
    <div class="search-container position-absolute">
        <!-- 搜尋欄 -->
        <form class="search-bar d-flex bg-white p-2 rounded-pill" @click.stop="showFilter = true">
            <input class="form-control" v-model="searchKeyword" placeholder="輸入物件標題或地址" />
            <button class="btn btn-primary" type="submit">
                <i class="fa-solid fa-magnifying-glass"></i>
            </button>
        </form>

        <!-- 篩選欄 -->
        <div class="filter-options p-4 border rounded shadow" v-show="showFilter" ref="filterOptions">
            <h4 class="fw-bold mb-5">篩選條件</h4>
            <form @submit.prevent>
                <!-- 位置 -->
                <div class="mb-3">
                    <label class="fw-bold mb-1">位置</label>
                    <div class="d-flex">
                        <select class="form-select me-2" v-model="city" @change="updateDistrictOptions">
                            <option disabled value="">選擇城市</option>
                            <option v-for="c in Object.keys(districts)" :key="c" :value="c">{{ c }}</option>
                        </select>
                        <select class="form-select" v-model="district" :disabled="!districtOptions.length">
                            <option disabled value="">選擇區域</option>
                            <option v-for="d in districtOptions" :key="d">{{ d }}</option>
                        </select>
                    </div>
                </div>

                <!-- 類型與型態 -->
                <div class="mb-3 d-flex">
                    <div class="w-50 me-2">
                        <label class="fw-bold mb-1">類型</label>
                        <select class="form-select" v-model="type">
                            <option>不限</option>
                            <option>整層出租</option>
                            <option>整棟出租</option>
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
                            <option>電梯大樓</option>
                            <option>透天</option>
                            <option>別墅</option>
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
                            <input type="number" class="form-control me-2" placeholder="最低"
                                v-model.number="customRent.min">
                            <span class="align-self-center">~</span>
                            <input type="number" class="form-control ms-2" placeholder="最高"
                                v-model.number="customRent.max">
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
                            <input type="number" class="form-control me-2" placeholder="最小"
                                v-model.number="customArea.min">
                            <span class="align-self-center">~</span>
                            <input type="number" class="form-control ms-2" placeholder="最大"
                                v-model.number="customArea.max">
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
import { ref, onMounted } from 'vue'

const showFilter = ref(false)
const searchKeyword = ref('')
const city = ref('')
const district = ref('')
const type = ref('')
const buildingType = ref('')
const rentRange = ref('')
const areaRange = ref('')
const customRent = ref({ min: null, max: null })
const customArea = ref({ min: null, max: null })
const selectedFeatures = ref([])

const showCustomRent = ref(false)
const showCustomArea = ref(false)

const districts = {
    高雄: ['鳳山區', '三民區', '左營區', '楠梓區', '前鎮區'],
    台北: ['大安區', '信義區', '中山區', '文山區', '士林區'],
    台中: ['西屯區', '北區', '南區', '東區', '大里區']
}

const districtOptions = ref([])

function updateDistrictOptions() {
    district.value = ''
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
    city.value = ''
    district.value = ''
    type.value = ''
    buildingType.value = ''
    rentRange.value = ''
    areaRange.value = ''
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
// 點擊頁面其他地方自動關閉 filter
onMounted(() => {
    document.addEventListener('click', (e) => {
        const filterBox = document.querySelector('.filter-options')
        const searchBar = document.querySelector('.search-bar')
        if (!filterBox?.contains(e.target) && !searchBar?.contains(e.target)) {
            showFilter.value = false
        }
    })
})

// 可自定義特色
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
    z-index: 1100;
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