<script lang='ts' setup>
import SHello from '@components/sections/S-Hello.vue'
import SBrief from '@components/sections/S-Brief.vue'
import SWhatIDo from '@components/sections/S-WhatIDo.vue'
import SUpToNow from '@components/sections/S-UpToNow.vue'
import SContacts from '@components/sections/S-Contacts.vue'

import {ScrollDetectDirective as vScrollDetect} from '@/directives/scroll-detect.directive'
import { ref } from 'vue'

const scrollValue = ref<number>(0)

const updateScroll = (v:number) => {
	console.log(v)
}

</script>

<template>

	<main v-scroll-detect='{cbFn: updateScroll}'>
		<SHello />
		<SBrief />
		<SWhatIDo />
		<SUpToNow />
		<SContacts />
	</main>


</template>

<style lang='scss' scoped>
main {
	overflow: hidden;
	height: 100vh;
}
</style>
