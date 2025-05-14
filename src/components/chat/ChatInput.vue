<template>
    <!-- 聊天輸入框元件 -->
    <form class="chat-input" @submit.prevent="send">
        <Button iconOnly class="input-btn plus-btn"><i class="fas fa-plus"></i></Button>
        <input v-model="text" ref="inputRef" type="text" placeholder="請輸入訊息，按下Enter傳送" />
        <Button v-if="props.showEmoji" iconOnly class="input-btn emoji-btn" @click="togglePicker"><i class="far fa-smile"></i></Button>
        <div v-if="showPicker" class="emoji-picker">
            <Picker :data="data" :preview="false" @select="insertEmoji" />
        </div>
        <button v-if="props.showSend" type="submit" class="send-btn">傳送 <i class="fas fa-paper-plane"></i></button>
    </form>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import Button from '@/components/buttons/button.vue';
import data from '@emoji-mart/data';
import { Picker } from 'emoji-mart-vue-fast';

const text = ref('');
const inputRef = ref(null);
const showPicker = ref(false);

const props = defineProps({
    showSend: { type: Boolean, default: true },
    showEmoji: { type: Boolean, default: true },
});
const emit = defineEmits(['send']);

function togglePicker() {
    showPicker.value = !showPicker.value;
}

function insertEmoji(emoji) {
    const el = inputRef.value;
    if (el) {
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const value = el.value;
        text.value = value.slice(0, start) + emoji.native + value.slice(end);
        nextTick(() => {
            el.focus();
            el.selectionStart = el.selectionEnd = start + emoji.native.length;
        });
    } else {
        text.value += emoji.native;
    }
}

function send() {
    if (text.value.trim()) {
        emit('send', text.value);
        text.value = '';
    }
}
</script>
<style scoped>
.chat-input {
    display: flex;
    align-items: center;
    padding: 0.5rem 0.5rem 0.5rem 0.5rem;
    background: #fff;
    border-top: 1px solid #eee;
    gap: 0.5rem;
}

.input-btn {
    background: #fff5e6;
    color: #444;
    border: none;
    border-radius: 0.8rem;
    width: 2.2rem;
    height: 2.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    cursor: pointer;
    margin: 0 0.2rem;
    transition: background 0.2s;
    box-sizing: content-box;
}

.input-btn:hover {
    background: #ffe0b2;
}

.plus-btn {
    margin-left: 0.2rem;
}

.emoji-btn {
    color: #3c6df0;
    background: #fff;
    margin-right: 1rem;
    margin-left: 0.2rem;
    padding: 0.2rem;
    width: 20px;
    height: 20px;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
}

.emoji-btn:hover {
    background: #e3eaff;
}

.chat-input input {
    flex: 1;
    border: none;
    border-radius: 1.25rem;
    padding: 0.8rem 1.2rem;
    font-size: 1.05rem;
    background: #fff;
    outline: none;
}

.send-btn {
    background: #fff5e6;
    color: #222;
    border: none;
    border-radius: 0.8rem;
    padding: 0.5rem 1.1rem;
    font-size: 1rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.4em;
    cursor: pointer;
    transition: background 0.2s;
}

.send-btn:hover {
    background: #ffe0b2;
}

.hero-section .typing-text {
    padding-right: 0.3em;
}

.popup, .sidebar {
    padding-right: 2.5rem;
}

.emoji-picker {
    position: absolute;
    bottom: 60px;
    right: 30px;
    z-index: 999;
}
</style>