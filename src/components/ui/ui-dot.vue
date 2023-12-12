<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useMainStore } from '@stores/main'
import { storeToRefs } from 'pinia'

const store = useMainStore()
const { dotVisible } = storeToRefs(store)

const dotRef = ref<HTMLElement>()
let target = { x: 0, y: 0 }
let current = { x: 0, y: 0 }
let reqIsActive = ref(false)

const emits = defineEmits<{
    (event: 'dotPosition', value: { x: number; y: number }): void
}>()

function onMouseMove(e: MouseEvent) {
    target = { x: e.clientX, y: e.clientY }
}

function onInterval() {
    const newCurrent = {
        x: Math.round(current.x + (target.x - current.x) / 20),
        y: Math.round(current.y + (target.y - current.y) / 20)
    }

    if (dotRef.value && (newCurrent.x !== current.x || newCurrent.y !== current.y)) {
        current = newCurrent
        emits('dotPosition', current)
        dotRef.value.style.transform = `translate(${current.x}px, ${current.y}px)`
    }

    reqIsActive.value && window.requestAnimationFrame(onInterval)
}

onMounted(() => {
    if (dotRef.value) {
        window.addEventListener('mousemove', onMouseMove)
        window.requestAnimationFrame(onInterval)
        reqIsActive.value = true
    }
})

onUnmounted(() => {
    window.removeEventListener('mousemove', onMouseMove)
    reqIsActive.value = false
})
</script>

<template>
    <div ref="dotRef" class="dot" :class="{ minimized: !dotVisible }">
        <div class="dot__content"></div>
    </div>
</template>

<style scoped lang="scss">
@use '@styles/utils';

.dot {
    position: fixed;
    top: 0;
    left: 0;

    pointer-events: none;

    @include utils.zIndex('dot');

    &__content {
        width: 1rem;
        height: 1rem;
        border-radius: 50%;

        transform: translate(-50%, -50%);
        background-color: var(--color-emphasize);

        transition-property: background-color, opacity, transform;
        transition-duration: 0.25s;
        transition-timing-function: ease-in-out;
    }

    &.minimized .dot__content {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0);
    }
}
</style>
