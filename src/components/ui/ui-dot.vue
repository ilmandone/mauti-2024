<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useMainStore } from '@stores/main'
import { storeToRefs } from 'pinia'

const store = useMainStore()
const { dotVisible } = storeToRefs(store)

const dotRef = ref(null)
let target = { x: 0, y: 0 }
let current = { x: 0, y: 0 }
let interval = ref(0)

function onMouseMove(e: MouseEvent) {
    target = { x: e.clientX, y: e.clientY }
}

function onInterval() {
    current = {
        x: current.x + (target.x - current.x) / 10,
        y: current.y + (target.y - current.y) / 10
    }

    dotRef.value.style.transform = `translate(${current.x}px, ${current.y}px)`
}

onMounted(() => {
    if (dotRef.value) {
        window.addEventListener('mousemove', onMouseMove)
        interval.value = window.setInterval(onInterval, 20)
    }
})

onUnmounted(() => {
    window.removeEventListener('mousemove', onMouseMove)
    window.clearInterval(interval.value)
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
