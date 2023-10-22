<script setup lang="ts">
import { onMounted, ref } from 'vue'

const END_WAIT = 200

const props = defineProps(['progress'])
const emits = defineEmits<{
    (event: 'startLoading', value: boolean): void
}>()

const displayed = ref<number>(0)
const interval = ref<number | null>(null)
const out = ref<boolean>(false)
const show = ref<boolean>(false)
const visible = ref<boolean>(true)

const loadingEL = ref<HTMLElement>()

const startInterval = () => {
    interval.value = window.setInterval(handleInterval, 30)
}

const stopInterval = () => {
    window.clearInterval(interval.value as number)
    interval.value = null
}

const handleInterval = (): void => {
    if (displayed.value < props.progress) {
        displayed.value += Math.round((props.progress - displayed.value) / 5)
    }

    if (displayed.value > 95 && props.progress === 100) {
        displayed.value = 100
        stopInterval()

        // End preloading
        window.setTimeout(() => {
            out.value = true
        }, END_WAIT)
    }
}

const startLoading = () => {
    startInterval()
    emits('startLoading', true)
    loadingEL.value?.removeEventListener('transitionend', startLoading)
}

onMounted(() => {
    window.setTimeout(() => {
        loadingEL.value?.addEventListener('transitionend', startLoading.bind(this))
        show.value = true
    }, 0)
})
</script>

<template>
    <div v-if="visible" :class="{ out }" class="loadingEL-wrapper">
        <div ref="loadingEL" class="loadingEL" :class="{ show }">{{ displayed }}</div>
    </div>
</template>

<style scoped lang="scss">
@use '@styles/utils';
@use '@styles/typo';

.loadingEL-wrapper {
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

    .loadingEL {
        @include typo.headers(10vw, var(--color-bg));
        font-weight: 700;

        pointer-events: none;

        opacity: 0;
        transition: opacity 1s cubic-bezier(0.96, -0.01, 0.36, 1);
        transition-delay: 0.25s;

        &.show {
            opacity: 1;
        }
    }

    &.out {
        transform: translateX(100vw);
    }
}
</style>
