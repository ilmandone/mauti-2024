<script setup lang="ts">
import { onMounted, ref } from 'vue'
import UISwitchButton from '@components/ui/UI-SwitchButton.vue'
import { useMainStore } from '@stores/main'
import { storeToRefs } from 'pinia'

const intervalTime = ref<number>(0)
const time = ref<number>(Date.now())

const store = useMainStore()
const { setTheme } = store
const { theme } = storeToRefs(store)

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
        <UISwitchButton :is-checked="theme === 'dark'" @checked="checked" />
    </header>
</template>

<style scoped lang="scss">
@use '@styles/utils';
@use '@styles/vars';

header {
    position: absolute;
    width: 100vw;

    box-sizing: border-box;

    padding: 2rem 2rem;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    @include utils.zIndex('header');

    @include utils.media('t') {
        padding: 2.5rem 3rem;
    }

    @include utils.media('tl') {
        padding: 2rem 2.5rem;
    }

    @include utils.media('dl') {
        padding: 3rem 3.5rem;
    }
}
</style>
