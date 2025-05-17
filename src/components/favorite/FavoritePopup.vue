<template>
  <Teleport to="body">
    <transition name="fade">
      <div class="popup-wrapper" ref="wrapperRef" v-if="visible">
        <h6 class="popup-header">收藏清單</h6>

        <div v-if="favorites.length" class="popup-body">
          <FavoriteMiniCard v-for="item in favorites" :key="item.propertyId" :image="item.image" :title="item.title"
            :city="item.city" :district="item.district" :address="item.address" :propertyId="item.propertyId"
            :rentPrice="item.rentPrice" @toggle-favorite="remove(item.propertyId)" />
        </div>

        <div v-else class="popup-empty">尚未收藏任何房源</div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, onUnmounted, computed } from 'vue'
import FavoriteMiniCard from '@/components/favorite/FavoriteMiniCard.vue'
import { useFavoriteStore } from '@/stores/favoriteStore.js'

const emits = defineEmits(['close'])
const props = defineProps({
  visible: Boolean
})

const wrapperRef = ref(null)

const favoriteStore = useFavoriteStore()
const favorites = computed(() => favoriteStore.list)
function remove(propertyId) {
  favoriteStore.removeFavorite(propertyId)
}
watch(
  () => props.visible,
  async (newVal) => {
    if (newVal) {
      await favoriteStore.fetchFavorites()
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside)
      }, 0)
    } else {
      document.removeEventListener('click', handleClickOutside)
    }
  }
)

function handleClickOutside(event) {
  if (wrapperRef.value && !wrapperRef.value.contains(event.target)) {
    emits('close')
  }
}

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.popup-wrapper {
  position: fixed;
  top: 90px;
  right: 115px;
  width: 490px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
  padding: 1.5rem;
  z-index: 1050;
}

.popup-header {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
}

.popup-body {
  max-height: 400px;
  overflow-y: auto;
}

.popup-empty {
  text-align: center;
  color: #999;
  padding: 1.5rem 0;
  font-size: 0.95rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
