<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useMainStore } from '@stores/main'
import debounce from 'lodash.debounce'

const props = defineProps(['progress', 'mainHeight'])
// const emit = defineEmits(['deltaDrag'])

const scroller = ref<HTMLElement>()
// const startY = ref(0)

const store = useMainStore()
// const { isTouch } = store

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
/*const mouseDownOnScroller = (e: MouseEvent) => {
    e.preventDefault()
    startY.value = e.clientY - delta.value

    window.addEventListener('mouseleave', mouseLeaveOrUpOnWindow)
    window.addEventListener('mouseup', mouseLeaveOrUpOnWindow)
    window.addEventListener('mousemove', mouseMoveOnWindow)

    scroller.value?.removeEventListener('mousedown', mouseDownOnScroller)
}

const mouseMoveOnWindow = (e: MouseEvent) => {
    const val = startY.value - e.clientY
    emit('deltaDrag', val)
}

const mouseLeaveOrUpOnWindow = (e: MouseEvent) => {
    window.removeEventListener('mouseleave', mouseLeaveOrUpOnWindow)
    window.removeEventListener('mouseup', mouseLeaveOrUpOnWindow)
    window.removeEventListener('mousemove', mouseMoveOnWindow)

    scroller.value?.addEventListener('mousedown', mouseDownOnScroller)
}*/

//#endregion

// TODO: Da riprendere con calma quando ho voglia di metterci la testa
/*onMounted(() => {
    if (!isTouch) scroller.value?.addEventListener('mousedown', mouseDownOnScroller)
})*/
</script>
<template>
    <div
        ref="scroller"
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

    transition: width 0.25s ease-in-out;
    will-change: width;

    &::after {
        content: '';
        position: absolute;
        top: 0.25rem;
        left: 0.4rem;
        width: 0.2rem;
        height: calc(100% - 0.5rem);

        border-radius: 0.15rem;

        background-color: var(--color-main);

        transition-property: width, left, border-radius;
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

    @include utils.media('dm') {
        &::after {
            left: 0.25rem;
            width: 0.5rem;

            border-radius: 0.25rem;
        }
    }
}
</style>
