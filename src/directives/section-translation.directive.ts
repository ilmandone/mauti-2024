import type { Directive } from 'vue'

type SectionTranslationDirective = Directive & {
    multiplier: number
    needUpdate: boolean
}

type HTMLElementExtended = HTMLElement & {
    multiplier: number
}

export const SectionTranslationDirective: Directive = {
    created(el: HTMLElementExtended) {
        el.multiplier = 0
    },

    mounted() {},
    unmounted() {},
    updated(el: HTMLElementExtended, binding) {
        const mainHeight: number = binding.value.mainHeight
        const elHeight = el.offsetHeight
        const scrollValue: number = binding.value.scrollValue
        const topPosition = el.offsetTop

        if (scrollValue + mainHeight < mainHeight - (topPosition + elHeight + mainHeight * el.multiplier)) {
            el.multiplier += 1
            el.style.transform = `translateY(${mainHeight * el.multiplier}px)`
        } else if (mainHeight - scrollValue < topPosition + elHeight + mainHeight * el.multiplier) {
            el.multiplier -= 1
            el.style.transform = `translateY(${-mainHeight * el.multiplier * -1}px)`
        }
    }
}
