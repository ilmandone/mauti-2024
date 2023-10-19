import { ref } from 'vue'
import { defineStore } from 'pinia'

export type Themes = 'light' | 'dark'
export type State = 'intro' | 'loading' | 'loaded' | 'running'

export const useMainStore = defineStore('main', () => {
    const isTouch = ref(false)
    const loadProgress = ref<number>(0)
    const state = ref<State>('intro')
    const theme = ref<Themes>('light')

    function setIsTouch(v: boolean) {
        isTouch.value = v
    }
    function setLoadProgress(v: number) {
        loadProgress.value = v
    }
    function setState(v: State) {
        state.value = v
    }
    function setTheme(v: Themes) {
        theme.value = v
    }

    return { isTouch, setIsTouch, theme, setTheme, loadProgress, setLoadProgress, state, setState }
})
