import type { Directive } from 'vue'

type HTMLElementExtended = HTMLElement & {
    multiplier: number
    mainHeightRef: number
}

export const SectionTranslationDirective: Directive = {
    created(el: HTMLElementExtended) {
        el.multiplier = 0
        el.mainHeightRef = 0
    },

    mounted() {},
    unmounted() {},
    updated(el: HTMLElementExtended, binding) {
        const { scrollValue, mainHeight } = binding.value
        const elHeight = el.offsetHeight
        const topPosition = el.offsetTop

        // Main height changed -> Update the element translate value
        if (mainHeight !== el.mainHeightRef && el.mainHeightRef !== 0) {
            el.style.transform = `translateY(${mainHeight * el.multiplier}px)`
        } else {
            const heightMultiplied = mainHeight * el.multiplier

            // Check for individual translate to change element order
            if (scrollValue + mainHeight < mainHeight - (topPosition + elHeight + heightMultiplied)) {
                el.multiplier += 1
            } else if (mainHeight - scrollValue < topPosition + elHeight + heightMultiplied) {
                el.multiplier -= 1
            }

            // Apply the single element translation
            el.style.transform = `translateY(${mainHeight * el.multiplier}px)`
        }

        // Update height reference for future check
        el.mainHeightRef = mainHeight
    }
}
