<template>
    <div class="prod-page">
        <div class="page-title"> 인  건  비  현  황  ({{ areaName }})</div>
        <!-- 1. 원료 입고 -->
        <section class="list-section">
            <div class="section-header section-blue">
                <h5>1. 칭량(Kg)</h5>
                <Button label="행 추가" icon="pi pi-plus" size="small" class="add-button" @click="addRow('weigh')"/>
            </div>
            <DataTable
                :value="weighList"
                class="my-table fixed-width-table"
                showGridlines
                scrollable
                scrollHeight="250px"
                editMode="cell"
            >
                <Column field="lotNo" header="LOT 및 제조번호" style="width: 100px" >
                    <template #body="{ data }">
                        <InputText v-model="data.lotNo" class="cell-input text-center" readonly/>
                    </template>
                </Column>
                <Column field="customerName" header="업체명" style="width: 180px">
                    <template #body="{ data }">
                        <InputText v-model="data.customerName" class="cell-input text-center" />
                    </template>
                </Column>
                <Column field="itemName" header="제품명" style="width: 300px">
                    <template #body="{ data }">
                        <InputText v-model="data.itemName" class="cell-input" />
                    </template>
                </Column>
                <Column field="prodType" header="구분" style="width: 110px">
                    <template #body="{ data }">
                        <InputText v-model="data.prodType" class="cell-input" />
                    </template>
                </Column>
                <Column field="prodQty" header="생산수량" style="width: 100px">
                    <template #body="{ data }">
                        <InputText v-model="data.prodQty" class="cell-input text-center" />
                    </template>
                </Column>
                <Column field="workTime"  header="작업시간" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.workTime"
                            :minFractionDigits="0"
                            :maxFractionDigits="3"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="inPrice" header="정규직(남)" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.manFPrice"
                            mode="decimal"
                            :minFractionDigits="0"
                            :maxFractionDigits="2"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="inPrice" header="일용직(남)" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.manDPrice"
                            mode="decimal"
                            :minFractionDigits="0"
                            :maxFractionDigits="2"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="inPrice" header="정규직(여)" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.wonFPrice"
                            mode="decimal"
                            :minFractionDigits="0"
                            :maxFractionDigits="2"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="inPrice" header="일용직(여)" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.wonDPrice"
                            mode="decimal"
                            :minFractionDigits="0"
                            :maxFractionDigits="2"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="supplyPrice" header="인건비합계" style="width: 120px">
                    <template #body="{ data }">
                        <InputNumber
                            :modelValue="calculateAmount(data)"
                            readonly
                            class="cell-number readonly-input"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="etc" header="비고" style="width: 180px">
                    <template #body="{ data }">
                        <InputText v-model="data.etc" class="cell-input" />
                    </template>
                </Column>
                <Column header="삭제" style="width: 55px; text-align: center">
                    <template #body="{ index }">
                        <Button icon="pi pi-trash" severity="danger" text rounded @click="removeRow('weigh', index)"/>
                    </template>
                </Column>
                <template #empty>
                    <div class="empty-message">
                        등록된 칭량 내역이 없습니다.
                    </div>
                </template>

                <template #footer>
                    <div class="table-summary">
                        <span>합계</span>
                        <span>
                            수량:
                            {{ formatNumber(weighTotalQty) }}
                        </span>
                        <span>
                            금액:
                            {{ formatNumber(weighTotalAmount) }}
                        </span>
                    </div>
                </template>
            </DataTable>
        </section>

        <!-- 2. 제조 -->
        <section class="list-section">
            <div class="section-header section-orange">
                <h5>2. 제조(kg)</h5>
                <Button label="행 추가" icon="pi pi-plus" size="small" class="add-button" @click="addRow('mat')" />
            </div>
            <DataTable
                :value="matList"
                class="my-table fixed-width-table"
                showGridlines
                scrollable
                scrollHeight="220px"
            >
                <Column field="lotNo" header="LOT 및 제조번호" style="width: 100px" >
                    <template #body="{ data }">
                        <InputText v-model="data.lotNo" class="cell-input text-center" readonly/>
                    </template>
                </Column>
                <Column field="customerName" header="업체명" style="width: 180px">
                    <template #body="{ data }">
                        <InputText v-model="data.customerName" class="cell-input text-center" />
                    </template>
                </Column>
                <Column field="itemName" header="제품명" style="width: 300px">
                    <template #body="{ data }">
                        <InputText v-model="data.itemName" class="cell-input" />
                    </template>
                </Column>
                <Column field="prodType" header="구분" style="width: 110px">
                    <template #body="{ data }">
                        <InputText v-model="data.prodType" class="cell-input" />
                    </template>
                </Column>
                <Column field="prodQty" header="생산수량" style="width: 100px">
                    <template #body="{ data }">
                        <InputText v-model="data.prodQty" class="cell-input text-center" />
                    </template>
                </Column>
                <Column field="workTime"  header="작업시간" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.workTime"
                            :minFractionDigits="0"
                            :maxFractionDigits="3"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="inPrice" header="정규직(남)" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.manFPrice"
                            mode="decimal"
                            :minFractionDigits="0"
                            :maxFractionDigits="2"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="inPrice" header="일용직(남)" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.manDPrice"
                            mode="decimal"
                            :minFractionDigits="0"
                            :maxFractionDigits="2"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="inPrice" header="정규직(여)" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.wonFPrice"
                            mode="decimal"
                            :minFractionDigits="0"
                            :maxFractionDigits="2"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="inPrice" header="일용직(여)" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.wonDPrice"
                            mode="decimal"
                            :minFractionDigits="0"
                            :maxFractionDigits="2"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="supplyPrice" header="인건비합계" style="width: 120px">
                    <template #body="{ data }">
                        <InputNumber
                            :modelValue="calculateAmount(data)"
                            readonly
                            class="cell-number readonly-input"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="etc" header="비고" style="width: 180px">
                    <template #body="{ data }">
                        <InputText v-model="data.etc" class="cell-input" />
                    </template>
                </Column>
                <Column header="삭제" style="width: 55px; text-align: center">
                    <template #body="{ index }">
                        <Button icon="pi pi-trash" severity="danger" text rounded @click="removeRow('mat', index)"/>
                    </template>
                </Column>
                <template #empty>
                    <div class="empty-message">
                        등록된 칭량 내역이 없습니다.
                    </div>
                </template>

                <template #footer>
                    <div class="table-summary">
                        <span>합계</span>
                        <span>
                            수량:
                            {{ formatNumber(matTotalQty) }}
                        </span>
                        <span>
                            금액:
                            {{ formatNumber(matTotalAmount) }}
                        </span>
                    </div>
                </template>
            </DataTable>
        </section>

        <!-- 3.  코팅 -->
        <section class="list-section">
            <div class="section-header section-gray">
                <h5>3. 코팅(M)</h5>
                <Button label="행 추가" icon="pi pi-plus" size="small" class="add-button" @click="addRow('coating')" />
            </div>
            <DataTable
                :value="coatingList"
                class="my-table fixed-width-table"
                showGridlines
                scrollable
                scrollHeight="220px"
            >
                <Column field="lotNo" header="LOT 및 제조번호" style="width: 100px" >
                    <template #body="{ data }">
                        <InputText v-model="data.lotNo" class="cell-input text-center" readonly/>
                    </template>
                </Column>
                <Column field="customerName" header="업체명" style="width: 180px">
                    <template #body="{ data }">
                        <InputText v-model="data.customerName" class="cell-input text-center" />
                    </template>
                </Column>
                <Column field="itemName" header="제품명" style="width: 300px">
                    <template #body="{ data }">
                        <InputText v-model="data.itemName" class="cell-input" />
                    </template>
                </Column>
                <Column field="prodType" header="구분" style="width: 110px">
                    <template #body="{ data }">
                        <InputText v-model="data.prodType" class="cell-input" />
                    </template>
                </Column>
                <Column field="prodQty" header="생산수량" style="width: 100px">
                    <template #body="{ data }">
                        <InputText v-model="data.prodQty" class="cell-input text-center" />
                    </template>
                </Column>
                <Column field="workTime"  header="작업시간" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.workTime"
                            :minFractionDigits="0"
                            :maxFractionDigits="3"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="inPrice" header="정규직(남)" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.manFPrice"
                            mode="decimal"
                            :minFractionDigits="0"
                            :maxFractionDigits="2"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="inPrice" header="일용직(남)" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.manDPrice"
                            mode="decimal"
                            :minFractionDigits="0"
                            :maxFractionDigits="2"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="inPrice" header="정규직(여)" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.wonFPrice"
                            mode="decimal"
                            :minFractionDigits="0"
                            :maxFractionDigits="2"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="inPrice" header="일용직(여)" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.wonDPrice"
                            mode="decimal"
                            :minFractionDigits="0"
                            :maxFractionDigits="2"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="supplyPrice" header="인건비합계" style="width: 120px">
                    <template #body="{ data }">
                        <InputNumber
                            :modelValue="calculateAmount(data)"
                            readonly
                            class="cell-number readonly-input"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="etc" header="비고" style="width: 180px">
                    <template #body="{ data }">
                        <InputText v-model="data.etc" class="cell-input" />
                    </template>
                </Column>
                <Column header="삭제" style="width: 55px; text-align: center">
                    <template #body="{ index }">
                        <Button icon="pi pi-trash" severity="danger" text rounded @click="removeRow('coating', index)"/>
                    </template>
                </Column>
                <template #empty>
                    <div class="empty-message">
                        등록된 칭량 내역이 없습니다.
                    </div>
                </template>

                <template #footer>
                    <div class="table-summary">
                        <span>합계</span>
                        <span>
                            수량:
                            {{ formatNumber(coatingTotalQty) }}
                        </span>
                        <span>
                            금액:
                            {{ formatNumber(coatingTotalAmount) }}
                        </span>
                    </div>
                </template>
            </DataTable>
        </section>

        <!-- 4. 충전 -->
        <section class="list-section">
            <div class="section-header section-yellow">
                <h5>4. 충진(EA)</h5>
                <Button label="행 추가" icon="pi pi-plus" size="small" class="add-button" @click="addRow('charge')" />
            </div>
            <DataTable
                :value="chargeList"
                class="my-table fixed-width-table"
                showGridlines
                scrollable
                scrollHeight="420px"
            >
                <Column field="lotNo" header="LOT 및 제조번호" style="width: 100px" >
                    <template #body="{ data }">
                        <InputText v-model="data.lotNo" class="cell-input text-center" readonly/>
                    </template>
                </Column>
                <Column field="customerName" header="업체명" style="width: 180px">
                    <template #body="{ data }">
                        <InputText v-model="data.customerName" class="cell-input text-center" />
                    </template>
                </Column>
                <Column field="itemName" header="제품명" style="width: 300px">
                    <template #body="{ data }">
                        <InputText v-model="data.itemName" class="cell-input" />
                    </template>
                </Column>
                <Column field="prodType" header="구분" style="width: 110px">
                    <template #body="{ data }">
                        <InputText v-model="data.prodType" class="cell-input" />
                    </template>
                </Column>
                <Column field="prodQty" header="생산수량" style="width: 100px">
                    <template #body="{ data }">
                        <InputText v-model="data.prodQty" class="cell-input text-center" />
                    </template>
                </Column>
                <Column field="workTime"  header="작업시간" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.workTime"
                            :minFractionDigits="0"
                            :maxFractionDigits="3"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="inPrice" header="정규직(남)" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.manFPrice"
                            mode="decimal"
                            :minFractionDigits="0"
                            :maxFractionDigits="2"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="inPrice" header="일용직(남)" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.manDPrice"
                            mode="decimal"
                            :minFractionDigits="0"
                            :maxFractionDigits="2"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="inPrice" header="정규직(여)" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.wonFPrice"
                            mode="decimal"
                            :minFractionDigits="0"
                            :maxFractionDigits="2"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="inPrice" header="일용직(여)" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.wonDPrice"
                            mode="decimal"
                            :minFractionDigits="0"
                            :maxFractionDigits="2"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="supplyPrice" header="인건비합계" style="width: 120px">
                    <template #body="{ data }">
                        <InputNumber
                            :modelValue="calculateAmount(data)"
                            readonly
                            class="cell-number readonly-input"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="etc" header="비고" style="width: 180px">
                    <template #body="{ data }">
                        <InputText v-model="data.etc" class="cell-input" />
                    </template>
                </Column>
                <Column header="삭제" style="width: 55px; text-align: center">
                    <template #body="{ index }">
                        <Button icon="pi pi-trash" severity="danger" text rounded @click="removeRow('charge', index)"/>
                    </template>
                </Column>
                <template #empty>
                    <div class="empty-message">
                        등록된 칭량 내역이 없습니다.
                    </div>
                </template>

                <template #footer>
                    <div class="table-summary">
                        <span>합계</span>
                        <span>
                            수량:
                            {{ formatNumber(chargeTotalQty) }}
                        </span>
                        <span>
                            금액:
                            {{ formatNumber(chargeTotalAmount) }}
                        </span>
                    </div>
                </template>
            </DataTable>
        </section>

        <!-- 5. 포장-->
        <section class="list-section">
            <div class="section-header section-green">
                <h5>5. 포장</h5>
                <Button label="행 추가" icon="pi pi-plus" size="small" class="add-button" @click="addRow('packing')" />
            </div>
            <DataTable
                :value="packingList"
                class="my-table fixed-width-table"
                showGridlines
                scrollable
                scrollHeight="420px"
            >
                <Column field="lotNo" header="LOT 및 제조번호" style="width: 100px" >
                    <template #body="{ data }">
                        <InputText v-model="data.lotNo" class="cell-input text-center" readonly/>
                    </template>
                </Column>
                <Column field="customerName" header="업체명" style="width: 180px">
                    <template #body="{ data }">
                        <InputText v-model="data.customerName" class="cell-input text-center" />
                    </template>
                </Column>
                <Column field="itemName" header="제품명" style="width: 300px">
                    <template #body="{ data }">
                        <InputText v-model="data.itemName" class="cell-input" />
                    </template>
                </Column>
                <Column field="prodType" header="구분" style="width: 110px">
                    <template #body="{ data }">
                        <InputText v-model="data.prodType" class="cell-input" />
                    </template>
                </Column>
                <Column field="prodQty" header="생산수량" style="width: 100px">
                    <template #body="{ data }">
                        <InputText v-model="data.prodQty" class="cell-input text-center" />
                    </template>
                </Column>
                <Column field="workTime"  header="작업시간" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.workTime"
                            :minFractionDigits="0"
                            :maxFractionDigits="3"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="inPrice" header="정규직(남)" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.manFPrice"
                            mode="decimal"
                            :minFractionDigits="0"
                            :maxFractionDigits="2"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="inPrice" header="일용직(남)" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.manDPrice"
                            mode="decimal"
                            :minFractionDigits="0"
                            :maxFractionDigits="2"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="inPrice" header="정규직(여)" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.wonFPrice"
                            mode="decimal"
                            :minFractionDigits="0"
                            :maxFractionDigits="2"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="inPrice" header="일용직(여)" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.wonDPrice"
                            mode="decimal"
                            :minFractionDigits="0"
                            :maxFractionDigits="2"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="supplyPrice" header="인건비합계" style="width: 120px">
                    <template #body="{ data }">
                        <InputNumber
                            :modelValue="calculateAmount(data)"
                            readonly
                            class="cell-number readonly-input"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="etc" header="비고" style="width: 180px">
                    <template #body="{ data }">
                        <InputText v-model="data.etc" class="cell-input" />
                    </template>
                </Column>
                <Column header="삭제" style="width: 55px; text-align: center">
                    <template #body="{ index }">
                        <Button icon="pi pi-trash" severity="danger" text rounded @click="removeRow('packing', index)"/>
                    </template>
                </Column>
                <template #empty>
                    <div class="empty-message">
                        등록된 칭량 내역이 없습니다.
                    </div>
                </template>

                <template #footer>
                    <div class="table-summary">
                        <span>합계</span>
                        <span>
                            수량:
                            {{ formatNumber(packingTotalQty) }}
                        </span>
                        <span>
                            금액:
                            {{ formatNumber(packingTotalAmount) }}
                        </span>
                    </div>
                </template>
            </DataTable>
        </section>
        <div class="bottom-buttons">
            <Button label="저장" icon="pi pi-save" @click="saveInfo" />
            <Button v-if="isBtn" label="종결" icon="pi pi-save" @click="updateEndYn" />
            <Button label="엑셀" icon="pi pi-file-excel" severity="success" @click="downloadLaborCost"></Button>
            <Button label="닫기"   outlined class="ml-2" @click="closeDialog"></Button>
            <!-- <Button label="초기화"  icon="pi pi-refresh" severity="secondary" outlined @click="reset" /> -->
        </div>
    </div>
