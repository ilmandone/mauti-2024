<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import debounce from 'lodash.debounce'

import SHello from '@components/sections/S-Hello.vue'
import SBrief from '@components/sections/S-Brief.vue'
import SWhatIDo from '@components/sections/S-WhatIDo.vue'
import SUpToNow from '@components/sections/S-UpToNow.vue'
import SContacts from '@components/sections/S-Contacts.vue'

import { ScrollDetectDirective as vScrollDetect } from '@/directives/scroll-detect.directive'
import { SectionTranslationDirective as vSectionTranslation } from '@/directives/section-translation.directive'
import SHeader from '@components/sections/S-Header.vue'
import UIScroller from '@components/ui/UI-Scroller.vue'

const main = ref()
const scrollValue = ref<number>(0)
const mainHeight = ref<number>(0)

const scrollProgress = computed<number>(() => {
    return scrollValue.value / mainHeight.value
})

//#region Scroll
const updateScroll = (v: number) => {
    scrollValue.value = v
}

const getScrollValue = (): number => {
    return scrollValue.value
}
//#endregion

//#region Window resize
const onWindowResize = debounce(() => {
    mainHeight.value = main.value.offsetHeight
}, 200)
//#endregion

//#region Hooks

onMounted(() => {
    window.addEventListener('resize', onWindowResize.bind(this))
    // TODO: Fix this workaround - One or more section do not return the proper height
    window.setTimeout(() => {
        mainHeight.value = main.value.getBoundingClientRect().height
    }, 550)
})

onUnmounted(() => {
    window.removeEventListener('resize', onWindowResize.bind(this))
})

//#endregion
</script>

<template>
    <SHeader />
    <main
        ref="main"
        v-scroll-detect="{ getScroll: getScrollValue, cbFn: updateScroll }"
        :style="{ transform: `translate3d(0, ${scrollValue}px, 0)` }"
    >
        <SHello v-section-translation="{ scrollValue, mainHeight }" />
        <SBrief v-section-translation="{ scrollValue, mainHeight }" />
        <SWhatIDo v-section-translation="{ scrollValue, mainHeight }" />
        <SUpToNow v-section-translation="{ scrollValue, mainHeight }" />
        <SContacts v-section-translation="{ scrollValue, mainHeight }" />
    </main>

    <UIScroller />
</template>

<style lang="scss" scoped>
main {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    transition: transform 1s cubic-bezier(0, 0.89, 0.41, 1.02);
}
</style>
