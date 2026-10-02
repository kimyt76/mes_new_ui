<template>

<div class="w-full mt-3">
    <!-- ========================================================= -->
    <!-- 기본 작업정보 -->
    <!-- ========================================================= -->
    <table cellspacing="0" width="100%">
        <tbody>
        <tr>
            <th class="cellBorder cellHeader">PO NO</th>
            <td class="cellBorder">
                {{ form.poNo }}
            </td>
            <th class="cellBorder cellHeader">품목코드</th>
            <td class="cellBorder">
                {{ form.itemCd }}
            </td>
            <th class="cellBorder cellHeader">품목명</th>
            <td class="cellBorder" colspan="3">
                {{ form.itemName }}
            </td>
        </tr>
        <tr>
            <th class="cellBorder cellHeader">제조일자</th>
            <td class="cellBorder">
                {{ form.matDate }}
            </td>
            <th class="cellBorder cellHeader">제조번호</th>
            <td class="cellBorder">
                {{ form.makeNo }}
            </td>
            <th class="cellBorder cellHeader">제조량</th>
            <td class="cellBorder">
                {{ form.prodQty }}
            </td>
            <th class="cellBorder cellHeader">고객사</th>
            <td class="cellBorder">
                {{ form.clientName }}
            </td>
        </tr>
        </tbody>
    </table>
</div>

