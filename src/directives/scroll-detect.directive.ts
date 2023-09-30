import type { Directive } from 'vue'

type ScrollDirective = Directive & {
    isTouch: boolean
    cbFn: (v: number) => void

    startY: number

    onActionDown: (e: PointerEvent | TouchEvent) => void
    onActionUp: (e: PointerEvent | TouchEvent) => void
    onActionMove: (e: PointerEvent | TouchEvent) => void

    onKeyDown: (e: KeyboardEvent) => void
    onKeyUp: (e: KeyboardEvent) => void
    onWheel: (e: WheelEvent) => void
}

export const ScrollDetectDirective: ScrollDirective = {
    isTouch: false,
    cbFn() {},
    startY: 0,

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
            val = (ScrollDetectDirective.startY - (e as TouchEvent).targetTouches[0].clientY) / 8
        } else {
            val = (e as PointerEvent).clientY - ScrollDetectDirective.startY
        }

        ScrollDetectDirective.cbFn(val)
    },
    onActionUp() {
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
