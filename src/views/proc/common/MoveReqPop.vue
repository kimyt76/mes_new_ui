<template>
<Card style="width: 80rem; height: 12rem;">
    <template #content>
        <!-- Row 1 -->
        <div class="grid mt-1 mb-1">
            <div class="col-4">
                <FloatLabel variant="on">
                    <DatePicker v-model="form.moveReqDate" inputId="on_label" showIcon iconDisplay="input" />
                    <label>요청일</label>
                </FloatLabel>
            </div>
            <div class="col-4">
                <FloatLabel variant="on">
                    <IconField iconPosition="left">
                    <InputText v-model="form.managerName" class="w-full" />
                    <InputIcon class="pi pi-search" @click="openPop('U')" />
                    </IconField>
                    <label>담당자</label>
                </FloatLabel>
            </div>
        </div>
        <div class="grid">
            <div class="col-4">
                <FloatLabel variant="on">
                    <Select
                    v-model="form.areaCd"
                    :options="areaCds"
                    optionLabel="codeNm"
                    optionValue="code"
                    class="w-full"
                    />
                    <label>구역(공장)</label>
                </FloatLabel>
            </div>
            <div class="col-4">
                <FloatLabel variant="on">
                    <Select
                        v-model="form.srcStorageCd"
                        :options="storages"
                        optionLabel="codeNm"
                        optionValue="code"
                        class="w-full"
                    />
                    <label>보내는 창고</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <Select
                        v-model="form.destStorageCd"
                        :options="storages"
                        optionLabel="codeNm"
                        optionValue="code"
                        class="w-full"
                    />
                    <label>받는 창고</label>
                </FloatLabel>
            </div>
        </div>
        <!-- Row 2 -->
        <div class="grid">
            <div class="col-12">
                <FloatLabel variant="on">
                    <Textarea v-model="form.etc" rows="1" class="w-full" autoResize />
                    <label>비고</label>
                </FloatLabel>
            </div>
        </div>
    </template>
</Card>
<div class="flex justify-end mt-3">
    <Button label="품목추가" severity="secondary" @click="openPop('I')"></Button>
</div>
<div class="mt-3">
    <DataTable
        v-model:selection="selectedItem"
        :value="itemList"
        class="my-table"
        showGridlines=""
        >
        <Column selectionMode="multiple" style="width: 3em"/>
        <Column field="itemCd"      header="품목코드" style="width: 120px"/>
        <Column field="itemName"    header="품목명" style="width: 400px"/>
        <Column field="qty"         header="수량" style="width: 100px">
            <template #body="slotProps">
                <InputNumber v-model="slotProps.data.qty" mode="decimal" :min="0" :max="999999" :useGrouping="false" class="w-full"/>
            </template>
        </Column>
        <Column field="etc" header="적요" style="width: 150px">
            <template #body="slotProps">
                <InputText v-model="slotProps.data.etc" class="w-full"/>
            </template>
        </Column>
        <Column field="actions"     header="-"    :style="{ width: '20px', textAlign:'center'}">
            <template #body="slotProps">
                <i class="pi pi-trash cursor-pointer"@click="removeRow(slotProps.index)"></i>
            </template>
        </Column>
    </DataTable>
</div>
<div class="flex justify-end gap-2 mt-2">
    <Button label="저장" severity="success" @click="saveInfo"/>
    <Button label="닫기" outlined class="ml-2" @click="closeDialog"/>
</div>


    <Dialog
        v-model:visible="itemDialog"
        header="품목 조회"
        modal
        :draggable="true"
        :resizable="false"
        >
        <ItemListMultiPop
            @selected = "handleSelected"
            @close="itemDialog = false"
            />
    </Dialog>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiSystems } from '@/api/apiSystem';
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';
import { todayKST } from '@/util/common';
import ItemListMultiPop from '@/views/basic/item/ItemListMultiPop.vue';
import UserListPop from '@/views/system/user/UserListPop.vue';
import { useDialog } from 'primevue';
import { computed, inject, onMounted, reactive, ref } from 'vue';

const itemDialog = ref(false)
const dialog = useDialog()
const { vSuccess, vInfo, vWarning} = useAlertStore()
const { userId, memberNm } = useAuthStore()
const dialogRef = inject('dialogRef');
const selectedItem = ref([])
const itemList = ref([])
const areaCds = ref([])
const allStorages = ref([]); // 전체 창고(18건)
const filteredStorages = computed(() => {
  if (!form.areaCd) return [];
  return allStorages.value.filter(s => s.areaCd === form.areaCd);
});

const storages = computed(() => filteredStorages.value);

const form = reactive({
    moveReqDate: '',
    areaCd: '',
    srcStorageCd: '',
    destStorageCd: '',
    managerId: '',
    managerName: '',
    etc: '',

    manamerName: '',
    userId: userId,
})

const handleSelected = (obj) =>{
    addRow(obj)
    itemDialog.value = false
}

const openPop = (type) =>{
    if(type === 'U'){
        dialog.open(UserListPop, {
            props:{
                header: '담당자 검색',
                modal: true,
                maximizable: false,
                draggable: false,
                style: {
                    overflow: 'hidden'
                },
                pt: {
                    root: { style: { overflow: 'hidden' } },
                    content: { style: { overflow: 'hidden' } }
                },
            },
            onClose:(event) => {
                if(event){
                    if(type === 'U'){
                        form.managerId = event.userId
                        form.managerName = event.memberNm
                    } else if(type === 'I'){
                        addRow(event)
                    }
                }
            },
        })
    }else{
        itemDialog.value = true
    }
}

const saveInfo = () =>{

}

const addRow = (obj) =>{
    const rowItem = obj.map((o, index) => ({
      itemCd: o.itemCd,
      itemName: o.itemName,
      qty: o.qty,
      etc: '',
  }));

  if (itemList.value.length > 0) {
    itemList.value.push(...rowItem);
  } else {
    itemList.value = [...rowItem];
  }
}

const removeRow = (index) =>{
    itemList.value.splice(index, 1);
}

onMounted( async ()=>{
    form.moveReqDate = todayKST()
    form.managerId = userId
    form.managerName = memberNm
    areaCds.value = await ApiCommon.getCodeList('area')
    allStorages.value = await ApiSystems.getStorageCodeList()

    const list = dialogRef.value?.data ?? []; // 부모에서 넘어온 배열
    form.etc = Array.isArray(list)? list
        .map(row => row.itemName)        // <- row.etc (필드명 확인!)
        .filter(v => v != null && String(v).trim() !== '')
        .join('\n')
        : (list?.itemName ?? ''); // 혹시 단건으로 올 때 대비
})

const closeDialog = () => {
  dialogRef.value.close();
};


</script>

<style scoped>
::v-deep(.my-table .p-datatable-thead > tr > th) {
  background-color: #BCAAA4;
  color: white;
  font-size: 14px;
  text-align: center;
  font-family: monaco, Consolas;
  padding: 8px;
}

</style>
