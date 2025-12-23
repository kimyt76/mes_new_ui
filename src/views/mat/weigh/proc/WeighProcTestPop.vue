<template>
<div class="w-full mt-3">
    <table cellspacing="0" width="100%">
        <tr>
            <th class="cellBorder cellHeader">PO NO</th>
            <td class="cellBorder"></td>
            <th class="cellBorder cellHeader">품목코드</th>
            <td class="cellBorder"></td>
            <th class="cellBorder cellHeader">품목명</th>
            <td  class="cellBorder" colspan="3"></td>
        </tr>
        <tr>
            <th class="cellBorder cellHeader">제조일자</th>
            <td class="cellBorder"></td>
            <th class="cellBorder cellHeader">제조번호</th>
            <td class="cellBorder"></td>
            <th class="cellBorder cellHeader">제조량</th>
            <td class="cellBorder"></td>
            <th class="cellBorder cellHeader">고객사</th>
            <td class="cellBorder"></td>
        </tr>
    </table>
</div>

<div class="card">
    <div class="flex items-center justify-between mb-2">
        <span class="font-bold text-lg">- 칭량공정</span>
        <span class="font-bold text-lg text-red-500 text-right">항목 기입 후, 반드시 저장을 누르세요.</span>
    </div>
    <Tabs v-model:value="activeTab">
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
                    <tr>
                        <th class="cellBorder cellHeader">점검자</th>
                        <td class="cellBorder" colspan="3">
                            <InputText id="on_label1" v-model="form.managerName"  fluid/>
                        </td>
                    </tr>
                    <tr>
                        <th class="cellBorder cellHeader">작업처</th>
                        <td class="cellBorder"  colspan="3">

                        </td>
                    </tr>
                    <tr>
                        <th class="cellBorder cellHeader">작업환경(분말칭량실)</th>
                        <td class="cellBorder"  colspan="3">

                        </td>
                    </tr>
                    <tr>
                        <th class="cellBorder cellHeader">작업환경(액상칭량실)</th>
                        <td class="cellBorder"  colspan="3">

                        </td>
                    </tr>
                    <tr>
                        <th class="cellBorder cellHeader">특이사항</th>
                        <td class="cellBorder" colspan="3">

                        </td>
                    </tr>

                </table>
            </div>
        </TabPanel>
        <TabPanel value="1">
            <div class="flex justify-end mt-3">
                <Button label="사용설비 저장" size="small" class="save-btn" />
            </div>
            <DataTable
                :value="equipmentList"
                scrollable
                showGridlines
                tableStyle="width:100%; table-layout: fixed;"
                class="my-table mt-2"
            >
                <Column field="no" header="" :style="{ width:'40px', textAlign:'center' }" />
                <Column header="관리번호" :style="{ width:'220px' }" :pt="{ columnHeaderContent:'justify-center' }">
                    <template #body="{ data }">
                        <InputText v-model="data.mgmtNo" class="w-full" @click="openPop(data, 'equipment')"/>
                    </template>
                </Column>
                <Column header="설비명" :pt="{ columnHeaderContent:'justify-center' }">
                    <template #body="{ data }">
                        <InputText v-model="data.equipmentName" class="w-full" />
                    </template>
                </Column>
                <Column header="-" :style="{ width:'70px', textAlign:'center' }" :pt="{ columnHeaderContent:'justify-center' }">
                    <template #body="{ index }">
                        <span class="text-orange-500 cursor-pointer" @click="resetEquipmentRow(index)">삭제</span>
                    </template>
                </Column>
            </DataTable>
        </TabPanel>

        <TabPanel value="2">
            <div class="flex justify-end mt-3">
                <Button label="작업인원 저장" size="small" class="save-btn" />
            </div>
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
            <div class="flex justify-end mt-3">
                <Button label="공정검사 저장" size="small" class="save-btn" />
            </div>
            <DataTable
                :value="procTestList"
                scrollable
                showGridlines
                tableStyle="width:100%; table-layout: fixed;"
                class="my-table mt-2"
            >
                <Column field="no" header="" :style="{ width:'40px', textAlign:'center' }" />
                <Column header="검사항목" :pt="{ columnHeaderContent:'justify-center' }">
                    <template #body="{ data }">
                        <span>{{ data.inspItem }}</span>
                    </template>
                </Column>
                <Column header="검사방법" :style="{ width:'160px', textAlign:'center' }" :pt="{ columnHeaderContent:'justify-center' }">
                    <template #body="{ data }">
                        <span>{{ data.method }}</span>
                    </template>
                </Column>
                <Column header="점검시기" :style="{ width:'160px', textAlign:'center' }" :pt="{ columnHeaderContent:'justify-center' }">
                    <template #body="{ data }">
                        <span style="white-space:pre-line">{{ data.cycle }}</span>
                    </template>
                </Column>
                <Column header="점검시간" :style="{ width:'140px', textAlign:'center' }" :pt="{ columnHeaderContent:'justify-center' }">
                    <template #body="{ data }">
                        <InputText v-model="data.time" class="w-full text-center"  @click="openPop(data, 'procTest')" />
                    </template>
                </Column>
                <Column header="점검결과" :style="{ width:'220px', textAlign:'center' }" :pt="{ columnHeaderContent:'justify-center' }">
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



</template>

<script setup>
import Tab from 'primevue/tab'
import TabList from 'primevue/tablist'
import TabPanel from 'primevue/tabpanel'
import Tabs from 'primevue/tabs'

import { useDialog } from 'primevue'
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import InputText from 'primevue/inputtext'
import RadioButton from 'primevue/radiobutton'
import { onMounted, reactive, ref } from 'vue'

const dialog = useDialog()
const form = reactive({
    managerName: '',
})
const activeTab = ref('0')
const tabs = ref([
  { title: '작업정보', value: '0' },
  { title: '사용설비', value: '1' },
  { title: '작업인원', value: '2' },
  { title: '공정검사', value: '3' },
])

const openPop = (data, type) =>{
    console.log('data', data)
    let title = ''
    let currntComponet = ''

    if (  type === 'equipment'  ) {
        title = '설비 선택'
    }else if (  type === 'worker'  ) {
        title = '작업자 선택'
    }else if (  type === 'procTest'  ) {
        title = '점검시간 설정'
    }

    dialog.open(currntComponet, {
        props: {
            header: title,
            modal,
        },
        onClose: (event) =>{
            // if ( !event.data ) return
            // if (  type === 'equipment'  ) {
            //     equipmentList[index].value = event.data
            // }else if (  type === 'worker'  ) {
            //     workUserList[index].value = event.data
            // }else if (  type === 'procTest'  ) {
            //     procTestList[index].value = event.data
            // }
        }
    })

}


// --------------------
// 1) 사용설비: 7행 고정(기본값은 빈 값)
// --------------------
const equipmentTemplate = Array.from({ length: 7 }, () => ({
  mgmtNo: '',
  equipmentName: '',
}))
const equipmentList = ref([])

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
const workUserList = ref([])

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
]
const procTestList = ref([])

onMounted(() => {
  equipmentList.value = initFromTemplate(equipmentTemplate)
  workUserList.value = initFromTemplate(workUserTemplate)
  procTestList.value = initFromTemplate(procTestTemplate)



})
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
</style>
