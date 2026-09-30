<template>
<Breadcrumb :home="home" :model="items"/>
<form @submit.prevent="srhList" class="space-y-4">
    <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full">
        <template #start>
            <div class="flex flex-wrap items-center gap-2 w-full">
                <FloatLabel variant="on">
                    <InputText id="on_label1" v-model="form.deptNm" style="width: 250px" />
                    <label for="on_label1">부서</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <InputText id="on_label2" v-model="form.memberNm" style="width: 250px" />
                    <label for="on_label2">사용자</label>
                </FloatLabel>
                <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600" />
            </div>
        </template>
    </Toolbar>
    <div class="auth-toolbar">
        <div class="auth-toolbar-left">
            <Button label="저장" icon="pi pi-save" @click="saveInfo" />
            <Button label="권한복사" icon="pi pi-copy" severity="secondary" @click="authCopyPop" />
            <div class="all-check-area">
                <div class="flex items-center gap-2">
                    <Checkbox
                        v-model="allReadYn"
                        binary
                        inputId="allReadYn"
                        :disabled="!selectedUser || !selectedGrpMenu"
                        @change="changeAllRead"
                    />
                    <label for="allReadYn">읽기권한 전체</label>
                </div>
                <div class="flex items-center gap-2">
                    <Checkbox
                        v-model="allWriteYn"
                        binary
                        inputId="allWriteYn"
                        :disabled="!selectedUser || !selectedGrpMenu"
                        @change="changeAllWrite"
                    />
                    <label for="allWriteYn">쓰기권한 전체</label>
                </div>
            </div>
        </div>
        <div v-if="selectedUser" class="selected-user-info">
            선택 사용자 :
            <strong>{{ selectedUser.deptNm }} / {{ selectedUser.memberNm }}</strong>
        </div>
    </div>
    <div class="auth-container">
        <!-- 사용자 정보 -->
        <div class="user-area">
            <div class="table-title">사용자</div>
            <DataTable
                v-model:selection="selectedUser"
                :value="userList"
                dataKey="userId"
                selectionMode="single"
                scrollable
                scrollHeight="650px"
                showGridlines
                class="my-table"
                tableStyle="table-layout: fixed;"
                @rowSelect="selectUser"
            >
                <Column field="deptNm"      header="부서" :style="{ width: '160px'}"></Column>
                <Column field="jobPosition" header="직급" :style="{ width: '80px', textAlign: 'center' }"></Column>
                <Column field="memberNm"    header="사용자명" :style="{ width: '120px', textAlign: 'center' }" ></Column>
                <template #empty>
                    <div class="empty-message">
                        조회된 사용자가 없습니다.
                    </div>
                </template>
            </DataTable>
        </div>
        <!-- 2레벨 메뉴 -->
        <div class="group-area">
            <div class="table-title">그룹메뉴</div>
            <DataTable
                v-model:selection="selectedGrpMenu"
                :value="grpMenuList"
                dataKey="menuId"
                selectionMode="single"
                scrollable
                scrollHeight="650px"
                showGridlines
                class="my-table"
                tableStyle="table-layout: fixed;"
                @rowSelect="selectGrpMenu"
            >
                <Column field="grpMenuName" header="그룹명" :style="{ width: '80px', textAlign: 'center' }"></Column>
                <template #empty>
                    <div class="empty-message">
                        조회된 그룹메뉴가 없습니다.
                    </div>
                </template>
            </DataTable>
        </div>
        <!-- 메뉴 권한 -->
        <div class="menu-area">
            <div class="table-title">
                메뉴권한
                <span v-if="selectedGrpMenu">
                    - {{ selectedGrpMenu.menuName }}
                </span>
            </div>
            <DataTable
                :value="filteredMenuList"
                dataKey="menuId"
                scrollable
                scrollHeight="650px"
                showGridlines
                class="my-table"
                tableStyle="table-layout: fixed;"
            >
                <Column field="grpMenuName" header="그룹명" :style="{ width: '80px', textAlign: 'center' }"></Column>
                <Column field="menuName" header="메뉴명" style="width: 260px"></Column>
                <Column field="readYn" header="읽기권한" style="width: 100px">
                    <template #body="{ data }">
                        <div class="check-cell">
                            <Checkbox
                                :modelValue="data.readYn === 'Y'"
                                binary
                                @update:modelValue="value => changeReadYn(data, value)"
                                :disabled="!selectedUser"
                            />
                        </div>
                    </template>
                </Column>
                <Column field="writeYn" header="쓰기권한" style="width: 100px">
                    <template #body="{ data }">
                        <div class="check-cell">
                            <Checkbox
                                :modelValue="data.writeYn === 'Y'"
                                binary
                                @update:modelValue="value => changeWriteYn(data, value)"
                                :disabled="!selectedUser"
                            />
                        </div>
                    </template>
                </Column>
                <template #empty>
                    <div class="empty-message">
                        조회된 메뉴가 없습니다.
                    </div>
                </template>
            </DataTable>
        </div>
    </div>
