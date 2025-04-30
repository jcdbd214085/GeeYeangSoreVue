<template>
    <!-- 聯絡人列表元件 -->
    <div class="contacts-list">
        <div class="contacts-search">
            <input type="text" v-model="search" placeholder="搜尋聯絡人" />
        </div>
        <div class="contacts-scroll">
            <div v-for="c in filteredContacts" :key="c.id"
                :class="['contact-item', { active: c.id === activeContactId }]" @click="$emit('select', c.id)">
                <Avatar :src="c.avatar" :alt="c.name" :size="40" class="avatar" />
                <div class="contact-info">
                    <div class="contact-name">{{ c.name }}</div>
                    <div class="contact-last">{{ c.lastMsg }}</div>
                </div>
                <span v-if="c.unread" class="unread">{{ c.unread }}</span>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import Avatar from '@/components/Avatar.vue';
const props = defineProps(['contacts', 'activeContactId']);
const search = ref('');
const filteredContacts = computed(() =>
    props.contacts.filter(c => c.name.includes(search.value))
);
</script>
<style scoped>
.contacts-list {
    height: 100vh;
    background: #f4f5f7;
    padding: 1rem 0.5rem 1rem 1rem;
    display: flex;
    flex-direction: column;
}

.contacts-search {
    padding-bottom: 1rem;
}

.contacts-search input {
    width: 100%;
    padding: 0.6rem 1rem;
    border-radius: 1.2rem;
    border: 1px solid #ddd;
    font-size: 1rem;
    background: #fff;
}

.contacts-scroll {
    flex: 1;
    overflow-y: auto;
    padding-right: 0.5rem;
}

.contact-item {
    display: flex;
    align-items: center;
    padding: 0.7rem 0.5rem;
    border-radius: 1.25rem;
    cursor: pointer;
    margin-bottom: 0.5rem;
    transition: background 0.2s;
}

.contact-item.active,
.contact-item:hover {
    background: #e0f7fa;
}

.avatar {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    margin-right: 0.8rem;
    object-fit: cover;
}

.contact-info {
    flex: 1;
}

.contact-name {
    font-weight: bold;
    font-size: 1.05rem;
}

.contact-last {
    color: #888;
    font-size: 0.95rem;
    margin-top: 0.1rem;
}

.unread {
    background: #ff9800;
    color: #fff;
    border-radius: 1rem;
    padding: 0.1rem 0.7rem;
    font-size: 0.9rem;
    margin-left: 0.5rem;
}

@media (max-width: 768px) {
    .contacts-list {
        display: none;
    }
}
</style>