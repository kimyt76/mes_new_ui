<template>
    <Card style="width: 70rem; height: 38rem;">
        <template #content>
            <!-- Row 1 -->
            <div class="grid mb-5">
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
                        <InputText v-model="form.itemCd" readonly class="w-full" />
                        <label>품목코드</label>
                    </FloatLabel>
                </div>
                <div class="col-6">
                    <FloatLabel variant="on">
                        <InputText v-model="form.itemName" class="w-full" />
                        <label>품목명</label>
                    </FloatLabel>
                </div>
            </div>
            <!-- Row 2 -->
            <div class="grid mb-5">
                <div class="col-3">
                    <FloatLabel variant="on">
                        <Select v-model="form.itemCategory1" :options="itemCategory1s"
                                optionLabel="codeNm" optionValue="code" class="w-full" />
                        <label>제품유형(대분류)</label>
                    </FloatLabel>
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <Select v-model="form.itemCategory2" :options="itemCategory2s"
                                optionLabel="codeNm" optionValue="code" class="w-full" />
                        <label>제품유형(중분류)</label>
                    </FloatLabel>
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <InputText v-model="form.category" class="w-full" />
                        <label>용도</label>
                    </FloatLabel>
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <InputNumber v-model="form.safeStock" class="w-full" />
                        <label>안전재고</label>
                    </FloatLabel>
                </div>
            </div>
            <div class="grid mb-5">
                <div class="col-6">
                    <FloatLabel variant="on">
                        <IconField iconPosition="left">
                            <InputText v-model="form.customerName" class="w-full"/>
                            <InputIcon class="pi pi-search"  @click="openPop()"/>
                        </IconField>
                        <label>거래처명</label>
                    </FloatLabel>
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <Select v-model="form.itemGrp1" :options="itemGrp1s"
                                optionLabel="codeNm" optionValue="code" class="w-full" />
                        <label>거래유형</label>
                    </FloatLabel>
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <Select v-model="form.itemGrp2" :options="itemGrp2s"
                                optionLabel="codeNm" optionValue="code" class="w-full" />
                        <label>제품유형</label>
                    </FloatLabel>
                </div>
            </div>
            <div class="grid mb-5">
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
                    <div class="flex">
                    <FloatLabel variant="on">
                        <InputNumber v-model="form.inPrice" class="w-full" @blur="handlePriceBlur"/>
                        <label>입고단가</label>
                    </FloatLabel>
                        <!-- 오른쪽 가운데 아이콘 -->
                        <Button
                            type="button"
                            icon="pi pi-info-circle"
                            text
                            rounded
                            @click="onInPriceIconClick"
                            />
                            <OverlayPanel ref="inPricePanel">
                                <div class="w-20rem">
                                    <div class="text-sm font-bold mb-2">
                                        입고단가 변경 이력
                                    </div>
                                    <Divider class="my-2" />
                                    <ul class="m-0 p-0 list-none">
                                        <li
                                        v-for="(item, i) in inPriceHistory"
                                        :key="i"
                                        class="flex justify-content-between text-sm py-1"
                                        >
                                        <span>{{ item.historyDate }}</span>
                                        <span>{{ item.price.toLocaleString() }} 원</span>
                                        </li>
                                    </ul>
                                    <Divider class="my-2" />
                                    <div class="flex justify-content-end">
                                        <Button
                                        label="닫기"
                                        size="small"
                                        text
                                        @click="hideInPricePanel"
                                        />
                                    </div>
                                </div>
                            </OverlayPanel>
                    </div>
                </div>
                <div class="col-3">
                    <div class="flex">
                        <FloatLabel variant="on">
                            <InputNumber v-model="form.outPrice" class="w-full" />
                            <label>출고단가</label>
                        </FloatLabel>
                                <!-- 오른쪽 가운데 아이콘 -->
                        <Button
                            type="button"
                            icon="pi pi-info-circle"
                            text
                            rounded
                            @click="onOutPriceIconClick"
                            />
                            <OverlayPanel ref="outPricePanel">
                                <div class="w-20rem">
                                    <div class="text-sm font-bold mb-2">
                                        출고단가 변경 이력
                                    </div>
                                    <Divider class="my-2" />
                                    <ul class="m-0 p-0 list-none">
                                        <li
                                        v-for="(item, i) in outPriceHistory"
                                        :key="i"
                                        class="flex justify-content-between text-sm py-1"
                                        >
                                        <span>{{ item.historyDate }}</span>
                                        <span>{{ item.price.toLocaleString() }} 원</span>
                                        </li>
                                    </ul>
                                    <Divider class="my-2" />
                                    <div class="flex justify-content-end">
                                        <Button
                                        label="닫기"
                                        size="small"
                                        text
                                        @click="hideOutPricePanel"
                                        />
                                    </div>
                                </div>
                            </OverlayPanel>
                    </div>
                </div>
            </div>
            <div class="grid mb-5">
                <div class="col-3">
                    <FloatLabel variant="on">
                        <InputText v-model="form.expiryDate" class="w-full" />
                        <label>유효기한</label>
                    </FloatLabel>
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <InputText v-model="form.itemCompany" class="w-full" />
                        <label>원료제조사</label>
                    </FloatLabel>
                </div>
                <div class="col-3" v-if="isItemType">
                    <FloatLabel variant="on">
                        <Select v-model="form.useCate" :options="useCates"
                                optionLabel="codeNm" optionValue="code" class="w-full" />
                        <label>사용구분</label>
                    </FloatLabel>
                </div>
                <div class="col-3">
                    <FloatLabel variant="on">
                        <Select v-model="form.useYn" :options="useYns"
                                optionLabel="codeNm" optionValue="code" class="w-full" />
                        <label>사용유무</label>
                    </FloatLabel>
                </div>
            </div>
            <!-- History -->
            <div class="grid mb-5">
                <div class="col-12">
                    <FloatLabel variant="on">
                        <Textarea v-model="form.etc" rows="3" class="w-full" style="resize: none" />
                        <label>비고</label>
                    </FloatLabel>
                </div>
            </div>
            <!-- Buttons -->
            <div class="flex gap-2 justify-end pt-3">
                <Button label="단가저장" severity="secondary" @click="savePrice"></Button>
                <Button label="저장" class="p-button-secondary" @click="saveInfo"></Button>
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
import { useDialog } from 'primevue';
import { inject, onMounted, reactive, ref, watch } from 'vue';
import CustomerListPop from '../customer/CustomerListPop.vue';

