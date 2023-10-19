<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const props = defineProps(['progress'])
const emits = defineEmits<{
    (event: 'startLoading', value: boolean): void
}>()

const visible = ref<boolean>(true)

watch(
    () => props.progress,
    (v) => {
        if (v === 100) {
            console.log('HIDE LOADING')
            // TODO: al termine dell'animazione di uscita
            visible.value = false
        }
    }
)

onMounted(() => {
    // TODO Al termine dell'animazione di ingresso
    window.setTimeout(() => {
        console.log('EMIT START LOADING')
        emits('startLoading', true)
    }, 1000)
})
</script>

<template>
    <div v-if="visible" class="loading-wrapper"></div>
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
