import type { Directive } from 'vue'

type ScrollDirective = Directive & {
	isTouch: boolean
	cbFn: (v: number) => void

	startY: number

	onPointerDown: (e: PointerEvent) => void
	onPointerUp: (e: PointerEvent) => void
	onPointerMove: (e: PointerEvent) => void
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

	onPointerDown(e) {
		ScrollDetectDirective.startY = e.clientY
		window.addEventListener('pointerup', ScrollDetectDirective.onPointerUp)
		window.addEventListener('pointermove', ScrollDetectDirective.onPointerMove)
	},

	onPointerMove(e) {
		const val = (ScrollDetectDirective.startY - e.clientY)
		ScrollDetectDirective.cbFn(val)
	},

	onPointerUp() {
		window.removeEventListener('pointerup', ScrollDetectDirective.onPointerUp)
		window.removeEventListener('pointermove', ScrollDetectDirective.onPointerMove)
	},

	//#endregion

	created(el: HTMLElement, binding) {

		// Register the cb function
		ScrollDetectDirective.cbFn = binding.value.cbFn

		// Detect touch device
		ScrollDetectDirective.isTouch = navigator.maxTouchPoints > 0 || 'ontouchstart' in window
	},

	mounted() {
		if (ScrollDetectDirective.isTouch)
			window.addEventListener('pointerdown', ScrollDetectDirective.onPointerDown)

		window.addEventListener('wheel', ScrollDetectDirective.onWheel)
	},

	unmounted() {
		if (ScrollDetectDirective.isTouch)
			window.removeEventListener('pointerdown', ScrollDetectDirective.onPointerDown)

		window.removeEventListener('wheel', ScrollDetectDirective.onWheel)
	}
}
