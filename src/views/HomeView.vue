<script lang='ts' setup>
import SHello from '@components/sections/SHello.vue'
import SBrief from '@components/sections/SBrief.vue'
import SWhatIDo from '@components/sections/SWhatIDo.vue'
import SUpToNow from '@components/sections/SUpToNow.vue'
import SContacts from '@components/sections/SContacts.vue'

import {ScrollDetectDirective} from '@directives/scroll-detect.directive'

const vScrollDetect = ScrollDetectDirective
</script>

<template>
	<main v-scroll-detect>
		<SHello />
		<SBrief />
		<SWhatIDo />
		<SUpToNow />
		<SContacts />
	</main>
</template>

<style scoped lang='scss'>
main {
	overflow: hidden;
	height: 100vh;
}
</style>
