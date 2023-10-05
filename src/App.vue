<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'

onMounted(() => {
    document.documentElement.style.setProperty(
        '--main-scroll-animation-time',
        window.navigator.maxTouchPoints > 0 ? '600ms' : '1200ms'
    )
})
</script>

<template>
    <RouterView />
</template>

<style scoped></style>
