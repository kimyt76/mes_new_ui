<template>
    <div class="prod-page">
        <div class="page-title"> 원료 일일 입고 및 사용내역 </div>
        <!-- 1. 원료 입고 -->
        <section class="list-section">
            <div class="section-header section-blue">
                <h5>1. 원료 입고</h5>
                <Button label="행 추가" icon="pi pi-plus" size="small" class="add-button" @click="addRow('in')"/>
            </div>
            <DataTable
                :value="inList"
                class="my-table fixed-width-table"
                showGridlines
                scrollable
                scrollHeight="250px"
                editMode="cell"
            >
                <Column field="dailyDate" header="입고일자" style="width: 100px" >
                    <template #body="{ data }">
                        <InputText v-model="data.dailyDate" class="cell-input text-center" readonly/>
                    </template>
                </Column>
                <Column field="orderDist" header="NO" style="width: 70px">
                    <template #body="{ data }">
                        <InputNumber v-model="data.orderDist" :useGrouping="false" class="cell-number" inputClass="text-center"/>
                    </template>
                </Column>
                <Column field="itemCd" header="품목코드" style="width: 110px">
                    <template #body="{ data }">
                        <InputText v-model="data.itemCd" class="cell-input" />
                    </template>
                </Column>
                <Column field="customerName" header="거래처명" style="width: 180px">
                    <template #body="{ data }">
                        <InputText v-model="data.customerName" class="cell-input text-center" />
                    </template>
                </Column>
                <Column field="itemName" header="제품명" style="width: 300px">
                    <template #body="{ data }">
                        <InputText v-model="data.itemName" class="cell-input" />
                    </template>
                </Column>
                <Column field="spec" header="규격[kg]" style="width: 100px">
                    <template #body="{ data }">
                        <InputText v-model="data.spec" class="cell-input text-center" />
                    </template>
                </Column>
                <Column field="qty"  header="수량[kg]" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.qty"
                            :minFractionDigits="0"
                            :maxFractionDigits="3"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="inPrice" header="단가[원]" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.inPrice"
                            mode="decimal"
                            :minFractionDigits="0"
                            :maxFractionDigits="2"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="supplyPrice" header="공급가[원]" style="width: 120px">
                    <template #body="{ data }">
                        <InputNumber
                            :modelValue="calculateAmount(data)"
                            readonly
                            class="cell-number readonly-input"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="expiryDate" header="사용기한" style="width: 100px">
                    <template #body="{ data }">
                        <InputText v-model="data.expiryDate" class="cell-input" />
                    </template>
                </Column>
                <Column field="etc" header="비고" style="width: 180px">
                    <template #body="{ data }">
                        <InputText v-model="data.etc" class="cell-input" />
                    </template>
                </Column>
                <Column header="삭제" style="width: 55px; text-align: center">
                    <template #body="{ index }">
                        <Button icon="pi pi-trash" severity="danger" text rounded @click="removeRow('in', index)"/>
                    </template>
                </Column>

                <template #empty>
                    <div class="empty-message">
                        등록된 원료 입고 내역이 없습니다.
                    </div>
                </template>

                <template #footer>
                    <div class="table-summary">
                        <span>합계</span>
                        <span>
                            수량:
                            {{ formatNumber(inTotalQty) }}
                        </span>
                        <span>
                            금액:
                            {{ formatNumber(inTotalAmount) }}
                        </span>
                    </div>
                </template>
            </DataTable>
        </section>

        <!-- 2. 원료 반품 -->
        <section class="list-section">
            <div class="section-header section-orange">
                <h5>2. 원료 반품</h5>
                <Button label="행 추가" icon="pi pi-plus" size="small" class="add-button" @click="addRow('return')" />
            </div>
            <DataTable
                :value="returnList"
                class="my-table fixed-width-table"
                showGridlines
                scrollable
                scrollHeight="220px"
            >
                <Column field="dailyDate" header="반품일자" style="width: 100px">
                    <template #body="{ data }">
                        <InputText v-model="data.dailyDate" class="cell-input text-center" />
                    </template>
                </Column>
                <Column field="orderDist" header="순번" style="width: 70px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.orderDist"
                            :useGrouping="false"
                            class="cell-number"
                            inputClass="text-center"
                        />
                    </template>
                </Column>
                <Column field="itemCd" header="품목코드" style="width: 110px">
                    <template #body="{ data }">
                        <InputText v-model="data.itemCd" class="cell-input" />
                    </template>
                </Column>
                <Column field="customerName" header="거래처명" style="width: 180px">
                    <template #body="{ data }">
                        <InputText v-model="data.customerName" class="cell-input text-center" />
                    </template>
                </Column>
                <Column field="itemName" header="제품명" style="width: 300px">
                    <template #body="{ data }">
                        <InputText v-model="data.itemName" class="cell-input" />
                    </template>
                </Column>
                <Column field="spec" header="규격[kg]" style="width: 100px">
                    <template #body="{ data }">
                        <InputText v-model="data.spec" class="cell-input text-center" />
                    </template>
                </Column>
                <Column field="qty"  header="수량[kg]" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.qty"
                            :maxFractionDigits="3"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="inPrice" header="단가[원]" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.inPrice"
                            mode="decimal"
                            :minFractionDigits="0"
                            :maxFractionDigits="2"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="supplyPrice" header="공급가[원]" style="width: 120px">
                    <template #body="{ data }">
                        <InputNumber
                            :modelValue="calculateAmount(data)"
                            readonly
                            class="cell-number readonly-input"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="expiryDate" header="사용기한" style="width: 100px">
                    <template #body="{ data }">
                        <InputText v-model="data.expiryDate" class="cell-input" />
                    </template>
                </Column>
                <Column field="etc" header="비고" style="width: 180px">
                    <template #body="{ data }">
                        <InputText v-model="data.etc" class="cell-input" />
                    </template>
                </Column>
                <Column header="삭제" style="width: 55px; text-align: center">
                    <template #body="{ index }">
                        <Button icon="pi pi-trash" severity="danger" text rounded @click="removeRow('return', index)" />
                    </template>
                </Column>
                <template #empty>
                    <div class="empty-message">
                        등록된 반품 내역이 없습니다.
                    </div>
                </template>

                <template #footer>
                    <div class="table-summary">
                        <span>합계 : </span>
                        <span>
                            수량:
                            {{ formatNumber(returnTotalQty) }}
                        </span>
                        <span>
                            금액:
                            {{ formatNumber(returnTotalAmount) }}
                        </span>
                    </div>
                </template>
            </DataTable>
        </section>

        <!-- 3. 원료 불량 -->
        <section class="list-section">
            <div class="section-header section-gray">
                <h5>3. 원료 불량</h5>
                <Button label="행 추가" icon="pi pi-plus" size="small" class="add-button" @click="addRow('discard')" />
            </div>
            <DataTable
                :value="discardList"
                class="my-table fixed-width-table"
                showGridlines
                scrollable
                scrollHeight="220px"
            >
                <Column field="dailyDate" header="불량일자" style="width: 100px">
                    <template #body="{ data }">
                        <InputText v-model="data.dailyDate" class="cell-input text-center" />
                    </template>
                </Column>

                <Column field="orderDist" header="순번" style="width: 70px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.orderDist"
                            :useGrouping="false"
                            class="cell-number"
                            inputClass="text-center"
                        />
                    </template>
                </Column>
                <Column field="itemCd" header="품목코드" style="width: 110px">
                    <template #body="{ data }">
                        <InputText v-model="data.itemCd" class="cell-input" />
                    </template>
                </Column>
                <Column field="customerName" header="거래처명" style="width: 180px">
                    <template #body="{ data }">
                        <InputText v-model="data.customerName" class="cell-input text-center" />
                    </template>
                </Column>
                <Column field="itemName" header="제품명" style="width: 300px">
                    <template #body="{ data }">
                        <InputText v-model="data.itemName" class="cell-input" />
                    </template>
                </Column>
                <Column field="spec" header="규격[kg]" style="width: 100px">
                    <template #body="{ data }">
                        <InputText v-model="data.spec" class="cell-input text-center" />
                    </template>
                </Column>
                <Column field="qty" header="수량[kg]" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.qty"
                            :maxFractionDigits="3"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="inPrice" header="단가[원]" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.inPrice"
                            mode="decimal"
                            :minFractionDigits="0"
                            :maxFractionDigits="2"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="supplyPrice" header="공급가[원]" style="width: 120px">
                    <template #body="{ data }">
                        <InputNumber
                            :modelValue="calculateAmount(data)"
                            readonly
                            class="cell-number readonly-input"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="expiryDate" header="사용기한" style="width: 100px">
                    <template #body="{ data }">
                        <InputText v-model="data.expiryDate" class="cell-input" />
                    </template>
                </Column>
                <Column field="etc" header="비고" style="width: 180px">
                    <template #body="{ data }">
                        <InputText v-model="data.etc" class="cell-input" />
                    </template>
                </Column>
                <Column header="삭제" style="width: 55px; text-align: center">
                    <template #body="{ index }">
                        <Button icon="pi pi-trash" severity="danger" text rounded @click="removeRow('discard', index)"/>
                    </template>
                </Column>

                <template #empty>
                    <div class="empty-message">
                        등록된 폐기 내역이 없습니다.
                    </div>
                </template>

                <template #footer>
                    <div class="table-summary">
                        <span>합계 : </span>
                        <span>
                            수량:
                            {{ formatNumber(discardTotalQty) }}
                        </span>
                        <span>
                            금액:
                            {{ formatNumber(discardTotalAmount) }}
                        </span>
                    </div>
                </template>
            </DataTable>
        </section>

        <!-- 4. 칭량 제품 -->
        <section class="list-section">
            <div class="section-header section-yellow">
                <h5>4. 칭량 제품</h5>
                <Button label="행 추가" icon="pi pi-plus" size="small" class="add-button" @click="addRow('prod')" />
            </div>
            <DataTable
                :value="prodList"
                class="my-table fixed-width-table"
                showGridlines
                scrollable
                scrollHeight="420px"
            >
                <Column field="dailyDate" header="칭량지시일" frozen style="width: 100px">
                    <template #body="{ data }">
                        <InputText v-model="data.dailyDate" class="cell-input text-center" />
                    </template>
                </Column>

                <Column field="orderDist" header="순번" frozen style="width: 70px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.orderDist"
                            :useGrouping="false"
                            class="cell-number"
                            inputClass="text-center"
                        />
                    </template>
                </Column>
                <Column field="itemCd" header="품목코드" frozen style="width: 110px">
                    <template #body="{ data }">
                        <InputText v-model="data.itemCd" class="cell-input" />
                    </template>
                </Column>
                <Column field="customerName" header="거래처명" style="width: 180px">
                    <template #body="{ data }">
                        <InputText v-model="data.customerName" class="cell-input text-center" />
                    </template>
                </Column>
                <Column field="itemName" header="품목명" style="width: 300px">
                    <template #body="{ data }">
                        <InputText v-model="data.itemName" class="cell-input" />
                    </template>
                </Column>
                <Column field="lotNo" header="로트번호" style="width: 100px">
                    <template #body="{ data }">
                        <InputText v-model="data.lotNo" class="cell-input text-center" />
                    </template>
                </Column>
                <Column field="qty" header="지시수량" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.qty"
                            :maxFractionDigits="3"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                 <Column field="inPrice" header="(g)당 단가" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.inPrice"
                            mode="decimal"
                            :minFractionDigits="0"
                            :maxFractionDigits="2"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="totalPrice" header="합계" style="width: 120px">
                    <template #body="{ data }">
                        <InputNumber
                            :modelValue="calculateAmount(data)"
                            readonly
                            class="cell-number readonly-input"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="areaName" header="구역" style="width: 100px">
                    <template #body="{ data }">
                        <InputText v-model="data.areaName" class="cell-input" />
                    </template>
                </Column>
                <Column field="etc" header="비고" style="width: 180px">
                    <template #body="{ data }">
                        <InputText v-model="data.etc" class="cell-input" />
                    </template>
                </Column>
                <Column header="삭제" frozen style="width: 55px; text-align: center">
                    <template #body="{ index }">
                        <Button icon="pi pi-trash" severity="danger" text rounded @click="removeRow('prod', index)" />
                    </template>
                </Column>

                <template #empty>
                    <div class="empty-message">
                        등록된 원료 사용 내역이 없습니다.
                    </div>
                </template>

                <template #footer>
                    <div class="table-summary">
                        <span>합계 : </span>
                        <span>
                            수량:
                            {{ formatNumber(prodTotalQty) }}
                        </span>
                        <span>
                            금액:
                            {{ formatNumber(prodTotalAmount) }}
                        </span>
                    </div>
                </template>
            </DataTable>
        </section>

        <!-- 5. 원료 사용량-->
        <section class="list-section">
            <div class="section-header section-green">
                <h5>5. 원료 사용량</h5>
                <Button label="행 추가" icon="pi pi-plus" size="small" class="add-button" @click="addRow('use')" />
            </div>
            <DataTable
                :value="useList"
                class="my-table fixed-width-table"
                showGridlines
                scrollable
                scrollHeight="420px"
            >
                <Column field="dailyDate" header="칭량지시일" frozen style="width: 100px">
                    <template #body="{ data }">
                        <InputText v-model="data.dailyDate" class="cell-input text-center" />
                    </template>
                </Column>

                <Column field="orderDist" header="순번" frozen style="width: 70px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.orderDist"
                            :useGrouping="false"
                            class="cell-number"
                            inputClass="text-center"
                        />
                    </template>
                </Column>

                <Column field="itemCd" header="품목코드" frozen style="width: 110px">
                    <template #body="{ data }">
                        <InputText v-model="data.itemCd" class="cell-input text-center" />
                    </template>
                </Column>
                <Column field="customerName" header="거래처명" style="width: 180px">
                    <template #body="{ data }">
                        <InputText v-model="data.customerName" class="cell-input text-center" />
                    </template>
                </Column>
                <Column field="itemName" header="제품명" style="width: 300px">
                    <template #body="{ data }">
                        <InputText v-model="data.itemName" class="cell-input" />
                    </template>
                </Column>
                <Column field="requiredQuantity" header="소요량" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.requiredQuantity"
                            :maxFractionDigits="3"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="inPrice" header="단가[원]" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.inPrice"
                            mode="decimal"
                            :minFractionDigits="0"
                            :maxFractionDigits="2"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="totalPrice" header="합계금액[원]" style="width: 120px">
                    <template #body="{ data }">
                        <InputNumber
                            :modelValue="calculateUseQty(data)"
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
                <Column header="삭제" frozen style="width: 55px; text-align: center">
                    <template #body="{ index }">
                        <Button icon="pi pi-trash" severity="danger" text rounded @click="removeRow('use', index)" />
                    </template>
                </Column>

                <template #empty>
                    <div class="empty-message">
                        등록된 원료 재고 내역이 없습니다.
                    </div>
                </template>

                <template #footer>
                    <div class="table-summary">
                        <span>합계 : </span>
                        <span>
                            수량:
                            {{ formatNumber(useTotalQty) }}
                        </span>
                        <span>
                            금액:
                            {{ formatNumber(useTotalAmount) }}
                        </span>
                    </div>
                </template>
            </DataTable>
        </section>

        <!-- 6. 원료 외주반출 -->
        <section class="list-section">
            <div class="section-header section-lime">
                <h5>6. 원료 외주반출</h5>
                <Button label="행 추가" icon="pi pi-plus" size="small" class="add-button" @click="addRow('osp')" />
            </div>
            <DataTable
                :value="ospList"
                class="my-table fixed-width-table"
                showGridlines
                scrollable
                scrollHeight="420px"
            >
                <Column field="dailyDate" header="발송일자" frozen style="width: 100px">
                    <template #body="{ data }">
                        <InputText v-model="data.dailyDate" class="cell-input text-center" />
                    </template>
                </Column>
                <Column field="orderDist" header="순번" frozen style="width: 70px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.orderDist"
                            :useGrouping="false"
                            class="cell-number"
                            inputClass="text-center"
                        />
                    </template>
                </Column>
                <Column field="itemCd" header="품목코드" frozen style="width: 110px">
                    <template #body="{ data }">
                        <InputText v-model="data.itemCd" class="cell-input" />
                    </template>
                </Column>
                <Column field="customerName" header="거래처명" style="width: 180px">
                    <template #body="{ data }">
                        <InputText v-model="data.customerName" class="cell-input text-center" />
                    </template>
                </Column>
                <Column field="itemName" header="제품명" style="width: 300px">
                    <template #body="{ data }">
                        <InputText v-model="data.itemName" class="cell-input" />
                    </template>
                </Column>
                <Column field="spec" header="규격[kg]" style="width: 100px">
                    <template #body="{ data }">
                        <InputText v-model="data.spec" class="cell-input" />
                    </template>
                </Column>
                <Column field="qty" header="수량" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.qty"
                            :maxFractionDigits="3"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="inPrice" header="단가[원]" style="width: 110px">
                    <template #body="{ data }">
                        <InputNumber
                            v-model="data.inPrice"
                            mode="decimal"
                            :minFractionDigits="0"
                            :maxFractionDigits="2"
                            class="cell-number"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="supplyPrice" header="공급가[원]" style="width: 120px">
                    <template #body="{ data }">
                        <InputNumber
                            :modelValue="calculateAmount(data)"
                            readonly
                            class="cell-number readonly-input"
                            inputClass="text-right"
                        />
                    </template>
                </Column>
                <Column field="expiryDate" header="사용기한" style="width: 100px">
                    <template #body="{ data }">
                        <InputText v-model="data.expiryDate" class="cell-input" />
                    </template>
                </Column>
                <Column field="etc" header="비고" style="width: 180px">
                    <template #body="{ data }">
                        <InputText v-model="data.etc" class="cell-input" />
                    </template>
                </Column>
                <Column header="삭제" frozen style="width: 55px; text-align: center">
                    <template #body="{ index }">
                        <Button icon="pi pi-trash" severity="danger" text rounded @click="removeRow('osp', index)" />
                    </template>
                </Column>

                <template #empty>
                    <div class="empty-message">
                        등록된 원료 외주반출 내역이 없습니다.
                    </div>
                </template>
                <template #footer>
                    <div class="table-summary">
                        <span>합계 : </span>
                        <span>
                            수량:
                            {{ formatNumber(ospTotalQty) }}
                        </span>
                        <span>
                            금액:
                            {{ formatNumber(ospTotalAmount) }}
                        </span>
                    </div>
                </template>
            </DataTable>
        </section>
        <div class="bottom-buttons">
            <Button label="저장" icon="pi pi-save" @click="saveInfo" />
            <Button v-if="isBtn" label="종결" icon="pi pi-save" @click="updateEndYn" />
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
    itemTypeCd : 'M1',
    typeCd : 'M',
    endYn: '',
    dailyId:'',
})

