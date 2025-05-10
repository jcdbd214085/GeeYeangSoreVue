<template>
    <div class="landlord-card shadow-sm">
        <h5 class="section-title">房東資訊</h5>

        <!-- 橫向排列 -->
        <div class="landlord-info mb-3">
            <AvatarImage :src="landlord.avatar" :size="100" class="me-3" />

            <!-- 名字與電話包一層 -->
            <div class="landlord-text">
                <h6 class="mb-1">{{ landlord.name }}</h6>
                <small class="text-muted">{{ landlord.phone }}</small>
            </div>
        </div>

        <button class="contact-btn w-100 mb-3" @click="openChat">
            <i class="fa-solid fa-comments me-2"></i> 聯絡房東
        </button>

        <a href="#" class="landlord-btn">
            查看房東其他物件 <i class="fa-solid fa-chevron-right ms-1"></i>
        </a>
    </div>
</template>

<script setup>
import AvatarImage from '@/components/Avatar.vue'
import { useChatPopupStore } from '@/stores/chatPopup'
import { ref } from 'vue'

const props = defineProps({
    landlord: {
        type: Object,
        required: true
    }
})

const chatPopupStore = useChatPopupStore()

function openChat() {
    const { id, name, avatar } = props.landlord
    const exists = chatPopupStore.openChats.some(c => c.id === id)
    if (!exists) {
        chatPopupStore.openChats.push({ id, name, avatar })
    }
    chatPopupStore.activeChatId = id
    chatPopupStore.open()
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
    color: #4ecdc4;
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