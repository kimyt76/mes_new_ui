<template>
<div class="w-full mt-3">
    <table cellspacing="0" width="100%">
        <tbody>
        <tr>
            <th class="cellBorder cellHeader">PO NO</th>
            <td class="cellBorder">{{ form.poNo }}</td>
            <th class="cellBorder cellHeader">품목코드</th>
            <td class="cellBorder">{{ form.itemCd }}</td>
            <th class="cellBorder cellHeader">품목명</th>
            <td  class="cellBorder" colspan="3">{{ form.itemName }}</td>
        </tr>
        <tr>
            <th class="cellBorder cellHeader">제조일자</th>
            <td class="cellBorder">{{ form.matDate }}</td>
            <th class="cellBorder cellHeader">제조번호</th>
            <td class="cellBorder">{{ form.matNo }}</td>
            <th class="cellBorder cellHeader">제조량</th>
            <td class="cellBorder">{{ form.workQty }}</td>
            <th class="cellBorder cellHeader">고객사</th>
            <td class="cellBorder">{{ form.clientName }}</td>
        </tr>
        </tbody>
    </table>
</div>

<div class="mt-4">
    <div class="flex items-center justify-between mb-2">
        <span class="font-bold text-lg">- 칭량공정</span>
        <!-- <span class="font-bold text-lg text-red-500 text-right">항목 기입 후, 반드시 저장을 누르세요.</span> -->
    </div>
    <Tabs v-model:value="activeTab" class="fixed-tabs">
        <TabList>
            <Tab
                v-for="tab in tabs"
                :key="tab.value"
                :value="tab.value"
                :pt="{
                    root: ({ state }) => ({
                    class: state.active
                        ? 'bg-blue-500 text-white font-bold'
                        : 'text-gray-600 hover:bg-gray-100'
                    })
                }"
                >
                {{ tab.title }}
                </Tab>
        </TabList>
        <TabPanel value="0">
            <div class="w-full mt-3">
                <table cellspacing="0" width="100%">
                    <tbody>
                    <tr>
                        <th class="cellBorder cellHeader">점검자</th>
                        <td class="cellBorder" colspan="3">
                            <FloatLabel variant="on">
                                <InputText id="on_label1" v-model="tab1.inspector" fluid/>
                                <label for="on_label1">점검자</label>
                            </FloatLabel>
                        </td>
                    </tr>
                    <tr>
                        <th class="cellBorder cellHeader" colspan="2">작업처</th>
                        <td class="cellBorder">
                            <FloatLabel variant="on">
                                <Select v-model="tab1.areaCd" :options="areaCds"
                                optionLabel="codeNm"
                                optionValue="code"
                                fluid
                                />
                                <label for="on_label">구역</label>
                            </FloatLabel>
                        </td>
                        <td class="cellBorder">
                            <FloatLabel variant="on">
                                <Select v-model="tab1.storageCd" :options="storageCds"
                                optionLabel="codeNm"
                                optionValue="code"
                                fluid
                                />
                                <label for="on_label">창고</label>
                            </FloatLabel>
                        </td>
                    </tr>
                    <tr>
                        <th class="cellBorder cellHeader" colspan="2">작업환경(분말칭량실)</th>
                        <td class="cellBorder">
                            <FloatLabel variant="on">
                                <InputText id="on_label1" v-model="tab1.powderTemperature" fluid/>
                                <label for="on_label1">온도</label>
                            </FloatLabel>
                        </td>
                        <td class="cellBorder">
                            <FloatLabel variant="on">
                                <InputText id="on_label1" v-model="tab1.powderHumidity" fluid/>
                                <label for="on_label1">습도</label>
                            </FloatLabel>
                        </td>
                    </tr>
                    <tr>
                        <th class="cellBorder cellHeader" colspan="2">작업환경(액상칭량실)</th>
                        <td class="cellBorder">
                            <FloatLabel variant="on">
                                <InputText id="on_label1" v-model="tab1.liquidTemperature" fluid/>
                                <label for="on_label1">온도</label>
                            </FloatLabel>
                        </td>
                        <td class="cellBorder">
                            <FloatLabel variant="on">
                                <InputText id="on_label1" v-model="tab1.liquidHumidity" fluid/>
                                <label for="on_label1">습도</label>
                            </FloatLabel>
                        </td>
                    </tr>
                    <tr>
                        <th class="cellBorder cellHeader">특이사항</th>
                        <td class="cellBorder" colspan="3">
                            <Textarea v-model="tab1.etc" rows="2" class="resize-none" fluid />
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </TabPanel>

        <TabPanel value="1">
            <DataTable
                :value="equipmentList"
                scrollable
                showGridlines
                tableStyle="width:100%; table-layout: fixed;"
                class="my-table mt-2"
            >
                <Column field="no" header="" :style="{ width:'40px', textAlign:'center' }" />
                <Column field="equipmentCd" header="관리번호" :style="{ width:'200px', textAlign:'center'  }">
                    <template #body="{ data }">
                        <InputText v-model="data.equipmentCd" class="w-full" @click="openPop(data, 'equipment')"/>
                    </template>
                </Column>
                <Column field="equipmentName" header="설비명" :style="{ width:'940px', textAlign:'center' }">
                    <template #body="{ data }">
                        <InputText v-model="data.equipmentName" class="w-full" :style="{ width:'70px', textAlign:'center' }"/>
                    </template>
                </Column>
                <Column header="-" :style="{ width:'60px', textAlign:'center' }">
                    <template #body="{ index }">
                        <span class="text-orange-500 cursor-pointer" @click="resetEquipmentRow(index)">삭제</span>
                    </template>
                </Column>
            </DataTable>
        </TabPanel>

        <TabPanel value="2">
            <DataTable
                :value="workUserList"
                scrollable
                showGridlines
                tableStyle="width:100%; table-layout: fixed;"
                class="my-table mt-2"
            >
                <Column field="no" header="" :style="{ width:'40px', textAlign:'center' }" />
                <Column header="구분" :style="{ width:'240px', textAlign:'center' }" :pt="{ columnHeaderContent:'justify-center' }">
                    <template #body="{ data }">
                        <span class="text-gray-600">{{ data.type }}</span>
                    </template>
                </Column>
                <Column header="작업자명" :pt="{ columnHeaderContent:'justify-center' }">
                    <template #body="{ data }">
                        <InputText v-model="data.workerName" class="w-full"  @click="openPop(data, 'worker')"/>
                    </template>
                </Column>
                <Column header="-" :style="{ width:'70px', textAlign:'center' }" :pt="{ columnHeaderContent:'justify-center' }">
                    <template #body="{ index }">
                        <span class="text-orange-500 cursor-pointer" @click="resetWorkUserRow(index)">삭제</span>
                    </template>
                </Column>
            </DataTable>
        </TabPanel>

        <TabPanel value="3">
            <DataTable
                :value="procTestList"
                scrollable
                showGridlines
                scrollHeight="500px"
                tableStyle="width:100%; table-layout: fixed;"
                class="my-table mt-2"
            >
                <Column field="distOrder" header="" :style="{ width:'40px', textAlign:'center' }" />
                <Column field="testMethod"header="검사항목" :pt="{ columnHeaderContent:'justify-center' }">
                    <template #body="{ data }">
                        <span>{{ data.inspItem }}</span>
                    </template>
                </Column>
                <Column field="testItem"header="검사방법" :style="{ width:'160px', textAlign:'center' }" >
                    <template #body="{ data }">
                        <span>{{ data.method }}</span>
                    </template>
                </Column>
                <Column field="testTiming" header="점검시기" :style="{ width:'160px', textAlign:'center' }" >
                    <template #body="{ data }">
                        <span style="white-space:pre-line">{{ data.cycle }}</span>
                    </template>
                </Column>
                <Column field="testTime" header="점검시간" :style="{ width:'140px', textAlign:'center' }" >
                    <template #body="{ data }">
                        <InputText v-model="data.time" class="w-full text-center"  @click="openPop(data, 'procTest')"  readonly/>
                    </template>
                </Column>
                <Column field="testTime" header="점검결과" :style="{ width:'220px', textAlign:'center' }">
                    <template #body="{ data }">
                        <div class="flex items-center justify-center gap-6">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <RadioButton v-model="data.result" inputId="ok" value="OK" />
                            적합
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer">
                            <RadioButton v-model="data.result" inputId="ng" value="NG" />
                            부적합
                        </label>
                        </div>
                    </template>
                </Column>
            </DataTable>
        </TabPanel>
    </Tabs>
