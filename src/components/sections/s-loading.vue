<script setup lang="ts">
import { onMounted, ref } from 'vue'

const END_WAIT = 500

const props = defineProps(['progress'])
const emits = defineEmits<{
    (event: 'loadingStart', value: boolean): void
    (event: 'loadingEnd', value: boolean): void
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
            wrapperRef.value?.addEventListener('transitionend', outComplete.bind(this), { once: true })
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
    emits('loadingEnd', true)
    visible.value = false
}

/**
 * Start the interval and emits loadingStart
 * @description The loadingStart event will be captured by the background that will return the progress value
 */
const loadingStart = () => {
    startInterval()
    emits('loadingStart', true)
    loadingRef.value?.removeEventListener('animationend', loadingStart)
}

onMounted(() => {
    window.setTimeout(() => {
        loadingRef.value?.addEventListener('animationend', loadingStart.bind(this))
        show.value = true
    }, 0)
})
</script>

<template>
    <div
        v-if="visible"
        :class="{ out }"
        class="wrapper"
        ref="wrapperRef"
        :style="{
            borderWidth: `${displayed * 0.01}vw`,
            borderRadius: `${displayed * 0.02}rem`
        }"
    >
        <svg id="logo" viewBox="0 0 1080 640" :class="{ show }">
            <use xlink:href="/vectors/logo.svg#logo"></use>
        </svg>

        <svg id="loading" viewBox="0 0 185 80" ref="loadingRef" :class="{ show }">
            <text y="76" text-anchor="middle" x="50%">{{ displayed }}</text>
        </svg>
        <aside class="copyright">(c) Copyright 2023 - Andrea Mandini</aside>
    </div>
</template>

<style scoped lang="scss">
@use '@styles/utils';
@use '@styles/typo';

// Animations
@use 'scss/s-loading.animations';

.wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100%;

    box-sizing: border-box;

    border-color: var(--color-bg);
    border-style: solid;
    border-width: 0;

    background-color: var(--color-emphasize);

    transition:
        transform 1s cubic-bezier(0.96, -0.01, 0.36, 1),
        border-width 0.1s ease-out;

    @include utils.zIndex('loader');

    svg {
        transition: transform 1s cubic-bezier(0.96, -0.01, 0.36, 1);

        &#logo {
            position: absolute;
            top: 50%;
            left: 0;

            width: 100vw;

            transform: translateY(-50%);

            fill: transparent;

            stroke-width: 8px;
            stroke-dasharray: 0 1000;
            stroke: var(--color-bg);

            &.show {
                animation: k-logo 1.25s cubic-bezier(0.96, -0.01, 0.36, 1) forwards;
            }
        }

        &#loading {
            position: absolute;
            top: 2rem;
            right: 2rem;
            width: 15vw;
            opacity: 0;

            stroke-width: 2px;
            stroke-dasharray: 20 100;
            pointer-events: none;

            text {
                @include typo.headers(120px, var(--color-bg));
                font-weight: 700;
            }

            &.show {
                animation: k-loading 1s cubic-bezier(0.96, -0.01, 0.36, 1) forwards;
                animation-delay: 0.2s;
            }
        }
    }

    .copyright {
        position: absolute;
        left: 50%;
        bottom: 1rem;

        transform: translateX(-50%);

        margin: 0 auto;
        text-align: center;
        color: var(--color-bg);

        font-size: 0.75rem;
        text-transform: uppercase;
    }

    &.out {
        transform: translateX(100vw);
        svg#logo {
            transform: translate(50vw, -50%);
        }
    }

    @include utils.media('t') {
        svg {
            &#logo {
                left: 0;
                width: 75vw;
                stroke-width: 6px;
            }

            &#loading {
                width: 10vw;
            }
        }

        .copyright {
            left: auto;
            right: 2rem;
            transform: none;
        }
    }

    @include utils.media('tl') {
        flex-direction: row;
        svg {
            &#logo {
                left: 7vw;
                width: 55vw;
                stroke-width: 8px;
            }

            &#loading {
                top: auto;
                bottom: 2rem;
                width: 5vw;
            }
        }

        .copyright {
            bottom: 1.5rem;
            left: 2rem;
            right: auto;
        }
    }

    @include utils.media('dl') {
        svg {
            &#logo {
                width: 45vw;
                stroke-width: 4px;
            }

            &#loading {
                width: 3vw;
            }
        }
    }
}
</style>
