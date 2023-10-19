<script lang="ts" setup>
import { ref } from 'vue'

const el = ref()

defineExpose({ el })
</script>

<template>
    <header class="hello" ref="el">
        <svg class="hello__svg" viewBox="0 0 1297.56 500.59">
            <use xlink:href="/vectors/hello.svg#hello"></use>
        </svg>

        <div class="v-hidden">
            <h1>Hello</h1>
        </div>

        <p class="hello__sub">I am a front end engineer with a deep love for UX/UI design and 3D</p>
    </header>
</template>

<style lang="scss" scoped>
@use '@styles/a11y';
@use '@styles/typo';
@use '@styles/utils';

.hello {
    width: 100vw;
    padding-top: 40vh;
    padding-bottom: 10vh;

    //background-color: greenyellow;

    .hello__svg {
        width: 100%;
        fill: var(--color-emphasize);

        @include utils.baseTransition(fill);
    }

    &__sub {
        margin-left: 12vw;
        padding: 1.3rem;
        @include typo.body(1.6rem, #{var(--color-emphasize)});
    }

    @include utils.media('t') {
        &__sub {
            margin-left: 16vw;
        }
    }

    @include utils.media('tl') {
        padding-top: 25vh;
        padding-bottom: 20vh;
        margin-left: 32vw;
        width: 67vw;

        &__sub {
            margin-left: 17.13%;
            width: auto;
            font-size: 2.5vw;
        }
    }

    @include utils.media('dl') {
        &__sub {
            letter-spacing: 0.1rem;
        }
    }
}
</style>
