import type { Directive } from 'vue'

export const ScrollDetectDirective: Directive = {
	created(el: HTMLElement) {
		console.log(el)
	}
}
