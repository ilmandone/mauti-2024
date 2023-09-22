<script setup lang='ts'>

</script>

<template>
	<section>
		<header>
			<h2 class='v-hidden'>Up to now</h2>
			<svg class='utn__svg' viewBox='0 0 1916 264'>
				<use xlink:href='/vectors/up-to-now.svg#utn'></use>
			</svg>
		</header>
	</section>

</template>

<style scoped lang='scss'>

@use "@styles/a11y";
@use "@styles/typo";
@use "@styles/utils";

section {
	margin: 30vh 0;

	header {
		width: 99vw;
	}

	.utn__svg {
		width: 100%;
		fill: var(--color-emphasize);
	}
}

</style>
