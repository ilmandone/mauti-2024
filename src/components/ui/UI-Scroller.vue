<script setup lang="ts">
import { computed, watch } from 'vue'

const props = defineProps(['progress', 'mainHeight'])

const height = computed<number>(() => {
    let h = 200
    if (props.mainHeight) {
        h = (window.innerHeight / props.mainHeight) * window.innerHeight
    }
    return h
})

const delta = computed(() => {
    let value = 0
    if (props.progress) {
        value = (~~props.progress - props.progress) * (window.innerHeight - height.value)
    }
    return value
})
</script>
<template>
    <div
        class="scroller"
        aria-hidden="true"
        :style="{ transform: `translate3d(0, ${delta}px, 0)`, height: `${height}px` }"
    ></div>
</template>

<style scoped lang="scss">
.scroller {
    position: fixed;
    top: 0;
    right: 0;
    width: 1rem;
    height: 4rem;

    background-color: transparent;
    pointer-events: none;

    // transition: transform 0.2s ease-out;

    &::after {
        content: '';
        position: absolute;
        top: 0.25rem;
        left: 0.25rem;
        width: 0.5rem;
        height: calc(100% - 0.5rem);

        border-radius: 0.25rem;

        background-color: var(--color-main);
    }
}
</style>
