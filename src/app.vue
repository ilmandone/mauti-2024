<script lang="ts" setup>
import { useMainStore } from '@stores/main'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import SLoading from '@components/sections/s-loading.vue'
import MainView from '@/views/main-view.vue'
import SHeader from '@components/sections/s-header.vue'
import SBackground from '@components/sections/s-background.vue'
import UiDot from '@components/ui/ui-dot.vue'

const store = useMainStore()
const { setTheme, setIsTouch, setIsFocused } = store
const { theme, isTouch, isFocused } = storeToRefs(store)

const loadingProgress = ref<number>(0)
const loadingStart = ref<boolean>(false)
const loadingEnd = ref<boolean>(false)

function onWindowBlur() {
    setIsFocused(false)
}

function onWindowFocus() {
    setIsFocused(true)
}

onMounted(() => {
    const hour = new Date().getHours()
    setTheme(hour > 6 && hour < 20 ? 'light' : 'dark')
    setIsTouch(window.navigator.maxTouchPoints > 0)
    setIsFocused(true)

    window.addEventListener('focus', onWindowFocus)
    window.addEventListener('blur', onWindowBlur)
})

onUnmounted(() => {
    window.removeEventListener('focus', onWindowFocus)
    window.removeEventListener('blur', onWindowBlur)
})

watch(theme, (v, p) => {
    if (document.body.classList.contains(`t-${p}`)) document.body.classList.remove(`t-${p}`)
    document.body.classList.add(`t-${v}`)
})
</script>

<template>
    <SBackground :start-loading="loadingStart" @load-progress="(v: number) => (loadingProgress = v)" />
    <SHeader />
    <MainView :load-end="loadingProgress === 100" :cover-hidden="loadingEnd" />
    <SLoading
        :progress="loadingProgress"
        @loading-start="(v: boolean) => (loadingStart = v)"
        @loading-end="(value: boolean) => (loadingEnd = value)"
    />
    <UiDot v-if="!isTouch && isFocused" />
</template>

<style scoped></style>
