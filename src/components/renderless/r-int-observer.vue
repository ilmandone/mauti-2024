<script lang="ts" setup>
import { ADD_TO_OBSERVER } from '@components/renderless/r-int-observer'
import { provide } from 'vue'

const addToObserver = (el: HTMLElement) => {
    console.log('ADD TO OBSERVER', el)
}

provide(ADD_TO_OBSERVER, addToObserver)
</script>

<template>
    <slot></slot>
</template>
