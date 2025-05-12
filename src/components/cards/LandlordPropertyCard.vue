<template>
    <div class="landlord-property-card d-flex" v-intersect="intersectAnimation">
        <!-- 房源內容 -->
        <div class="left-section">
  <div v-if="$slots.badge" class="card-badge">
    <slot name="badge"></slot>
  </div>

  <div @click="goToDetail">
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
        <div class="right-section d-flex flex-column align-items-center justify-content-start">
            <div class="landlord-info text-center mb-3">
                <AvatarImage :src="landlord.avatar" :size="140" class="mb-1" />
                <h5 class="mb-3">{{ landlord.name }}</h5>
                <small class="text-muted">{{ landlord.phone }}</small>
            </div>

            <button class="contact-btn w-100 mb-3" @click="openChat">
                <i class="fa-solid fa-comments me-2"></i> 聯絡房東
            </button>
            <a href="#" class="landlord-btn p-0">
                查看房東其他物件 <i class="fa-solid fa-chevron-right ms-1"></i>
            </a>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import AvatarImage from '@/components/Avatar.vue'
import { useChatPopupStore } from '@/stores/chatPopup'

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

const isFavorited = ref(false)
function toggleFavorite() {
  isFavorited.value = !isFavorited.value
}

const chatPopupStore = useChatPopupStore()

function openChat() {
  const landlordId = props.landlord.id
  const chatAlreadyExists = chatPopupStore.openChats.some(c => c.id === landlordId)

  if (!chatAlreadyExists) {
    chatPopupStore.openChats.push({
      id: landlordId,
      name: props.landlord.name,
      avatar: props.landlord.avatar
    })
  }

  chatPopupStore.activeChatId = landlordId
  chatPopupStore.open()
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

.landlord-property-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.landlord-property-card:hover .card-img{
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
