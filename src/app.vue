<script lang="ts" setup>
import { useMainStore } from '@stores/main'
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import SLoading from '@components/sections/s-loading.vue'
import MainView from '@/views/main-view.vue'
import SHeader from '@components/sections/s-header.vue'
import SBackground from '@components/sections/s-background.vue'

const store = useMainStore()
const { setTheme } = store
const { theme } = storeToRefs(store)

const loadingProgress = ref<number>(0)
const startLoading = ref<boolean>(false)

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
    <SBackground :start-loading="startLoading" @load-progress="(v: number) => (loadingProgress = v)" />
    <SHeader />
    <MainView :load-end="loadingProgress === 100" />
    <SLoading :progress="loadingProgress" @start-loading="(v: boolean) => (startLoading = v)" />
</template>

<style scoped></style>