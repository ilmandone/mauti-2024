<script lang="ts" setup>
import SHello from '@components/sections/S-Hello.vue'
import SBrief from '@components/sections/S-Brief.vue'
import SWhatIDo from '@components/sections/S-WhatIDo.vue'
import SUpToNow from '@components/sections/S-UpToNow.vue'
import SContacts from '@components/sections/S-Contacts.vue'

import { ScrollDetectDirective as vScrollDetect } from '@/directives/scroll-detect.directive'
import { ref } from 'vue'

const scrollValue = ref<number>(0)

const updateScroll = (v: number) => {
    scrollValue.value -= v
}
</script>

<template>
    <main v-scroll-detect="{ cbFn: updateScroll }" :style="{ transform: `translate3d(0, ${scrollValue}px, 0)` }">
        <SHello />
        <SBrief />
        <SWhatIDo />
        <SUpToNow />
        <SContacts />
    </main>
</template>

<style lang="scss" scoped>
main {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    transition: transform var(--main-scroll-animation-time) cubic-bezier(0, 0.89, 0.41, 1.02);
}
</style>
