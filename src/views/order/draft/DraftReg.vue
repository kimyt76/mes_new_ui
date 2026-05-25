<template>
    <Card style="width: 85rem;">
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
                                <td class="approval-cell">{{ getApproval('DRAFTER')?.approvalUserName }}</td>
                                <td class="approval-cell">{{ getApproval('BUSINESS')?.approvalUserName }}</td>
                                <td class="approval-cell">{{ getApproval('PRODUCT')?.approvalUserName }}</td>
                                <td class="approval-cell">{{ getApproval('PURCHASE')?.approvalUserName }}</td>
                                <td class="approval-cell">{{ getApproval('QC')?.approvalUserName }}</td>
                                <td class="approval-cell">
                                    <div class="cell-stack">
                                        <span>{{ getApproval('LAB')?.approvalUserName }}</span>
                                        <Button
                                            label="결재자"
                                            severity="secondary"
                                            @click="openPop"
                                        />
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td class="approval-date"> {{ getApproval('DRAFTER')?.draftApprovalDate }}</td>

                                <td class="approval-date">
                                    <span v-if="!getApproval('BUSINESS')?.draftApprovalDate">결재일자</span>
                                    <span v-else>{{ getApproval('BUSINESS')?.draftApprovalDate }}</span>
                                </td>

                                <td class="approval-date">
                                    <span v-if="!getApproval('PRODUCT')?.draftApprovalDate">결재일자</span>
                                    <span v-else>{{ getApproval('PRODUCT')?.draftApprovalDate }}</span>
                                </td>

                                <td class="approval-date">
                                    <span v-if="!getApproval('PURCHASE')?.draftApprovalDate">결재일자</span>
                                    <span v-else>{{ getApproval('PURCHASE')?.draftApprovalDate }}</span>
                                </td>

                                <td class="approval-date">
                                    <span v-if="!getApproval('QC')?.draftApprovalDate">결재일자</span>
                                    <span v-else>{{ getApproval('QC')?.draftApprovalDate }}</span>
                                </td>

                                <td class="approval-date">
                                    <span v-if="!getApproval('LAB')?.draftApprovalDate">결재일자</span>
                                    <span v-else>{{ getApproval('LAB')?.draftApprovalDate }}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="mt-4">
                <table class="approval-table">
                    <colgroup>
                        <col style="width: 20%;" />
                        <col style="width: 30%;" />
                        <col style="width: 20%;" />
                        <col style="width: 30%;" />
                    </colgroup>

                    <tbody>
                        <tr>
                            <th class="cell-th">문서번호</th>
                            <td>{{ form.draftDate }}-{{ form.seq }}</td>
                            <th class="cell-th">처리기한</th>
                            <td>즉시</td>
                        </tr>

                        <tr>
                            <th class="cell-th">보존년한</th>
                            <td>5년</td>
                            <th class="cell-th">기안일자</th>
                            <td>{{ form.draftDate }}</td>
                        </tr>

                        <tr>
                            <th class="cell-th">기안부서</th>
                            <td>{{ deptNm }}</td>
                            <th class="cell-th">기안자</th>
                            <td>{{ memberNm }}</td>
                        </tr>

                        <tr>
                            <th class="cell-th">제목</th>
                            <td colspan="3">
                                {{ form.clientName }} &nbsp;&nbsp;
                                {{ form.itemName }} &nbsp;&nbsp;
                                발주서 및 제품 사양서 검토 요청의 건
                            </td>
                        </tr>

                        <tr>
                            <td colspan="4" style="height: 100px; text-align: center;">
                                {{ form.clientName }} &nbsp;&nbsp;
                                {{ form.itemName }} &nbsp;&nbsp;
                                발주서 및 제품 사양서 기안하오니 검토하여 주시기 바랍니다.
                                <br /><br />
                                - 아 래 -
                            </td>
                        </tr>

                        <tr>
                            <th class="cell-th">고객사명</th>
                            <td>
                                <InputText v-model="form.clientName" class="w-full" />
                            </td>

                            <th class="cell-th">품목</th>
                            <td>
                                <InputText v-model="form.itemName" class="w-full" />
                            </td>
                        </tr>

                        <tr>
                            <th class="cell-th">발주수량</th>
                            <td>
                                <InputNumber v-model="form.orderQty" class="w-full" />
                            </td>

                            <th class="cell-th">납기일자</th>
                            <td>
                                <DatePicker v-model="form.dueDate" showIcon class="w-full" />
                            </td>
                        </tr>

                        <tr>
                            <th class="cell-th">첨부파일</th>
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

    <div class="flex gap-2 justify-end pt-3">
        <Button label="저장" class="p-button-secondary" @click="saveInfo" />
        <Button label="닫기" outlined class="ml-2" @click="closeDialog" />
    </div>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon'
