<script setup lang='ts'>

</script>

<template>
	<section>
		<h2>What <br> I <br> Do</h2>
		<div class='skill-list'>
			<h3>Front end development</h3>
			<p>I craft effective long lasting front-end solution for E-Commerce, SPA/MPA, portals, CMS, back office, PWA and more.
				<br>
				I design f/e architecture to interact with back-end services, minimize dependencies and improve performance. I help to define teams workflow to match CI/CD infrastructures and take care of the quality of the code.
				<br>
				I also develope solution with all the major front-end frameworks and no, I don’t want to list all of them</p>

			<h3>UX / UI Design</h3>
			<p>I design UX experience for all kind of platform with particolar care for information architecture, accessibility and testing.
				<br> I also transform UX wireframes and lo-fi interfaces into more polished working with colors, typography and iconography.</p>

			<h3>3D</h3>
			<p>I create 3D models and scenes for both real time and production rendering, from modeling to texturing and final composition.
				<br> I also work with real time web libraries and UE to release end-user application or development tools.</p>
		</div>
	</section>
</template>

<style scoped lang='scss'>

@use "@styles/commons";
@use "@styles/typo";
@use "@styles/utils";

section {
	margin: 30vh 2rem;
}

h2 {
	@include typo.headers(5rem);
	font-weight: 700;
	line-height: 5rem;
}

.skill-list {
	h3 {

		margin: 2.5rem 0;
		@include commons.left-border($color: var(--color-emphasize));

		@include typo.headers(2rem);
		font-weight: 700;
		line-height: 2rem;
		text-transform: uppercase;
	}
}

</style>
