<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ThreeBackground } from '@/three/three-bg'

const threeContainer = ref()
const threeBg = ref<ThreeBackground>()

onMounted(() => {
    const threeBG = new ThreeBackground(threeContainer.value)
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
