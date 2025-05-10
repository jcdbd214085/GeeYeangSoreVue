<template>
    <div v-if="lat && lng" id="map" class="map-container"></div>
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

onMounted(async () => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(props.address)}`)
        const data = await response.json()

        if (!data.length) {
            console.warn('找不到該地址的座標')
            return
        }

        lat.value = parseFloat(data[0].lat)
        lng.value = parseFloat(data[0].lon)

        await nextTick()

        const map = L.map('map').setView([lat.value, lng.value], props.zoom)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
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