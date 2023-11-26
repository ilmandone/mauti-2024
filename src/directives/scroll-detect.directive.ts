import type { Directive } from 'vue'

/**
 * Detect scroll input and return the delta value
 * Input detected:
 * - Touch
 * - Wheel
 * - Keyboard up/down arrows
 */

type ScrollDirective = Directive & {
    acceleration: number
    isTouch: boolean
    startY: number

    cb: (v: number) => void
    getScroll: () => number | void
    enabled: boolean

    onActionDown: (e: TouchEvent) => void
    onActionUp: (e: TouchEvent) => void
    onActionMove: (e: TouchEvent) => void

    onActionKey: (e: KeyboardEvent) => void
    onWheel: (e: WheelEvent) => void
}

export const ScrollDetectDirective: ScrollDirective = {
    acceleration: 0,
    isTouch: false,
    startY: 0,

    cb() {},
    enabled: false,
    getScroll() {},

    //#region Mouse
    onWheel(e) {
        ScrollDetectDirective.enabled &&
            ScrollDetectDirective.cb(-e.deltaY + (ScrollDetectDirective.getScroll() as number))
    },
    //#endregion

    //#region
    onActionKey(e: KeyboardEvent) {
        if (ScrollDetectDirective.enabled)
            switch (e.key) {
                case 'ArrowUp':
                    ScrollDetectDirective.cb(100 + (ScrollDetectDirective.getScroll() as number))
                    break
                case 'ArrowDown':
                    ScrollDetectDirective.cb(-100 + (ScrollDetectDirective.getScroll() as number))
                    break
            }
    },

    //#endregion

    //#region Pointer

    /**
     * Store the start value and enable move and up action
     * @param {TouchEvent} e
     */
    onActionDown(e: TouchEvent) {
        if (ScrollDetectDirective.enabled) {
            ScrollDetectDirective.startY = e.targetTouches[0].clientY - ScrollDetectDirective.startY

            window.addEventListener('touchmove', ScrollDetectDirective.onActionMove)
            window.addEventListener('touchend', ScrollDetectDirective.onActionUp)
        }
    },

    /**
     * On move return the progressive value
     * @param {PointerEvent | TouchEvent} e
     */
    onActionMove(e: TouchEvent) {
        const clientY = e.targetTouches[0].clientY
        let val = 0

        val = clientY - ScrollDetectDirective.startY

        ScrollDetectDirective.acceleration = ScrollDetectDirective.startY - clientY
        ScrollDetectDirective.cb(val)
    },
    onActionUp() {
        ScrollDetectDirective.startY = ScrollDetectDirective.getScroll() as number

        window.removeEventListener('touchmove', ScrollDetectDirective.onActionMove)
        window.removeEventListener('touchend', ScrollDetectDirective.onActionUp)
    },
    //#endregion

    created(el: HTMLElement, binding) {
        // Register the cb function
        ScrollDetectDirective.cb = binding.value.cb
        ScrollDetectDirective.getScroll = binding.value.getScroll

        // Detect touch device
        ScrollDetectDirective.isTouch = navigator.maxTouchPoints > 0 || 'ontouchstart' in window
    },
    mounted(el, binding) {
        ScrollDetectDirective.enabled = binding.value.enabled
        window.addEventListener('touchstart', ScrollDetectDirective.onActionDown)
        window.addEventListener('wheel', ScrollDetectDirective.onWheel)
        window.addEventListener('keydown', ScrollDetectDirective.onActionKey)
    },
    unmounted() {
        window.removeEventListener('touchstart', ScrollDetectDirective.onActionDown)
        window.removeEventListener('wheel', ScrollDetectDirective.onWheel)
    },
    updated(el: HTMLElement, binding) {
        ScrollDetectDirective.enabled = binding.value.enabled
    }
}