</template>

<script setup>
import { ApiBase } from '@/api/apiBase';
import { useAlertStore } from '@/stores/alert';
import { todayKST } from '@/util/common';
import { handleApiError } from '@/util/errorHandler';
import { computed, inject, onMounted, reactive, ref } from 'vue';

const isBtn = ref(true)
const { vSuccess, vInfo } = useAlertStore()
const dialogRef = inject('dialogRef', null)
const form = reactive({
    dailyDate: null,
    workTypeCd : '',
    typeCd: 'C',
    endYn: '',
    dailyId:'',
})
const areaName = ref('')
onMounted( async () =>{
    form.dailyId = dialogRef.value?.data?.dailyId ?? null
    form.endYn = dialogRef.value?.data?.endYn ?? 'N'
     let area = dialogRef.value?.data?.areaCd ?? ''
   console.log('area', area)

     if (area === 'A001') {
        areaName.value = '시흥'
    }else{
         areaName.value = '안산'
     }
form.dailyId= 1
    if ( form.endYn === 'Y') {
        isBtn.value = false
    }

    const res = await ApiBase.getLaborCostInfo(form.dailyId)

   console.log('M1 일일보고서 정보', res)

   if ( res.dailyReportInfo) {
       Object.assign(form, res.dailyReportInfo)
   }
   weighList.value = res.weighList || []
   matList.value = res.matList || []
   coatingList.value = res.coatingList || []
   chargeList.value = res.chargeList || []
   packingList.value = res.packingList || []
})