onMounted( async () =>{
    form.dailyId = dialogRef.value?.data?.dailyId ?? null
    form.endYn = dialogRef.value?.data?.endYn ?? 'N'

    if ( form.endYn === 'Y') {
        isBtn.value = false
    }

    const res = await ApiBase.getM1DailyReportInfo(form.dailyId)
   //console.log('M1 일일보고서 정보', res)

   if ( res.dailyReportInfo) {
       Object.assign(form, res.dailyReportInfo)
   }
   inList.value = res.inList || []
   returnList.value = res.returnList || []
   discardList.value = res.discardList || []
   prodList.value = res.prodList || []
   useList.value = res.useList || []
   ospList.value = res.ospList || []
})

const inList = ref([])
const returnList = ref([])
const discardList = ref([])
const prodList = ref([])
const useList = ref([])
const ospList = ref([])

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

const createInRow = () => ({
    dailyDate: !form.dailyId
        ? todayKST()
        : form.dailyDate ?? todayKST(),
    orderDist: inList.value.length + 1,
    itemCd: '',
    itemName: '',
    unit: '',
    qty: 0,
    inPrice: 0,
    etc: '',
})

const createReturnRow = () => ({
    dailyDate: !form.dailyId
        ? todayKST()
        : form.dailyDate ?? todayKST(),
    orderDist: returnList.value.length + 1,
    itemCd: '',
    itemName: '',
    unit: 'kg',
    qty: 0,
    etc: '',
})