<!-- ========================================================= -->
<!-- 칭량공정 -->
<!-- ========================================================= -->
<div class="mt-4">
    <div class="flex items-center justify-between mb-2">
        <span class="font-bold text-lg">
            - 칭량공정
        </span>
        <span class="font-bold text-sm text-red-500">
            각 탭 작성 후 저장해주세요.
        </span>
    </div>
    <Tabs v-model:value="activeTab" class="fixed-tabs" >
        <!-- ===================================================== -->
        <!-- TAB HEADER -->
        <!-- ===================================================== -->
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

        <!-- ===================================================== -->
        <!-- TAB 1. 작업정보 -->
        <!-- ===================================================== -->
        <TabPanel value="0">
            <div class="tab-content">
                <!-- 상단 -->
                <div class="tab-header">
                    <div>
                        <span class="tab-title">
                            작업정보
                        </span>
                        <span class="tab-desc">
                            작업처 및 작업환경 정보를 입력합니다.
                        </span>
                    </div>
                    <Button label="저장" icon="pi pi-save" size="small" @click="saveWorkInfo" />
                </div>

                <table cellspacing="0" width="100%">
                    <tbody>
                    <!-- 점검자 -->
                    <tr>
                        <th class="cellBorder cellHeader"> 점검자 </th>
                        <td class="cellBorder inputCell" colspan="3" >
                            <FloatLabel variant="on">
                                <InputText v-model="tab1.inspector" fluid />
                                <label>점검자</label>
                            </FloatLabel>
                        </td>
                    </tr>
                    <!-- 작업처 -->
                    <tr>
                        <th class="cellBorder cellHeader" colspan="2" > 작업처 </th>
                        <td class="cellBorder inputCell">
                            <FloatLabel variant="on">
                                <Select
                                    v-model="tab1.areaCd"
                                    :options="areaCds"
                                    optionLabel="codeNm"
                                    optionValue="code"
                                    fluid
                                />
                                <label>구역</label>
                            </FloatLabel>
                        </td>
                        <td class="cellBorder inputCell">
                            <FloatLabel variant="on">
                                <Select
                                    v-model="tab1.storageCd"
                                    :options="storageCds"
                                    optionLabel="codeNm"
                                    optionValue="code"
                                    fluid
                                />
                                <label>창고</label>
                            </FloatLabel>
                        </td>
                    </tr>

                    <!-- 분말칭량실 -->
                    <tr>
                        <th class="cellBorder cellHeader" colspan="2" > 작업환경(분말칭량실) </th>
                        <td class="cellBorder inputCell">
                            <FloatLabel variant="on">
                                <InputText v-model="tab1.powderTemperature" fluid />
                                <label>온도</label>
                            </FloatLabel>
                        </td>
                        <td class="cellBorder inputCell">
                            <FloatLabel variant="on">
                                <InputText v-model="tab1.powderHumidity" fluid />
                                <label>습도</label>
                            </FloatLabel>
                        </td>
                    </tr>

                    <!-- 액상칭량실 -->
                    <tr>
                        <th class="cellBorder cellHeader" colspan="2" > 작업환경(액상칭량실) </th>
                        <td class="cellBorder inputCell">
                            <FloatLabel variant="on">
                                <InputText v-model="tab1.liquidTemperature" fluid />
                                <label>온도</label>
                            </FloatLabel>
                        </td>
                        <td class="cellBorder inputCell">
                            <FloatLabel variant="on">
                                <InputText v-model="tab1.liquidHumidity" fluid />
                                <label>습도</label>
                            </FloatLabel>
                        </td>
                    </tr>

                    <!-- 특이사항 -->
                    <tr>
                        <th class="cellBorder cellHeader"> 특이사항 </th>
                        <td class="cellBorder inputCell" colspan="3" >
                            <Textarea v-model="tab1.etc" rows="3" class="resize-none" fluid />
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </TabPanel>

        <!-- ===================================================== -->
        <!-- TAB 2. 사용설비 -->
        <!-- 7 ROW 고정 -->
        <!-- ===================================================== -->
        <TabPanel value="1">
            <div class="tab-content">
                <div class="tab-header">
                    <div>
                        <span class="tab-title"> 사용설비 </span>
                        <span class="tab-desc"> 칭량공정에 사용한 설비를 선택합니다. </span>
                    </div>
                    <Button label="저장" icon="pi pi-save" size="small" @click="saveEquipment" />
                </div>

                <DataTable
                    :value="equipmentList"
                    scrollable
                    showGridlines
                    tableStyle="width:100%; table-layout:fixed;"
                    class="my-table"
                >
                    <!-- 번호 -->
                    <Column field="no" header="No." :style="{ width:'70px', textAlign:'center' }"  />
                    <!-- 관리번호 -->
                    <Column field="equipmentCd" header="관리번호" :style="{ width:'250px' }" >
                        <template #body="{ data }">
                            <InputText v-model="data.equipmentCd" class="w-full" readonly @click="openPop(data, 'equipment')" />
                        </template>
                    </Column>
                    <!-- 설비명 -->
                    <Column field="equipmentName" header="설비명" >
                        <template #body="{ data }">
                            <InputText v-model="data.equipmentName" class="w-full" readonly @click="openPop(data, 'equipment')" />
                        </template>
                    </Column>
                    <!-- 삭제 -->
                    <Column header="" :style="{ width:'80px' }" >
                        <template #body="{ index }">
                            <div class="flex justify-center">
                                <Button icon="pi pi-times" severity="danger" text rounded size="small" @click="resetEquipmentRow(index)" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </TabPanel>

        <!-- ===================================================== -->
        <!-- TAB 3. 작업인원 -->
        <!-- 6 ROW 고정 -->
        <!-- ===================================================== -->
        <TabPanel value="2">
            <div class="tab-content">
                <div class="tab-header">
                    <div>
                        <span class="tab-title"> 작업인원 </span>
                        <span class="tab-desc"> 분말 / 액상 작업자를 등록합니다. </span>
                    </div>
                    <Button label="저장" icon="pi pi-save" size="small" @click="saveWorker" />
                </div>

                <DataTable
                    :value="workUserList"
                    scrollable
                    showGridlines
                    tableStyle="width:100%; table-layout:fixed;"
                    class="my-table"
                >
                    <!-- 번호 -->
                    <Column field="no" header="No." :style="{ width:'70px' }" />
                    <!-- 구분 -->
                    <Column field="type" header="구분" :style="{ width:'200px' }" >
                        <template #body="{ data }">
                            <div class="text-center font-medium"> {{ data.type }} </div>
                        </template>
                    </Column>
                    <!-- 작업자 -->
                    <Column field="workerName" header="작업자명" >
                        <template #body="{ data }">
                            <InputText v-model="data.workerName" class="w-full" readonly @click="openPop(data, 'worker')" />
                        </template>
                    </Column>
                    <!-- 삭제 -->
                    <Column header="" :style="{ width:'80px' }" >
                        <template #body="{ index }">
                            <div class="flex justify-center">
                                <Button icon="pi pi-times" severity="danger" text rounded size="small" @click="resetWorkUserRow(index)" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </TabPanel>
        <!-- ===================================================== -->
        <!-- TAB 4. 공정검사 -->
        <!-- 조회 리스트 -->
        <!-- ===================================================== -->
        <TabPanel value="3">
            <div class="tab-content">
                <div class="tab-header">
                    <div>
                        <span class="tab-title"> 공정검사 </span>
                        <span class="tab-desc"> 검사시간과 검사결과를 입력합니다. </span>
                    </div>
                    <Button label="저장" icon="pi pi-save" size="small" @click="saveProcTest" />
                </div>

                <DataTable
                    :value="procTestList"
                    scrollable
                    showGridlines
                    scrollHeight="430px"
                    tableStyle="width:100%; table-layout:fixed;"
                    class="my-table"
                >
                    <!-- 번호 -->
                    <Column field="orderDist" header="No." :style="{ width:'70px' }" />

                    <!-- 검사항목 -->
                    <Column field="testItem" header="검사항목" >
                        <template #body="{ data }">
                            <span> {{ data.testItem }} </span>
                        </template>
                    </Column>

                    <!-- 검사방법 -->
                    <Column field="testMethod" header="검사방법" :style="{ width:'230px' }" >
                        <template #body="{ data }">
                            <span> {{ data.testMethod }} </span>
                        </template>
                    </Column>

                    <!-- 점검시기 -->
                    <Column field="testTiming" header="점검시기" :style="{ width:'180px' }" >
                        <template #body="{ data }">
                            <div class="text-center" style="white-space:pre-line" >
                                {{ data.testTiming }}
                            </div>
                        </template>
                    </Column>
                    <!-- 점검시간 -->
                    <Column field="testTime" header="점검시간" :style="{ width:'180px' }" >
                        <template #body="{ data }">
                            <InputText v-model="data.testTime" class="w-full text-center" readonly @click="openPop(data, 'procTest')" />
                        </template>
                    </Column>

                    <!-- 검사결과 -->
                    <Column field="testResult" header="점검결과" :style="{ width:'240px' }" >
                        <template #body="{ data, index }">
                            <div class="flex items-center justify-center gap-6">
                                <label class="flex items-center gap-2 cursor-pointer" >
                                    <RadioButton v-model="data.testResult" :inputId="`test-ok-${index}`" value="Y" />
                                    <span>적합</span>
                                </label>
                                <label class="flex items-center gap-2 cursor-pointer" >
                                    <RadioButton v-model="data.testResult" :inputId="`test-ng-${index}`" value="N" />
                                    <span>부적합</span>
                                </label>
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </TabPanel>
    </Tabs>
