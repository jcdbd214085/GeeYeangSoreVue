<template>
  <!-- 房源卡片元件 -->

  <div class="property-card" v-intersect="intersectAnimation" @click="goToDetail">
    <div v-if="$slots.badge" class="card-badge">
      <slot name="badge"></slot>
    </div>
    <img :src="image" alt="房源圖片" class="card-img-top">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center">
        <div class="rent">
          NT$ {{ new Intl.NumberFormat().format(rentPrice) }} / 月

        </div>
        <button class="follow-btn" @click.stop="toggleFavorite">
          <i :class="['fa-heart', isFavorited ? 'fa-solid' : 'fa-regular']"
            :style="{ color: isFavorited ? '#ff9800' : '' }"></i>
        </button>
      </div>
      <hr class="rent-hr" />
      <div class="location">
        <i class="fa-solid fa-location-dot me-1"></i>
        {{ city }} {{ district }} {{ address }}
      </div>
      <div class="type-title">
        <span>{{ propertyType }}</span> |
        <span>{{ title }}</span>
      </div>
      <div class="room-info">
        <i class="fa-solid fa-bed me-1"></i> {{ roomCount }} 房
        <i class="fa-solid fa-bath ms-3 me-1"></i> {{ bathroomCount }} 衛
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useFavoriteStore } from '@/stores/favoriteStore.js'
import { useUserStore } from '@/stores/user.js'

const userStore = useUserStore()
const emit = defineEmits(['open-login'])
const router = useRouter()
const props = defineProps({
  propertyId: { type: [String, Number], required: true },
  image: { type: String, required: true },
  rentPrice: { type: Number, required: true },
  propertyType: { type: String, required: true },
  title: { type: String, required: true },
  city: { type: String, required: true },
  district: { type: String, required: true },
  address: { type: String, required: true },
  roomCount: { type: Number, required: true },
  bathroomCount: { type: Number, required: true },
  intersectAnimation: { type: String, default: 'fadeInLeft' }
});

const favoriteStore = useFavoriteStore()
const isFavorited = computed(() => {
  return userStore.isLogin && favoriteStore.list.some(item => item.propertyId === props.propertyId)
})
const tenantId = localStorage.getItem('tenantId')
console.log("image url", props.image)

async function toggleFavorite() {
  if (!userStore.isLogin) {
    favoriteStore.pendingFavoriteId = props.propertyId
    emit('open-login')
    return
  }

  if (isFavorited.value) {
    await favoriteStore.removeFavorite(props.propertyId)
  } else {
    await favoriteStore.addFavorite(props.propertyId)
  }
}

function goToDetail() {
  if (props.propertyId) {
    router.push(`/property/${props.propertyId}`).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  } else {
    console.warn('propertyId 未定義')
  }
}

</script>
<style scoped>
.card-img-top {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px 8px 0 0;
  display: block;
}

.property-card {
  cursor: pointer;
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  opacity: 0;
  position: relative;
  transform: translateY(20px);
  border: 1px solid #eee;

}

.property-card.animate__animated {
  opacity: 1;
  transform: translateY(0);
}

.property-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.property-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: all 0.4s ease;
}

.property-card:hover img {
  transform: scale(1.05);
}

.card-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 2;
}

.card-body {
  padding: 1.5rem;
}

.rent {
  color: var(--accent);
  font-weight: bold;
  font-size: 1.3rem;
}

.rent-hr {
  border: none;
  border-bottom: 3px solid var(--accent);
  width: 150px;
  margin: 0.3rem 0;
}

.location {
  font-size: 0.8rem;
  margin-bottom: 0.4rem;
  color: #666;
}

.type-title {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.room-info {
  font-size: 0.8rem;
  color: #555;
}

.follow-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--accent);
  font-size: 1.4rem;
  transition: color 0.3s ease, transform 0.2s ease;
}

.follow-btn:hover {
  color: #24B4A8;
  transform: scale(1.2);
}

.follow-btn:active {
  transform: scale(0.9);
}


.badge {
  margin-right: 0.5rem;
  padding: 0.5rem 1rem;
  font-weight: 500;
}

.no-animation.property-card {
  opacity: 1 !important;
  transform: none !important;
  transition: none !important;
}

.property-card.small-card .rent {
  font-size: 1.1rem;
}

.property-card.small-card .type-title {
  font-size: 1rem;
}

.property-card.small-card .room-info {
  font-size: 0.75rem;
}

.property-card.small-card .location {
  font-size: 0.75rem;
}

.property-card.small-card .card-body {
  padding: 1rem;
}
</style>