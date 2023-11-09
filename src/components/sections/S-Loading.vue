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
        /* window.setTimeout(() => {
            wrapperRef.value?.addEventListener('transitionend', outComplete.bind(this))
            out.value = true
        }, END_WAIT)*/
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
        <svg id="logo" viewBox="0 0 1080 640" :class="{ show }">
            <use xlink:href="/vectors/logo.svg#logo"></use>
        </svg>

        <svg id="loading" viewBox="0 0 185 80" ref="loadingRef" :class="{ show }">
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
    flex-direction: column;
    justify-content: center;
    align-items: center;

    transition: transform 1s cubic-bezier(0.96, -0.01, 0.36, 1);

    @include utils.zIndex('loader');

    svg {
        &#logo {
            width: 90vw;
            margin: 2vh 0 0 0;
            opacity: 0;

            fill: transparent;
            stroke-width: 8px;
            stroke-dasharray: 0 1000;

            &.show {
                animation: intro-logo 1.2s cubic-bezier(0.96, -0.01, 0.36, 1) forwards;
            }
        }

        &#loading {
            width: 36vw;
            margin-top: 2vh;
            margin-left: 25vw;
            opacity: 0;

            stroke-width: 2px;
            stroke-dasharray: 20 100;
            pointer-events: none;

            text {
                @include typo.headers(120px, var(--color-bg));
                font-weight: 700;
            }

            &.show {
                animation: intro-loading 1.5s cubic-bezier(0.96, -0.01, 0.36, 1) forwards;
            }
        }
    }

    &.out {
        transform: translateX(100vw);
    }

    @include utils.media('t') {
        svg {
            &#logo {
                width: 65vw;
                stroke-width: 6px;
            }

            &#loading {
                margin-left: 45vw;
                width: 20vw;
            }
        }
    }

    @include utils.media('tl') {
        flex-direction: row;
        svg {
            &#logo {
                width: 48vw;
                margin: 0 12vw 0 0;
                stroke-width: 8px;
            }

            &#loading {
                position: absolute;
                bottom: 6vh;
                right: 6vw;
                margin: 0;
                width: 14vw;
            }
        }
    }

    @include utils.media('dm') {
        svg {
            &#logo {
                width: 48vw;
                margin: 0 12vw 0 0;
                stroke-width: 6px;
            }

            &#loading {
                width: 8.5vw;
            }
        }
    }

    @include utils.media('dl') {
        svg {
            &#logo {
                width: 48vw;
                margin: 0 12vw 0 0;
                stroke-width: 4px;
            }

            &#loading {
                width: 7vw;
            }
        }
    }
}

@keyframes intro-loading {
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
        stroke-dasharray: 300 300;
        fill: var(--color-emphasize);
        opacity: 1;
    }

    100% {
        stroke: var(--color-bg);
        stroke-dasharray: 300 300;
        fill: var(--color-bg);
        opacity: 1;
    }
}

@keyframes intro-logo {
    0% {
        opacity: 0;
        stroke: var(--color-emphasize);
        stroke-dasharray: 0 700;
        transform: translate3d(0, -15px, 0);
    }
    5% {
        opacity: 1;
    }

    70% {
        stroke: var(--color-bg);
        stroke-dasharray: 700 700;
        opacity: 1;
        transform: translate3d(0, 0, 0);
    }

    100% {
        stroke: var(--color-bg);
        stroke-dasharray: 6000 1200;
        opacity: 1;
        transform: translate3d(0, 0, 0);
    }
}
</style>
