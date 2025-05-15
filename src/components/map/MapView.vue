<template>
  <div v-if="lat && lng" :id="mapId" class="map-container"></div>
  <div v-else class="text-muted small">
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

onMounted(async () => {
  try {
    if (!props.address || typeof props.address !== 'string' || props.address.trim() === '') {
      console.warn('地址為空或格式錯誤:', props.address)
      return
    }

    // 去掉門牌號碼（提升查詢成功率）
    const cleanedAddress = props.address.replace(/[0-9]{1,4}號?/g, '').trim()
    console.log('查詢地圖地址：', cleanedAddress)

    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanedAddress)}`)
    const data = await response.json()

    if (!data.length) {
      console.warn('找不到該地址的座標：', cleanedAddress)
      return
    }

    lat.value = parseFloat(data[0].lat)
    lng.value = parseFloat(data[0].lon)

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
