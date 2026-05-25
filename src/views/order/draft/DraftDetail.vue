<template>
    <Card style="width: 85rem;">
        <template #content>
            <div class="approval-wrapper">
                <table class="approval-table approval-sign-table">
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
                            <td class="approval-cell">{{ getApproval('LAB')?.approvalUserName }}</td>
                        </tr>

                        <tr>
                            <td class="approval-date">
                                {{ getApproval('DRAFTER')?.draftApprovalDate || '결재일자' }}
                            </td>

                            <td
                                v-for="cd in approvalCdList"
                                :key="cd"
                                class="approval-date"
                            >
                                {{ getApproval(cd)?.draftApprovalDate || '결재일자' }}
                            </td>
                        </tr>
                    </tbody>
                </table>
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
                            <td>{{ form.draftDept }}</td>
                            <th class="cell-th">기안자</th>
                            <td>{{ form.drafter }}</td>
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
                            <td colspan="4" class="content-cell">
                                {{ form.clientName }} &nbsp;&nbsp;
                                {{ form.itemName }} &nbsp;&nbsp;
                                발주서 및 제품 사양서 기안하오니 검토하여 주시기 바랍니다.
                                <br /><br />
                                - 아 래 -
                            </td>
                        </tr>

                        <tr>
                            <th class="cell-th">고객사명</th>
                            <td>{{ form.clientName }}</td>
                            <th class="cell-th">품목</th>
                            <td>{{ form.itemName }}</td>
                        </tr>

                        <tr>
                            <th class="cell-th">발주수량</th>
                            <td>{{ form.orderQty }}</td>
                            <th class="cell-th">납기일자</th>
                            <td>{{ form.dueDate }}</td>
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

                        <tr
                            v-for="item in approvalList.filter(x => x.approvalCd !== 'DRAFTER')"
                            :key="item.approvalCd"
                        >
                            <th class="cell-th">
                                의견({{ getApprovalLabel(item.approvalCd) }})
                            </th>
                            <td colspan="3">
                                <Textarea
                                    v-model="item.boardTxt"
                                    :readonly="item.approvalUserId !== userId"
                                    rows="2"
                                    style="width: 100%;"
                                    placeholder="의견을 입력하세요."
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="dialog-footer flex gap-2 justify-end pt-3">
                <Button
                    v-if="isEditBtn"
                    label="수정"
                    outlined
                    class="ml-2"
                    @click="updatePop"
                />
                <Button
                    v-if="isSaveBtn"
                    label="저장"
                    class="p-button-secondary"
                    @click="saveInfo"
                />
                <Button
                    label="닫기"
                    outlined
                    class="ml-2"
                    @click="closeDialog"
                />
            </div>
        </template>
    </Card>
</template>

<script setup>
import { ApiOrder } from '@/api/apiOrders'
import CommFileUpload from '@/components/CommFileUpload.vue'
import { useAlertStore } from '@/stores/alert'
import { useAuthStore } from '@/stores/auth'
import { formatDate, todayKST } from '@/util/common'
import { handleApiError } from '@/util/errorHandler'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Textarea from 'primevue/textarea'
import { inject, onMounted, reactive, ref } from 'vue'

const { vSuccess, vWarning } = useAlertStore()
const { userId } = useAuthStore()

const dialogRef = inject('dialogRef')

const attachFile = ref([])
const isEditBtn = ref(false)
const isSaveBtn = ref(false)
const myApprovalCd = ref('')

const approvalCdList = ['BUSINESS', 'PRODUCT', 'PURCHASE', 'QC', 'LAB']

const form = reactive({
    draftId: '',
    draftDate: '',
    seq: '',
    draftDept: '',
    drafter: '',
    clientName: '',
    itemName: '',
    orderQty: 0,
    dueDate: '',
    attachFileId: '',
    endYn: '',
})

const approvalList = ref([
    { approvalCd: 'DRAFTER', approvalUserId: '', approvalUserName: '', draftApprovalDate: '', boardTxt: '' },
    { approvalCd: 'BUSINESS', approvalUserId: '', approvalUserName: '', draftApprovalDate: '', boardTxt: '' },
    { approvalCd: 'PRODUCT', approvalUserId: '', approvalUserName: '', draftApprovalDate: '', boardTxt: '' },
    { approvalCd: 'PURCHASE', approvalUserId: '', approvalUserName: '', draftApprovalDate: '', boardTxt: '' },
    { approvalCd: 'QC', approvalUserId: '', approvalUserName: '', draftApprovalDate: '', boardTxt: '' },
    { approvalCd: 'LAB', approvalUserId: '', approvalUserName: '', draftApprovalDate: '', boardTxt: '' },
])

const getApproval = (approvalCd) => {
    return approvalList.value.find(item => item.approvalCd === approvalCd)
}

