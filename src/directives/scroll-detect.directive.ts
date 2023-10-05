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

    cbFn: (v: number) => void

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

    cbFn() {},

    //#region Mouse
    onWheel(e) {
        ScrollDetectDirective.cbFn(e.deltaY)
    },
    //#endregion

    //#region
    onActionKey(e: KeyboardEvent) {
        switch (e.key) {
            case 'ArrowUp':
                ScrollDetectDirective.cbFn(-100)
                break
            case 'ArrowDown':
                ScrollDetectDirective.cbFn(100)
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
        ScrollDetectDirective.startY = e.targetTouches[0].clientY

        window.addEventListener('touchmove', ScrollDetectDirective.onActionMove)
        window.addEventListener('touchend', ScrollDetectDirective.onActionUp)
    },

    /**
     * On move return the progressive value
     * @param {PointerEvent | TouchEvent} e
     */
    onActionMove(e: TouchEvent) {
        const clientY = e.targetTouches[0].clientY
        let val = 0

        const direction = clientY > ScrollDetectDirective.startY ? -1 : 1
        val = (window.innerHeight / 30) * direction

        ScrollDetectDirective.acceleration = ScrollDetectDirective.startY - clientY
        ScrollDetectDirective.startY = clientY

        ScrollDetectDirective.cbFn(val)
    },
    onActionUp() {
        ScrollDetectDirective.cbFn(ScrollDetectDirective.acceleration * 3)
        ScrollDetectDirective.acceleration = 0

        window.removeEventListener('touchmove', ScrollDetectDirective.onActionMove)
        window.removeEventListener('touchend', ScrollDetectDirective.onActionUp)
    },
    //#endregion

    created(el: HTMLElement, binding) {
        // Register the cb function
        ScrollDetectDirective.cbFn = binding.value.cbFn

        // Detect touch device
        ScrollDetectDirective.isTouch = navigator.maxTouchPoints > 0 || 'ontouchstart' in window
    },
    mounted() {
        window.addEventListener('touchstart', ScrollDetectDirective.onActionDown)
        window.addEventListener('wheel', ScrollDetectDirective.onWheel)
        window.addEventListener('keydown', ScrollDetectDirective.onActionKey)
    },
    unmounted() {
        window.removeEventListener('touchstart', ScrollDetectDirective.onActionDown)
        window.removeEventListener('wheel', ScrollDetectDirective.onWheel)
    }
}
