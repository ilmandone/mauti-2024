<script setup lang="ts">
import { onMounted, ref, inject } from 'vue'

import { ADD_TO_OBSERVER, type IAddToObserver } from '@components/renderless/r-int-observer'

const intro = ref<HTMLElement>()
const sideLine = ref<HTMLElement>()

const addToObserver = inject(ADD_TO_OBSERVER) as IAddToObserver

onMounted(() => {
    addToObserver(intro.value as HTMLElement)
    addToObserver(sideLine.value as HTMLElement)
})
</script>

<template>
    <section class="brief">
        <p class="intro" ref="intro">
            Passionate about visual interfaces from early age, I have honed my design and development skills through a
            career that has taken me from freelance to enterprise companies.
        </p>
        <div class="side-line" ref="sideLine">
            <p>
                I use a methodical approach for each task, believing that an accurate and precise analysis is the
                foundation of any solid, effective and lasting solution.
            </p>
            <p>
                This approach has always been complemented by my love in crafting intuitive and effective user
                experiences, playing with fonts, colors and motion.
            </p>
        </div>
    </section>
</template>

<style scoped lang="scss">
@use '@styles/a11y';
@use '@styles/commons';
@use '@styles/typo';
@use '@styles/utils';

@use './scss/common-animations';

section.brief {
    padding: 20vh 2rem;

    p {
        margin-bottom: 3rem;
    }

    .intro {
        @include typo.body(1.6rem);
        opacity: 0;

        &.on-screen {
            @include common-animations.use('fade-in', 0.75s, 0.1s);
        }
    }

    .side-line {
        font-size: 1.3rem;
        @include commons.left-border;
        opacity: 0;

        &.on-screen {
            @include common-animations.use('fade-in', 0.75s, 0.2s);
        }
    }

    @include utils.media('t') {
        padding: 20vh 8rem;
    }

    @include utils.media('tl') {
        width: 70vw;
        padding: 20vh 0 30vh 10vw;

        .intro {
            font-size: 2.5vw;
            letter-spacing: 0.1rem;
        }

        .side-line {
            font-size: 1.7vw;
        }
    }

    @include utils.media('dl') {
        width: 60vw;
        padding: 20vh 0 30vh 15vw;

        .intro {
            font-size: 2.25vw;
        }

        .side-line {
            font-size: 1.6vw;
        }
    }
}
</style>
