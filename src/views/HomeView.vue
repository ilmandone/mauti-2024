<script lang='ts' setup>
import SHello from '@components/sections/S-Hello.vue'
import SBrief from '@components/sections/S-Brief.vue'
import SWhatIDo from '@components/sections/S-WhatIDo.vue'
import SUpToNow from '@components/sections/S-UpToNow.vue'
import SContacts from '@components/sections/S-Contacts.vue'
import UIScrollLoop from '@components/ui/UI-ScrollLoop.vue'
</script>

<template>

	<UIScrollLoop>
		<SHello />
		<SBrief />
		<SWhatIDo />
		<SUpToNow />
		<SContacts />
	</UIScrollLoop>

</template>

<style lang='scss' scoped>

</style>
