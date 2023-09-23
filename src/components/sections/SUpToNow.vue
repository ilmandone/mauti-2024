<script lang='ts' setup>

</script>

<template>
	<section class='utn'>
		<header class='utn__header'>
			<h2 class='v-hidden'>Up to now</h2>
			<svg class='utn__svg' viewBox='0 0 1916 264'>
				<use xlink:href='/vectors/up-to-now.svg#utn'></use>
			</svg>
		</header>

		<div class='contents'>

			<section>
				<header class='v-hidden'>
					<h3> My Career</h3>
				</header>

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
			</section>

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
					<li class='mb'>CSS / SCSS / SASS</li>

					<li>Angular / React / Vue and more</li>
					<li>GitHub / Bitbucket</li>
					<li class='mb'>Atlassian’s tools suite</li>

					<li>Full proficient in Agile / Scrum methodology</li>
				</ul>
			</section>

		</div>

	</section>

</template>

<style lang='scss' scoped>

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

	.contents {
		margin: 4rem 2rem;

		display: flex;
		flex-direction: column;
	}

	.contents > section {
		flex: 1;
		margin: 1rem 0;

		header:not(.v-hidden) {
			margin-bottom: 1rem;
			@include typo.body(1.5rem, var(--color-emphasize));
		}

		ul {
			list-style: none;
			padding: 0;

			font-size: 1.25rem;

			li {
				margin-bottom: 0.5rem;
			}

			li.mb {
				margin-bottom: 1.5rem;
			}
		}
	}

	@include utils.media('t') {
		.contents {
			margin: 5rem 8rem;
		}
	}

	@include utils.media('tl') {
		.contents {
			flex-direction: row;
			margin: 10vw 20vw 8rem 10vw;
		}

		.contents > section {

			header:not(.v-hidden) {
				font-size: 1.65vw;
			}

			ul {
				font-size: 1.4vw;

				li {
					margin-bottom: 0.5vw;
				}

				li.mb {
					margin-bottom: 1.5vw;
				}
			}
		}
	}
}

</style>
