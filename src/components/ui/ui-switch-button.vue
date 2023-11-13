<script setup lang="ts">
import { ref, watch } from 'vue'

const emits = defineEmits(['checked'])
const props = defineProps({
    isChecked: {
        type: Boolean,
        default: null
    }
})
const checked = ref<boolean>(false)

const click = () => {
    emits('checked', !checked.value)
}

watch(
    () => props.isChecked,
    (c) => {
        checked.value = c
    }
)
</script>

<template>
    <button :class="{ checked }" type="button" role="switch" :aria-checked="checked" @click="click">
        <span class="v-hidden">Theme switch</span>
        <span class="icon">
            <slot name="icon"></slot>
        </span>
    </button>
</template>

<style scoped lang="scss">
.icon {
    position: absolute;
    left: -2rem;
    top: 0;
    height: 1.5rem;
    width: 1.5rem;

    display: block;
}
button[role='switch'] {
    position: relative;
    width: 3rem;
    height: 1.5rem;
    background-color: var(--color-emphasize);

    border: none;
    border-radius: 1rem;

    cursor: pointer;

    &:after {
        content: '';
        position: absolute;
        top: 0.25rem;
        left: 0.25rem;
        height: 1rem;
        width: 1rem;
        background-color: var(--color-main);

        border-radius: 0.5rem;

        transition: left 0.2s ease-out;
    }

    &.checked:after {
        left: 1.75rem;
    }
}
</style>
