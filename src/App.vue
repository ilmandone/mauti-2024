<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useMainStore } from '@stores/main'
import { onMounted } from 'vue'

const store = useMainStore()
const { setTheme } = store

onMounted(() => {
    const hour = new Date().getHours()
    setTheme(hour > 6 && hour < 20 ? 'light' : 'dark')
})
</script>

<template>
    <RouterView />
</template>

<style scoped></style>
