<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useMainStore } from '@stores/main'
import { storeToRefs } from 'pinia'

const props = defineProps(['progress', 'mainHeight'])
const emit = defineEmits(['deltaDrag'])

const scroller = ref<HTMLElement>()
const downY = ref(0)

const store = useMainStore()
const { isTouch } = storeToRefs(store)
const { setDotVisible } = store

//#region Scroller
/**
 * Get the scroller height
 */
const height = computed<number>(() => {
    let h = 200
    if (props.mainHeight) {
        h = (window.innerHeight / props.mainHeight) * window.innerHeight
    }
    return h
})

/**
 * Get the delta position for scroller
 */
const delta = computed<number>(() => {
    let value = 0
    if (props.progress) {
        let delta = ~~props.progress - props.progress
        if (delta < 0) delta += 1

        value = delta * (window.innerHeight - height.value)
    }

    return value
})
//#endregion

//#region Drag
const mouseDownOnScroller = (e: MouseEvent) => {
    downY.value = e.clientY

    window.addEventListener('mousemove', mouseMoveInWindow)
    window.addEventListener('mouseup', mouseExitFromWindow)
    window.addEventListener('mouseleave', mouseExitFromWindow)
}

const mouseExitFromWindow = () => {
    window.removeEventListener('mousemove', mouseMoveInWindow)
    window.removeEventListener('mouseup', mouseExitFromWindow)
    window.removeEventListener('mouseleave', mouseExitFromWindow)
}

const mouseMoveInWindow = (e: MouseEvent) => {
    const delta = e.clientY - downY.value
    emit('deltaDrag', delta)
    window.setTimeout(() => {
        downY.value = e.clientY
    })
}

//#endregion

// TODO: Da riprendere con calma quando ho voglia di metterci la testa
onMounted(() => {
    if (!isTouch) scroller.value?.addEventListener('mousedown', mouseDownOnScroller)
})
</script>
<template>
    <div
        ref="scroller"
        class="scroller"
        aria-hidden="true"
        :style="{ transform: `translate3d(0, ${delta}px, 0)`, height: `${height}px` }"
        @mouseenter="() => setDotVisible(false)"
        @mouseleave="() => setDotVisible(true)"
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

    transition: width 0.25s ease-in-out;
    will-change: width;

    &::after {
        content: '';
        position: absolute;
        top: 0.5rem;
        left: 0.4rem;
        width: 0.1rem;
        height: calc(100% - 1rem);

        border-radius: 0.15rem;

        background-color: var(--color-main);

        transition-property: width, left, border-radius, background-color;
        transition-duration: 0.25s;
        transition-timing-function: ease-in-out;

        will-change: width, left, border-radius;
    }

    @include utils.media('mouse') {
        &:hover {
            width: 1.4rem;

            &::after {
                left: 0.15rem;
                width: 0.7rem;
                border-radius: 0.35rem;

                background-color: var(--color-emphasize);
            }
        }
    }

    @include utils.media('dm') {
        &::after {
            left: 0.35rem;
            width: 0.3rem;
            border-radius: 0.175rem;
        }
    }

    @include utils.media('dl') {
        &::after {
            left: 0.3rem;
            width: 0.4rem;
            border-radius: 0.2rem;
        }
    }
}
</style>
