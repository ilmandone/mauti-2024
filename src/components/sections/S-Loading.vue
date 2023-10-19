<script setup lang="ts">
import { useMainStore } from '@stores/main'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'

const store = useMainStore()
const { loadProgress } = storeToRefs(store)

watch(loadProgress, (v) => {
    console.log(v)
})
</script>

<template>
    <div class="loading-wrapper"></div>
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
