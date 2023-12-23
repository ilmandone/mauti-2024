<script lang="ts" setup>
import { inject, onMounted, ref } from 'vue'
import { ADD_TO_OBSERVER, type IAddToObserver } from '@components/renderless/r-int-observer'

const svg = ref<HTMLElement>()
const section1 = ref<HTMLElement>()
const section2 = ref<HTMLElement>()

const addToObserver = inject(ADD_TO_OBSERVER) as IAddToObserver

onMounted(() => {
    addToObserver([svg.value, section1.value, section2.value] as HTMLElement[])
})
</script>

<template>
    <section class="utn">
        <header class="utn__header">
            <h2 class="v-hidden">Up to now</h2>
            <svg class="utn__svg" viewBox="0 0 1581 354" ref="svg">
                <use xlink:href="/vectors/up-to-now.svg#utn"></use>
            </svg>
        </header>

        <div class="contents">
            <section ref="section1">
                <header class="v-hidden">
                    <h3>My Career</h3>
                </header>

                <ul>
                    <li class="mb">
                        <span class="period">Today</span> <br />
                        <span class="v-hidden">Role:</span> <strong>Front-end software architect</strong> <br />
                        <span class="v-hidden">Company:</span> Var Group
                    </li>
                    <li class="mb">
                        <span class="period">2018 - 2021</span> <br />
                        <span class="v-hidden">Role:</span> <strong>Senior Front End Developer</strong> <br />
                        <span class="v-hidden">Company:</span>YNAP
                    </li>
                    <li class="mb">
                        <span class="period">2015 - 2018</span> <br />
                        <span class="v-hidden">Role:</span> <strong>Digital art director / UX designer</strong> <br />
                        <span class="v-hidden">Company:</span>Life Longari Loman
                    </li>
                    <li class="mb">
                        <span class="period">2013 - 2015</span> <br />
                        <span class="v-hidden">Role:</span> <strong>UX / UI designer</strong> <br />
                        <span class="v-hidden">Company:</span>Neri Wolff - Quadrante
                    </li>
                    <li class="mb">
                        <span class="period">2011 - 2013</span> <br />
                        <span class="v-hidden">Role:</span> <strong>UX / UI designer - Front-end developer</strong>
                        <br />
                        <span class="v-hidden">Company:</span>Net Synergy
                    </li>
                </ul>
            </section>

            <section ref="section2">
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
                    <li class="mb">CSS / SCSS / SASS</li>

                    <li>Angular / React / Vue and more</li>
                    <li>GitHub / Bitbucket</li>
                    <li class="mb">Atlassian’s tools suite</li>

                    <li>Full proficient in Agile / Scrum methodology</li>
                </ul>
            </section>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@use '@styles/typo';
@use '@styles/utils';

@use './scss/common-animations';
@use './scss/s-up-to-now';

section.utn {
    padding: 20vh 0;

    &__ header {
        width: 99vw;
    }

    .utn__svg {
        width: 100%;

        stroke: var(--color-emphasize);
        stroke-width: 4px;
        stroke-linejoin: round;
        stroke-dasharray: 0 800;

        fill: transparent;

        @include utils.baseTransition(fill, stroke);

        &.on-screen {
            animation: k-up-to-now-show 1s ease-out forwards;
            animation-delay: 0.25s;
        }
    }

    .contents {
        margin: 4rem 2rem;

        display: flex;
        flex-direction: column;
    }

    .contents > section {
        flex: 1;
        margin: 1rem 0;
        opacity: 0;

        &.on-screen {
            @include common-animations.use('fade-in', 0.75s, 0.1s);
        }

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

            .period {
                font-size: 1rem;
                line-height: 1.8rem;
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
            margin: 10vw 10vw 8rem 10vw;
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

                .period {
                    font-size: 1.2vw;
                    line-height: 2vw;
                }
            }
        }
    }

    @include utils.media('dl') {
        .contents {
            margin: 10vw 15vw 8rem 15vw;
        }
    }
}
</style>
