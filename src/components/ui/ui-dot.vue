<script setup lang="ts"></script>

<template>
    <div class="dot"></div>
</template>

<style scoped lang="scss">
@use '@styles/utils';

.dot {
    position: fixed;
    top: 0;
    left: 0;
    width: 1rem;
    height: 1rem;

    transform: translateX(-50%, -50%);

    border-radius: 50%;

    background-color: red;

    @include utils.zIndex('dot');
}
</style>
