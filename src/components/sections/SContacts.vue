<script setup lang='ts'>

</script>

<template>
	<section>
		<h2 class='v-hidden'>Contacts</h2>
		<div class='contents'>
			<a href='mailto:info@mauti.it'>info@mauti.it</a>
			<div class='social'>
				<a href='https://t.me/andreamandini'>Telegram</a>
				<a href='https://www.behance.net/mandinia'>Be</a>
				<a href='https://www.instagram.com/andreamandini/'>Instagram</a>
			</div>
		</div>
	</section>
</template>

<style scoped lang='scss'>

@use "@styles/typo";
@use "@styles/utils";

section {
	margin: 10vh 2rem;

	.contents {
		display: flex;
		flex-direction: column;

		a {
			@include typo.body();
			font-size: 1.25rem;
		}

		& > a:first-child {
			margin-bottom: 2rem;
		}

		.social {
			display: flex;
			flex-direction: column;
		}
	}
}

</style>
