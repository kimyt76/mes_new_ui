<template>
<div class="weight-dialog-body">
      <!-- 좌측 키패드 영역 -->
      <div class="left-panel">
        <div class="display-value">
          {{ displayValue }}
        </div>

        <div class="keypad-grid">
          <Button label="1" class="keypad-btn p-button-outlined" @click="appendValue('1')" />
          <Button label="2" class="keypad-btn p-button-outlined" @click="appendValue('2')" />
          <Button label="3" class="keypad-btn p-button-outlined" @click="appendValue('3')" />

          <Button label="4" class="keypad-btn p-button-outlined" @click="appendValue('4')" />
          <Button label="5" class="keypad-btn p-button-outlined" @click="appendValue('5')" />
          <Button label="6" class="keypad-btn p-button-outlined" @click="appendValue('6')" />

          <Button label="7" class="keypad-btn p-button-outlined" @click="appendValue('7')" />
          <Button label="8" class="keypad-btn p-button-outlined" @click="appendValue('8')" />
          <Button label="9" class="keypad-btn p-button-outlined" @click="appendValue('9')" />

          <Button label="0" class="keypad-btn p-button-outlined" @click="appendValue('0')" />
          <Button label="." class="keypad-btn p-button-outlined" @click="appendDot" />
          <Button label="DEL" class="keypad-btn p-button-outlined" @click="removeLast" />
        </div>

        <div class="bottom-btns" :class="{ three: isSaveBtn }">
            <Button
                v-if="isSaveBtn"
                label="저장"
                class="action-btn confirm-btn"
                @click="saveWeight"
            />
            <Button
                label="입력"
                class="action-btn confirm-btn"
                @click="onConfirm"
            />
            <Button
                label="리셋"
                class="action-btn reset-btn"
                @click="onReset"
            />
        </div>
    </div>

      <!-- 우측 테이블 영역 -->
      <div class="right-panel">
        <div class="right-top">
          <div class="section-title">최근 저울별 측정값</div>
          <Button label="측정값 갱신" class="refresh-btn" @click="refreshMeasures" />
        </div>

        <DataTable
          :value="measureList"
            stripedRows
            scrollable
            scrollHeight="320px"
            class="measure-table"
        >
          <Column field="scaleName" header="저울별칭" />
          <Column field="measuredAt" header="최근측정시간" />
          <Column field="measuredValue" header="최근측정값" />
        </DataTable>
      </div>
    </div>
</template>

<script setup>
import { computed, inject, onMounted, ref } from 'vue'

const dialogRef = inject('dialogRef')
const isSaveBtn = ref(false)
const inputValue = ref('0')
const measureList = ref([])
const displayValue = computed(() => inputValue.value || '0')
const appendValue = (num) => {
  if (inputValue.value === '0') {
    inputValue.value = num
    return
  }
  inputValue.value += num
}

const appendDot = () => {
  if (!inputValue.value.includes('.')) {
    inputValue.value += '.'
  }
}

const removeLast = () => {
  if (!inputValue.value || inputValue.value.length === 1) {
    inputValue.value = '0'
    return
  }
  inputValue.value = inputValue.value.slice(0, -1)
  if (inputValue.value === '' || inputValue.value === '-') {
    inputValue.value = '0'
  }
}

const saveWeight = () =>{

}

const onReset = () => {
  inputValue.value = '0'
}

const onConfirm = () => {
  // 부모에 emit 하거나 dialog close 처리
   dialogRef.value.close(inputValue.value);
}

const refreshMeasures = () => {
  console.log('측정값 갱신')
  getMeasureList()
}

const getMeasureList = async () =>{
    //measureList.value = await ApiSystems.getBagWeightHistList()
}

onMounted( () =>{
    //console.log('dialogRef', dialogRef.value?.data?.form)
    if ( dialogRef.value?.data?.form.isBtn === 'S') {
        isSaveBtn.value = true
    }
    const param = {
        areaCd: dialogRef.value?.data?.form.areaCd,
        storageCd: dialogRef.value?.data?.form.storageCd
    }
    getMeasureList(param)
})

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
:deep(.weight-input-dialog .p-dialog-header) {
  background: #4b586d;
  color: #fff;
  padding: 0.85rem 1rem;
}

.dialog-header-title {
  font-size: 1rem;
  font-weight: 700;
}

.weight-dialog-body {
  display: flex;
  gap: 2rem;
  padding: 1.25rem 1rem 1.5rem 1rem;
  min-height: 430px;
  background: #f7f7f7;
  width: 900px;
}

.left-panel {
  width: 265px;
  flex-shrink: 0;
}

.display-value {
  font-size: 3rem;
  line-height: 1;
  color: #222;
  padding: 0.5rem 0 0.75rem 0;
  border-bottom: 1px dashed #b8b8b8;
  margin-bottom: 0.5rem;
}

.keypad-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.65rem;
  margin-top: 0.35rem;
}

:deep(.keypad-btn.p-button) {
  height: 64px;
  border-radius: 2px;
  color: #4b586d;
  border-color: #5c6880;
  background: #fff;
  font-size: 1.35rem;
  font-weight: 500;
}

.bottom-btns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.65rem;
  margin-top: 0.65rem;
}

:deep(.action-btn.p-button) {
  height: 62px;
  border-radius: 3px;
  font-size: 1.6rem;
  font-weight: 700;
  background: #4f5d74;
  border-color: #4f5d74;
}

.right-panel {
  flex: 1;
  min-width: 0;
}

.right-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 500;
  color: #111;
}

:deep(.refresh-btn.p-button) {
  background: #4f5d74;
  border-color: #4f5d74;
  font-weight: 600;
  height: 34px;
  padding: 0 1rem;
}

.measure-table {
  background: #fff;
}

:deep(.measure-table .p-datatable-thead > tr > th) {
  background: #efefef;
  color: #444;
  text-align: center;
  font-weight: 600;
  padding: 0.45rem 0.75rem;
  border: 1px solid #d5d5d5;
}

:deep(.measure-table .p-datatable-tbody > tr > td) {
  text-align: center;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ececec;
  height: 42px;
}

:deep(.measure-table .p-datatable-tbody > tr > td:first-child) {
  color: #14a3a3;
  font-weight: 600;
}
.bottom-btns {
  display: flex;
  gap: 10px;
}

/* 버튼 기본: 2개일 때 */
.bottom-btns .action-btn {
  flex: 1;
}

/* 버튼 3개일 때 */
.bottom-btns.three .action-btn {
  flex: 1;
}
</style>
