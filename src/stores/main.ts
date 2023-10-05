import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', () => {
    // Touch state
    const isTouch = ref(false)
    function setIsTouch(v: boolean) {
        isTouch.value = v
    }

    return { isTouch, setIsTouch }
})
