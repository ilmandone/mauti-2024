<script setup lang="ts">
import { useMainStore } from '@stores/main'
import { storeToRefs } from 'pinia'
import { onMounted, watch } from 'vue'

const store = useMainStore()
const { loadProgress } = storeToRefs(store)
const { setState } = store
const { state } = storeToRefs(store)

watch(loadProgress, (v: number) => {
    if (v === 100) setState('loaded')

    // On outro animation end
    window.setTimeout(() => {
        setState('running')
    }, 3000)
})

onMounted(() => {
    // On intro animation end
    window.setTimeout(() => {
        setState('loading')
    }, 4000)
})
</script>

<template>
    <div v-if="state !== 'running'" class="loading-wrapper"></div>
</template>

<style scoped lang="scss">
@use '@styles/utils';

.loading-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;

    background-color: lavender;

    @include utils.zIndex('loader');
}
</style>
