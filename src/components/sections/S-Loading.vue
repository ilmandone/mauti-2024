<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps(['progress'])
const emits = defineEmits<{
    (event: 'startLoading', value: boolean): void
}>()

const visible = ref<boolean>(true)
const displayed = ref<number>(0)
const interval = ref<number | null>(null)

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
        console.log('HIDE LOADING')
    }
}

/*watch(
    () => props.progress,
    (v) => {
        if (v === 100) {

            // TODO: al termine dell'animazione di uscita
            // visible.value = false
        }
    }
)*/

onMounted(() => {
    // TODO Al termine dell'animazione di ingresso
    window.setTimeout(() => {
        console.log('EMIT START LOADING')
        startInterval()
        emits('startLoading', true)
    }, 1000)
})
</script>

<template>
    <div v-if="visible" class="loading-wrapper">
        <div class="loading">{{ displayed }}</div>
    </div>
</template>

<style scoped lang="scss">
@use '@styles/utils';
@use '@styles/typo';

.loading-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;

    background-color: var(--color-emphasize);

    display: flex;
    justify-content: center;
    align-items: center;

    @include utils.zIndex('loader');

    .loading {
        @include typo.headers(10vw, var(--background-color));
        font-weight: 700;

        pointer-events: none;
    }
}
</style>