const weighList = ref([])
const matList = ref([])
const coatingList = ref([])
const chargeList = ref([])
const packingList = ref([])

const updateEndYn = async () =>{
    try{
        const params = {
            dailyId: form.dailyId,
            endYn: 'Y',
        }

        const res = await ApiBase.updateM1DailyReportEndYn(params)
        vSuccess('종결 처리되었습니다.')
    }catch(err){
        handleApiError(err)
    }
}

const createWeighRow = () => ({
    dailyDate: !form.dailyId
        ? todayKST()
        : form.dailyDate ?? todayKST(),
    orderDist: weighList.value.length + 1,
    itemCd: '',
    itemName: '',
    unit: '',
    qty: 0,
    inPrice: 0,
    etc: '',
})

const createMatRow = () => ({
    dailyDate: !form.dailyId
        ? todayKST()
        : form.dailyDate ?? todayKST(),
    orderDist: matList.value.length + 1,
    itemCd: '',
    itemName: '',
    unit: 'kg',
    qty: 0,
    etc: '',
})

const createCoatingRow = () => ({
    dailyDate: !form.dailyId
        ? todayKST()
        : form.dailyDate ?? todayKST(),
    orderDist: coatingList.value.length + 1,
    itemCd: '',
    itemName: '',
    unit: 'kg',
    qty: 0,
    etc: '',
})

