<script lang="ts" setup>
import { ADD_TO_OBSERVER } from '@components/renderless/r-int-observer'
import { onUnmounted, provide } from 'vue'

let observer: IntersectionObserver | null = null

const createObserver = (): IntersectionObserver => {
    return new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const target = entry.target
                if (entry.isIntersecting) {
                    target.classList.add('on-screen')
                } else {
                    target.classList.remove('on-screen')
                }
            })
        },
        {
            threshold: [0, 1]
        }
    )
}
const addToObserver = (els: HTMLElement[]) => {
    if (!observer) observer = createObserver()
    els.forEach((el) => (observer as IntersectionObserver).observe(el))
}

// Create the provider to set el in observer
provide(ADD_TO_OBSERVER, addToObserver)

onUnmounted(() => {
    if (observer) {
        observer.disconnect()
        observer = null
    }
})
</script>

<template>
    <slot></slot>
</template>