</div>
<div class="flex justify-end gap-1 mt-3">
    <Button label="전체저장"  class="p-button-secondary" @click="saveInfo" />
    <Button label="작업완료"  class="p-button-secondary" @click="workCompleted" />
    <Button label="공정검사서(칭량)"   outlined class="ml-2" @click="procTestPrint" />
    <Button label="닫기"   outlined class="ml-2" @click="closeDialog" />
</div>

</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon'
import { ApiSystems } from '@/api/apiSystem'
import { useAlertStore } from '@/stores/alert'
import { useAuthStore } from '@/stores/auth'
import { isEmpty } from '@/util/common'
import { useDialog } from 'primevue'
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import InputText from 'primevue/inputtext'
import RadioButton from 'primevue/radiobutton'
import Tab from 'primevue/tab'
import TabList from 'primevue/tablist'
import TabPanel from 'primevue/tabpanel'
import Tabs from 'primevue/tabs'
import { computed, inject, onMounted, reactive, ref } from 'vue'
import EquipmentPop from '../../common/EquipmentPop.vue'
import TiemPop from '../../common/TimePop.vue'
import WorkerPop from '../../common/WorkerPop.vue'

const {userId} = useAuthStore()
const  { vSuccess, vInfo, vWarning} = useAlertStore()
const dialogRef = inject('dialogRef')
const dialog = useDialog()
const equipmentList = ref([])
const workUserList = ref([])
const procTestList = ref([])
const areaCds = ref([])
const storageAllRaw = ref([])