const createChargeRow = () => ({
    dailyDate: !form.dailyId
        ? todayKST()
        : form.dailyDate ?? todayKST(),
    orderDist: chargeList.value.length + 1,
    itemCd: '',
    itemName: '',
    productName: '',
    lotNo: '',
    unit: 'kg',
    qty: 0,
    managerName: '',
    etc: '',
})

const createPackingRow = () => ({
    dailyDate: !form.dailyId
        ? todayKST()
        : form.dailyDate ?? todayKST(),
    orderDist: packingList.value.length + 1,
    itemCd: '',
    itemName: '',
    requiredQuantity: 0,
    inPrice: 0,
    totalPrice: 0,
    etc: '',
})

const listMap = {
    weigh: weighList,
    mat: matList,
    coating: coatingList,
    charge: chargeList,
    packing: packingList,
}

const addRow = (type) => {
    const rowFactoryMap = {
        weigh: createWeighRow,
        mat: createMatRow,
        coating: createCoatingRow,
        charge: createChargeRow,
        packing: createPackingRow,
    }

    const targetList = listMap[type]
    const rowFactory = rowFactoryMap[type]

    if (!targetList || !rowFactory) return

    targetList.value.push(rowFactory())
}

const deleteWeighIds = ref([])
const deleteMatIds = ref([])
const deleteCoatingIds = ref([])
const deleteChargeIds = ref([])
const deletePackingIds = ref([])