const dialog = useDialog()
const dialogRef = inject('dialogRef');
const { userId } = useAuthStore()
const { vError, vSuccess} = useAlertStore()
const itemTypeCds = ref([])
const itemGrp1s = ref([])
const itemGrp2s = ref([])
const itemCategory1s = ref([])
const itemCategory2s = ref([])
const useCates = ref([])
const useYns = ref([])
const inPricePanel = ref()
const outPricePanel = ref()

const inPriceHistory = ref([])
const outPriceHistory = ref([])
const changePrice = ref('')
const isItemType = ref(false)

const form = reactive({
    itemCd : '',
    itemTypeCd: '',
    itemName: '',
    customerName: '',
    customerCd: '',
    itemGrp1: '',
    itemGrp2: '',
    useCate: '',
    inPrice: '',
    outPrice: '',
    itemCategory1: '',
    itemCategory2: '',
    etc:'',
    useYn : '',
    safeStock: '',
    avgDeliveryDate: '',
    unit: '',
    spec: '',
    category: '',
    expiryDate: '',
    itemCompany : '',

    userId: userId,
})
// 이전 단가 저장
const oldPrices = reactive({
  inPrice: null,
  outPrice: null
})

const onInPriceIconClick = (event) =>{
    inPricePanel.value?.toggle(event)
}
const onOutPriceIconClick = (event) =>{
    outPricePanel.value?.toggle(event)
}
const hideInPricePanel = () => {
    inPricePanel.value?.hide()
}
const hideOutPricePanel = () => {
    outPricePanel.value?.hide()
}
const handlePriceBlur = () => {
  const inChanged = form.inPrice !== oldPrices.inPrice
  const outChanged = form.outPrice !== oldPrices.outPrice

  if (inChanged && !outChanged) {
    changePrice.value = 'I'
    //console.log('입고단가만 변경됨:', form.inPrice)
  } else if (!inChanged && outChanged) {
    changePrice.value = 'O'
    //console.log('출고단가만 변경됨:', form.outPrice)
  } else if (inChanged && outChanged) {
    changePrice.value = 'A'
    //console.log('입고단가와 출고단가 모두 변경됨:', form.inPrice, form.outPrice)
  }
}

