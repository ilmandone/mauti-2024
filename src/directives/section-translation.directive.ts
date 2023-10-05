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
        const elHeight: number = el.offsetHeight
        const scrollValue: number = binding.value.scrollValue
        const topPosition = el.offsetTop
        console.log('***********************************')
        console.log('scroll', scrollValue)
        console.log('height', elHeight)
        console.log('top', topPosition)
        console.log('scroll + height', scrollValue + elHeight)
        console.log('top + height', topPosition + elHeight)
        console.log('mainHeight', mainHeight)
        console.log('***********************************')
        console.log(scrollValue + mainHeight)
        console.log(mainHeight - (topPosition + elHeight + mainHeight * el.multiplier))
        if (scrollValue + mainHeight < mainHeight - (topPosition + elHeight + mainHeight * el.multiplier)) {
            console.log('UFFA')
            el.multiplier += 1
            el.style.transform = `translateY(${mainHeight * el.multiplier}px)`
        } else if (mainHeight - scrollValue < topPosition + elHeight + mainHeight * el.multiplier) {
            console.log('GNUFFA')
            el.multiplier -= 1
            el.style.transform = `translateY(${-mainHeight * el.multiplier * -1}px)`
        }
    }
}
