<template>
<div class="w-full mt-3">
    <table cellspacing="0" width="100%">
      <tbody>
        <tr>
            <th class="cellBorder cellHeader">제조번호</th>
            <td class="cellBorder"></td>
            <th class="cellBorder cellHeader">품목코드</th>
            <td class="cellBorder"></td>
            <th class="cellBorder cellHeader">품목명</th>
            <td class="cellBorder" colspan="3"></td>
        </tr>
        <tr>
            <th class="cellBorder cellHeader">지시일자</th>
            <td class="cellBorder"></td>
            <th class="cellBorder cellHeader">지시량</th>
            <td class="cellBorder"></td>
            <th class="cellBorder cellHeader">제조설비</th>
            <td class="cellBorder" colspan="3"></td>
        </tr>
        <tr>
            <th class="cellBorder cellHeader">제조일자</th>
            <td class="cellBorder"></td>
            <th class="cellBorder cellHeader">제조량</th>
            <td class="cellBorder"></td>
            <th class="cellBorder cellHeader">생산수율</th>
            <td class="cellBorder"></td>
            <th class="cellBorder cellHeader">생산처</th>
            <td class="cellBorder"></td>
        </tr>
        <tr>
            <th class="cellBorder cellHeader">PO NO</th>
            <td class="cellBorder"></td>
            <th class="cellBorder cellHeader">특이사항</th>
            <td class="cellBorder" colspan="5">
                <InputText class="w-full" v-model="form.etc" />
            </td>
        </tr>
      </tbody>
    </table>
  </div>

<div class="p-3">

<div class="header">
      <TabView v-model:activeIndex="topActiveIndex" class="top-tabs">
        <TabPanel header="원료투입">
            <div class="flex items-center gap-3">
                <FloatLabel variant="on">
                    <InputText id="on_label1" v-model="form.weighNo" />
                    <label for="on_label1">QR코드(칭량번호)</label>
                </FloatLabel>

                <div class="count">
                {{ totalCount }} 중 {{ doneCount }} 개 완료
                </div>
                <div>
                    <span class="hint">** 저장시 완료 체크된 행만 저장됩니다.</span>
                </div>
            </div>
        </TabPanel>
        <TabPanel header="공정기록">

        </TabPanel>
      </TabView>
</div>


</div>



  <div class="w-full mt-3">
    <div class="flex items-center justify-end gap-3">
      <Button label="저장" class="p-button-secondary" @click="saveInfo"></Button>
      <Button label="바코드출력" icon="pi pi-barcode" @click="barcodePrint" />
      <Button label="공정기록서(제조투입)" @click="downloadProcTest('P')"/>
      <Button label="공정기록서(공정기록)" @click="downloadProcTest('R')"/>
      <Button label="닫기" outlined class="ml-2" @click="closeDialog" />
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { inject, onMounted, reactive, ref } from 'vue';

const { userId} = useAuthStore()
const dialogRef = inject('dialogRef')

const topActiveIndex = ref(0)
const subActiveIndex = ref(0);
const totalCount = ref(0)
const doneCount = ref(0)

const form = reactive({

    weighNo:'',
    etc:'',

    userId: userId,
})



const saveInfo = () =>{

}

const downloadProcTest = (type) =>{
    let title = ''

    if ( type === 'P' ){

    } else if ( type === 'R' ){

    }
}

const barcodePrint = () =>{

}

onMounted( async () =>{





})





const closeDialog = () => {
    dialogRef.close();
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
  height: 30px;
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

.count {
  margin-left: 30px;
  font-weight: 500;
  font-size: 13px;
}

.hint {
  margin-left: 30px;
  font-weight: 500;
  color: #2b63c6;
  font-size: 13px;
}

</style>