const saveInfo = async () =>{
  try{
    const params = {
      ...form
    }

    const msg = await ApiItem.saveItemDetailInfo(params)
    vSuccess(msg)
    closeDialog()
  }catch(err){
    vError(err.massage)
  }
}

const savePrice = async () =>{
if (!changePrice.value) {
    vWarning('변경된 단가가 없습니다.')
    return
  }

  const params = {
    type: changePrice.value,  /*타입구분 */
    itemCd: form.itemCd,
    inPrice: form.inPrice,
    outPrice: form.outPrice,
    userId: userId,
  }

  try {
    const msg = await ApiItem.updatePriceInfo(params)
    vSuccess(msg)

    const priceRes =  await ApiItem.getItemInfo(form.itemCd)
    inPriceHistory.value =  priceRes.priceHistory.filter(h => h.priceType === 'I')
    outPriceHistory.value = priceRes.priceHistory.filter(h => h.priceType === 'O')

    // 변경 후 이전값 갱신
    oldPrices.inPrice = form.inPrice
    oldPrices.outPrice = form.outPrice
    changePrice.value = '' // 초기화
  } catch (err) {
    console.error(err)
    vError(err.response?.data || '단가 변경 중 오류가 발생했습니다.')
  }
}

watch(() => form.itemCategory1, async (newVal) => {
  itemCategory2s.value = await ApiItem.getProdMList(form.itemCategory1)
})

const openPop = () => {
    dialog.open(CustomerListPop, {
        props:{
            header: '거래처 목록',
            modal: true,
            maximizable: false,
            draggable: true,
            style: {
                overflow: 'hidden'
            },
            pt: {
                root: { style: { overflow: 'hidden' } },
                content: { style: { overflow: 'hidden' } }
            },
        },
        onClose:(event) => {
            if (event.data) {
                form.customerName = event.data.customerName
                form.customerCd = event.data.customerCd
            }
        },
    })
}

onMounted( async () =>{
    const res = await ApiItem.getItemInfo(dialogRef.value.data)

    itemTypeCds.value = await ApiCommon.getCodeList('ITEM_TYPE_CD')
    itemGrp1s.value = await ApiCommon.getCodeList('ITEM_GRP1')
    itemGrp2s.value = await ApiCommon.getCodeList('ITEM_GRP2')
    useYns.value = await ApiCommon.getCodeList('use_yn')

    Object.assign(form, res)

    inPriceHistory.value =  res.priceHistory.filter(h => h.priceType === 'I')
    outPriceHistory.value = res.priceHistory.filter(h => h.priceType === 'O')

    if ( ['M2', 'M7'].includes(res.itemTypeCd) ){
        useCates.value = await ApiCommon.getCodeList('use_Cate')
        itemCategory1s.value = await ApiCommon.getCodeList('order_cate')
        itemCategory2s.value = await ApiCommon.getCodeList('sub_item')
        isItemType.value = true
    }else{
        itemCategory1s.value = await ApiItem.getProdLList()
        itemCategory2s.value = await ApiItem.getProdMList(res.itemCategory1)
    }
})



const closeDialog = () => {
  dialogRef.value.close();
};

</script>

<style scoped>
.price-field-wrapper {
  position: relative;
}

.price-input {
  /* 아이콘이 겹치지 않게 오른쪽 패딩 확보 */
  padding-right: 2.5rem;
}


</style>
