<template>
    <div class="p-3">
        <div class="grid">
            <!-- 비고 -->
            <div class="col-12">
                <FloatLabel variant="on">
                    <Textarea
                        id="etc"
                        v-model="form.etc"
                        rows="4"
                        class="w-full"
                        style="resize: none;"
                        autoResize
                    />
                    <label for="etc">비고</label>
                </FloatLabel>
            </div>

            <!-- 특이사항 -->
            <div class="col-12 mt-2">
                <FloatLabel variant="on">
                    <Textarea
                        id="memo"
                        v-model="form.memo"
                        rows="4"
                        class="w-full"
                        style="resize: none;"
                        autoResize
                    />
                    <label for="memo">특이사항</label>
                </FloatLabel>
            </div>
        </div>

        <!-- 버튼 -->
        <div class="flex justify-content-end gap-2 mt-3">
            <Button
                label="저장"
                icon="pi pi-save"
                :loading="isSaving"
                :disabled="isSaving || isLoading"
                @click="saveProcMemo"
            />
            <Button
                label="닫기"
                icon="pi pi-times"
                severity="secondary"
                outlined
                :disabled="isSaving"
                @click="closeDialog"
            />
        </div>
    </div>
</template>

<script setup>
import { ApiProc } from '@/api/apiProc'
import { useAlertStore } from '@/stores/alert'
import { handleApiError } from '@/util/errorHandler'
import { inject, onMounted, reactive, ref } from 'vue'

const { vSuccess, vWarning, vInfo} = useAlertStore()
const dialogRef = inject('dialogRef')

const isSaving = ref(false)
const isLoading = ref(false)

const form = reactive({
    workProcId: null,
    etc: '',
    memo: '',
})

// 조회
const loadProcMemo = async () => {
    console.log('form.workProcId',  form.workProcId)
    if (!form.workProcId) {
        vWarning('작업공정 정보가 없습니다.')
        return
    }

    isLoading.value = true

    try {
        const data = await ApiProc.getProcMemo(form.workProcId)

        form.etc = data?.etc ?? ''
        form.memo = data?.memo ?? ''

    } catch (err) {
        handleApiError(err)
    } finally {
        isLoading.value = false
    }
}

// 저장
const saveProcMemo = async () => {
    if (isSaving.value || isLoading.value) return

    if (!form.workProcId) {
        return vWarning('작업공정 정보가 없습니다.')
    }

    isSaving.value = true

    try {
        const params = {
            workProcId: form.workProcId,
            etc: form.etc,
            memo: form.memo,
        }

        await ApiProc.updateProcMemo(params)

        vSuccess('저장되었습니다.')

        dialogRef.value.close({
            saved: true,
        })

    } catch (err) {
        handleApiError(err)
    } finally {
        isSaving.value = false
    }
}

// 닫기
const closeDialog = () => {
    dialogRef.value.close()
}

onMounted(async () => {
    form.workProcId = dialogRef.value?.data?.workProcId

    await loadProcMemo()
})
</script>
