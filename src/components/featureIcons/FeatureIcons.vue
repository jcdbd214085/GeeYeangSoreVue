<template>
    <div class="feature-icons">

        <div v-for="(feature, index) in features" :key="index" class="feature-item"
            :class="{ inactive: !feature.active }">
            <i :class="feature.icon" class="feature-icon me-2"></i>
            <span>{{ feature.label }}</span>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    features: {
        type: Array,
        required: true
    }
});
</script>

<style scoped>

.feature-icons {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 1.5rem 1.8rem;
}

.feature-item {
    display: flex;
    align-items: center;
    font-size: 0.95rem;
    color: #333;
    opacity: 1;
}

.feature-item.inactive {
    color: #aaa;
    opacity: 0.5;
}

.feature-item:not(.inactive) {
    color: #3CDDD2;
    opacity: 1;
}

.feature-icon {
    font-size: 1.5rem;
    margin-right: 0.6rem;
}
</style>