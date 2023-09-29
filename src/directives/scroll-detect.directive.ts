import type { Directive } from 'vue'

/*function onPointerDown() {
	window.addEventListener('pointerup', onPointerUp)
	console.log(this)
}

function onPointerUp() {
	console.log('UP')
	window.removeEventListener('pointerup', onPointerUp)
}*/

type ScrollDirective = Directive & {
	isTouch: boolean
	cbFn: (v: number) => void

	startY: number
	deltaY: number
	onPointerDown: (e:PointerEvent) => void
	onPointerUp: (e:PointerEvent) => void
	onPointerMove: (e:PointerEvent) => void
	onWheel: (e:WheelEvent) => void
}

export const ScrollDetectDirective: ScrollDirective = {

	isTouch: false,
	cbFn(v: number) {},

	startY: 0,
	deltaY: 0,

	onWheel(e){
		ScrollDetectDirective.cbFn(e.deltaY)
	},

	onPointerDown(e) {
		window.addEventListener('pointerup', ScrollDetectDirective.onPointerUp)
		window.addEventListener('pointermove', ScrollDetectDirective.onPointerMove)
	},

	onPointerMove(e){
		ScrollDetectDirective.cbFn(ScrollDetectDirective.startY - e.clientY)
	},

	onPointerUp(e) {
		window.removeEventListener('pointerup', ScrollDetectDirective.onPointerUp)
		window.removeEventListener('pointermove', ScrollDetectDirective.onPointerMove)
	},

	created(el: HTMLElement, binding) {

		// Register the cb function
		ScrollDetectDirective.cbFn = binding.value.cbFn

		// Detect touch device
		ScrollDetectDirective.isTouch =  navigator.maxTouchPoints > 0 || 'ontouchstart' in window
	},

	mounted(el: HTMLElement) {
		if(!ScrollDetectDirective.isTouch)
			window.addEventListener('pointerdown', ScrollDetectDirective.onPointerDown)

		window.addEventListener('wheel', ScrollDetectDirective.onWheel)
	},

	unmounted(el: HTMLElement) {
		if(!ScrollDetectDirective.isTouch)
			window.removeEventListener('pointerdown', ScrollDetectDirective.onPointerDown)

		window.removeEventListener('wheel', ScrollDetectDirective.onWheel)
	}
}