const createDiscardRow = () => ({
    dailyDate: !form.dailyId
        ? todayKST()
        : form.dailyDate ?? todayKST(),
    orderDist: discardList.value.length + 1,
    itemCd: '',
    itemName: '',
    unit: 'kg',
    qty: 0,
    etc: '',
})

const createProdRow = () => ({
    dailyDate: !form.dailyId
        ? todayKST()
        : form.dailyDate ?? todayKST(),
    orderDist: prodList.value.length + 1,
    itemCd: '',
    itemName: '',
    productName: '',
    lotNo: '',
    unit: 'kg',
    qty: 0,
    managerName: '',
    etc: '',
})

const createUseRow = () => ({
    dailyDate: !form.dailyId
        ? todayKST()
        : form.dailyDate ?? todayKST(),
    orderDist: useList.value.length + 1,
    itemCd: '',
    itemName: '',
    requiredQuantity: 0,
    inPrice: 0,
    totalPrice: 0,
    etc: '',
})
const createOspRow = () => ({
    dailyDate: !form.dailyId
        ? todayKST()
        : form.dailyDate ?? todayKST(),
    orderDist: ospList.value.length + 1,
    itemCd: '',
    itemName: '',
    spec: '',
    qty: 0,
    inPrice: 0,
    expiryDate: '',
    etc: '',
})

