<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ThreeBackground } from '@/three/three-bg'

import { useMainStore } from '@stores/main'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'

const store = useMainStore()
const { theme } = storeToRefs(store)
const { setLoadProgress } = store

watch(theme, (cv) => {
    if (threeBg.value) threeBg.value.change(cv === 'light' ? 0 : 1)
})

const threeContainer = ref()
const threeBg = ref<ThreeBackground>()

onMounted(() => {
    const threeBG = new ThreeBackground(threeContainer.value, setLoadProgress, theme.value === 'light' ? 0 : 1)
    threeBG.start()

    threeBg.value = threeBG
})
</script>

<template>
    <div class="three-container" ref="threeContainer"></div>
</template>

<style scoped lang="scss">
.three-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
}
</style>