const deleteIdMap = {
    weigh: { ids: deleteWeighIds, idField: 'dailyCostId' },
    mat: { ids: deleteMatIds, idField: 'dailyCostId' },
    coating: { ids: deleteCoatingIds, idField: 'dailyCostId' },
    charge: { ids: deleteChargeIds, idField: 'dailyCostId' },
    packing: { ids: deletePackingIds, idField: 'dailyCostId' },
}

const removeRow = (type, index) => {
    const targetList = listMap[type]
    const deleteInfo = deleteIdMap[type]

    if (!targetList || index < 0) return

    const row = targetList.value[index]

    if (!row) return

    if (deleteInfo) {
        const deleteId = row[deleteInfo.idField]

        if (deleteId != null && deleteId !== '' && !deleteInfo.ids.value.includes(deleteId)) {
            deleteInfo.ids.value.push(deleteId)
        }
    }

    targetList.value.splice(index, 1)

    targetList.value.forEach((row, rowIndex) => {
        row.orderDist = rowIndex + 1
    })
}

const calculateAmount = (row) => {
    const qty = Number(row.qty) || 0
    const inPrice = Number(row.inPrice) || 0

    return qty * inPrice
}

/************** 리스트 별 합계******************************************************* */
const weighTotalQty = computed(() => {
    return weighList.value.reduce(
        (sum, row) => sum + (Number(row.qty) || 0), 0,
    )
})
const weighTotalAmount = computed(() => {
    return weighList.value.reduce(
        (sum, row) => sum + calculateAmount(row),0,
    )
})

