<template>
    <Card style="width: 85rem; height: 50rem;">
         <template #content>
            <div class="w-full overflow-x-auto">
                <div class="w-[800px] max-w-full ml-auto">
                    <table class="approval-table">
                        <tbody>
                        <tr>
                        <th rowspan="3" class="approval-side">결재</th>
                        <th class="col-normal">기안자</th>
                        <th class="col-normal">영업관리</th>
                        <th class="col-normal">생산관리</th>
                        <th class="col-normal">구매부</th>
                        <th class="col-normal">품질관리</th>
                        <th class="col-normal">연구소</th>
                    </tr>
                    <tr>
                        <td class="approval-cell">{{ memberNm }}</td>
                        <td class="approval-cell">{{ approvalInfo.businessUserName }}</td>
                        <td class="approval-cell">{{ approvalInfo.productUserName }}</td>
                        <td class="approval-cell">{{ approvalInfo.purchaseUserName }}</td>
                        <td class="approval-cell">{{ approvalInfo.qcUserName }}</td>
                        <td class="approval-cell">
                        <div class="cell-stack">
                            <span>{{ approvalInfo.labUserName }}</span>

                            <!-- PrimeVue 버튼 -->
                            <Button
                                label="결재자"
                                severity="secondary"
                                @click="openPop"
                            />
                        </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="approval-date">{{ form.draftDate }}</td>
                        <td class="approval-date">결재일자</td>
                        <td class="approval-date">결재일자</td>
                        <td class="approval-date">결재일자</td>
                        <td class="approval-date">결재일자</td>
                        <td class="approval-date">결재일자</td>
                    </tr>
                    </tbody>
                </table>
                </div>
            </div>
            <div class="mt-4">
                <table class="approval-table">
                    <tbody>
                        <tr>
                            <th>문서번호</th>
                            <td>{{form.draftDate}}- {{ form.seq }}</td>
                            <th>처리기한</th>
                            <td>즉시</td>
                        </tr>
                        <tr>
                            <th>보존년한</th>
                            <td>5년</td>
                            <th>기안일자</th>
                            <td>{{form.draftDate}}</td>
                        </tr>
                        <tr>
                            <th>기안부서</th>
                            <td>{{ deptNm }}</td>
                            <th>기안자</th>
                            <td>{{ memberNm }}</td>
                        </tr>
                        <tr>
                            <th>제목</th>
                            <td colspan="3">발주서 및 제품 사양서 검토 요청의 건</td>
                        </tr>
                        <tr>
                            <td colspan="4" style="height: 100px; text-align: center;">
                                발주서 및 제품 사양서 기안하오니 검토하여 주시기 바랍니다.<br /><br />
                                 - 아 래 -
                            </td>
                        </tr>
                        <tr>
                            <th>고객사명</th>
                            <td>
                                <div>
                                    <InputText v-model="form.clientName" class="w-full" />
                                </div>
                            </td>
                            <th>품목</th>
                            <td>
                                <div>
                                    <InputText v-model="form.itemName" class="w-full" />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th>발주수량</th>
                            <td>
                                 <div>
                                    <InputNumber v-model="form.orderQty" class="w-full" />
                                </div>
                            </td>
                            <th>납기일자</th>
                            <td>
                                <div>
                                   <DatePicker v-model="form.dliveryDate" showIcon class="w-full" />
                               </div>
                            </td>
                        </tr>
                        <tr>
                            <th>첨부파일</th>
                            <td colspan="3">
                                    <CommFileUpload
                                        v-model="attachFile"
                                        :download-url="`/api/lab/material/file/download`"
                                        :accept="'.pdf,.xlsx,.xls,.png,.jpg,.jpeg'"
                                        :multiple="true"
                                        @error="(msg) => console.error(msg)"
                                    />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </Card>
    <!-- Buttons -->
    <div class="flex gap-2 justify-end pt-3">
        <Button label="저장" severity="secondary" @click="saveInfo"></Button>
        <Button label="닫기" @click="closeDialog"></Button>
    </div>


</template>

<script setup>
import CommFileUpload from '@/components/CommFileUpload.vue'
import { useAuthStore } from '@/stores/auth'
import { toDate } from '@/util/common'
import UserListPop from '@/views/system/user/UserListPop.vue'
import { DatePicker, useDialog } from 'primevue'
import Button from 'primevue/button'
import { inject, reactive, ref } from 'vue'

const { deptNm, userId, memberNm} = useAuthStore()
const dialog = useDialog()
const dialogRef = inject('dialogRef')
const attachFile = ref([])
const form = reactive({
    draftDate: toDate(),
    seq: '',
    customerName: '',
    itemName: '',
    orderQty: 0,
    dueDate: '',
    draftUserName: memberNm,
    draftDept: deptNm,
    draftUserId: userId,
    statusType: 'ING',
})

const approvalInfo = {
  businessUserName: '영업관리',
  businessUserId: '',
  productUserName: '생산관리',
  productUserId: '',
  purchaseUserName: '구매부',
  purchaseUserId: '',
  qcUserName: '품질관리',
  qcUserId: '',
  labUserName: '',
  labUserId: '',
}

const saveInfo = () =>{

}

const openPop = () =>{
    dialog.open(UserListPop, {
        props:{
            header:'사용자 목록',
            modal: true,
            draggable: false,
            maximizable: false,
        },
        onClose:(event) =>{
            if ( event.data) {
                approvalInfo.labUserId = event.data.userId
                approvalInfo.labUserName = event.data.memberNm
            }
        }
    })
}

const closeDialog = () =>{
    dialogRef.value.close()
}
</script>

<style scoped>
.approval-table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  font-size: 15px;
}

.approval-table th,
.approval-table td {
  border: 1px solid #ccc;
  padding: 4px 4px;
}

/* 결재 */
.approval-side {
  width: 16px;
  writing-mode: vertical-rl;
  text-orientation: upright;
  letter-spacing: 15px;
  vertical-align: middle;
}

/* 나머지 */
.col-normal {
  width: 60px;
}
.approval-head {
  height: 25px;
  text-align: center;
  background: #fafafa;
  font-weight: 600;
}
.approval-cell {
  height: 70px;
  text-align: center;
  vertical-align: middle;
}

.approval-date {
  height: 24px;
  text-align: center;
  vertical-align: middle;
  color: #555;
}

.cell-stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px; /* 6 → 4 */
}

</style>
