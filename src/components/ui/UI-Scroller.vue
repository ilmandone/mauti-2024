<script setup lang="ts"></script>

<template>
    <div class="scroller" aria-hidden="true"></div>
</template>

<style scoped lang="scss">
.scroller {
    position: fixed;
    top: 0;
    right: 0;
    width: 1rem;
    height: 4rem;

    background-color: transparent;
    pointer-events: none;

    &::after {
        content: '';
        position: absolute;
        top: 0.25rem;
        left: 0.25rem;
        width: 0.5rem;
        height: 3.5rem;

        border-radius: 0.25rem;

        background-color: var(--color-main);
    }
}
</style>
