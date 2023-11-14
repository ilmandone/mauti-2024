<script setup lang="ts">
import { computed } from 'vue'

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
        let delta = ~~props.progress - props.progress
        if (delta < 0) delta += 1

        value = delta * (window.innerHeight - height.value)
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
@use '@styles/utils';

.scroller {
    position: fixed;
    top: 0;
    right: 0;
    width: 1rem;
    height: 4rem;

    background-color: transparent;

    @include utils.zIndex('scroller');

    &::after {
        content: '';
        position: absolute;
        top: 0.25rem;
        left: 0.4rem;
        width: 0.2rem;
        height: calc(100% - 0.5rem);

        border-radius: 0.15rem;

        background-color: var(--color-main);
    }

    @include utils.media('dm') {
        &::after {
            left: 0.35rem;
            width: 0.3rem;

            border-radius: 0.175rem;
        }
    }

    @include utils.media('dm') {
        &::after {
            left: 0.25rem;
            width: 0.5rem;

            border-radius: 0.25rem;
        }
    }
}
</style>
