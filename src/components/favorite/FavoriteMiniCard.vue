<template>
  <div class="favorite-mini-card d-flex align-items-center" @click="goToDetail">
    <img :src="image" class="mini-img me-3" />
    <div class="flex-grow-1">
      <div class="mini-title">{{ title }}</div>
      <div class="mini-location">{{ city }} {{ district }} {{ address }}</div>
      <div class="mini-price">NT$ {{ new Intl.NumberFormat().format(rentPrice) }} / 月</div>
    </div>
    <button class="favorite-btn" @click.stop="$emit('toggle-favorite', propertyId)">
      <i class="fa-solid fa-heart"></i>
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const props = defineProps({
  image: String,
  title: String,
  city: String,
  district: String,
  address: String,
  propertyId: [String, Number],
  rentPrice: Number
})

function goToDetail() {
  if (props.propertyId) {
    router.push(`/property/${props.propertyId}`)
  } else {
    console.warn('propertyId is missing')
  }
}
</script>

<style scoped>
.favorite-mini-card {
  cursor: pointer;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}
.mini-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
}
.mini-title {
  font-weight: 700;
  font-size: 1.2rem;
  margin-bottom: 4px;
  word-break: break-word;
}
.mini-location {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 4px;
  word-break: break-word;
}
.mini-price {
  font-size: 1rem;
  color: #24b4a8;
  font-weight: 600;
}
.favorite-btn {
  background: none;
  border: none;
  font-size: 1.6rem;
  color: #ff9800;
  cursor: pointer;
  padding-left: 0.5rem;
  padding-right: 0.2rem;
}
.favorite-btn:hover {
  color: #e07e00;
}
</style>