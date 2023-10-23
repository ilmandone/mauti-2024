<script setup lang="ts">
import { onMounted, ref } from 'vue'

const END_WAIT = 500

const props = defineProps(['progress'])
const emits = defineEmits<{
    (event: 'startLoading', value: boolean): void
}>()

const displayed = ref<number>(0)
const interval = ref<number | null>(null)
const out = ref<boolean>(false)
const show = ref<boolean>(false)
const visible = ref<boolean>(true)

const loadingRef = ref<HTMLElement>()
const wrapperRef = ref<HTMLElement>()

//#region Progress

/**
 * Start the interval related to progress value
 */
const startInterval = () => {
    interval.value = window.setInterval(handleInterval, 30)
}

/**
 * Clear the interval
 */
const clearInterval = () => {
    window.clearInterval(interval.value as number)
    interval.value = null
}

/**
 * For each interval show the preloading value
 * @description Show the value with a value progression for a smooth animation
 */
const handleInterval = (): void => {
    if (displayed.value < props.progress) {
        displayed.value += Math.round((props.progress - displayed.value) / 5)
    }

    if (displayed.value > 95 && props.progress === 100) {
        displayed.value = 100
        clearInterval()

        // End preloading
        window.setTimeout(() => {
            wrapperRef.value?.addEventListener('transitionend', outComplete.bind(this))
            out.value = true
        }, END_WAIT)
    }
}

//#endregion

/**
 * On out complete remove the loader from the DOM
 */
const outComplete = () => {
    wrapperRef.value?.removeEventListener('transitionend', outComplete)
    visible.value = false
}

/**
 * Start the interval and emits startLoading
 * @description The startLoading event will be captured by the background that will return the progress value
 */
const startLoading = () => {
    startInterval()
    emits('startLoading', true)
    loadingRef.value?.removeEventListener('animationend', startLoading)
}

onMounted(() => {
    window.setTimeout(() => {
        loadingRef.value?.addEventListener('animationend', startLoading.bind(this))
        show.value = true
    }, 0)
})

</script>

<template>
    <div v-if="visible" :class="{ out }" class="wrapper" ref="wrapperRef">
        <svg viewBox="0 0 185 80" ref="loadingRef" :class="{ show }">
            <text y="76" text-anchor="middle" x="50%">{{ displayed }}</text>
        </svg>
    </div>
</template>

<style scoped lang="scss">
@use '@styles/utils';
@use '@styles/typo';

.wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;

    background-color: var(--color-emphasize);

    display: flex;
    justify-content: center;
    align-items: center;

    transition: transform 1s cubic-bezier(0.96, -0.01, 0.36, 1);

    @include utils.zIndex('loader');

    svg {
        opacity: 0;
        width: 40vw;
        stroke-dasharray: 20 100;
        pointer-events: none;

        text {
            @include typo.headers(120px, var(--color-bg));
            font-weight: 700;
        }

        &.show {
            animation: intro 1.5s cubic-bezier(0.96, -0.01, 0.36, 1) forwards;
        }
    }

    &.out {
        transform: translateX(100vw);
    }

    @include utils.media('dm') {
        svg {
            width: 35vw;
        }
    }
}

@keyframes intro {
    0% {
        opacity: 0;
        stroke: var(--color-emphasize);
        stroke-dasharray: 0 300;
        fill: var(--color-emphasize);
    }
    5% {
        opacity: 1;
    }
    45%,
    55% {
        stroke: var(--color-bg);
        stroke-dasharray: 210 300;
        fill: var(--color-emphasize);
        opacity: 1;
    }

    100% {
        stroke: var(--color-bg);
        stroke-dasharray: 210 300;
        fill: var(--color-bg);
        opacity: 1;
    }
}
</style>
