<script setup lang="ts"></script>

<template>
    <div class="scroller" aria-hidden="true"></div>
</template>

<style scoped lang="scss">
.scroller {
    position: fixed;
    top: 0;
    right: 0;
    background-color: var(--color-main);

    pointer-events: none;
}
</style>
