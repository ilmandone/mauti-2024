<script setup lang="ts"></script>

<template>
    <section class="brief">
        <p class="intro">
            Passionate about visual interfaces from early age, I have honed my design and development skills through a
            career that has taken me from freelance to enterprise companies.
        </p>
        <div class="side-line">
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

section.brief {
    padding: 20vh 2rem;
    //background-color: orangered;

    p {
        margin-bottom: 3rem;
    }

    .intro {
        @include typo.body(1.6rem);
    }

    .side-line {
        font-size: 1.3rem;
        @include commons.left-border;
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
}
</style>
