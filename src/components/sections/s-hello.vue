<script lang="ts" setup>
import { inject, onMounted, ref } from 'vue'
import { ADD_TO_OBSERVER, type IAddToObserver } from '@components/renderless/r-int-observer'

const hello = ref<HTMLElement>()
const helloSub = ref<HTMLElement>()

const addToObserver = inject(ADD_TO_OBSERVER) as IAddToObserver

onMounted(() => {
    addToObserver([hello.value, helloSub.value] as HTMLElement[])
})
</script>

<template>
    <header class="hello" ref="el">
        <svg class="hello__svg" viewBox="0 0 1297.56 500.59" ref="hello">
            <use xlink:href="/vectors/hello.svg#hello"></use>
        </svg>

        <div class="v-hidden">
            <h1>Hello</h1>
        </div>

        <p class="hello__sub" ref="helloSub">I am a front end engineer with a deep love for UX/UI design and 3D</p>
    </header>
</template>

<style lang="scss" scoped>
@use '@styles/a11y';
@use '@styles/typo';
@use '@styles/utils';

// Animations
@use './scss/s-hello.animations';
@use 'scss/common-animations';

.hello {
    width: 100vw;
    padding-top: 40vh;
    padding-bottom: 10vh;

    .hello__svg {
        width: 100%;
        fill: transparent;

        stroke: var(--color-emphasize);
        stroke-width: 4px;
        stroke-linejoin: round;
        stroke-dasharray: 0 1500;

        // Transition for theme change
        @include utils.baseTransition(fill, stroke);

        &.on-screen {
            animation: k-hello-show 1s ease-out forwards;
            animation-delay: 0.25s;
        }
    }

    &__sub {
        margin-left: 12vw;
        padding: 1.3rem;
        @include typo.body(1.6rem, #{var(--color-emphasize)});

        opacity: 0;

        &.on-screen {
            @include common-animations.use('fade-slide-in', 0.75s, 0.1s);
        }
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
