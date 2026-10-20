import { useAuthStore } from '@/stores/auth.js'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export const useMenuPermission = () => {

    const authStore = useAuthStore()
    const route = useRoute()

    // 현재 메뉴의 쓰기 권한
    const canWrite = computed(() => {

        const menuList = authStore.menuAuthList ?? []

        const menu = menuList.find(item =>
            item.menuPath === route.path
        )

        return menu?.writeYn === 'Y'
    })

    return {
        canWrite
    }
}
