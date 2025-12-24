<template>
    <Card style="width: 70rem; height: 28rem;">
        <template #content>
            <!-- Row 1 -->
            <div class="grid mb-3">
                <div class="col-3">
                    <FloatLabel variant="on">
                        <Select v-model="form.itemTypeCd"
                                :options="itemTypeCds"
                                optionLabel="codeNm"
                                optionValue="code" class="w-full" />
                        <label>품목구분</label>
                    </FloatLabel>
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <Select v-model="form.itemCategory1"
                                :options="itemCategory1s"
                                optionLabel="codeNm"
                                optionValue="code" class="w-full" />
                        <label>대분류</label>
                    </FloatLabel>
                </div>
                <div class="col-6 flex">
                    <FloatLabel variant="on">
                        <Select v-model="form.itemCategory2"
                                :options="itemCategory2s"
                                optionLabel="codeNm"
                                optionValue="code" class="w-[225px]" />
                        <label>중분류</label>
                    </FloatLabel>
                    <Button icon="pi pi-search"
                        label="중복체크"
                        class="p-button-text p-mt-2"
                        @click="itemCdCheck"
                        />
                </div>
            </div>
            <!-- Row 2 -->
            <div class="grid mb-3">
                <div class="col-3">
                    <FloatLabel variant="on">
                        <InputText v-model="form.itemCd" class="w-full" />
                        <label>품목코드</label>
                    </FloatLabel>
                </div>
                <div class="col-6">
                    <FloatLabel variant="on">
                        <InputText v-model="form.itemName" class="w-full" />
                        <label>품목명</label>
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
            <!-- Buttons -->
            <div class="flex gap-2 justify-end pt-3">
                <Button v-if="isAll" label="전체생성" severity="secondary" @click="saveInfo('A')"></Button>
                <Button label="저장" class="p-button-secondary" @click="saveInfo('O')"></Button>
                <Button label="닫기" outlined class="ml-2" @click="closeDialog" />
            </div>

        </template>
    </Card>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiItem } from '@/api/apiItem';
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';
import { isEmpty, makeItemCd, typeNm } from '@/util/common';
import { handleApiError } from '@/util/errorHandler';
import { useDialog } from 'primevue';
import { inject, onMounted, reactive, ref, watch, watchEffect } from 'vue';
import CustomerListPop from '../customer/CustomerListPop.vue';

const { vSuccess, vInfo, vWarning } = useAlertStore()
const {userId} = useAuthStore()

const dialog = useDialog()
const dialogRef = inject('dialogRef');

const isAll = ref(false)
const itemTypeCds = ref([])
const itemCategory1s =ref([])
const itemCategory2s =ref([])
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

    gb : '',
    userId: userId,
})

const saveInfo =  async(type) =>{
    try{
        form.gb = type

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
  form.itemCd = null
  form.itemName = null
  itemCategory1s.value = []
  itemCategory2s.value = []

  form.itemCategory1 = null
  form.itemCategory2 = null

  const actions = {
    M1: async () =>{
        itemCategory1s.value = await ApiCommon.getCodeList('order_cate')
        itemCategory2s.value = await ApiCommon.getCodeList('raw_item')
        isAll.value = false
    },
    M4: async () =>{
        itemCategory1s.value = await ApiItem.getProdLList()
        isAll.value = true
    }
  }

  if ( actions[newVal]) {
    await actions[newVal]()
  }
})

watch(() => form.itemCategory1, async(newVal) => {
  if ( form.itemTypeCd === 'M4'){
    itemCategory2s.value = await ApiItem.getProdMList(newVal)
    isAll.value = true
  }
})

watchEffect( async () => {
  if (form.itemCategory1 && form.itemCategory2) {
    form.itemCd = await makeItemCd(form.itemTypeCd, form.itemCategory1, form.itemCategory2)

    if ( isEmpty(form.itemName)) {
      form.itemName = typeNm(form.itemTypeCd)
    }
  }
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
    itemTypeCds.value = (await ApiCommon.getCodeList('ITEM_TYPE_CD'))
        .filter(i => ['M1', 'M4'].includes(i.code));
    itemGrp1s.value = await ApiCommon.getCodeList('ITEM_GRP1')
    itemGrp2s.value = await ApiCommon.getCodeList('ITEM_GRP2')
    useYns.value = await ApiCommon.getCodeList('use_yn')
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
