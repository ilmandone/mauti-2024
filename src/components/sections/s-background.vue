<script setup lang="ts">
import { ref, watch } from 'vue'
import { ThreeBackground } from '@/three/three-bg'

import { useMainStore } from '@stores/main'
import { storeToRefs } from 'pinia'

export interface Props {
    startLoading: boolean
    scrollProgress: number
    pointerPosition: { x: number; y: number }
}

const store = useMainStore()
const { theme } = storeToRefs(store)

const props = withDefaults(defineProps<Props>(), {
    startLoading: false,
    scrollProgress: 0,
    pointerPosition: () => {
        return { x: 0, y: 0 }
    }
})

const emits = defineEmits<{
    (event: 'loadProgress', id: number): void
}>()

const loadProgressCb = (v: number) => {
    emits('loadProgress', v)
}

// Hooks
watch(
    () => props.startLoading,
    () => {
        const tBG = new ThreeBackground(threeContainer.value, loadProgressCb, theme.value === 'light' ? 0 : 1)
        tBG.start()

        threeBg.value = tBG
    }
)

watch(theme, (cv) => {
    if (threeBg.value) threeBg.value.change(cv === 'light' ? 0 : 1)
})

watch(
    () => props.scrollProgress,
    (v: number) => {
        threeBg.value?.scrollProgression(v)
    }
)

watch(
    () => props.pointerPosition,
    (v: { x: number; y: number }) => {
        threeBg.value?.pointerPosition(v)
    }
)

const threeContainer = ref()
const threeBg = ref<ThreeBackground>()
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
