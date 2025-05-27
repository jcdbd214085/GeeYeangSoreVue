<template>
  <div class="landlord-property-card d-flex" v-intersect="intersectAnimation">
    <!-- 房源內容 -->
    <div class="left-section">  
      <div class="image-wrapper" @click="goToDetail">
        <div v-if="$slots.badge" class="card-badge">
        <slot name="badge"></slot>
        </div>
        <img :src="image" alt="房源圖片" class="card-img" />
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
    </div>

    <!-- 房東資訊 -->
    <div class="right-section landlord-info">
      <AvatarImage :src="landlord.avatar" :size="155" class="mb-4" />
      <h5 class="mb-2">{{ landlord.name }}</h5>
      <div class="landlord-text mb-3">
        
        <small class="text-muted ms-2 mb-1">
          <i class="fa-solid fa-phone me-2"></i>{{ landlord.phone }}
        </small><br>
        <small class="text-muted ms-2 mb-2">
          <i class="fa-solid fa-envelope me-2"></i>{{ landlord.email }}
        </small>
      </div>

      <button class="contact-btn w-100 " @click="openChat">
        <i class="fa-solid fa-comments me-2"></i> 聯絡房東
      </button>
      <!-- <a href="#" class="landlord-btn p-0">
        查看房東其他物件 <i class="fa-solid fa-chevron-right ms-1"></i>
      </a> -->
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import AvatarImage from '@/components/Avatar.vue'
import { useFavoriteStore } from '@/stores/favoriteStore.js'
import { useUserStore } from '@/stores/user.js'
import axios from 'axios'

const userStore = useUserStore()
const emit = defineEmits(['open-login', 'open-chat'])
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
  landlord: { type: Object, required: true },
  intersectAnimation: { type: String, default: 'fadeInRight' }
})

function goToDetail() {
  if (props.propertyId) {
    router.push(`/property/${props.propertyId}`)
  } else {
    console.warn('propertyId 未定義')
  }
}

const favoriteStore = useFavoriteStore()
const isFavorited = computed(() => {
  return userStore.isLogin && favoriteStore.list.some(item => item.propertyId === props.propertyId)
})
const tenantId = localStorage.getItem('tenantId')
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

async function openChat() {
  try {
    const res = await axios.get('/api/auth/me', { withCredentials: true })
    if (!res.data.success) {
      emit('open-login')
      return
    }
    const myTenantId = res.data.tenantId
    const landlordTenantId = props.landlord.id
    if (String(myTenantId) === String(landlordTenantId)) {
      alert('無法與自己對話')
      return
    }
    emit('open-chat', landlordTenantId)
  } catch (e) {
    emit('open-login')
  }
}
</script>

<style scoped>
.landlord-property-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
  border: 1px solid #eee;
  display: flex;
  flex-direction: row;
  height: 100%;
}

.left-section {
  flex: 2;
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
  overflow: hidden;
  cursor: pointer;
}

.image-wrapper {
  position: relative; 
}

.card-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 2;
}

.landlord-property-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.landlord-property-card:hover .card-img {
  transform: scale(1.05);
  transition: transform 0.3s ease;
}

.card-img {
  width: 100%;
  height: 230px;
  object-fit: cover;
  border-top-right-radius: 0;
  border-top-left-radius: 15px;
}

.card-body {
  padding: 1.2rem;
}

.right-section {
  flex: 1;
  padding: 2rem 1.5rem;
  border-left: 1px solid #eee;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden; 
}

.right-section::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url('/image/logo2.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: left -10px bottom -12px;
  opacity: 0.1; 
  z-index: 0;
}

.right-section > * {
  position: relative;
  z-index: 1;
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

.landlord-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.landlord-text {
  align-self: flex-start; 
  text-align: left;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.landlord-extra {
  font-size: 1.rem;
}

.landlord-btn {
  color: #4ecdc4;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.landlord-btn:hover {
  color: #3CDDD2;
}

.landlord-btn:active {
  color: #007A75;
}

.contact-btn {
  background-color: #3CDDD2;
  border: none;
  color: white !important;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 500;
  transition: background-color 0.3s ease, transform 0.2s ease;
  text-align: center;
}

.contact-btn:hover {
  background-color: #2BC8C0;
}

.contact-btn:active {
  background-color: #009D95;
}

.no-animation.landlord-property-card {
  opacity: 1 !important;
  transform: none !important;
  transition: none !important;
}
</style>
