<template>
    <Card style="width: 50rem; height: 27rem;">
        <template #content>
            <!-- Row 1 -->
            <div class="grid mb-3">
                <div class="col-8 flex gap-2">
                    <FloatLabel variant="on">
                        <InputText
                            v-model="form.userId"
                            inputId="userId"
                            class="w-full"
                            :readonly="isReadOnly"
                        />
                        <label for="userId" id="lblUserId">사용자 ID</label>
                    </FloatLabel>
                    <Button
                        v-if="!isReadOnly"
                        label="중복체크"
                        class="btn-check"
                        @click="userCheck"
                    ></Button>
                </div>
            </div>

            <!-- Row 2 -->
            <div class="grid mb-3">
                <div class="col-4">
                    <FloatLabel variant="on">
                        <InputText
                            v-model="form.memberNm"
                            inputId="memberNm"
                            class="w-full"
                            :readonly="!isReadOnly"
                        />
                        <label for="memberNm" id="lblMemberNm">사용자이름</label>
                    </FloatLabel>
                </div>
                <div class="col-4">
                    <FloatLabel variant="on">
                        <InputText
                            v-model="form.jobPosition"
                            inputId="jobPosition"
                            class="w-full"
                        />
                        <label for="jobPosition" id="lblJobPosition">직급</label>
                    </FloatLabel>
                </div>
                <div class="col-4">
                    <FloatLabel variant="on">
                        <InputText
                            v-model="form.deptNm"
                            inputId="deptNm"
                            class="w-full"
                        />
                        <label for="deptNm" id="lblDeptNm">부서</label>
                    </FloatLabel>
                </div>
            </div>

            <!-- Row 3 -->
            <div class="grid mb-3">
                <div class="col-4">
                    <FloatLabel variant="on">
                        <InputText
                            v-model="form.phone"
                            inputId="phone"
                            class="w-full"
                        />
                        <label for="phone" id="lblPhone">연락처</label>
                    </FloatLabel>
                </div>
                <div class="col-4">
                    <FloatLabel variant="on">
                        <InputText
                            v-model="form.email"
                            inputId="email"
                            class="w-full"
                        />
                        <label for="email" id="lblEmail">이메일</label>
                    </FloatLabel>
                </div>
                <div class="col-4">
                    <FloatLabel variant="on">
                        <Select
                            v-model="form.useYn"
                            :options="items"
                            optionLabel="codeNm"
                            optionValue="code"
                            class="w-full"
                            inputId="useYn"
                        />
                        <label for="useYn" id="lblUseYn">재직여부</label>
                    </FloatLabel>
                </div>
            </div>

            <!-- Row 4 -->
            <div class="grid mb-3" v-if="!isReadOnly">
                <div class="col-4">
                    <FloatLabel variant="on" class="w-full">
                        <Password
                            v-model="form.password"
                            inputId="password"
                            toggleMask
                            :feedback="false"
                            class="w-full"
                            :inputClass="'w-full pr-8'"
                        />
                        <label for="password" id="lblPassword">패스워드</label>
                    </FloatLabel>
                </div>
                <div class="col-4">
                    <FloatLabel variant="on" class="w-full">
                        <Password
                            v-model="form.confirmPassword"
                            inputId="confirmPassword"
                            toggleMask
                            :feedback="false"
                            class="w-full"
                            :inputClass="'w-full pr-8'"
                        />
                        <label for="confirmPassword" id="lblConfirmPassword">
                            패스워드 확인
                        </label>
                    </FloatLabel>
                </div>
            </div>

            <!-- History -->
            <div class="grid mb-3">
                <div class="col-12">
                    <FloatLabel variant="on">
                        <Textarea
                            v-model="form.etc"
                            rows="3"
                            class="w-full"
                            style="resize: none"
                            inputId="etc"
                        />
                        <label for="etc" id="lblEtc">비고</label>
                    </FloatLabel>
                </div>
            </div>

            <!-- Buttons -->
            <div class="flex gap-2 justify-end pt-3">
                <Button
                    v-if="isReadOnly"
                    label="패스워드초기화"
                    severity="secondary"
                    @click="passwordInit"
                ></Button>
                <Button label="저장" severity="secondary" @click="saveInfo"></Button>
                <Button label="닫기" @click="closeDialog"></Button>
            </div>
        </template>
    </Card>
</template>


<script setup>
import { ApiSystems } from '@/api/apiSystem';
import { useAlertStore } from '@/stores/alert';
import { isEmpty } from '@/util/common';
import { inject, onMounted, reactive, ref } from 'vue';

const dialogRef = inject('dialogRef')
const { vError, vSuccess ,vInfo, vWarning} = useAlertStore()
const isReadOnly = ref(false)
const submitted = ref(false)

/**
 *  사용 유무 초기화
 */
const items = [
      { codeNm: '재직', code: 'Y' },
      { codeNm: '퇴직', code: 'N' },
]

const form = reactive({
  userId: null,
  deptNm: null,
  jobPosition: null,
  memberNm: null,
  phone: null,
  email:null,
  password: null,
  confirmPassword: null,
  useYn: '',
  etc: null,
})

const saveInfo = async () =>{
  submitted.value = true

  // 유효성 체크
  if (!validate()) {
    return
  }

  try{
    const params = {
      ...form
    }
    const msg = await ApiSystems.updateUserInfo(params)
    vSuccess(msg.data)
    closeDialog()
  }catch(err){
    vError(err.response.data.message)
  }
}

onMounted( async () =>{
    if ( !isEmpty(dialogRef.value.data)) {
        const res = await ApiSystems.getUserInfo(dialogRef.value.data)
        Object.assign(form, res)
        isReadOnly.value = true
    }
})

const validate = () => {
  const errors = []

  // 1. userId 필수
  if (!form.userId) {
    errors.push('사용자 ID를 입력하세요.')
  }

  // 2. 사용자명 필수
  if (!form.memberNm) {
    errors.push('사용자명을 입력하세요.')
  }

  // 3. 패스워드 관련 검증 (신규 등록일 때만: !isReadOnly)
  if (!isReadOnly.value) {
    if (!form.password) {
      errors.push('패스워드를 입력하세요.')
    } else {
      if (form.password.length < 3) {
        errors.push('패스워드는 3자리 이상이어야 합니다.')
      }
    }

    if (form.password !== form.confirmPassword) {
      errors.push('패스워드와 패스워드 확인이 일치하지 않습니다.')
    }
  }

  if (errors.length > 0) {
    vWarning(errors.join('\n'))
    return false
  }

  return true
}

/**
 * 패스워드 초기화
 */
const passwordInit = () => {
  ApiSystems.passwordInit(form.userId).then(res => {
      vSuccess(res.data)
  });
}

const userCheck = () => {
  ApiSystems.userCheck(form.userId).then(res => {
    vInfo(res.data)
  });
}

const closeDialog = () => {
  dialogRef.value.close();
};

</script>

<style scoped>

</style>
