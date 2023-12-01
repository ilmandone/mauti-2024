import { ref } from 'vue'
import { defineStore } from 'pinia'

export type Themes = 'light' | 'dark'

export const useMainStore = defineStore('main', () => {
    const isFocused = ref(false)
    const isTouch = ref(false)
    const theme = ref<Themes>('light')

    function setIsTouch(v: boolean) {
        isTouch.value = v
    }

    function setTheme(v: Themes) {
        theme.value = v
    }

    function setIsFocused(v: boolean) {
        isFocused.value = v
    }

    return { isTouch, setIsTouch, theme, setTheme, isFocused, setIsFocused }
})
