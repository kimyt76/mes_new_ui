<template>
<Card style="width: 70rem; height: 32rem;">
    <template #content>
            <div class="w-full mb-4 font-bold">
              - {{ dialogPayload.asItemName }} ( {{ dialogPayload.asItemCd }} )
            </div>
            <div class="grid mb-3">
                <div class="col-12 flex items-center gap-3">
                    <FloatLabel variant="on">
                        <Select v-model="form.itemTypeCd"
                                :options="itemTypeCds"
                                optionLabel="codeNm"
                                optionValue="code" class="w-[223px]"  />
                        <label>품목구분</label>
                    </FloatLabel>
                    <Button icon="pi pi-search"
                        label="중복체크"
                        class="p-button-text p-mt-2"
                        @click="itemCdCheck"
                        />
                    <span class="text-red-500 font-bold">품목코드가 등록된 뒤에 체크하세요!!!</span>
                </div>
            </div>
            <div class="grid mb-3">
                <div class="col-3">
                    <FloatLabel variant="on">
                        <Select v-model="form.itemCategory1"
                                :options="itemCategory1s"
                                optionLabel="codeNm"
                                optionValue="code" class="w-[223px]"  />
                        <label>대분류</label>
                    </FloatLabel>
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <Select v-model="form.itemCategory2"
                                :options="itemCategory2s"
                                optionLabel="codeNm"
                                optionValue="code" class="w-[223px]"  />
                        <label>중분류</label>
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
                <div class="col-3">
                    <FloatLabel variant="on">
                        <Select v-model="form.itemGrp1"
                        :options="itemGrp1s"
                        optionLabel="codeNm"
                        optionValue="code" class="w-full" />
                        <label>거래유형</label>
                    </FloatLabel>
                </div>
            </div>
            <div class="grid mb-3">
                <div class="col-3 ">
                    <FloatLabel variant="on">
                        <InputText v-model="form.itemCd" class="w-full" />
                        <label>품목코드</label>
                    </FloatLabel>
                </div>
                <div class="col-9">
                    <FloatLabel variant="on">
                        <InputText v-model="form.itemName" class="w-full" />
                        <label>품목명</label>
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
import { isEmpty, replaceString, typeCd } from '@/util/common';
import { inject, onMounted, reactive, ref, unref, watch } from 'vue';
import CustomerListPop from '../customer/CustomerListPop.vue';

const {vSuccess, vError, vInfo, vWarning} = useAlertStore()
const { userId }  = useAuthStore()
const dialogRef = inject('dialogRef')
const itemTypeCds = ref([])
const itemCategory1s = ref([])
const itemCategory2s = ref([])
const itemGrp1s = ref([])
const itemGrp2s = ref([])
const useYns =ref([])

const dialogPayload = reactive({
  asItemCd: '',
  asItemName: '',
  asItemTypeCd: '',
})
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

    userId: userId,
})

watch(() => form.itemCategory1, async (newVal) => {
  itemCategory2s.value = await ApiItem.getProdMList(form.itemCategory1)
})


watch(() => form.itemTypeCd, (newVal) => {
  form.itemCd = dialogPayload.asItemCd+typeCd(newVal)
  form.itemName = replaceString(dialogPayload.asItemName, newVal)
})

const saveInfo = async() =>{
    const params = {
      ...form
    }

    const res = await ApiItem.saveItemAddInfo(params)
    vSuccess(res.message)
    closeDialog()
}

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

const itemCdCheck = async () =>{
  if ( isEmpty(form.itemCd)) return vWarning('품목코드가 없습니다. ')

  const chk = await ApiItem.getItemCdCheck(form.itemCd)

  if ( chk === 'Y' ) {
    vWarning("중복된 품목코드입니다.")
  }else{
    vInfo("사용가능한 품목코드입니다.")
  }
}

onMounted( async () =>{
  const data = dialogRef?.value?.data ?? {}


  dialogPayload.asItemCd = unref(data.asItemCd ?? '')
  dialogPayload.asItemName = unref(data.asItemName ?? '')
  dialogPayload.asItemTypeCd = unref(data.itemTypeCd ?? '')

  itemTypeCds.value = (await ApiCommon.getCodeList('item_type_cd')).filter(i => ['M3','M5', 'M6', 'M0'].includes(i.code))
  itemGrp1s.value = await ApiCommon.getCodeList('ITEM_GRP1')
  itemGrp2s.value = await ApiCommon.getCodeList('ITEM_GRP2')
  useYns.value = await ApiCommon.getCodeList('use_yn')

  itemCategory1s.value = await ApiItem.getProdLList()
  const res = await ApiItem.getItemInfo(dialogPayload.asItemCd)
  Object.assign(form, res)

  if (form.itemCategory1) {
      itemCategory2s.value = await ApiItem.getProdMList(form.itemCategory1)
    } else {
      itemCategory2s.value = []
    }
})


const closeDialog = () =>{
    dialogRef?.value?.close?.()
}
</script>

<style scoped>

</style>
