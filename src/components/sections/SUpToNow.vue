<script setup lang='ts'>

</script>

<template>
	<section class='utn'>
		<header class='utn__header'>
			<h2 class='v-hidden'>Up to now</h2>
			<svg class='utn__svg' viewBox='0 0 1916 264'>
				<use xlink:href='/vectors/up-to-now.svg#utn'></use>
			</svg>
		</header>

		<div class='d-list'>
			<ul>
				<li>
					Today <br>
					Front-end architect <br>
					Var Group
				</li>
				<li>
					2018 - 2023 <br>
					Senior Front End Developer br
					YNAP
				</li>
				<li>asdasd</li>
				<li>asdad</li>
			</ul>

			<section>
				<header>
					<h3>Skills and tools</h3>
				</header>
				<ul>
					<li>Javascript</li>
					<li>Typescript</li>
					<li>C#</li>
					<li>Python</li>
					<li>Node JS</li>
					<li>HTML</li>
					<li>CSS / SCSS / SASS</li>
					<li>Angular / React / Vue and more</li>
					<li>GitHub / Bitbucket</li>
					<li>Atlassian’s tools suite</li>

					<li>Full proficient in Agile / Scrum methodology</li>
				</ul>
			</section>

		</div>

	</section>

</template>

<style scoped lang='scss'>

@use "@styles/a11y";
@use "@styles/typo";
@use "@styles/utils";

section.utn {
	margin: 30vh 0;

	&__ header {
		width: 99vw;
	}

	.utn__svg {
		width: 100%;
		fill: var(--color-emphasize);
	}

	.d-list {
		margin: 4rem 2rem;
		background-color: #f0f;

		display: flex;
		flex-direction: column;

		> * {
			flex: 1;
		}
	}

	@include utils.media('t') {
		margin: 35vh 0;

		.d-list {
			margin: 6rem 8rem;
		}
	}

	@include utils.media('tl') {

		.d-list {
			margin: 10vw;
			width: 80vw;

			flex-direction: row;
		}
	}

	@include utils.media('dl') {
		margin: 45vh 0;
	}
}

</style>
