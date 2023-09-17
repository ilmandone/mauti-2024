<script lang='ts' setup>

</script>

<template>
	<div class='hello'>
		<div class='hello__picture' aria-hidden='true'>
			<svg class='hello-svg' viewBox="0 0 1297.56 500.59">
				<use xlink:href='/vectors/hello.svg#hello'></use>
			</svg>
		</div>
		<div class='hello__text'>
			<h1>Hello</h1>
		</div>

	</div>

	<p>I am a front end engineer with a deep love for UX/UI design and 3D</p>
</template>

<style scoped lang='scss'>

.hello{
	width: 100vw;

	&__text h1 {
		color: red;
		visibility: hidden;
		font-size: 0;
	}
}

.hello-svg {
	fill: var(--color-emphasize);
}

</style>
