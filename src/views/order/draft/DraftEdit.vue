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

                            <td v-for="cd in approvalCdList" :key="cd" class="approval-date">
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
                                <InputNumber v-model="form.orderQty" class="w-full" :min="0" />
                            </td>

                            <th class="cell-th">납기일자</th>
                            <td>
                                <DatePicker
                                    v-model="form.dueDate"
                                    showIcon
                                    class="w-full"
                                    dateFormat="yy-mm-dd"
                                />
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
                                    @remove="removeFile"
                                    @error="(msg) => console.error(msg)"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="dialog-footer flex gap-2 justify-end pt-3">
                <Button label="저장" class="p-button-secondary" @click="saveInfo" />
                <Button label="닫기" outlined class="ml-2" @click="closeDialog" />
            </div>
        </template>
    </Card>
</template>

<script setup>
import { ApiOrder } from '@/api/apiOrders'
import CommFileUpload from '@/components/CommFileUpload.vue'
import { useAlertStore } from '@/stores/alert'
import { useAuthStore } from '@/stores/auth'
import { formatDate } from '@/util/common'
import { handleApiError } from '@/util/errorHandler'
import Button from 'primevue/button'
import Card from 'primevue/card'
import DatePicker from 'primevue/datepicker'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import { inject, onMounted, reactive, ref } from 'vue'

const { vSuccess, vWarning } = useAlertStore()
const { userId } = useAuthStore()

const dialogRef = inject('dialogRef')

const attachFile = ref([])
const deleteFileList = ref([])

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
    userId: userId,
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
            item.approvalDate ||
            item.approval_date ||
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
        drafter.approvalUserName = form.drafter || form.draftUserName || form.drafter || ''
        drafter.draftApprovalDate = form.draftDate ? formatDate(form.draftDate) : ''
    }
}

const initServerFiles = (list = []) => {
    return list.map(file => ({
        ...file,
        attachFileId: file.attachFileId || file.attach_file_id || form.attachFileId,
        fileSeq: file.fileSeq || file.file_seq || file.seq,
        flag: 'S',
    }))
}

const removeFile = (file, index) => {
    if (file?.flag === 'S') {
        deleteFileList.value.push({
            attachFileId: file.attachFileId,
            fileSeq: file.fileSeq,
        })
    }

    if (index !== undefined && index !== null) {
        attachFile.value.splice(index, 1)
        return
    }

    attachFile.value = attachFile.value.filter(item => item !== file)
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
        draftApprovalDate: item.draftApprovalDate
            ? formatDate(item.draftApprovalDate)
            : '',
    }))

    const draftRequest = {
        draftInfo: draftVo,
        draftApprovalList,
        deleteFileList: deleteFileList.value,
    }

    formData.append(
        'draftRequest',
        new Blob([JSON.stringify(draftRequest)], {
            type: 'application/json'
        })
    )

    attachFile.value.forEach(item => {
        const file = item.file

        if (file instanceof File) {
            formData.append('newFiles', file)
        }
    })

    try {
        const res = await ApiOrder.saveDraftInfo(formData)
        vSuccess('수정되었습니다.')
        dialogRef.value.close(form.draftId)
    } catch (err) {
        handleApiError(err)
    }
}

const closeDialog = () => {
    dialogRef.value.close()
}

onMounted(async () => {
    const popupData = dialogRef.value.data

    form.draftId = typeof popupData === 'object'
        ? popupData.draftId
        : popupData

    if (!form.draftId) {
        vWarning('문서 ID가 없습니다.')
        return
    }

    const res = await ApiOrder.getDraftInfo(form.draftId)
    const data = res.data || res

    Object.assign(form, data.draftInfo || {})

    setApprovalList(data.draftApprovalList || [])

    if (data.attachFileInfo !== null && data.attachFileInfo !== undefined) {
        attachFile.value = initServerFiles(data.attachFileInfo)
    } else {
        attachFile.value = []
    }
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
