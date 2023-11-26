<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import debounce from 'lodash.debounce'

import SHello from '@components/sections/s-hello.vue'
import SBrief from '@components/sections/s-brief.vue'
import SWhatIDo from '@components/sections/s-what-i-do.vue'
import SUpToNow from '@components/sections/s-up-to-now.vue'
import SContacts from '@components/sections/s-contacts.vue'
import UIScroller from '@components/ui/ui-scroller.vue'
import RIntObserver from '@components/renderless/r-int-observer.vue'

import { ScrollDetectDirective as vScrollDetect } from '@/directives/scroll-detect.directive'
import { SectionTranslationDirective as vSectionTranslation } from '@/directives/section-translation.directive'

const main = ref()
const scrollValue = ref<number>(0)
const mainHeight = ref<number>(0)
const noTransition = ref<boolean>(false)

const props = defineProps({
    loadEnd: { default: false },
    coverHidden: { default: false }
})

const scrollProgress = computed<number>(() => {
    return scrollValue.value / mainHeight.value
})

//#region Scroll
const updateScroll = (v: number) => {
    scrollValue.value = v
    noTransition.value = false
}

const getScrollValue = (): number => {
    return scrollValue.value
}

const updateByDrag = (v: number) => {
    const vToScreen = v * (mainHeight.value / window.innerHeight)
    scrollValue.value -= vToScreen
    noTransition.value = true
}
//#endregion

//#region Window resize
const updateMainHeight = () => {
    mainHeight.value = main.value?.getBoundingClientRect().height
}

const onWindowResize = debounce(updateMainHeight, 150)
//#endregion

//#region Hooks
watch(
    () => props.loadEnd,
    () => {
        updateMainHeight()
    }
)

onMounted(() => {
    window.addEventListener('resize', onWindowResize.bind(this))
})

onUnmounted(() => {
    window.removeEventListener('resize', onWindowResize.bind(this))
})

//#endregion
</script>

<template>
    <main
        ref="main"
        v-scroll-detect="{ enabled: props.coverHidden, getScroll: getScrollValue, cb: updateScroll }"
        :style="{
            transform: `translate3d(0, ${scrollValue}px, 0)`
        }"
        :class="{
            'no-transition': noTransition
        }"
    >
        <RIntObserver>
            <SHello v-section-translation="{ scrollValue, mainHeight }" />
            <SBrief v-section-translation="{ scrollValue, mainHeight }" />
            <SWhatIDo v-section-translation="{ scrollValue, mainHeight }" />
            <SUpToNow v-section-translation="{ scrollValue, mainHeight }" />
            <SContacts v-section-translation="{ scrollValue, mainHeight }" />
        </RIntObserver>
    </main>

    <UIScroller :progress="scrollProgress" :mainHeight="mainHeight" @delta-drag="updateByDrag" />
</template>

<style lang="scss" scoped>
main {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    transition: transform 1.2s cubic-bezier(0, 0.89, 0.41, 1.02);

    &.no-transition {
        transition: none;
    }
}
</style>
