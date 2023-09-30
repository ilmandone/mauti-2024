import type { Directive } from 'vue'

type ScrollDirective = Directive & {
    acceleration: number
    isTouch: boolean
    startY: number

    cbFn: (v: number) => void

    onActionDown: (e: PointerEvent | TouchEvent) => void
    onActionUp: (e: PointerEvent | TouchEvent) => void
    onActionMove: (e: PointerEvent | TouchEvent) => void

    onKeyDown: (e: KeyboardEvent) => void
    onKeyUp: (e: KeyboardEvent) => void
    onWheel: (e: WheelEvent) => void
}

export const ScrollDetectDirective: ScrollDirective = {
    acceleration: 0,
    isTouch: false,
    startY: 0,

    cbFn() {},

    //#region Mouse

    onWheel(e) {
        ScrollDetectDirective.cbFn(e.deltaY)
    },

    //#endregion

    //#region
    // TODO: add scroll with key down and up
    onKeyDown(e: KeyboardEvent) {},
    onKeyUp(e: KeyboardEvent) {},

    //#endregion

    //#region Pointer

    onActionDown(e: PointerEvent | TouchEvent) {
        ScrollDetectDirective.startY = ScrollDetectDirective.isTouch
            ? (e as TouchEvent).targetTouches[0].clientY
            : (e as PointerEvent).clientY

        window.addEventListener(
            ScrollDetectDirective.isTouch ? 'touchmove' : 'pointermove',
            ScrollDetectDirective.onActionMove
        )
        window.addEventListener(
            ScrollDetectDirective.isTouch ? 'touchend' : 'pointerup',
            ScrollDetectDirective.onActionUp
        )
    },
    onActionMove(e) {
        let val = 0
        if (ScrollDetectDirective.isTouch) {
            const posY = (e as TouchEvent).targetTouches[0].clientY
            const direction = posY > ScrollDetectDirective.startY ? -1 : 1
            val = (window.innerHeight / 30) * direction
            ScrollDetectDirective.acceleration = ScrollDetectDirective.startY - posY
            ScrollDetectDirective.startY = posY
        } else {
            val = (e as PointerEvent).clientY - ScrollDetectDirective.startY
        }

        ScrollDetectDirective.cbFn(val)
    },
    onActionUp(e) {
        ScrollDetectDirective.cbFn(ScrollDetectDirective.acceleration * 3)

        window.removeEventListener(
            ScrollDetectDirective.isTouch ? 'touchmove' : 'pointermove',
            ScrollDetectDirective.onActionMove
        )

        window.removeEventListener(
            ScrollDetectDirective.isTouch ? 'touchend' : 'pointerup',
            ScrollDetectDirective.onActionUp
        )
    },
    //#endregion

    created(el: HTMLElement, binding) {
        // Register the cb function
        ScrollDetectDirective.cbFn = binding.value.cbFn

        // Detect touch device
        ScrollDetectDirective.isTouch = navigator.maxTouchPoints > 0 || 'ontouchstart' in window
    },
    mounted() {
        window.addEventListener(
            ScrollDetectDirective.isTouch ? 'touchstart' : 'pointerdown',
            ScrollDetectDirective.onActionDown
        )

        window.addEventListener('wheel', ScrollDetectDirective.onWheel)
    },
    unmounted() {
        // if (ScrollDetectDirective.isTouch)
        window.removeEventListener('pointerdown', ScrollDetectDirective.onActionDown)

        window.removeEventListener('wheel', ScrollDetectDirective.onWheel)
    }
}