</form>
</template>
<script setup>
import { ApiSystem } from '@/api/apiSystem';
import { useAlertStore } from '@/stores/alert';
import { handleApiError } from '@/util/errorHandler';
import { useDialog } from 'primevue';
import { computed, onMounted, reactive, ref } from 'vue';
import AuthPop from './AuthPop.vue';
const dialog = useDialog()
const { vSuccess, vInfo } = useAlertStore()
const userList = ref([])
const grpMenuList = ref([])
const menuList = ref([])
const selectedUser = ref(null)
const selectedGrpMenu = ref(null)
const allReadYn = ref(false)
const allWriteYn = ref(false)
const form = reactive({
    deptNm: '',
    memberNm: '',
    useYn: 'Y',
})
const filteredMenuList = computed(() =>{
    if (!selectedGrpMenu.value || selectedGrpMenu.value.menuId === 'ALL') {
        return menuList.value
    }
    return menuList.value.filter(row =>
        String(row.grpMenuId ?? row.parentId) === String(selectedGrpMenu.value.menuId)
    )
})
const authCopyPop = () =>{
    if (!selectedUser.value?.userId) {
        vInfo('사용자를 선택해주세요.')
        return
    }
    dialog.open(AuthPop, {
        props:{
            header:'사용자권한복사',
            modal: true,
            draggable:false,
            style:{
                width:'400px'
            }
        },
        data:{
            srcUserId: selectedUser.value.userId,
            srcMemberNm: selectedUser.value.memberNm,
        },
        onClose: (event) => {
            if (event?.data) {
                selectUserInfo(selectedUser.value)
            }
       }
    })
}
const srhList = async () =>{
    try{
        const params = {
            ...form
        }
        const res = await ApiSystem.getAuthMenuInfo(params)
        userList.value = res.userList || []
        grpMenuList.value = [
            {
                menuId: 'ALL',
                grpMenuName: 'ALL'
            },
            ...(res.grpMenuList || [])
        ]
        menuList.value = (res.menuList || []).map(row =>({
            ...row,
            readYn: 'N',
            writeYn: 'N'
        }))
        selectedUser.value = null
        selectedGrpMenu.value = grpMenuList.value[0] || null
        setAllCheckState()
    }catch(error){
        handleApiError(error)
    }
}
const selectUser = async (event) =>{
    const row = event.data
    await selectUserInfo(row)
}
const selectUserInfo = async (row) =>{
    console.log('row', row)
    try{
        if (!row?.userId) {
            return
        }
        selectedGrpMenu.value = grpMenuList.value[0] || null

        const params = {
            userId: row.userId,
            grpMenuId: null
        }

        const res = await ApiSystem.getUserMenuAuthList(params)

        menuList.value = res || []

        setAllCheckState()
    }catch(error){
        handleApiError(error)
    }
}

