import type { Directive } from 'vue'

type ScrollDirective = Directive & {
    acceleration: number
    isTouch: boolean
    startY: number

    cbFn: (v: number) => void

    onActionDown: (e: PointerEvent | TouchEvent) => void
    onActionUp: (e: PointerEvent | TouchEvent) => void
    onActionMove: (e: PointerEvent | TouchEvent) => void

    onActionKey: (e: KeyboardEvent) => void
    onWheel: (e: WheelEvent) => void
}

/**
 * Return the clientY value from mouse or touch event
 * @param {PointerEvent | TouchEvent} e
 * @param {boolean} isTouch
 * @return {number}
 */
function getClientY(e: PointerEvent | TouchEvent, isTouch: boolean): number {
    return isTouch ? (e as TouchEvent).targetTouches[0].clientY : (e as PointerEvent).clientY
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
     * @param {PointerEvent | TouchEvent} e
     */
    onActionDown(e: PointerEvent | TouchEvent) {
        ScrollDetectDirective.startY = getClientY(e, ScrollDetectDirective.isTouch)

        window.addEventListener(
            ScrollDetectDirective.isTouch ? 'touchmove' : 'pointermove',
            ScrollDetectDirective.onActionMove
        )
        window.addEventListener(
            ScrollDetectDirective.isTouch ? 'touchend' : 'pointerup',
            ScrollDetectDirective.onActionUp
        )
    },

    /**
     * On move return the progressive value
     * @param {PointerEvent | TouchEvent} e
     */
    onActionMove(e: PointerEvent | TouchEvent) {
        const clientY = getClientY(e, ScrollDetectDirective.isTouch)
        let val = 0

        if (ScrollDetectDirective.isTouch) {
            const direction = clientY > ScrollDetectDirective.startY ? -1 : 1
            val = (window.innerHeight / 30) * direction

            ScrollDetectDirective.acceleration = ScrollDetectDirective.startY - clientY
            ScrollDetectDirective.startY = clientY
        } else {
            val = ScrollDetectDirective.startY - clientY
            console.log(val)
        }

        ScrollDetectDirective.cbFn(val)
    },
    onActionUp(e) {
        ScrollDetectDirective.cbFn(ScrollDetectDirective.acceleration * 3)
        ScrollDetectDirective.acceleration = 0

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

        if (!ScrollDetectDirective.isTouch) {
            window.addEventListener('wheel', ScrollDetectDirective.onWheel)
            window.addEventListener('keydown', ScrollDetectDirective.onActionKey)
        }
    },
    unmounted() {
        window.removeEventListener('pointerdown', ScrollDetectDirective.onActionDown)
        window.removeEventListener('wheel', ScrollDetectDirective.onWheel)
    }
}
