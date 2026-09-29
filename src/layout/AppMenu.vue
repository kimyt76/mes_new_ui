<script setup>
import { useAuthStore } from '@/stores/auth.js';
import { onMounted, ref, watch } from 'vue';
import AppMenuItem from './AppMenuItem.vue';

const authStore = useAuthStore()
const model = ref([])

const buildMenuTree = (menuList) => {

    if (!Array.isArray(menuList)) {
        return []
    }

    const menuMap = new Map()

    menuList.forEach((row) => {

        menuMap.set(row.menuId, {

            menuId: row.menuId,
            parentId: row.parentId,
            sortOrder: row.sortOrder ?? 0,

            menuType: row.menuType,
            readYn: row.readYn ?? 'N',
            writeYn: row.writeYn ?? 'N',

            label: row.menuName,

            ...(row.icon ? {
                icon: row.icon
            } : {}),

            ...(row.menuPath ? {
                to: row.menuPath
            } : {}),

            items: []
        })
    })


    const roots = []


    menuMap.forEach((menu) => {

        if (menu.parentId == null) {

            roots.push(menu)

            return
        }


        const parent =
            menuMap.get(menu.parentId)


        if (parent) {
            parent.items.push(menu)
        }

    })


    const sortMenus = (items) => {

        items.sort(
            (a, b) =>
                (a.sortOrder ?? 0) -
                (b.sortOrder ?? 0)
        )


        items.forEach((item) => {

            if (item.items?.length) {

                sortMenus(item.items)

            } else {

                delete item.items

            }

        })

    }


    sortMenus(roots)


    return roots
}

watch( () => authStore.menuAuthList, (menuList) => {
        model.value = buildMenuTree(menuList ?? []);
    },
    {
        immediate: true
    }
);

/**
 * Store의 메뉴가 변경되면
 * 왼쪽 메뉴 자동 재생성
 */
watch( () => authStore.menuAuthList, (menuList) => {
        model.value =
            buildMenuTree(
                menuList ?? []
            )

    },
    {
        deep: true,
        immediate: true
    }
)

onMounted(async  () => {
     await authStore.fetchMenuAuthList();
})
</script>


<template>
    <ul class="layout-menu">

        <template
            v-for="(item, i) in model"
            :key="item.menuId ?? i"
        >

            <app-menu-item
                v-if="!item.separator"
                :item="item"
                :index="i"
            />

            <li
                v-if="item.separator"
                class="menu-separator"
            ></li>

        </template>

    </ul>
</template>


<style lang="scss" scoped>
</style>