</div>

<!-- ========================================================= -->
<!-- 하단 공통 버튼 -->
<!-- ========================================================= -->
<div class="bottom-area">
    <div class="text-sm text-gray-500"> 각 탭의 입력사항을 저장한 후 작업완료를 진행해주세요. </div>
    <div class="flex items-center gap-2">
        <Button label="공정검사서(칭량)" icon="pi pi-file" outlined @click="procTestPrint" />
        <Button label="작업완료" icon="pi pi-check" severity="success" @click="workCompleted" />
        <Button label="닫기" icon="pi pi-times" severity="secondary" outlined @click="closeDialog" />
    </div>
</div>

</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon'
import { ApiProc } from '@/api/apiProc'
import { ApiSystem } from '@/api/apiSystem'
import { onMounted, ref } from 'vue'


const activeTab = ref('0')
const tabs = [
    { title: '작업정보', value: '0' },
    { title: '사용설비', value: '1' },
    { title: '작업인원', value: '2' },
    { title: '공정검사', value: '3' },
]

// 사용설비 7행 고정
const equipmentList = ref(
    Array.from({ length: 7 }, (_, index) => ({
        no: index + 1,
        equipmentCd: '',
        equipmentName: '',
    }))
)

// 작업인원 6행 고정
const workUserList = ref([
    { no: 1, type: '분말',  workerName: '' },
    { no: 2, type: '분말',  workerName: '' },
    { no: 3, type: '분말',  workerName: '' },
    { no: 4, type: '액상',  workerName: '' },
    { no: 5, type: '액상',  workerName: '' },
    { no: 6, type: '액상',  workerName: '' },
])


// 공정검사 - 서버 조회 결과
const procTestList = ref([])
const areaCds = ref([])
const allStorageList = ref([])


onMounted( async () =>{
  procTestList.value = await ApiProc.getProcTestMethodList(params)
  areaCds.value = await ApiCommon.getCodeList('area')
  allStorageList.value = await ApiSystem.getStorageList({})

})



</script>


<style scoped>
.cellBorder {
    border: 0.5px solid #ccc;
    text-align: center;
    vertical-align: middle;
}

.cellHeader {
    background-color: #f0f0f0;
    font-weight: bold;
    width: 150px;
    height: 38px;
}

.inputCell {
    padding: 6px;
}


/* =========================================================
   Tabs
========================================================= */

.fixed-tabs {
    height: 570px;
    display: flex;
    flex-direction: column;
}

.tab-content {
    padding-top: 6px;
}

.tab-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    height: 48px;

    margin-bottom: 8px;
    padding: 0 4px 6px 4px;

    border-bottom: 1px solid #ddd;
}

.tab-title {
    font-size: 16px;
    font-weight: 700;
    color: #333;
}

.tab-desc {
    margin-left: 10px;
    font-size: 12px;
    font-weight: normal;
    color: #888;
}


/* =========================================================
   DataTable
========================================================= */

::v-deep(.my-table .p-datatable-thead > tr > th) {
    background-color: #BCAAA4;
    color: white;

    font-size: 14px;
    text-align: center;

    padding: 8px;
}

::v-deep(.my-table .p-datatable-tbody > tr > td) {
    padding: 3px 5px;
    vertical-align: middle;
}


/* =========================================================
   Bottom
========================================================= */

.bottom-area {
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-top: 10px;
    padding-top: 10px;

    border-top: 1px solid #ddd;
}

</style>
