<script lang='ts' setup>

</script>

<template>
	<section class='wido'>
		<h2>What <br> I <br> Do</h2>
		<section class='wido__single'>

			<h3>Front-end development</h3>
			<p>I craft effective long lasting front-end solution for E-Commerce, SPA/MPA, portals, CMS, back office,
				PWA
				and more.
				I design f/e architecture to interact with back-end services, minimize dependencies and improve
				performance. I help to define teams workflow to match CI/CD infrastructures and take care of the
				quality
				of the code.
				I also develope solution with all the major front-end frameworks and no, I don’t want to list all of
				them</p>
		</section>

		<section class='wido__single'>
			<h3>UX / UI Design</h3>
			<p>I design UX experience for all kind of platform with particolar care for information architecture,
				accessibility and testing.
				I also transform UX wireframes and lo-fi interfaces into more polished working with colors,
				typography and iconography.</p>

		</section>

		<section class='wido__single'>
			<h3>3D</h3>
			<p>I create 3D models and scenes for both real time and production rendering, from modeling to texturing
				and
				final composition.
				I also work with real time web libraries and UE to release end-user application or development
				tools.</p>
		</section>
	</section>
</template>

<style lang='scss' scoped>

@use "@styles/commons";
@use "@styles/typo";
@use "@styles/utils";

section.wido {
	margin: 30vh 2rem;

	&__single {
		margin: 2rem 0;
	}

	h2 {
		@include typo.headers(5.5rem);
		font-weight: 700;
		line-height: 5.5rem;
	}

	h3 {
		margin: 2.5rem 0;
		@include commons.left-border($color: var(--color-emphasize));

		@include typo.headers(1.75rem);
		font-weight: 700;
		line-height: 2rem;
		text-transform: uppercase;
	}

	@include utils.media('t') {
		margin: 35vh 8rem;

		&__single {
			margin: 3rem 0;
		}
	}

	@include utils.media('tl') {
		width: 70vw;
		margin: 35vh 0 35vh 10vw;

		&__single {
			margin: 5vw 0;
		}

		h2 {
			font-size: 6vw;
			line-height: 6vw;
		}

		h3 {
			margin: 5vw 0;
			font-size: 2.5vw;
		}

		p {
			font-size: 1.5vw;
		}
	}
}


</style>
