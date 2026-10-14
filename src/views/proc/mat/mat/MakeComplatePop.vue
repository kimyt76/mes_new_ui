
<template>
    <div class="complete-wrap">

        <div class="complete-guide">
            <i class="pi pi-info-circle"></i>
            <span>
                제조 작업을 완료하기 전에 실제 제조량을 확인해주세요.
            </span>
        </div>

        <div class="qty-grid">

            <div class="qty-field">
                <label class="field-label">지시 제조량</label>
                <InputNumber
                    v-model="form.orderQty"
                    class="w-full"
                    inputClass="w-full"
                    suffix=" kg"
                    :minFractionDigits="0"
                    :maxFractionDigits="6"
                    :useGrouping="true"
                    readonly
                    fluid
                />
            </div>

            <div class="qty-field">
                <label class="field-label required">실제 제조량</label>
                <InputNumber
                    v-model="form.prodQty"
                    class="w-full"
                    inputClass="w-full"
                    suffix=" kg"
                    :min="0"
                    :minFractionDigits="0"
                    :maxFractionDigits="6"
                    :useGrouping="true"
                    fluid
                />
            </div>
        </div>

        <div class="button-area">
            <Button
                label="닫기"
                icon="pi pi-times"
                severity="secondary"
                outlined
                @click="closeDialog"
            />

            <Button
                label="제조완료"
                icon="pi pi-check"
                severity="success"
                :loading="saving"
                @click="confirmComplete"
            />
        </div>

    </div>
</template>

<script setup>
import { ApiProc } from '@/api/apiProc'
import { useAlertStore } from '@/stores/alert'
import { handleApiError } from '@/util/errorHandler'
import { useConfirm } from 'primevue/useconfirm'
import { inject, onMounted, reactive, ref } from 'vue'

const dialogRef = inject('dialogRef')
const confirm = useConfirm()
const { vSuccess, vInfo } = useAlertStore()

const saving = ref(false)

const form = reactive({
    workProcId: '',
    workBatchId: '',
    procCd: 'PRC002',
    testNo: '',
    prodQty: 0,
    orderQty: 0
})

onMounted(() => {
    const data = dialogRef?.value?.data?.form

    if (data) {
        Object.assign(form, data)

        form.orderQty = Number(data.orderQty || 0)
        form.prodQty = Number(data.prodQty || 0)
    }
})

const confirmComplete = async () => {
    const qty = Number(form.prodQty)

    if (!Number.isFinite(qty) || qty <= 0) {
        vInfo('실제 제조량을 입력해주세요.')
        return
    }

    if (saving.value) return

    saving.value = true

    try {
        const params = {
            procStatus: '22',
            batchStatus: '22',
            workProcId: form.workProcId,
            workBatchId: form.workBatchId,
            procCd: form.procCd,
            testNo: form.testNo,
            prodQty: Number(form.prodQty)
        }

        await ApiProc.completeMake(params)

        vSuccess('정상적으로 제조완료 처리하였습니다!')

        dialogRef.value?.close({
            completed: true
        })

    } catch (err) {
        handleApiError(err)
    } finally {
        saving.value = false
    }


    // confirm.require({
    //     header: '제조완료 확인',
    //     message: '제조를 완료하고 제조출고를 진행하시겠습니까?',
    //     icon: 'pi pi-exclamation-triangle',
    //     acceptLabel: '제조완료',
    //     rejectLabel: '취소',
    //     accept: async () => {
    //       await completeMake()
    //     }
    // })
}

// const completeMake = async () => {
//     if (saving.value) return

//     saving.value = true

//     try {
//         const params = {
//             procStatus: '22',
//             batchStatus: '22',
//             workProcId: form.workProcId,
//             workBatchId: form.workBatchId,
//             procCd: form.procCd,
//             testNo: form.testNo,
//             prodQty: Number(form.prodQty)
//         }

//         await ApiProc.completeMake(params)

//         vSuccess('정상적으로 제조완료 처리하였습니다!')

//         dialogRef.value?.close({
//             completed: true
//         })

//     } catch (err) {
//         handleApiError(err)
//     } finally {
//         saving.value = false
//     }
// }

const closeDialog = () => {
    dialogRef.value?.close()
}
</script>

<style scoped>
.complete-wrap {
    padding: 8px 4px 4px;
    min-width: 0;
}

.complete-guide {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 14px;
    margin-bottom: 22px;
    background: #eff6ff;
    border-radius: 8px;
    color: #1d4ed8;
    font-size: 13px;
}

.complete-guide i {
    font-size: 16px;
}

.qty-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.qty-field {
    min-width: 0;
}

.field-label {
    display: block;
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: 600;
    color: #475569;
}

.field-label.required::after {
    content: ' *';
    color: #ef4444;
}

.complete-notice {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 22px;
    padding: 12px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    color: #64748b;
    font-size: 12px;
}

.complete-notice i {
    color: #f59e0b;
    font-size: 15px;
}

.button-area {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #e2e8f0;
}

@media (max-width: 480px) {
    .qty-grid {
        grid-template-columns: 1fr;
    }
}
</style>
