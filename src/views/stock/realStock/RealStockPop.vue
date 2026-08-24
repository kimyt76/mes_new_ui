<template>
<Card style="width: 64rem; height: 4rem;">
    <template #content>
        <div class="grid mb-2">
            <div class="col-3">
                <FloatLabel variant="on">
                    <DatePicker v-model="form.realStockDate" showIcon fluid/>
                    <label for="on_label">품목구분</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <Select v-model="form.itemTypeCd" :options="itemTypeCds"
                    optionLabel="codeNm"
                    optionValue="code"
                    class="w-full"
                    />
                    <label for="on_label">품목구분</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <Select v-model="form.areaCd" :options="areaCds"
                    optionLabel="codeNm"
                    optionValue="code"
                    class="w-full"
                    />
                    <label for="on_label">구역</label>
                </FloatLabel>
            </div>
            <div class="col-3">
                <FloatLabel variant="on">
                    <Select v-model="form.storageCd" :options="filteredStorages"
                    optionLabel="codeNm"
                    optionValue="code"
                    class="w-full"
                    />
                    <label for="on_label">창고</label>
                </FloatLabel>
            </div>
        </div>
    </template>
</Card>
 <div class="flex justify-end gap-2 mt-3">
    <Button label="저장" class="p-button-secondary" @click="saveInfo" />
    <Button label="닫기" outlined class="ml-2" @click="closeDialog"></Button>
</div>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiStock } from '@/api/apiStock';
import { ApiSystem } from '@/api/apiSystem';
import { useAlertStore } from '@/stores/alert';
import { isEmpty, todayKST } from '@/util/common';
import { computed, inject, onMounted, reactive, ref } from 'vue';

const dialogRef = inject('dialogRef')
const {vSuccess, vWarning} = useAlertStore()
const itemTypeCds = ref([])
const areaCds = ref([])
const allStorages = ref([]);
const filteredStorages = computed(() => {
    if (!form.areaCd) return [];
    return allStorages.value.filter(s => s.areaCd === form.areaCd);
});

const form = reactive({
    realStockDate: todayKST(),
    itemTypeCd: 'M1',
    areaCd: 'A001',
    storageCd: '',

    realStockMstId: '',
})

const saveInfo = async () =>{
    if ( isEmpty(form.storageCd )) return vWarning("창고를 선택하세요!!")

    const params = {
        ...form
    }
    const res = await ApiStock.saveRealStock(params)
    //vSuccess("등록되었습니다.")
    form.realStockMstId = res.data.realStockMstId
    // console.log('res.data.realStockMstId',  res.data.realStockMstId )
    // console.log('form.realStockMstId',  form.realStockMstId )

    dialogRef.value.close({
       realStockMstId: form.realStockMstId,
    })
}

onMounted( async () =>{
    itemTypeCds.value = await ApiCommon.getCodeList('item_type_cd')
    areaCds.value = await ApiCommon.getCodeList('area')
    allStorages.value = await ApiSystem.getStorageCodeList()
})

const closeDialog = () =>{
    dialogRef.value.close()
}

</script>

<style scoped>

</style>
