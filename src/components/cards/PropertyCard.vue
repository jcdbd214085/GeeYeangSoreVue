<template>
  <!-- 房源卡片元件 -->
  <div class="property-card" v-intersect>
    <div v-if="$slots.badge" class="card-badge">
      <slot name="badge"></slot>
    </div>
    <img :src="image" alt="房源圖片" class="card-img-top">
    <div class="card-body">
      <h5 class="card-title">{{ title }}</h5>
      <p class="card-text">{{ location }}</p>
      <div class="tags">
        <span v-for="(tag, i) in tags" :key="i" class="badge bg-light text-dark">{{ tag }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  image: { type: String, required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  tags: { type: Array, default: () => [] }
});

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

.card-title {
  color: var(--accent);
  font-weight: 700;
}

.tags {
  margin-top: 1rem;
}

.badge {
  margin-right: 0.5rem;
  padding: 0.5rem 1rem;
  font-weight: 500;
}
</style>