<script setup lang='ts'>

</script>

<template>
	<section>
		<p class='intro'>Passionate about visual interfaces from early age, I have honed my design and development skills through a career that has taken me from freelance to enterprise companies.</p>
		<div class='side-line'>
			<p>
				I use a methodical approach for each task, believing that an accurate and precise analysis is the foundation of any solid, effective and lasting solution.
			</p>
			<p>
				This approach has always been complemented by my love in crafting intuitive and effective user experiences, playing with fonts, colors and motion.
			</p>
		</div>
	</section>
</template>

<style scoped lang='scss'>

@use "@styles/a11y";
@use "@styles/typo";
@use "@styles/utils";

section {
	margin: 30vh 2rem;

	p {
		margin-bottom: 3rem;
	}

	.intro {
		@include typo.body(1.6rem);
	}

	.side-line {
		font-size: 1.3rem;
		padding-left: 2rem;

		border-left: 2px solid var(--color-main);
	}

	@include utils.media('t') {
		margin: 35vh 8rem;
	}

	@include utils.media('tl') {
		width: 70vw;
		margin: 35vh 0 35vh 10vw;

		.intro {
			font-size: 2.5vw;
			letter-spacing: 0.1rem;
		}

		.side-line {
			padding-left: 3vw;
			font-size: 1.70vw;
		}
	}
}
</style>
