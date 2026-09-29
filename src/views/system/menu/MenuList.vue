<template>
<Breadcrumb :home="home" :model="items"/>

<form @submit.prevent="srhList" class="space-y-4">
    <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full">
        <template #start>
            <div class="flex flex-wrap items-center gap-2 w-full">
                <FloatLabel variant="on">
                    <InputText v-model="form.menuName" style="width: 180px" />
                    <label>메뉴명</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <Select
                        v-model="form.menuType"
                        :options="menuTypes"
                        optionLabel="codeNm"
                        optionValue="code"
                        style="width: 150px"
                        showClear
                    />
                    <label>메뉴구분</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <Select
                        v-model="form.useYn"
                        :options="useYns"
                        optionLabel="codeNm"
                        optionValue="code"
                        style="width: 150px"
                        showClear
                    />
                    <label>사용여부</label>
                </FloatLabel>
                <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600" />
            </div>
        </template>
    </Toolbar>
</form>

<div class="flex items-center justify-end gap-2 mb-2">
    <Button label="신규" icon="pi pi-plus" severity="secondary" @click="selectRowClick(null)" />
    <Button label="전체펼침" icon="pi pi-angle-double-down" severity="secondary" outlined @click="expandAll" />
    <Button label="전체접기" icon="pi pi-angle-double-up" severity="secondary" outlined @click="collapseAll" />
    <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel" />
</div>

<TreeTable
    :value="menuTree"
    v-model:expandedKeys="expandedKeys"
    scrollable
    scrollHeight="650px"
    showGridlines
    class="my-table"
>
    <Column field="menuName" header="메뉴명" expander :style="{ width: '320px', textAlign: 'center' }" >
        <template #body="slotProps">
            <div
                :class="{
                    'clickable-cell': Number(slotProps.node.data.menuLevel) === 3
                }"
                @click=" Number(slotProps.node.data.menuLevel) === 3 && selectRowClick(slotProps.node.data) "
            >
                <i v-if="slotProps.node.data.menuType === 'G'" class="pi pi-folder mr-2" ></i>
                <i v-else class="pi pi-file mr-2" ></i>
                {{ slotProps.node.data.menuName }}
            </div>
        </template>
    </Column>
    <Column field="menuLevel" header="단계" :style="{ width: '80px', textAlign: 'center' }" >
        <template #body="slotProps">
            {{ slotProps.node.data.menuLevel }}단계
        </template>
    </Column>
    <Column field="menuType" header="구분" :style="{ width: '100px', textAlign: 'center' }" >
        <template #body="slotProps">
            <Tag
                v-if="slotProps.node.data.menuType === 'G'"
                value="그룹"
                severity="info"
            />
            <Tag
                v-else
                value="메뉴"
                severity="secondary"
            />
        </template>
    </Column>
    <Column field="menuPath" header="메뉴경로" :style="{ width: '300px' }" />
    <Column field="icon" header="아이콘" :style="{ width: '200px' }" >
        <template #body="slotProps">
            <div class="flex align-items-center gap-2">
                <i
                    v-if="slotProps.node.data.icon"
                    :class="slotProps.node.data.icon"
                ></i>

                <span>
                    {{ slotProps.node.data.icon }}
                </span>
            </div>
        </template>
    </Column>
    <Column field="sortOrder" header="순서" :style="{ width: '80px', textAlign: 'center' }" />
    <Column field="useYn" header="사용여부" :style="{ width: '90px', textAlign: 'center' }" >
        <template #body="slotProps">
            <Tag
                :value="slotProps.node.data.useYn === 'Y' ? '사용' : '미사용'"
                :severity="slotProps.node.data.useYn === 'Y' ? 'success' : 'danger'"
            />
        </template>
    </Column>
</TreeTable>
</template>


<script setup>
import { ApiSystem } from '@/api/apiSystem'
import { exportToExcel } from '@/util/exportToExcel'
import { useDialog } from 'primevue'
import { onMounted, reactive, ref } from 'vue'
import MenuPop from './MenuPop.vue'

