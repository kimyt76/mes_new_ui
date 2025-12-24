<template>
    <Card style="width: 70rem; height: 25rem;">
        <template #content>
            <div class="w-full mb-4 font-bold">
              - {{ dialogData.asItemName }} ( {{ dialogData.asItemCd }} )
            </div>
            <!-- Row 1 -->
            <div class="grid mb-3">
                <div class="col-3">
                    <FloatLabel variant="on">
                        <Select v-model="form.itemTypeCd"
                                :options="itemTypeCds"
                                optionLabel="codeNm"
                                optionValue="code" class="w-[223px]"  />
                        <label>품목구분</label>
                    </FloatLabel>
                </div>
                <div class="col-6 flex">
                    <FloatLabel variant="on">
                        <InputText v-model="form.itemCd" class="w-full" />
                        <label>품목코드</label>
                    </FloatLabel>
                    <Button icon="pi pi-search"
                        label="중복체크"
                        class="p-button-text p-mt-2"
                        @click="itemCdCheck"
                        />
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <Select v-model="form.useYn"
                                :options="useYns"
                                optionLabel="codeNm"
                                optionValue="code" class="w-full" />
                        <label>사용유무</label>
                    </FloatLabel>
                </div>
            </div>
            <!-- Row 2 -->
             <div class="grid mb-3">
                <div class="col-6">
                    <FloatLabel variant="on">
                        <InputText v-model="form.itemName" class="w-full" />
                        <label>품목명</label>
                    </FloatLabel>
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <Select v-model="form.itemGrp1"
                        :options="itemGrp1s"
                        optionLabel="codeNm"
                        optionValue="code" class="w-full" />
                        <label>거래유형</label>
                    </FloatLabel>
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <Select v-model="form.itemGrp2"
                                :options="itemGrp2s"
                                optionLabel="codeNm"
                                optionValue="code" class="w-full" />
                        <label>제품유형</label>
                    </FloatLabel>
                </div>
            </div>

            <div class="grid mb-3">
                <div class="col-3">
                    <FloatLabel variant="on">
                        <Select v-model="form.itemCategory1"
                                :options="itemCategory1s"
                                optionLabel="codeNm"
                                optionValue="code" class="w-full" />
                        <label>제품유형(대)</label>
                    </FloatLabel>
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <Select v-model="form.itemCategory2"
                                :options="itemCategory2s"
                                optionLabel="codeNm"
                                optionValue="code" class="w-full" />
                        <label>제품유형(중)</label>
                    </FloatLabel>
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <InputText v-model="form.unit" class="w-full" />
                        <label>단위</label>
                    </FloatLabel>
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <InputText v-model="form.spec" class="w-full" />
                        <label>SPEC</label>
                    </FloatLabel>
                </div>
            </div>
            <div class="grid mb-3">
                <div class="col-6">
                    <FloatLabel variant="on">
                        <IconField iconPosition="left">
                            <InputText v-model="form.customerName" class="w-full"/>
                            <InputIcon class="pi pi-search"  @click="openPop"/>
                        </IconField>
                        <label>거래처</label>
                    </FloatLabel>
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <InputNumber v-model="form.inPrice" class="w-full" />
                        <label>입고단가</label>
                    </FloatLabel>
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <InputNumber v-model="form.outPrice" class="w-full" />
                        <label>출고단가</label>
                    </FloatLabel>
                </div>
            </div>
            <!-- etc -->
            <div class="grid mb-3">
                <div class="col-12">
                    <FloatLabel variant="on">
                        <Textarea v-model="form.etc" rows="3" class="w-full" style="resize: none" />
                        <label>비고</label>
                    </FloatLabel>
                </div>
            </div>

        </template>
    </Card>
    <!-- Buttons -->
    <div class="flex gap-2 justify-end pt-3">
        <Button label="저장" class="p-button-secondary" @click="saveInfo()"></Button>
        <Button label="닫기"  outlined class="ml-2" @click="closeDialog"></Button>
    </div>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiItem } from '@/api/apiItem';
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';
import { replaceString, typeCd } from '@/util/common';
import { handleApiError } from '@/util/errorHandler';
import { useDialog } from 'primevue';
import { computed, inject, onMounted, reactive, ref, watch } from 'vue';
import CustomerListPop from '../customer/CustomerListPop.vue';

const { vSuccess, vInfo, vWarning } = useAlertStore()
const {userId} = useAuthStore()

const dialog = useDialog()
const dialogRef = inject('dialogRef', null);
const dialogData  = computed(() => dialogRef?.value?.data ?? {
  asItemCd: '',
  asItemName: '',
  itemTypeCd: '',
});

const itemTypeCds = ref([])
const itemCategory1s = ref([])
const itemCategory2s = ref([])
const itemGrp1s = ref([])
const itemGrp2s = ref([])
const useYns =ref([])

const form = reactive({
    itemTypeCd: '',
    itemCd:'',
    itemName: '',
    itemCategory1: '',
    itemCategory2: '',
    unit: '',
    spec: '',
    inPrice: '',
    outPrice: '',
    customerCd: '',
    customerName: '',
    itemGrp1: '',
    itemGrp2: '',
    etc: '',
    useYn: 'Y',

    gb : 'O',
    userId: userId,
})

const saveInfo =  async() =>{
    try{
        const params = {
        ...form
        }
    const msg = await ApiItem.saveItemInfo(params)
    vSuccess(msg.data.message)
    closeDialog()
  }catch(err){
    handleApiError(err)
  }
}

watch(() => form.itemTypeCd, async (newVal) => {
  form.itemCd = dialogData.value.asItemCd+typeCd(newVal)
  form.itemName = replaceString(form.itemName, newVal)
})

watch(() => form.itemCategory1, async(newVal) => {
    itemCategory2s.value = await ApiItem.getProdMList(newVal)
})

const openPop = () =>{
    dialog.open( CustomerListPop, {
        props: {
            header:'거래처 목록',
            modal: true,
            style: {
                overflow: 'hidden'
            },
            pt: {
                root: { style: { overflow: 'hidden' } },
                content: { style: { overflow: 'hidden' } }
            }
        },
        onClose: (event) =>{
            form.customerCd = event.data.customerCd
            form.customerName = event.data.customerName
        }

    })
}

onMounted(async () =>{
    const res = await ApiItem.getItemInfo(dialogData.value.asItemCd);

    itemTypeCds.value = (await ApiCommon.getCodeList('ITEM_TYPE_CD'))
        .filter(i => !['M1','M2', 'M4','M7'].includes(i.code));
    itemGrp1s.value = await ApiCommon.getCodeList('ITEM_GRP1')
    itemGrp2s.value = await ApiCommon.getCodeList('ITEM_GRP2')
    useYns.value = await ApiCommon.getCodeList('use_yn')
    itemCategory1s.value = await ApiItem.getProdLList()
    itemCategory2s.value = await ApiItem.getProdMList(res.itemCategory1)

    Object.assign(form, res)
})

const itemCdCheck = async () =>{
  const chk = await ApiItem.getItemCdCheck(form.itemCd)

  if ( chk === 'Y' ) {
    vWarning("중복된 품목코드입니다.")
  }else{
    vInfo("사용가능한 품목코드입니다.")
  }
}

const closeDialog = () => {
  dialogRef.value.close();
};

</script>

<style scoped>

</style>