const listMap = {
    in: inList,
    return: returnList,
    discard: discardList,
    prod: prodList,
    use: useList,
    osp: ospList,
}

const addRow = (type) => {
    const rowFactoryMap = {
        in: createInRow,
        return: createReturnRow,
        discard: createDiscardRow,
        prod: createProdRow,
        use: createUseRow,
        osp: createOspRow,
    }

    const targetList = listMap[type]
    const rowFactory = rowFactoryMap[type]

    if (!targetList || !rowFactory) return

    targetList.value.push(rowFactory())
}

const deleteInIds = ref([])
const deleteReturnIds = ref([])
const deleteDiscardIds = ref([])
const deleteProdIds = ref([])
const deleteUseIds = ref([])
const deleteOspIds = ref([])

const deleteIdMap = {
    in: { ids: deleteInIds, idField: 'dailyItemId' },
    return: { ids: deleteReturnIds, idField: 'dailyItemId' },
    discard: { ids: deleteDiscardIds, idField: 'dailyItemId' },
    prod: { ids: deleteProdIds, idField: 'dailyProdId' },
    use: { ids: deleteUseIds, idField: 'dailyItemUseId' },
    osp: { ids: deleteOspIds, idField: 'dailyItemId' },
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

const calculateUseQty = (row) => {
    const requiredQuantity = Number(row.requiredQuantity) || 0
    const inPrice = Number(row.inPrice) || 0

    return requiredQuantity * inPrice
}


/************** 리스트 별 합계******************************************************* */
const inTotalQty = computed(() => {
    return inList.value.reduce(
        (sum, row) => sum + (Number(row.qty) || 0), 0,
    )
})
const inTotalAmount = computed(() => {
    return inList.value.reduce(
        (sum, row) => sum + calculateAmount(row),0,
    )
})

const  returnTotalQty = computed(() => {
    return returnList.value.reduce(
        (sum, row) => sum + (Number(row.qty) || 0), 0,
    )
})
const returnTotalAmount = computed(() => {
    return returnList.value.reduce(
        (sum, row) => sum + calculateAmount(row), 0,
    )
})

const  discardTotalQty = computed(() => {
    return discardList.value.reduce(
        (sum, row) => sum + (Number(row.qty) || 0), 0,
    )
})
const discardTotalAmount = computed(() => {
    return discardList.value.reduce(
        (sum, row) => sum + calculateAmount(row), 0,
    )
})

const prodTotalQty = computed(() => {
    return prodList.value.reduce(
        (sum, row) => sum + (Number(row.qty) || 0), 0,
    )
})
const prodTotalAmount = computed(() => {
    return prodList.value.reduce(
        (sum, row) => sum + calculateAmount(row), 0,
    )
})

const useTotalQty = computed(() => {
    return useList.value.reduce(
        (sum, row) => sum + (Number(row.qty) || 0), 0,
    )
})
const useTotalAmount = computed(() => {
    return useList.value.reduce(
        (sum, row) => sum + calculateUseQty(row), 0,
    )
})

const ospTotalQty = computed(() => {
    return ospList.value.reduce(
        (sum, row) => sum + (Number(row.qty) || 0), 0,
    )
})
const ospTotalAmount = computed(() => {
    return ospList.value.reduce(
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
            inList: inList.value,
            returnList: returnList.value,
            discardList: discardList.value,
            prodList: prodList.value,
            useList: useList.value,
            ospList: ospList.value,
            deleteInIds: deleteInIds.value,
            deleteReturnIds: deleteReturnIds.value,
            deleteDiscardIds: deleteDiscardIds.value,
            deleteProdIds: deleteProdIds.value,
            deleteUseIds: deleteUseIds.value,
            deleteOspIds: deleteOspIds.value,
        }

        //console.log('저장 데이터', params)
        // 실제 API 호출
        await ApiBase.saveDailyReportM1(params)
        vSuccess('저장되었습니다.')
        closeDialog()
    }catch (error) {
        //console.error('저장 중 오류 발생:', error)
        handleApiError(error)
    }
}

const closeDialog = () =>{
    dialogRef.value.close()
}

const reset = () => {
    inList.value = []
    returnList.value = []
    discardList.value = []
    prodList.value = []
    useList.value = []
    ospList.value = []
    deleteInIds.value = []
    deleteReturnIds.value = []
    deleteDiscardIds.value = []
    deleteProdIds.value = []
    deleteUseIds.value = []
    deleteOspIds.value = []
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
