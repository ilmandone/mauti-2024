<script setup lang="ts">
import { onMounted, ref } from 'vue'

const emits = defineEmits(['checked'])
const props = defineProps(['isChecked'])
const checked = ref<boolean>(false)

const click = () => {
    checked.value = !checked.value
    emits('checked', checked.value)
}

onMounted(() => {
    checked.value = props.isChecked
})
</script>

<template>
    <button :class="{ checked }" type="button" role="switch" :aria-checked="checked" @click="click">
        <span class="v-hidden">Theme switch</span>
    </button>
</template>

<style scoped lang="scss">
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
    }

    &.checked:after {
        left: auto;
        right: 0.25rem;
    }
}
</style>