const storageCds = computed(() => {
  const area = tab1.areaCd
  const list = storageAllRaw.value ?? []
  const filtered = area ? list.filter(x => x.areaCd === area) : list

  return filtered.map(x => ({
    code: x.storageCd,
    codeNm: x.storageName,
  }))
})
const form = reactive({
    poNo: '',
    itemCd: '',
    itemName: '',
    matDate: '',
    workQty: '',
    clientId: '',
    clientName: '',
    managerName: '',

    procTestId: '',
    userId: userId,
})
const tab1 = reactive({
    inspector: '',
    areaCd: '',
    storageCd: '',
    powderTemperature: '',
    powderHumidity: '',
    liquidTemperature: '',
    liquidHumidity: '',
    etc: '',
})
const activeTab = ref('0')
const tabs = ref([
  { title: '작업정보', value: '0' },
  { title: '사용설비', value: '1' },
  { title: '작업인원', value: '2' },
  { title: '공정검사', value: '3' },
])


const workCompleted =()=>{
    if ( isEmpty(form.procTestId) ) return vInfo('저장 후 작업완료를 진행해주세요.')


}
const saveInfo =()=>{


}

const openPop = (row, type) =>{
    let title = ''
    let currntComponet = ''
    let cd = ''

    if (  type === 'equipment'  ) {
        title = '설비 선택'

        if ( isEmpty(tab1.storageCd)  ) return vInfo('창고를 선택해주세요.')

        cd = tab1.storageCd
        currntComponet = EquipmentPop
    }else if (  type === 'worker'  ) {
        title = '작업자 선택'
        cd = 'PRC001'
        currntComponet = WorkerPop
    }else if (  type === 'procTest'  ) {
        title = '점검시간 설정'
        currntComponet = TiemPop
    }


    dialog.open(currntComponet, {
        props: {
            header: title,
            modal:true
        },
        data: cd,
        onClose: (event) =>{
            if ( !event.data ) return
            if (  type === 'equipment'  ) {
                row.equipmentName = event.data.equipmentName
                row.equipmentCd = event.data.equipmentCd
            }else if (  type === 'worker'  ) {
                row.workerName = event.data
            }else if (  type === 'procTest'  ) {
                row.time = event.data
            }
        }
    })
}

const procTestPrint = async () =>{
//   if (isEmpty(form.procTestId)) return vInfo('처방정보가 없습니다. 저장 후 시도해주세요.')

//   try {
//     const params = { recipeInfo: { ...form }, recipeList: recipeList.value }
//     const blob = await ApiMat.downloadProcTest(params)
//     const url = window.URL.createObjectURL(blob)
//     const a = document.createElement('a')
//     a.href = url
//     a.download = `공정검사서(칭량)_${form.itemName}.xlsx`
//     a.click()
//     window.URL.revokeObjectURL(url)
//   } catch {
//     vError('엑셀 다운로드 실패')
//   }
}
// --------------------
// 1) 사용설비: 7행 고정(기본값은 빈 값)
// --------------------
const equipmentTemplate = Array.from({ length: 7 }, () => ({
  mgmtNo: '',
  equipmentName: '',
}))

const initFromTemplate = (tpl) =>
  tpl.map((row, i) => ({ no: i + 1, ...structuredClone(row) }))

