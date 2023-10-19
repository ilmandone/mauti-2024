<script lang="ts" setup>
import { RouterView } from 'vue-router'
import { useMainStore } from '@stores/main'
import { onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import SLoading from '@components/sections/S-Loading.vue'

const store = useMainStore()
const { setTheme } = store
const { theme } = storeToRefs(store)

onMounted(() => {
    const hour = new Date().getHours()
    setTheme(hour > 6 && hour < 20 ? 'light' : 'dark')
})

watch(theme, (v, p) => {
    if (document.body.classList.contains(`t-${p}`)) document.body.classList.remove(`t-${p}`)
    document.body.classList.add(`t-${v}`)
})
</script>

<template>
    <RouterView />
    <SLoading />
</template>

<style scoped></style>