const getApprovalLabel = (approvalCd) => {
    const labels = {
        DRAFTER: '기안자',
        BUSINESS: '영업관리',
        PRODUCT: '생산관리',
        PURCHASE: '구매부',
        QC: '품질관리',
        LAB: '연구소',
    }

    return labels[approvalCd] || ''
}

const normalizeApproval = (item = {}) => {
    return {
        approvalCd: item.approvalCd || item.approval_cd || '',
        approvalUserId: item.approvalUserId || item.approval_user_id || '',
        approvalUserName:
            item.approvalUserName ||
            item.approval_user_name ||
            item.memberNm ||
            item.member_nm ||
            item.userName ||
            item.user_name ||
            '',
        draftApprovalDate:
            item.draftApprovalDate ||
            item.draft_approval_date ||
            '',
        boardTxt: item.boardTxt || item.board_txt || '',
    }
}

const setApprovalList = (serverList = []) => {
    serverList.forEach(item => {
        const serverItem = normalizeApproval(item)
        const target = getApproval(serverItem.approvalCd)

        if (target) {
            Object.assign(target, {
                ...target,
                ...serverItem,
                draftApprovalDate: serverItem.draftApprovalDate
                    ? formatDate(serverItem.draftApprovalDate)
                    : ''
            })
        }
    })

    const drafter = getApproval('DRAFTER')

    if (drafter && !drafter.approvalUserName) {
        drafter.approvalUserId = form.drafter || form.draftUserId || ''
        drafter.approvalUserName = form.drafter || form.draftUserName || ''
        drafter.draftApprovalDate = form.draftDate
            ? formatDate(form.draftDate)
            : ''
    }
}

const setMyApproval = () => {
    const myApproval = approvalList.value.find(
        item => item.approvalUserId === userId
    )

    isEditBtn.value = false
    isSaveBtn.value = false
    myApprovalCd.value = ''

    if (!myApproval) {
        return
    }

    myApprovalCd.value = myApproval.approvalCd

    if (!myApproval.draftApprovalDate) {
        myApproval.draftApprovalDate = todayKST()
    }

    isSaveBtn.value = true

    if (myApproval.approvalCd === 'DRAFTER') {
        isEditBtn.value = true
    }
}

const saveInfo = async () => {
    const myApproval = getApproval(myApprovalCd.value)

    if (!myApproval) {
        vWarning('결재 권한이 없습니다.')
        return
    }

    if (myApproval.approvalCd !== 'DRAFTER' && !myApproval.boardTxt?.trim()) {
        vWarning('의견을 입력하세요.')
        return
    }

    const params = {
        draftId: form.draftId,
        approvalCd: myApproval.approvalCd,
        approvalUserId: userId,
        draftApprovalDate: formatDate(myApproval.draftApprovalDate || todayKST()),
        boardTxt: myApproval.boardTxt || '',
    }

    try {
        const res = await ApiOrder.saveApprovalComment(params)

        vSuccess(res.data?.message || res.message || '저장되었습니다.')
        dialogRef.value.close(true)
    } catch (err) {
        handleApiError(err)
    }
}

const updatePop = () => {
    dialogRef.value.close({
        mode: 'edit',
        draftId: form.draftId,
    })
}
const initServerFiles = (list) => {
    return (list || []).map(file => ({
        ...file,
        flag: 'S'
    }))
}

const closeDialog = () => {
    dialogRef.value.close()
}

onMounted(async () => {
    form.draftId = dialogRef.value.data

    const res = await ApiOrder.getDraftInfo(form.draftId)
    const data = res.data || res

    Object.assign(form, data.draftInfo || {})
    setApprovalList(data.draftApprovalList || [])

    if (data.attachFileInfo !== null && data.attachFileInfo !== undefined) {
        attachFile.value = initServerFiles(data.attachFileInfo)
    } else {
        attachFile.value = []
    }

    setMyApproval()
})
</script>

<style scoped>
.approval-wrapper {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    overflow-x: auto;
}

.approval-table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    font-size: 15px;
}

.approval-sign-table {
    width: 800px;
    max-width: 100%;
}

.approval-table th,
.approval-table td {
    border: 1px solid #ccc;
    padding: 4px;
}

.approval-side {
    width: 20px;
    writing-mode: vertical-rl;
    text-orientation: upright;
    letter-spacing: 8px;
    vertical-align: middle;
    text-align: center;
}

.col-normal {
    width: 90px;
    text-align: center;
}

.approval-cell {
    height: 70px;
    text-align: center;
    vertical-align: middle;
}

.approval-date {
    height: 36px;
    text-align: center;
    vertical-align: middle;
    color: #555;
}

.cell-th {
    background-color: #eeeeee;
    text-align: center;
}

.content-cell {
    height: 100px;
    text-align: center;
    vertical-align: middle;
}

.dialog-footer {
    position: sticky;
    bottom: 0;
    background: white;
    padding: 12px 0;
    z-index: 10;
}

:deep(.p-card-body) {
    padding-bottom: 0;
}
</style>
