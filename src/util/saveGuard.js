import { ref } from 'vue'

export const useSaveGuard = () => {

    const isSaving = ref(false)

    const saveGuard = async (callback) => {

        // 저장 중이면 재실행 방지
        if (isSaving.value) {
            return
        }

        isSaving.value = true

        try {
            return await callback()
        } finally {
            // 성공, 실패 관계없이 해제
            isSaving.value = false
        }
    }

    return {
        saveGuard,
        isSaving
    }
}