import { ApiOrder } from '@/api/apiOrders'
import CommFileUpload from '@/components/CommFileUpload.vue'
import { useAlertStore } from '@/stores/alert'
import { useAuthStore } from '@/stores/auth'
import { formatDate, todayKST } from '@/util/common'
import { handleApiError } from '@/util/errorHandler'
import UserListPop from '@/views/system/user/UserListPop.vue'
import { DatePicker, useDialog } from 'primevue'
import Button from 'primevue/button'
import { inject, onMounted, reactive, ref } from 'vue'

const { vSuccess, vWarning } = useAlertStore()
const { deptNm, userId, memberNm } = useAuthStore()

const dialog = useDialog()
const dialogRef = inject('dialogRef')

const attachFile = ref([])

const form = reactive({
    draftDate: todayKST(),
    seq: '',
    clientName: '',
    itemName: '',
    orderQty: 0,
    dueDate: '',
    draftUserName: memberNm,
    draftDept: deptNm,
    drafter: userId,
    endYn: 'N',
    draftId: '',
    userId: userId,
})

const approvalList = ref([
    {
        approvalCd: 'DRAFTER',
        approvalUserId: userId,
        approvalUserName: memberNm,
        draftApprovalDate: todayKST(),
    },
    {
        approvalCd: 'BUSINESS',
        approvalUserId: '원신호',
        approvalUserName: '원신호',
        draftApprovalDate: '',
        boardTxt: ''
    },
    {
        approvalCd: 'PRODUCT',
        approvalUserId: '박승훈',
        approvalUserName: '박승훈',
        draftApprovalDate: '',
        boardTxt: ''
    },
    {
        approvalCd: 'PURCHASE',
        approvalUserId: '김승남',
        approvalUserName: '김승남',
        draftApprovalDate: '',
        boardTxt: ''
    },
    {
        approvalCd: 'QC',
        approvalUserId: '김상훈',
        approvalUserName: '김상훈',
        draftApprovalDate: '',
        boardTxt: ''
    },
    {
        approvalCd: 'LAB',
        approvalUserId: '',
        approvalUserName: '',
        draftApprovalDate: '',
        boardTxt: ''
    }
])

const getApproval = (approvalCd) => {
    return approvalList.value.find(item => item.approvalCd === approvalCd)
}

const valid = () => {
    if (!form.clientName?.trim()) {
        vWarning('고객사명을 입력하세요.')
        return false
    }

    if (!form.itemName?.trim()) {
        vWarning('품목을 입력하세요.')
        return false
    }

    if (!form.orderQty || form.orderQty <= 0) {
        vWarning('발주수량을 입력하세요.')
        return false
    }

    if (!form.dueDate) {
        vWarning('납기일자를 선택하세요.')
        return false
    }

    const labApproval = getApproval('LAB')

    if (!labApproval?.approvalUserId) {
        vWarning('연구소 결재자를 선택하세요.')
        return false
    }

    if (attachFile.value.length === 0) {
        vWarning('첨부파일을 등록하세요.')
        return false
    }

    return true
}

const saveInfo = async () => {
    if (!valid()) return

    const formData = new FormData()

    const draftVo = {
        ...form,
        draftDate: formatDate(form.draftDate),
        dueDate: formatDate(form.dueDate),
    }

    const draftApprovalList = approvalList.value.map(item => ({
        ...item,
        draftApprovalDate: formatDate(item.draftApprovalDate)
    }))


    const draftRequest = {
        draftInfo: draftVo,
        draftApprovalList: draftApprovalList,
    }

    const json = JSON.stringify(draftRequest)

    console.log('전송 JSON', json)

    formData.append(
        'draftRequest',
        new Blob(
            [json],
            { type: 'application/json' }
        )
    )

    attachFile.value.forEach((item) => {
        const file = item.file

        if (file instanceof File) {
            formData.append('newFiles', file)
        }
    })


    try {
        const res = await ApiOrder.saveDraftInfo(formData)
        console.log('저장 결과', res)
        form.draftId = res.data
        vSuccess(res.message)

        dialogRef.value.close(form.draftId)
    } catch (err) {
        handleApiError(err)
    }
}

const openPop = () => {
    dialog.open(UserListPop, {
        props: {
            header: '사용자 목록',
            modal: true,
            draggable: false,
            maximizable: false,
        },
        onClose: (event) => {
            if (event.data) {
                const labApproval = getApproval('LAB')

                labApproval.approvalUserId = event.data.userId
                labApproval.approvalUserName = event.data.memberNm
                labApproval.draftApprovalDate = todayKST()
            }
        }
    })
}

onMounted(async () => {
    form.seq = await ApiCommon.getNextSeq(
        'tb_draft_mst',
        'draft_date',
        form.draftDate
    )
})

const closeDialog = () => {
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

.approval-side {
    width: 16px;
    writing-mode: vertical-rl;
    text-orientation: upright;
    letter-spacing: 15px;
    vertical-align: middle;
}

.col-normal {
    width: 60px;
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
    gap: 4px;
}

.cell-th {
    background-color: #eeeeee;
}
</style>