const selectGrpMenu = async (event) =>{
    try{
        const row = event.data

        if (!selectedUser.value?.userId) {
            setAllCheckState()
            return
        }

        const params = {
            userId: selectedUser.value.userId,
            grpMenuId: row.menuId === 'ALL' ? null : row.menuId
        }

        const res = await ApiSystem.getUserMenuAuthList(params)

        menuList.value = res || []

        setAllCheckState()

    }catch(error){
        handleApiError(error)
    }
}

const changeReadYn = (row, checked) =>{
    row.readYn = checked ? 'Y' : 'N'
    if (!checked) {
        row.writeYn = 'N'
    }
    setAllCheckState()
}

const changeWriteYn = (row, checked) =>{
    row.writeYn = checked ? 'Y' : 'N'
    if (checked) {
        row.readYn = 'Y'
    }
    setAllCheckState()
}

const changeAllRead = () =>{
    const checked = allReadYn.value
    filteredMenuList.value.forEach(row =>{
        row.readYn = checked ? 'Y' : 'N'
        if (!checked) {
            row.writeYn = 'N'
        }
    })
    setAllCheckState()
}

const changeAllWrite = () =>{
    const checked = allWriteYn.value
    filteredMenuList.value.forEach(row =>{
        row.writeYn = checked ? 'Y' : 'N'
        if (checked) {
            row.readYn = 'Y'
        }
    })
    setAllCheckState()
}

const setAllCheckState = () =>{
    const list = filteredMenuList.value
    if (!selectedUser.value || list.length === 0) {
        allReadYn.value = false
        allWriteYn.value = false
        return
    }
    allReadYn.value = list.every(row => row.readYn === 'Y')
    allWriteYn.value = list.every(row => row.writeYn === 'Y')
}

const saveInfo = async () =>{
    try{
        if (!selectedUser.value?.userId) {
            vInfo('사용자를 선택해주세요.')
            return
        }
        const params = {
            userId: selectedUser.value.userId,
            menuList: menuList.value.map(row =>({
                menuId: row.menuId,
                readYn: row.readYn || 'N',
                writeYn: row.writeYn || 'N'
            }))
        }
       // console.log('권한 저장정보', params)
        await ApiSystem.saveMenuAuth(params)
        vSuccess('저장되었습니다.')
        await selectUserInfo(selectedUser.value)
    }catch(error){
        handleApiError(error)
    }
}
onMounted( async ()=>{
    await srhList()
})

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '시스템관리' },
    { label: '권한관리 목록' },
]);

</script>
<style scoped>
.auth-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
}
.auth-toolbar-left {
    display: flex;
    align-items: center;
    gap: 8px;
}
.all-check-area {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-left: 15px;
}
.selected-user-info {
    font-size: 13px;
    padding-right: 10px;
}
.auth-container {
    display: grid;
    grid-template-columns: 380px 220px 1fr;
    gap: 8px;
    width: 100%;
}
.user-area,
.group-area,
.menu-area {
    min-width: 0;
}
.table-title {
    height: 36px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    border: 1px solid #bdbdbd;
    border-bottom: 0;
    background: #f5f5f5;
    font-size: 14px;
    font-weight: 700;
}
.check-cell {
    display: flex;
    justify-content: center;
    align-items: center;
}
.empty-message {
    padding: 20px;
    text-align: center;
    color: #777777;
}
:deep(.my-table) {
    font-size: 13px;
}
:deep(.my-table .p-datatable-table) {
    table-layout: fixed;
}
:deep(.my-table .p-datatable-thead > tr > th) {
    height: 34px;
    padding: 4px 6px;
    background: #BCAAA4;
    color: #ffffff;
    font-size: 13px;
    text-align: center;
}
:deep(.my-table .p-datatable-tbody > tr > td) {
    height: 32px;
    padding: 3px 6px;
}
:deep(.my-table .p-datatable-tbody > tr.p-datatable-row-selected) {
    font-weight: 600;
}
</style>
