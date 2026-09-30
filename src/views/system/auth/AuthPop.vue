<template>
    <div class="auth-copy-wrap">
        <div class="auth-copy-title">
            <i class="pi pi-copy"></i>
            <span>권한복사</span>
        </div>
        <div class="auth-copy-desc">
            복사 원본자의 메뉴 권한을 대상자에게 동일하게 복사합니다.
        </div>
        <div class="auth-copy-box">
            <!-- 원본자 -->
            <div class="user-field">
                <label class="field-title">
                    복사 원본자
                </label>
                <IconField iconPosition="right">
                    <InputText v-model="form.srcMemberNm" readonly class="user-input" />
                    <InputIcon class="pi pi-search cursor-pointer" @click="openPop('S')" />
                </IconField>
            </div>
            <!-- 화살표 -->
            <div class="arrow-area">
                <i class="pi pi-arrow-right"></i>
            </div>
            <!-- 대상자 -->
            <div class="user-field">
                <label class="field-title">
                    복사 대상자
                </label>
                <IconField iconPosition="right">
                    <InputText v-model="form.tarMemberNm" readonly class="user-input" />
                    <InputIcon class="pi pi-search cursor-pointer" @click="openPop('T')" />
                </IconField>
            </div>

        </div>

        <div class="button-area">

            <Button
                label="권한복사"
                icon="pi pi-copy"
                severity="success"
                @click="authCopy"
            />

            <Button
                label="닫기"
                outlined
                severity="secondary"
                @click="closeDialog"
            />

        </div>

    </div>
</template>


<script setup>
import { ApiSystem } from '@/api/apiSystem'
import { useAlertStore } from '@/stores/alert'
import { isEmpty } from '@/util/common'
import { handleApiError } from '@/util/errorHandler'
import { useDialog } from 'primevue'
import { inject, onMounted, reactive } from 'vue'
import UserListPop from '../user/UserListPop.vue'

const { vSuccess, vWarning } = useAlertStore()

const dialog = useDialog()
const dialogRef = inject('dialogRef')

const form = reactive({
    srcMemberNm: '',
    srcUserId: '',
    tarMemberNm: '',
    tarUserId: '',
})

/**
 * 사용자 조회 팝업
 */
const openPop = (type) => {
    dialog.open(UserListPop, {
        props: {
            header: '사용자 조회',
            modal: true,
            draggable: false
        },
        onClose: (event) => {
            if (!event?.data) return
            if (type === 'T') {
                form.tarMemberNm = event.data.memberNm
                form.tarUserId = event.data.userId
            } else {
                form.srcMemberNm = event.data.memberNm
                form.srcUserId = event.data.userId
            }
        }
    })
}

/**
 * 권한 복사
 */
const authCopy = async () => {
    if (isEmpty(form.srcUserId)) {
        return vWarning('복사 원본자를 선택하세요.')
    }
    if (isEmpty(form.tarUserId)) {
        return vWarning('복사 대상자를 선택하세요.')
    }
    if (form.srcUserId === form.tarUserId) {
        return vWarning('원본자와 대상자는 같을 수 없습니다.')
    }

    try {
        const params = {
            srcUserId: form.srcUserId,
            tarUserId: form.tarUserId
        }

        await ApiSystem.copyMenuAuthInfo(params)

        vSuccess('복사가 정상적으로 완료되었습니다.')

        dialogRef.value.close({
            success: true
        })
    } catch (err) {
        handleApiError(err)
    }
}

/**
 * 초기값
 */
onMounted(() => {
    if (dialogRef.value?.data) {
        form.srcMemberNm = dialogRef.value.data.srcMemberNm ?? ''
        form.srcUserId = dialogRef.value.data.srcUserId ?? ''
    }
})

/**
 * 닫기
 */
const closeDialog = () => {
    dialogRef.value.close()
}
</script>
<style lang="scss" scoped>
.auth-copy-wrap {
    width: 100%;
    padding: 8px 6px 4px;
}
/* 제목 */
.auth-copy-title {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 8px;
    font-size: 16px;
    font-weight: 700;
    color: #374151;
    i {
        font-size: 15px;
        color: #10b981;
    }
}

/* 설명 */
.auth-copy-desc {
    margin-bottom: 18px;
    padding: 10px 12px;
    background: #f8fafc;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 13px;
    color: #6b7280;
}

/* 사용자 선택 영역 */
.auth-copy-box {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 14px;
    padding: 18px 20px;
    border: 1px solid #e5e7eb;
    border-radius: 7px;
    background: #ffffff;
}

/* 각 사용자 영역 */
.user-field {
    display: flex;
    flex-direction: column;
    gap: 7px;
}

/* 원본자 / 대상자 라벨 */
.field-title {
    font-size: 13px;
    font-weight: 600;
    color: #4b5563;
}

/*
 * 이름 5자 정도 표시 폭
 */
.user-input {
    width: 130px;
}

/* 가운데 화살표 */
.arrow-area {
    display: flex;
    align-items: center;
    justify-content: center;

    height: 39px;

    color: #9ca3af;

    i {
        font-size: 18px;
    }
}

/* 하단 버튼 */
.button-area {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    gap: 6px;

    margin-top: 16px;
}

/* 검색 아이콘 */
.cursor-pointer {
    cursor: pointer;
}

</style>
