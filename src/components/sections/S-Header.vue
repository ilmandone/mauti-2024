<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import UIToggleButton from '@components/ui/UI-ToggleButton.vue'
import { useMainStore } from '@stores/main'
import { storeToRefs } from 'pinia'

const intervalTime = ref<number>(0)
const time = ref<number>(Date.now())

const store = useMainStore()
const { theme } = storeToRefs(store)
const { setTheme } = store

const checked = (e) => {
    setTheme(e ? 'dark' : 'light')
}

onMounted(() => {
    intervalTime.value = window.setInterval(() => {
        time.value = Math.round(Date.now() / 1000)
    })
})
</script>

<template>
    <header>
        <aside class="current-time" aria-label="current time">{{ time }}</aside>
        <UIToggleButton @checked="checked" />
    </header>
</template>

<style scoped lang="scss">
@use '@styles/utils';
@use '@styles/vars';

header {
    position: absolute;
    width: 100vw;

    box-sizing: border-box;

    padding: 1rem 2rem;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    @include utils.zIndex('header');
}
</style>
