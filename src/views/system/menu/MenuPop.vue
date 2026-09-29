```vue
<template>
<div class="menu-pop">
    <div class="form-grid">
        <!-- 메뉴 ID -->
        <div class="form-row" v-if="form.menuId">
            <label class="form-label">메뉴 ID</label>
            <InputText
                v-model="form.menuId"
                disabled
                class="w-full"
            />
        </div>

        <!-- 메뉴명 -->
        <div class="form-row">
            <label class="form-label required">메뉴명</label>

            <InputText
                v-model="form.menuName"
                class="w-full"
                maxlength="100"
                placeholder="메뉴명을 입력하세요"
            />
        </div>
        <!-- 상위 메뉴 -->
        <div class="form-row">
            <label class="form-label">상위 메뉴</label>
            <Select
                v-model="form.parentId"
                :options="parentMenuList"
                optionLabel="menuName"
                optionValue="menuId"
                placeholder="상위 메뉴 선택"
                class="w-full"
                showClear
                @change="changeParentMenu"
            />
        </div>

        <!-- 메뉴 단계 -->
        <div class="form-row">
            <label class="form-label required">메뉴 단계</label>
            <InputNumber
                v-model="form.menuLevel"
                :min="1"
                :max="3"
                :useGrouping="false"
                class="w-full"
                disabled
            />
        </div>

        <!-- 메뉴 구분 -->
        <div class="form-row">
            <label class="form-label required">메뉴 구분</label>
            <Select
                v-model="form.menuType"
                :options="menuTypes"
                optionLabel="codeNm"
                optionValue="code"
                class="w-full"
            />
        </div>

        <!-- 메뉴 경로 -->
        <div class="form-row">
            <label class="form-label">메뉴 경로</label>
            <InputText
                v-model="form.menuPath"
                class="w-full"
                maxlength="300"
                placeholder="/system/menu"
                :disabled="form.menuType === 'G'"
            />
        </div>

        <!-- 아이콘 -->
        <div class="form-row">
            <label class="form-label">아이콘</label>

            <div class="flex align-items-center gap-2 w-full">
                <InputText
                    v-model="form.icon"
                    class="flex-1"
                    maxlength="100"
                    placeholder="pi pi-cog"
                />
                <div class="icon-preview">
                    <i
                        v-if="form.icon"
                        :class="form.icon"
                    ></i>
                </div>
            </div>
        </div>


        <!-- 정렬 순서 -->
        <div class="form-row">
            <label class="form-label required">정렬 순서</label>
            <InputNumber
                v-model="form.sortOrder"
                :min="1"
                :maxFractionDigits="0"
                :useGrouping="false"
                class="w-full"
            />
        </div>
        <!-- 사용 여부 -->
        <div class="form-row">
            <label class="form-label required">사용 여부</label>
            <Select
                v-model="form.useYn"
                :options="useYns"
                optionLabel="codeNm"
                optionValue="code"
                class="w-full"
            />
        </div>
    </div>

    <!-- 버튼 -->
    <div class="button-area">
        <Button label="저장" icon="pi pi-save" @click="saveMenu" />
        <Button label="닫기" icon="pi pi-times" severity="secondary" outlined @click="closePop" />
    </div>

</div>
</template>


<script setup>
import { ApiSystem } from '@/api/apiSystem'
import { useAlertStore } from '@/stores/alert'
import { handleApiError } from '@/util/errorHandler'
import { inject, onMounted, reactive, ref, watch } from 'vue'

const {vSuccess, vWarning} = useAlertStore()
const dialogRef = inject('dialogRef')
const parentMenuList = ref([])

const menuTypes = ref([
    { codeNm: '그룹', code: 'G' },
    { codeNm: '메뉴', code: 'M' }
])

const useYns = ref([
    { codeNm: '사용', code: 'Y' },
    { codeNm: '미사용', code: 'N' }
])


const form = reactive({
    menuId: null,
    menuName: '',
    parentId: null,
    menuLevel: 1,
    menuType: 'G',
    menuPath: '',
    icon: '',
    sortOrder: 1,
    useYn: 'Y',
})

/**
 * 상위메뉴 목록 조회
 */
const getParentMenuList = async () => {
    try {
        const params = {
            useYn: 'Y'
        }

        const res = await ApiSystem.getMenuMgmtList(params)

        const list = res?.data ?? res ?? []

        /*
         * 3단계 메뉴는 자식을 가질 수 없으므로
         * 1, 2단계만 상위메뉴로 선택 가능
         *
         * 현재 수정중인 메뉴 자신도 제외
         */
        parentMenuList.value = list.filter(row => {
            return Number(row.menuLevel) < 3 &&
                   row.menuId !== form.menuId

        })

    } catch (error) {
        console.error('상위메뉴 조회 오류', error)
        parentMenuList.value = []
    }

}


/**
 * 상세 조회
 */
const getMenuDetail = async () => {
    if (!form.menuId) return

    try {
        const res = await ApiSystem.getMenuDetail(form.menuId)
        const data = res?.data ?? res

        if (!data) return
        form.menuName = data.menuName ?? ''
        form.parentId = data.parentId ?? null
        form.menuLevel = Number(data.menuLevel ?? 1)
        form.menuType = data.menuType ?? 'G'
        form.menuPath = data.menuPath ?? ''
        form.icon = data.icon ?? ''
        form.sortOrder = Number(data.sortOrder ?? 1)
        form.useYn = data.useYn ?? 'Y'
        form.remark = data.remark ?? ''
    } catch (error) {
        console.error('메뉴 상세 조회 오류', error)
    }
}


/**
 * 상위 메뉴 변경
 */
const changeParentMenu = () => {
    if (!form.parentId) {
        form.menuLevel = 1
        return
    }

    const parent = parentMenuList.value.find(
        row => row.menuId === form.parentId
    )

    if (!parent) {
        form.menuLevel = 1
        return
    }

    form.menuLevel = Number(parent.menuLevel) + 1
    /*
     * 3단계 메뉴는 실제 화면 메뉴이므로
     * 기본 메뉴구분을 M으로 설정
     */
    if (form.menuLevel === 3) {
        form.menuType = 'M'
    }

}

/**
 * 메뉴 구분 변경
 */
watch( () => form.menuType, (value) => {
        /*
         * 그룹이면 실제 이동 경로가 필요 없으므로 제거
         */
        if (value === 'G') {
            form.menuPath = ''
        }
    }
)

/**
 * 입력 체크
 */
const validation = () => {
    if (!form.menuName?.trim()) {
        vWarning('메뉴명을 입력하세요.')
        return false
    }

    if (!form.menuLevel) {
        vWarning('메뉴 단계를 확인하세요.')
        return false
    }

    if (!form.menuType) {
        vWarning('메뉴 구분을 선택하세요.')
        return false
    }

    if ( form.menuType === 'M' && !form.menuPath?.trim() ) {
        vWarning('메뉴 경로를 입력하세요.')

        return false
    }

    if (!form.sortOrder) {
        vWarning('정렬 순서를 입력하세요.')
        return false
    }

    if (!form.useYn) {
        vWarning('사용 여부를 선택하세요.')
        return false
    }

    return true
}


/**
 * 저장
 */
const saveMenu = async () => {
    if (!validation()) return

    try {
        const params = {
            menuId: form.menuId,
            menuName: form.menuName,
            parentId: form.parentId,
            menuLevel: form.menuLevel,
            menuType: form.menuType,
            menuPath: form.menuType === 'G' ? null : form.menuPath,
            icon: form.icon,
            sortOrder: form.sortOrder,
            useYn: form.useYn,
        }

        /*
         * menuId 있으면 수정
         * 없으면 신규등록
         */
        await ApiSystem.saveMenu(params)

        vSuccess('저장되었습니다.')

        dialogRef.value.close({ saved: true })
    } catch (error) {
        console.error('메뉴 저장 오류', error)
        handleApiError(err)
    }
}

/**
 * 닫기
 */
const closePop = () => {
    dialogRef.value.close()
}

onMounted(async () => {
    /*
     * 부모 화면에서
     *
     * data: menuId
     *
     * 로 넘기고 있음
     */
    form.menuId = dialogRef.value?.data.menuId ?? null
    /*
     * 수정인 경우 상세 먼저 조회
     */
    if (form.menuId) {
        await getMenuDetail()
    }

    await getParentMenuList()
})
</script>


<style scoped>
.menu-pop {
    padding: 5px 10px 10px 10px;
}
.form-grid {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.form-row {
    display: grid;
    grid-template-columns: 120px 1fr;
    align-items: center;
    min-height: 38px;
}
.form-label {
    font-size: 13px;
    font-weight: 600;
    padding-left: 5px;
}
.form-label.required::after {
    content: ' *';
    color: red;
}
.icon-preview {
    width: 40px;
    height: 36px;

    border: 1px solid #d1d5db;
    border-radius: 6px;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 18px;
}
.button-area {
    display: flex;
    justify-content: flex-end;
    gap: 8px;

    margin-top: 20px;
    padding-top: 12px;

    border-top: 1px solid #e5e7eb;
}
:deep(.p-inputtext) {
    font-size: 13px;
}
:deep(.p-select) {
    font-size: 13px;
}
:deep(.p-inputnumber) {
    width: 100%;
}
:deep(.p-inputnumber-input) {
    width: 100%;
}

</style>

