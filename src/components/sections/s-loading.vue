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
    <div
        v-if="visible"
        :class="{ out }"
        class="wrapper"
        ref="wrapperRef"
        :style="{ borderWidth: `${displayed * 0.02}vw` }"
    >
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
@use './scss/S-Loading.animations';
.wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;

    box-sizing: border-box;

    border-color: var(--color-bg);
    border-style: solid;
    border-width: 0;

    background-color: var(--color-emphasize);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    transition:
        transform 1s cubic-bezier(0.96, -0.01, 0.36, 1),
        border-width 0.1s ease-out;

    @include utils.zIndex('loader');

    svg {
        transition: transform 0.9s cubic-bezier(0.96, -0.01, 0.36, 1);

        &#logo {
            width: 86vw;

            fill: transparent;

            stroke-width: 8px;
            stroke-dasharray: 0 1000;
            stroke: var(--color-bg);

            &.show {
                @include S-Loading.use('logo', 1.25s);
            }
        }

        &#loading {
            width: 25vw;
            margin-top: 2vh;
            margin-left: 35vw;
            opacity: 0;

            stroke-width: 2px;
            stroke-dasharray: 20 100;
            pointer-events: none;

            text {
                @include typo.headers(120px, var(--color-bg));
                font-weight: 700;
            }

            &.show {
                @include S-Loading.use('loading', 1s, 0.2s);
            }
        }
    }

    &.out {
        transform: translateX(100vw);
        svg {
            transform: translateX(30vw);
        }
    }

    @include utils.media('t') {
        svg {
            &#logo {
                width: 65vw;
                stroke-width: 6px;
            }

            &#loading {
                margin-left: 45vw;
                width: 18vw;
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
                width: 10vw;
            }
        }
    }

    @include utils.media('dm') {
        svg {
            &#logo {
                width: 48vw;
                margin: 0 12vw 0 0;
                stroke-width: 10px;
            }

            &#loading {
                width: 8.5vw;
            }
        }
    }

    @include utils.media('dl') {
        svg {
            &#logo {
                width: 38vw;
                margin: 0 15vw 0 0;
                stroke-width: 4px;
            }

            &#loading {
                width: 5vw;
            }
        }
    }
}
</style>