const  matTotalQty = computed(() => {
    return matList.value.reduce(
        (sum, row) => sum + (Number(row.qty) || 0), 0,
    )
})
const matTotalAmount = computed(() => {
    return matList.value.reduce(
        (sum, row) => sum + calculateAmount(row), 0,
    )
})

const  coatingTotalQty = computed(() => {
    return coatingList.value.reduce(
        (sum, row) => sum + (Number(row.qty) || 0), 0,
    )
})
const coatingTotalAmount = computed(() => {
    return coatingList.value.reduce(
        (sum, row) => sum + calculateAmount(row), 0,
    )
})

const chargeTotalQty = computed(() => {
    return chargeList.value.reduce(
        (sum, row) => sum + (Number(row.qty) || 0), 0,
    )
})
const chargeTotalAmount = computed(() => {
    return chargeList.value.reduce(
        (sum, row) => sum + calculateAmount(row), 0,
    )
})

const packingTotalQty = computed(() => {
    return packingList.value.reduce(
        (sum, row) => sum + (Number(row.qty) || 0), 0,
    )
})
const packingTotalAmount = computed(() => {
    return packingList.value.reduce(
        (sum, row) => sum + calculateAmount(row), 0,
    )
})

const formatNumber = (value) => {
    return Number(value || 0).toLocaleString('ko-KR', {
        maximumFractionDigits: 3,
    })
}
const saveInfo = async () => {
    try{
        const params = {
            dailyReportInfo: form,
            weighList: weighList.value,
            matList: matList.value,
            coatingList: coatingList.value,
            chargeList: chargeList.value,
            packingList: packingList.value,
            deleteWeighIds: deleteWeighIds.value,
            deleteMatIds: deleteMatIds.value,
            deleteCoatingIds: deleteCoatingIds.value,
            deleteChargeIds: deleteChargeIds.value,
            deletePackingIds: deletePackingIds.value,
        }

        console.log('저장 데이터', params)
        // 실제 API 호출
        await ApiBase.saveLaborCostInfo(params)
        vSuccess('저장되었습니다.')
        closeDialog()
    }catch (error) {
        console.error('저장 중 오류 발생:', error)
        handleApiError(error)
    }
}


