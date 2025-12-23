<template>
<Breadcrumb :home="home" :model="items"/>
<form @submit.prevent="srhList" class="space-y-4">
    <Toolbar class="flex flex-wrap mt-2 mb-2 gap-1 w-full"  >
        <template #start>
            <div class="flex flex-wrap items-center gap-2 w-full">
            <FloatLabel variant="on">
                <InputText  v-model="form.memberNm" style="width: 150px"/>
                <label for="on_label">사용자 이름</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText v-model="form.jobPosition" style="width: 180px" />
                <label for="jobPosition">직급</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText  v-model="form.deptNm" style="width: 180px" />
                <label for="deptNm">부서</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <Select v-model="form.useYn"
                 :options="useYns"
                 optionLabel="codeNm" optionValue="code"
                 style="width: 150px"
                />
                <label for="on_label1">재직여부</label>
            </FloatLabel>

            <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600" />
            </div>
        </template>
    </Toolbar>
</form>
<div class="flex items-center justify-end gap-2 mb-2">
    <Button label="신규" icon="pi pi-plus" severity="secondary" @click="selectRowClick('')"></Button>
    <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadExcel"></Button>
</div>
<div>
    <DataTable
        :value="userList"
        paginator :rows="20"
        :rowsPerPageOptions="[20,30,40]"
        scrollHeight="650px"
        scrollable
        showGridlines
        class="my-table"
        >
        <Column field="userId"    header="사용자ID"  style="text-align: center;"  :style="{ width: '120px'}" :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data.userId)" class="clickable-cell">
                    {{ slotProps.data.userId }}
                </div>
            </template>
        </Column>
        <Column field="memberNm"  header="사용자명"  style="text-align: center;"    :style="{ width: '130px'}" bodyClass="break-words"  :pt="{ columnHeaderContent: 'justify-center' }">
            <template #body="slotProps">
                <div @click="selectRowClick(slotProps.data.userId)" class="clickable-cell">
                    {{ slotProps.data.memberNm }}
                </div>
            </template>
        </Column>
        <Column field="deptNm"    header="부서" style="text-align: center;"  :style="{ width: '150px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="jobPosition"    header="직급" style="text-align: center;"  :style="{ width: '100px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="phone"    header="전화번호" style="text-align: center;"   :style="{ width: '160px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="email"    header="이메일" style="text-align: center;"  :style="{ width: '180px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="useYn"    header="재직여부" style="text-align: center;"  :style="{ width: '80px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
        <Column field="etc"    header="비고" style="text-align: left;"  :style="{ width: '200px'}" :pt="{ columnHeaderContent: 'justify-center' }"/>
    </DataTable>
</div>


</template>

<script setup>
import { ApiSystems } from '@/api/apiSystem';
import { isEmpty } from '@/util/common';
import { exportToExcel } from '@/util/exportToExcel';
import { useDialog } from 'primevue';
import { reactive, ref } from 'vue';
import UserDtlPop from './UserDtlPop.vue';

const dialog = useDialog()
const dt = ref(null);
const userList = ref([])
const form = reactive({
    memberNm: '',
    jobPosition: '',
    deptNm: '',
    useYn: '',
})

const useYns = ref([
    { codeNm: '재직', code: 'Y' },
    { codeNm: '퇴직', code: 'N' },
])

// form
const srhList = async () =>{
    const params = {
        ...form
    }
    // api
    userList.value = await ApiSystems.getUserList(params);
}

const selectRowClick = (id) =>{
     let title = '사용자 등록'

    if (!isEmpty(id)) {
        title = '사용자 상세'
    }
    dialog.open(UserDtlPop, {
        props: {
            header: title,
            modal: true,
            modal: true,
            maximizable: false,
            draggable: true,
            style: {
                overflow: 'hidden'
            },
            pt: {
                root: { style: { overflow: 'hidden' } },
                content: { style: { overflow: 'hidden' } }
            }
        },
        data: id
    })
}

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: '시스템관리' },
    { label: '사용자관리' },
    { label: '사용자목록' },
]);

const downloadExcel = () =>{
  const cols = dt.value?.columns ?? [];

  if (!cols.length) {
    console.warn("No Columns Found");
    return;
  }
  exportToExcel(userList.value, "사용자 리스트", cols);
}

</script>

<style scoped>
::v-deep(.my-table .p-datatable-thead > tr > th) {
  background-color: #BCAAA4;
  color: white;
  font-size: 14px;
  text-align: center;
  font-family: monaco, Consolas;
}
/* 셀 hover 효과 */
.clickable-cell {
  cursor: pointer;
  text-decoration: underline;
}

::v-deep(.my-table .p-datatable-thead > tr > td) {
  background-color: #BCAAA4;
  color: white;
  font-size: 14px;
}
</style>
