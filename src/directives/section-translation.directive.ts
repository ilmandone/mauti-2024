import type { Directive } from 'vue'

type SectionTranslationDirective = Directive & {
    multiplier: number
    needUpdate: boolean
}

export const SectionTranslationDirective: SectionTranslationDirective = {
    multiplier: 0,
    needUpdate: false,

    mounted() {},
    unmounted() {},
    updated(el: HTMLElement, binding) {
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
        console.log(mainHeight - scrollValue)
        console.log(topPosition + elHeight)
        if (
            scrollValue + mainHeight <
            mainHeight - (topPosition + elHeight + mainHeight * SectionTranslationDirective.multiplier)
        ) {
            console.log('UFFA')
            SectionTranslationDirective.multiplier += 1
            el.style.transform = `translateY(${mainHeight * SectionTranslationDirective.multiplier}px)`
        } else if (
            mainHeight - scrollValue <
            topPosition + elHeight + mainHeight * SectionTranslationDirective.multiplier
        ) {
            console.log('GNUFFA')
            SectionTranslationDirective.multiplier -= 1
            el.style.transform = `translateY(${-mainHeight * SectionTranslationDirective.multiplier * -1}px)`
        }
    }
}
