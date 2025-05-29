<template>
    <div class="landlord-card shadow-sm">
        <h5 class="section-title">房東資訊</h5>

        <!-- 橫向排列 -->
        <div class="landlord-info mb-3">
            <img
                :src="getAvatarUrl(landlord.avatar)"
                :alt="landlord.name"
                class="avatar-img me-3"
                :style="{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }"
            />
            <!-- 名字與電話包一層 -->
            <div class="landlord-text">
                <h5 class="mb-2">{{ landlord.name }}</h5>
                <small class="text-muted d-block mb-1">
                    <i class="fa-solid fa-phone me-2"></i>{{ landlord.phone }}
                </small>
                <small class="text-muted d-block">
                    <i class="fa-solid fa-envelope me-2"></i>{{ landlord.email }}
                </small>
            </div>
        </div>

        <button class="contact-btn w-100 mb-3" @click="openChat">
            <i class="fa-solid fa-comments me-2"></i> 聯絡房東
        </button>

        <!-- <a href="#" class="landlord-btn">
            查看房東其他物件 <i class="fa-solid fa-chevron-right ms-1"></i>
        </a> -->
    </div>
</template>

<script setup>
import AvatarImage from '@/components/Avatar.vue'
import { ref } from 'vue'
import axios from 'axios'

const props = defineProps({
    landlord: {
        type: Object,
        required: true
    }
})
const emit = defineEmits(['open-chat'])

async function openChat() {
    try {
        const res = await axios.get('/api/auth/me', { withCredentials: true })
        if (!res.data.success) {
            alert('請先登入');
            return;
        }
        const myTenantId = res.data.tenantId
        const landlordTenantId = props.landlord.id
        if (String(myTenantId) === String(landlordTenantId)) {
            alert('無法與自己對話');
            return;
        }
        emit('open-chat', landlordTenantId)
    } catch (e) {
        alert('請先登入');
    }
}

function getAvatarUrl(filename) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!filename || !/^[\w\-.]+\.(jpg|jpeg|png|gif)$/i.test(filename)) {
    return `${baseUrl}/images/User/default.png`;
  }
  return `${baseUrl}/images/User/${filename}`;
}
</script>

<style scoped>
.landlord-card {
    background: #fff;
    padding: 1.5rem;
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    width: 100%;
}

.section-title {
    font-size: 1.4rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #333;
}

.landlord-info {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
}

.landlord-text {
    text-align: left;
}

.landlord-name {
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.2rem;
}

.landlord-phone {
    font-size: 1.05rem;
    color: #666;
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

.landlord-btn {
    color: #24B4A8;
    text-decoration: none;
    font-weight: 500;
    font-size: 1rem;
    display: inline-block;
    text-align: center;
    width: 100%;
    transition: color 0.3s ease;
}

.landlord-btn:hover {
    color: #3CDDD2;
}

.landlord-btn:active {
    color: #007A75;
}
</style>