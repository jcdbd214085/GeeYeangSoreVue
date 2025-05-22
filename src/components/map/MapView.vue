<template>
  <!-- 正在查地址 -->
  <div v-if="isLocating" class="text-muted small">地圖載入中...</div>

  <!-- 查詢成功 -->
  <div v-else-if="lat && lng" :id="mapId" class="map-container"></div>

  <!-- 查無結果 -->
  <div v-else-if="isFailed" class="text-muted small">
    找不到地址座標：「{{ props.address }}」
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps({
  address: {
    type: String,
    required: true
  },
  zoom: {
    type: Number,
    default: 16
  }
})

const lat = ref(null)
const lng = ref(null)
const mapId = `map-${Math.random().toString(36).substring(2, 10)}`
const isLocating = ref(true) 
const isFailed = ref(false)

function generateAddressVariants(originalAddress) {
  const variants = new Set()
  const base = originalAddress.trim()

  if (!base) return []

  // 1. 完整原始地址
  variants.add(base)

  // 2. 只保留到巷
  const laneMatch = base.match(/^(.*?[路街道]\d+巷)/)
  if (laneMatch) {
    variants.add(laneMatch[1])
  }

  // 3. 只保留到路/街/大道
  const roadMatch = base.match(/^(.*?[路街大道])/)
  if (roadMatch) variants.add(roadMatch[1])

  // 4. 只保留到區
  const districtMatch = base.match(/^(.*?[市縣].*?[區鎮鄉])/)
  if (districtMatch) variants.add(districtMatch[1])

  return [...variants].filter(v => v.length >= 6)
}

onMounted(async () => {
  try {
    if (!props.address || typeof props.address !== 'string' || props.address.trim() === '') {
      console.warn('地址為空或格式錯誤:', props.address)
      return
    }

    const originalAddress = props.address.trim()
    const addressVariants = generateAddressVariants(originalAddress)

    console.log('地址查詢候選：', addressVariants)

    isLocating.value = true
    isFailed.value = false
    let found = false
    for (const raw of addressVariants) {
      const query = `台灣 ${raw}`
      console.log('嘗試查詢地址：', query)
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
      const data = await response.json()
      if (data.length > 0) {
        lat.value = parseFloat(data[0].lat)
        lng.value = parseFloat(data[0].lon)
        found = true
        break
      }
    }

    isLocating.value = false
    isFailed.value = !found

    if (!found) {
      console.warn('所有變化後的地址都查不到座標：', props.address)
      return
    }

    await nextTick()

    const map = L.map(mapId).setView([lat.value, lng.value], props.zoom)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '地圖資料 © OpenStreetMap',
      crossOrigin: true
    }).addTo(map)

    L.marker([lat.value, lng.value]).addTo(map)

  } catch (error) {
    console.error('地圖初始化失敗：', error)
  }
})
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 350px;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