const resetFromTemplateAt = (listRef, tpl, index) => {
  listRef.value[index] = { no: index + 1, ...structuredClone(tpl[index]) }
}

// 삭제(=해당 행 초기값으로 리셋)
const resetEquipmentRow = (index) => {
  resetFromTemplateAt(equipmentList, equipmentTemplate, index)
}

// --------------------
// 2) 작업인원: 6행 고정, 1~3 분말 / 4~6 액상
// --------------------
const workUserTemplate = [
  { type: '분말', workerName: '' },
  { type: '분말', workerName: '' },
  { type: '분말', workerName: '' },
  { type: '액상', workerName: '' },
  { type: '액상', workerName: '' },
  { type: '액상', workerName: '' },
]

const resetWorkUserRow = (index) => {
  resetFromTemplateAt(workUserList, workUserTemplate, index)
}
// --------------------
// 3) 공정검사: 8행 고정(항목/방법/시기 기본값)
// --------------------
const procTestTemplate = [
  { inspItem: '칭량작업전 작업소 청결상태가 양호한가?', method: '육안검사', cycle: '칭량 작업전', time: ':', result: 'OK' },
  { inspItem: '작업소 내 불필요한 물건이 방치되어 있는가?', method: '육안검사', cycle: '칭량 작업전', time: ':', result: 'OK' },
  { inspItem: '분말칭량실 온도 및 습도가 기준에 적합한가?', method: '온습도계 확인', cycle: '칭량 작업전', time: ':', result: 'OK' },
  { inspItem: '액상칭량실 온도 및 습도가 기준에 적합한가?', method: '온습도계 확인', cycle: '칭량 작업전', time: ':', result: 'OK' },
  { inspItem: '작업자 복장상태가 올바르게 착용하였는가?', method: '육안검사', cycle: '칭량 작업전', time: ':', result: 'OK' },
  { inspItem: '칭량도구 세척상태가 양호한가?', method: '육안검사', cycle: '칭량 작업전', time: ':', result: 'OK' },
  { inspItem: '모든 칭량저울 Calibration이 실시되었는가?', method: '설비점검표 확인', cycle: '칭량 작업전', time: ':', result: 'OK' },
  { inspItem: '칭량작업자는 손소독을 작업전 및 작업시 주기적으로 실시하였는가?', method: '관찰', cycle: '칭량 작업전\n칭량 작업시', time: '수시확인', result: 'OK' },
  { inspItem: '칭량작업시 원료별 품질검사 적합라벨이 부착되어 있는지 확인하였는가?', method: '관찰', cycle: '칭량 작업시', time: '수시확인', result: 'OK' },
  { inspItem: '칭량된 모든 원료는 식별라벨(제품명/원료명/제조번호/제조량/칭량무게)을 부착하였는가?', method: '칭량원료 칭량라벨부착 확인', cycle: '칭량 작업시', time: '수시확인', result: 'OK' },
]

onMounted( async() => {
  equipmentList.value = initFromTemplate(equipmentTemplate)
  workUserList.value = initFromTemplate(workUserTemplate)
  procTestList.value = initFromTemplate(procTestTemplate)

  //procTestList.value = await ApiCommon.getProcTestList('PRC001')
  areaCds.value = await ApiCommon.getCodeList('area')
  storageAllRaw.value = await ApiSystems.getStorageList({})

  console.log('dialogRef.value.data', dialogRef.value.data)

  if ( !isEmpty(dialogRef.value.data) ) {

  }


})

const closeDialog = () =>{
    dialogRef.value.close()
}

</script>

<style scoped>
.cellBorder {
  border-top: 0.5px solid #ccc;
  border-bottom: 0.5px solid #ccc;
  border-left: 0.5px solid #ccc;
  border-right: 0.5px solid #ccc;
  text-align: center;
  vertical-align: middle;
}
.cellHeader {
  background-color: #f0f0f0;
  font-weight: bold;
  width: 150px;
  height: 30px
}
.handsontable THEAD TH {
  background: #d9d9d9;
  border-color: #000000;
}
td .custom-cell {
  background-color: rgb(245 245 245);
}
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

::v-deep(.my-table .p-datatable-thead > tr > th) {
  background-color: #BCAAA4;
  color: white;
  font-size: 14px;
  text-align: center;
  font-family: monaco, Consolas;
  padding: 8px;
}
.fixed-tabs {
  height: 570px;              /* ✅ 탭 전체 높이 고정 */
  display: flex;
  flex-direction: column;
}
</style>