const downloadLaborCost = async () => {
    if (!form.dailyId) {
        vInfo('저장 후 다운로드 가능합니다.')
        return
    }

    try {
        const params = {
            typeCd: form.typeCd,
            dailyId: form.dailyId
        }

        const res = await ApiBase.downloadDailyReport(params)
        const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `인건비생산일보_${form.dailyDate}.xlsx`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    } catch (error) {
        handleApiError(error)
    }
}

const closeDialog = () =>{
    dialogRef.value.close()
}

const reset = () => {
    weighList.value = []
    matList.value = []
    coatingList.value = []
    chargeList.value = []
    packingList.value = []
    deleteWeighIds.value = []
    deleteMatIds.value = []
    deleteCoatingIds.value = []
    deleteChargeIds.value = []
    deletePackingIds.value = []
}
</script>

<style scoped>
.prod-page {
    width: 100%;
    min-width: 1200px;
    padding: 12px;
    background: #ffffff;
}
.page-title {
    padding: 6px 8px;
    margin-bottom: 12px;
    border: 1px solid #cfcfcf;
    border-left: 5px solid #607d8b;
    background: #fafafa;
    font-size: 20px;
    font-weight: 700;
}
.list-section {
    margin-bottom: 18px;
}
.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 38px;
    padding: 4px 8px;
    border: 1px solid #bdbdbd;
    border-bottom: 0;
}
.section-header h5 {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
}
.section-blue {
    background: #dceef8;
}
.section-orange {
    background: #fbe6d5;
}
.section-gray {
    background: #eeeeee;
}
.section-yellow {
    background: #fff2cc;
}
.section-green {
    background: #e2f0d9;
}
.section-lime {
    background: #F0F4C3;
}
.add-button {
    height: 28px;
    padding: 0 10px;
    font-size: 12px;
}
.cell-input,
.cell-select,
.cell-number {
    width: 100%;
}
.text-center {
    text-align: center;
}
.text-right {
    text-align: right;
}
.empty-message {
    padding: 18px;
    text-align: center;
    color: #777777;
}
.table-summary {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 40px;
    padding-right: 15px;
    font-weight: 700;
}
.bottom-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 10px 0 30px;
}
/* DataTable 전체 글꼴 및 행 높이 */
:deep(.my-table) {
    font-size: 12px;
}
:deep(.my-table .p-datatable-table) {
    min-width: 100%;
    table-layout: fixed;
}
:deep(.my-table .p-datatable-thead > tr > th) {
    height: 31px;
    padding: 3px 5px;
    background: #f5f5f5;
    border-color: #777777;
    color: #222222;
    font-size: 12px;
    font-weight: 700;
    text-align: center;
    white-space: nowrap;
}

:deep(.my-table .p-datatable-tbody > tr > td) {
    height: 30px;
    padding: 1px 3px;
    border-color: #999999;
    vertical-align: middle;
}

:deep(.my-table .p-inputtext) {
    width: 100%;
    height: 26px;
    padding: 2px 5px;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    font-size: 12px;
}

:deep(.my-table .p-inputnumber) {
    width: 100%;
}

:deep(.my-table .p-inputnumber-input) {
    width: 100%;
    height: 26px;
    padding: 2px 5px;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    font-size: 12px;
}

:deep(.my-table .p-select) {
    width: 100%;
    height: 26px;
    border: 0;
    border-radius: 0;
    box-shadow: none;
}

:deep(.my-table .p-select-label) {
    padding: 4px 5px;
    font-size: 12px;
}

:deep(.my-table .p-select-dropdown) {
    width: 24px;
}

:deep(.my-table .readonly-input input) {
    background: #f3f3f3;
    color: #333333;
    font-weight: 600;
}

:deep(.my-table .p-datatable-footer) {
    padding: 7px 10px;
    border-color: #777777;
    background: #fafafa;
    font-size: 12px;
}

:deep(.my-table .p-button.p-button-icon-only) {
    width: 25px;
    height: 25px;
}
</style>
