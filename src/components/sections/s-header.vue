<script setup lang="ts">
import { onMounted, ref } from 'vue'
import UISwitchButton from '@components/ui/ui-switch-button.vue'
import { type Themes, useMainStore } from '@stores/main'
import { storeToRefs } from 'pinia'

const intervalTime = ref<number>(0)
const time = ref<number>(Date.now())

const store = useMainStore()
const { setTheme } = store
const { theme } = storeToRefs(store)

const checked = (e: Themes) => {
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
        <UISwitchButton :is-checked="theme === 'dark'" @checked="checked" />
        <aside class="current-time" aria-label="current time">{{ time }}</aside>
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
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;

    @include utils.zIndex('header');

    .current-time {
        display: none;
    }

    @include utils.media('t') {
        padding: 2.5rem 3rem;
    }

    @include utils.media('tl') {
        padding: 2rem 2.5rem;

        .current-time {
            display: block;
        }
    }

    @include utils.media('dl') {
        padding: 3rem 3.5rem;
    }
}
</style>
