import { ref } from 'vue';

export function useSaveGuard() {
    const isSaving = ref(false);

    const saveGuard = async (callback) => {
        if (isSaving.value) {
            return;
        }

        isSaving.value = true;

        try {
            return await callback();
        } finally {
            isSaving.value = false;
        }
    };

    return {
        isSaving,
        saveGuard
    };
}
