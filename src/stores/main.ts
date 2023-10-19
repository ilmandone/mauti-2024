import { ref } from 'vue'
import { defineStore } from 'pinia'

export type Themes = 'light' | 'dark'

export const useMainStore = defineStore('main', () => {
    // Touch state
    const isTouch = ref(false)
    const theme = ref<Themes>('light')
    const loadProgress = ref<number>(0)
    function setIsTouch(v: boolean) {
        isTouch.value = v
    }

    function setTheme(v: Themes) {
        theme.value = v
    }

    function setLoadProgress(v: number) {
        loadProgress.value = v
    }

    return { isTouch, setIsTouch, theme, setTheme, loadProgress, setLoadProgress }
})
