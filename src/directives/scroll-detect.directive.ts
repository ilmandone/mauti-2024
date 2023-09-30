import type { Directive } from 'vue'

type ScrollDirective = Directive & {
    isTouch: boolean
    cbFn: (v: number) => void

    startY: number

    onPointerDown: (e: PointerEvent | TouchEvent) => void
    onPointerUp: (e: PointerEvent | TouchEvent) => void
    onPointerMove: (e: PointerEvent | TouchEvent) => void
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

    //#region Pointer

    onPointerDown(e: PointerEvent | TouchEvent) {
        ScrollDetectDirective.startY =
            e.type === 'touchstart' ? (e as TouchEvent).targetTouches[0].clientY : (e as PointerEvent).clientY

        window.addEventListener(
            navigator.maxTouchPoints > 0 ? 'touchmove' : 'pointermove',
            ScrollDetectDirective.onPointerMove
        )
        window.addEventListener(
            navigator.maxTouchPoints > 0 ? 'touchend' : 'pointerup',
            ScrollDetectDirective.onPointerUp
        )
    },

    onPointerMove(e) {
        let val = 0
        if (e.type === 'touchmove') {
            val = (ScrollDetectDirective.startY - (e as TouchEvent).targetTouches[0].clientY) / 10
        } else {
            val = (e as PointerEvent).clientY - ScrollDetectDirective.startY
        }

        ScrollDetectDirective.cbFn(val)
    },

    onPointerUp() {
        window.removeEventListener(
            navigator.maxTouchPoints > 0 ? 'touchmove' : 'pointermove',
            ScrollDetectDirective.onPointerMove
        )

        window.removeEventListener(
            navigator.maxTouchPoints > 0 ? 'touchend' : 'pointerup',
            ScrollDetectDirective.onPointerUp
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
            navigator.maxTouchPoints > 0 ? 'touchstart' : 'pointerdown',
            ScrollDetectDirective.onPointerDown
        )

        window.addEventListener('wheel', ScrollDetectDirective.onWheel)
    },

    unmounted() {
        // if (ScrollDetectDirective.isTouch)
        window.removeEventListener('pointerdown', ScrollDetectDirective.onPointerDown)

        window.removeEventListener('wheel', ScrollDetectDirective.onWheel)
    }
}
