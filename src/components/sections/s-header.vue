<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
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

/**
 * Theme icon URL based on the current theme
 */
const themeIconURL = computed(() => {
    return `/vectors/${theme.value}.svg#ico;n`
})

onMounted(() => {
    intervalTime.value = window.setInterval(() => {
        time.value = Math.round(Date.now() / 1000)
    })
})
</script>

<template>
    <header>
        <UISwitchButton :is-checked="theme === 'dark'" @checked="checked">
            <template #icon>
                <div class="icon-wrapper">
                    <svg class="icon" viewBox="0 0 512 512" :class="{ toggle: theme === 'light' }">
                        <use xlink:href="/vectors/dark.svg#icon"></use>
                    </svg>

                    <svg class="icon" viewBox="0 0 512 512" :class="{ toggle: theme === 'light' }">
                        <use xlink:href="/vectors/light.svg#icon"></use>
                    </svg>
                </div>
            </template>
        </UISwitchButton>

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

    .icon-wrapper {
        width: 100%;
        height: 100%;
        background-color: var(--color-bg);

        overflow: hidden;

        border-radius: 50%;

        transition: background-color 0.4s ease-out;
    }

    .icon {
        fill: var(--color-main);
        display: block;

        transition-property: fill, transform;
        transition-duration: 0.4s;
        transition-timing-function: ease-out;

        &.toggle {
            transform: translateY(-100%);
        }
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
