<template>
<!-- 전체 팝업 카드 -->
  <Card style="width: 55rem; height: 48rem;">
    <template #content>
      <div class="flex flex-column h-full">
        <!-- 🔹 검색 영역 -->
        <div class="search-section">
          <form @submit.prevent="srhList" class="search-form">
            <div class="search-field flex gap-2">
                <FloatLabel variant="on">
                    <Select
                        v-model="form.itemTypeCd"
                        :options="itemTypeCds"
                        optionLabel="codeNm"
                        optionValue="code"
                        style="width: 120px"
                    />
                    <label for="on_label">품목구분</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <InputText id="on_label" v-model="form.itemName" style="width: 180px"/>
                    <label for="on_label">품목명</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <InputText id="on_label" v-model="form.itemCd" style="width: 180px"/>
                    <label for="on_label">품목코드</label>
                </FloatLabel>
                <FloatLabel variant="on">
                    <Select
                        v-model="form.regYn"
                        :options="regYns"
                        optionLabel="codeNm"
                        optionValue="code"
                        style="width: 120px"
                    />
                    <label for="on_label">등록여부</label>
                </FloatLabel>
                <Button label="검색" icon="pi pi-search" type="submit" class="bg-blue-500 text-white hover:bg-blue-600"></Button>
            </div>
          </form>
        </div>
        <!-- 🔹 리스트 영역 (높이 제한) -->
        <div class="list-section mt-3 h-[500px]">
          <div class="overflow-auto">
            <DataTable
                :value="qcTestTypeList"
                paginator :rows="20"
                :rowsPerPageOptions="[20,30,40]"
                scrollHeight="500px"
                columnResizeMode="fit"
                scrollable
                showGridlines
                class="my-table"
                @row-click="selectRowClick"
                >
                <Column field="itemCd"          header="품목코드"  :style="{ width: '100px', textAlign:'center'}" />
                <Column field="itemTypeName"    header="품목구분"  :style="{ width: '120px', textAlign:'center'}" />
                <Column field="itemName"        header="품목명"    :style="{ width: '400px'}" bodyClass="break-words"/>
                <Column field="testItemJoin"    header="시험항목"  :style="{ width: '400px', textAlign:'center'}" />
                <Column field="regYn"           header="등록여부"  :style="{ width: '120px', textAlign:'center'}" />
            </DataTable>
          </div>
        </div>
    </div>
    <!-- 🔹 하단 버튼 -->
    <div class="flex gap-2 justify-end pt-3">
      <Button label="닫기" outlined class="ml-2" @click="closeDialog" />
    </div>
    </template>
</Card>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiQc } from '@/api/apiQc';
import { computed, inject, onMounted, reactive, ref } from 'vue';

const dialogRef = inject('dialogRef')
const qcTestTypeList = ref([])
const itemTypeCds = ref([])
const totalCount = computed(() => {
  return Array.isArray(qcTestTypeList.value) ? qcTestTypeList.value.length : 0
})
const regYns = ref([
    { codeNm: '등록', code: 'Y' },
    { codeNm: '미등록', code: 'N' },
])
const form = reactive({
    itemName: '',
    itemCd: '',
    itemTypeCd: '',
    regYn : '',
})

const srhList = async () =>{
    const param = {
        ...form
    }
    qcTestTypeList.value = await ApiQc.getQcTestTypeList(param)
}

const selectRowClick = async (row) =>{
    const res = await ApiQc.getQcTestTypeMethod(row.data.itemCd)
    dialogRef.value.close(res)
}

onMounted( async () => {
    itemTypeCds.value = await ApiCommon.getCodeList('item_type_cd')
    form.regYn ='Y'
})

const closeDialog = () =>{
    dialogRef.value.close()
}

</script>

<style scoped>
:deep(.my-table .p-datatable-thead > tr > th) {
  background-color: #BCAAA4;
  color: white;
  font-size: 14px;
  text-align: center;
  font-family: monaco, Consolas;
}
::v-deep(.break-words) {
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
  text-decoration: underline;
  cursor: pointer;
}
</style>
