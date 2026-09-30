<script setup>
import { useAuthStore } from '@/stores/auth.js';
import { onMounted, ref, watch } from 'vue';
import AppMenuItem from './AppMenuItem.vue';

const authStore = useAuthStore()
const model = ref([])

/**
 * 메뉴 Tree 생성
 *
 * - 실제 메뉴(M) : readYn === 'Y' 인 경우만 노출
 * - 그룹 메뉴(G) : 하위 메뉴가 하나라도 있을 경우만 노출
 * - 최하위 메뉴 : items 속성 제거
 */
const buildMenuTree = (menuList) => {
    if (!Array.isArray(menuList)) return []

    const menuMap = new Map()

    // 1. 전체 메뉴 Map 생성
    menuList.forEach((row) => {
        menuMap.set(row.menuId, {
            menuId: row.menuId,
            parentId: row.parentId,
            sortOrder: row.sortOrder,
            menuLevel: row.menuLevel,
            menuType: row.menuType,

            label: row.menuName,
            to: row.menuPath,
            icon: row.icon,

            readYn: row.readYn ?? 'N',
            writeYn: row.writeYn ?? 'N',

            items: []
        })
    })

    const roots = []
    // 2. 부모 / 자식 관계 생성
    menuMap.forEach((menu) => {

        if (
            menu.parentId == null ||
            menu.parentId === 0 ||
            !menuMap.has(menu.parentId)
        ) {
            roots.push(menu)
        } else {
            menuMap.get(menu.parentId).items.push(menu)
        }
    })

    /**
     * 하위 메뉴부터 권한 필터링
     */
    const filterMenu = (menu) => {
        // 자식 메뉴를 먼저 필터링
        if (menu.items?.length > 0) {
            menu.items = menu.items.filter(filterMenu)

            // 자식 정렬
            menu.items.sort(
                (a, b) =>
                    Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0)
            )
        }

        /**
         * 그룹 메뉴
         *
         * 하위 메뉴가 하나도 없으면
         * 그룹 메뉴도 제거
         */
        if (menu.menuType === 'G') {
            return menu.items?.length > 0
        }

        /**
         * 실제 메뉴
         *
         * 읽기 권한이 없으면 제거
         */
        if (menu.menuType === 'M') {

            if (menu.readYn !== 'Y') {
                return false
            }

            /**
             * 실제 메뉴인데
             * 하위 메뉴가 없으면 최하위 메뉴
             *
             * items: [] 를 남겨두면
             * AppMenuItem에서 하위메뉴로 인식할 수 있으므로
             * items 자체를 제거
             */
            if (!menu.items || menu.items.length === 0) {
                delete menu.items
            }

            return true
        }

        /**
         * menuType 값이 없거나
         * 예상하지 못한 값일 경우
         *
         * 하위 메뉴가 있으면 그룹으로 처리
         */
        if (menu.items?.length > 0) {
            return true
        }

        /**
         * 최하위 메뉴이면 읽기권한 체크
         */
        if (menu.readYn === 'Y') {
            delete menu.items
            return true
        }

        return false
    }

    // 3. Root 메뉴부터 필터링
    return roots
        .filter(filterMenu)
        .sort(
            (a, b) =>
                Number(a.sortOrder ?? 0) -
                Number(b.sortOrder ?? 0)
        )
}

/**
 * Store의 메뉴 권한이 변경되면
 * 왼쪽 메뉴 자동 재생성
 */
watch(
    () => authStore.menuAuthList,
    (menuList) => {

        model.value = buildMenuTree(
            menuList ?? []
        )
    },
    {
        deep: true,
        immediate: true
    }
)

/**
 * 로그인 사용자 메뉴권한 조회
 */
onMounted(async () => {
    await authStore.fetchMenuAuthList()
})
</script>

<template>
    <ul class="layout-menu">
        <template
            v-for="(item, i) in model"
            :key="item.menuId ?? i"
        >
            <app-menu-item v-if="!item.separator" :item="item" :index="i" />
            <li v-if="item.separator" class="menu-separator" ></li>
        </template>
    </ul>
</template>


<style lang="scss" scoped>
</style>