const dialog = useDialog()
const menuList = ref([])
const menuTree = ref([])
const expandedKeys = ref({})
const form = reactive({
    menuName: '',
    menuType: '',
    useYn: ''
})
const menuTypes = ref([
    { codeNm: '그룹', code: 'G' },
    { codeNm: '메뉴', code: 'M' }
])
const useYns = ref([
    { codeNm: '사용', code: 'Y' },
    { codeNm: '미사용', code: 'N' }
])

const buildMenuTree = (list) => {
    if (!Array.isArray(list)) return []

    const nodeMap = new Map()

    list.forEach((row) => {
        nodeMap.set(row.menuId, {
            key: String(row.menuId),

            data: {
                ...row
            },

            children: []
        })
    })

    const roots = []

    nodeMap.forEach((node) => {
        const parentId = node.data.parentId

        if (parentId == null) {
            roots.push(node)
            return
        }

        const parent = nodeMap.get(parentId)

        if (parent) {
            parent.children.push(node)
        } else {
            roots.push(node)
        }
    })

    const sortNodes = (nodes) => {
        nodes.sort(
            (a, b) =>
                (a.data.sortOrder ?? 0) -
                (b.data.sortOrder ?? 0)
        )

        nodes.forEach((node) => {

            if (node.children?.length) {
                sortNodes(node.children)
            } else {
                delete node.children
            }

        })
    }

    sortNodes(roots)

    return roots
}

const srhList = async () => {
    try {
        const params = {
            ...form
        }
        const res = await ApiSystem.getMenuMgmtList(params)
        const list = res?.data ?? res ?? []

        menuList.value = list
        menuTree.value = buildMenuTree(list)

    } catch (error) {
        console.error('메뉴 조회 오류', error)
        menuList.value = []
        menuTree.value = []
    }
}

const expandAll = () => {
    const keys = {}

    const addKeys = (nodes) => {
        nodes.forEach((node) => {
            if (node.children?.length) {
                keys[node.key] = true
                addKeys(node.children)
            }
        })
    }

    addKeys(menuTree.value)
    expandedKeys.value = keys
}


const collapseAll = () => {
    expandedKeys.value = {}
}


const selectRowClick = (row) => {

    // 신규 등록
    const isNew = row == null

    // 기존 메뉴는 3단계만 상세팝업 호출
    if (!isNew && Number(row.menuLevel) !== 3) {
        return
    }

    const menuId = row?.menuId ?? null

    console.log('menuId', menuId)

    const title = menuId
        ? '메뉴 상세'
        : '메뉴 등록'

    dialog.open(MenuPop, {
        props: {
            header: title,
            modal: true,
            maximizable: false,
            draggable: true,
            style: {
                width: '700px',
                overflow: 'hidden'
            }
        },
        data:{
            menuId: menuId,
        } ,
        onClose: () => {
            srhList()
        }
    })
}

const downloadExcel = () => {
    const columns = [
        { field: 'menuId', header: '메뉴ID' },
        { field: 'menuName', header: '메뉴명' },
        { field: 'menuLevel', header: '단계' },
        { field: 'menuType', header: '구분' },
        { field: 'menuPath', header: '메뉴경로' },
        { field: 'icon', header: '아이콘' },
        { field: 'sortOrder', header: '순서' },
        { field: 'useYn', header: '사용여부' }
    ]

    exportToExcel( menuList.value, '메뉴 리스트', columns )
}


const home = ref({
    icon: 'pi pi-home'
})

const items = ref([
    { label: '시스템관리' },
    { label: '메뉴관리' }
])

onMounted(() => {
    srhList()
})

</script>


<style scoped>
::v-deep(.my-table .p-treetable-thead > tr > th) {
    background-color: #BCAAA4;
    color: white;
    font-size: 14px;
    text-align: center;
    font-family: monaco, Consolas;
}

::v-deep(.my-table .p-treetable-tbody > tr > td) {
    font-size: 13px;
    padding: 4px 6px;
}

.clickable-cell {
    cursor: pointer;
    text-decoration: underline;
    text-align: left;
    width: 100%;
}

.clickable-cell:hover {
    font-weight: 600;
}
</style>
