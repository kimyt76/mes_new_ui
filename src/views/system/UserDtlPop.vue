<template>
  <v-card>
      <v-card-item
        :title="props.title"
        ></v-card-item>
        <v-card-text>
          <v-form ref="vform">
          <v-row dense
            class="mt-1 ml-1 mr-1"
            >
            <v-col
              cols="12"
              md="4"
              sm="6"
            >
            <v-text-field
              v-model="form.userId"
              dense
              label="사용자 ID"
              placeholder="사용자 ID 입력해주세요"
              variant="underlined"
              :readonly="isReadOnly"
              :rules="validUserId"
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
            >
              <v-btn
                class="mt-2"
                v-if="props.mode === 'N'"
                text="중복확인"
                @click="userCheck"
                ></v-btn>
            </v-col>
            <v-col
              cols="12"
              md="4"
              sm="6"
            >
            <v-text-field
              v-model="form.memberNm"
              dense
              label="사용자 이름"
              placeholder="사용자 이름 입력해주세요"
              variant="underlined"
              :readonly="isReadOnly"
              :rules="validMemberNm"
                />
            </v-col>

            <v-col
              cols="12"
              md="4"
              sm="6"
            >
            <v-text-field
              v-model="form.jobPosition"
              dense
              label="직급"
              placeholder="직급을 입력해주세요"
              variant="underlined"
              />
            </v-col>

            <v-col
              cols="12"
              md="4"
              sm="6"
            >
            <v-text-field
              v-model="form.deptNm"
              dense
              label="부서"
              placeholder="부서를 입력해주세요"
              variant="underlined"
              />
            </v-col>

            <v-col
              cols="12"
              md="4"
              sm="6"
            >
            <v-text-field
              v-model="form.phone"
              dense
              label="연락처"
              placeholder="전화번호를 입력해주세요"
              variant="underlined"
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
              sm="6"
            >
            <v-text-field
              v-model="form.email"
              dense
              label="이메일"
              placeholder="이메일을 입력해주세요"
              variant="underlined"
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
              sm="6"
              >
              <v-select
                v-model="form.useYn"
                label="재직여부"
                :items="items"
                item-title="text"
                item-value="value"
                variant="underlined"
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
              sm="6"
              v-if="props.mode === 'N'"
              >
              <v-text-field
                v-model="form.password"
                dense
                label="패스워드"
                type="password"
                placeholder="패스워드를 입력해주세요"
                variant="underlined"
                :rules="validPassword"
                />
            </v-col>
            <v-col
              cols="12"
               md="4"
                v-if="props.mode === 'N'"
              >
              <v-text-field
                v-model="form.confirmPassword"
                dense
                label="패스워드 확인"
                type="password"
                placeholder="패스워드를 입력해주세요"
                variant="underlined"
                :rules="validConfirmPassword"
                />
            </v-col>
            <v-col
              cols="12"
              >
              <v-text-field
                v-model="form.etc"
                dense
                label="비고"
                placeholder="기타정보를 입력하세요"
                variant="underlined"
                />
            </v-col>
          </v-row>
        </v-form>
          <small class="text-caption text-medium-emphasis">* 이메일은 ID만 넣어주세요</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="props.mode === 'U'"
            color="red-darken-3"
            text="패스워드 초기화"
            depressed
            variant="tonal"
             @click="passwordInit"
          />
          <v-btn
            color="indigo-darken-4"
            text="저장"
            variant="tonal"
            depressed
            @click="saveUser"
            />
          <v-btn
            text="닫기"
            variant="tonal"
             @click="emit('close-dialog')"
          />
        </v-card-actions>
      </v-card>
</template>

<script setup>
import { ApiSystems } from '@/api/apiSystem'
import { useAlertStore } from '@/stores/alert'
import { onMounted, reactive, ref } from 'vue'

const alert = useAlertStore()
const emit = defineEmits(['saved', 'close-dialog'])

const vform = ref()
const isReadOnly = ref(false)
const props = defineProps({
  title: {
    type: String,
  },
  id: {
    type: String,
  },
  mode: {
    type: String,
  },
})

const form = reactive ({
  userId: null,
  deptNm: null,
  jobPosition: null,
  memberNm: null,
  phone: null,
  email:null,
  password: null,
  confirmPassword: null,
  useYn: props.mode === 'N' ? 'Y' : 'N'
})

/**
 *  재직 유무 초기화
 */
const items = [
  { text: '재직', value: 'Y' },
  { text: '퇴직', value: 'N' },
]

/**
 * 화면 호출 시 userId값이 있을 경우 사용자 자동 조회
 */
onMounted(() => {
  if ( props.mode === 'U' ) {
    //console.log('mode', props.mode)
    getUserInfo(props.id);
    isReadOnly.value = true;
  }
})

/**
 * 사용자 조회
 * @param id : userId값이 있을 경우
 */
const getUserInfo = (id) => {
  ApiSystems.getUserInfo(id).then(res => {
    const result = res.data  // ✅ PromiseResult 값
    Object.assign(form, result);
  })
}

const validUserId = [
  v => !!v || '사용자 ID는 필수입니다.',
  v => v.length >= 2 || '사용자 ID는 최소 2자 이상이어야 합니다.',
]

const validMemberNm = [
  v => !!v || '사용자 이름은 필수입니다.',
  v => v.length >= 2 || '사용자 이름은 최소 2자 이상이어야 합니다.',
]

const validPassword = [
  v => !!v || '패스워드는 필수입니다.',
  v => v.length >= 4 || '패스워드는 최소 4자 이상이어야 합니다.',
]

const validConfirmPassword = [
  v => !!v || '패스워드 확인은 필수입니다.',
  v => v.length >= 4 || '패스워드 확인은 최소 4자 이상이어야 합니다.',
]

const checkValid = async () => {
  const success = await vform.value.validate()

  if (!success) {
    alert.vWarning('필수 입력값을 확인하세요.')
    return false
  }
  return true
}

/**
 *  사용자 신규 생성 및 수정
 */
const saveUser = async () =>{
  const params = {
      ...form
  }
  if ( props.mode === 'N') {
    const isValid = await checkValid()

    if (!isValid) return

    if ( form.password !== form.confirmPassword ) {
      alert.vWarning("패스워드가 틀립니다. 다시 확인해주십시오!!")
      return
    }
  }else{
    delete params.password
  }

  try{
    ApiSystems.updateUserInfo(params).then(res => {
      emit('saved', res.data)
      emit('close-dialog')
    });
  }catch(err){
    alert.vError('저장에 실패했습니다.'+ err);
  }
}

/**
 * 패스워드 초기화
 */
const passwordInit = () => {
  ApiSystems.passwordInit(form.userId).then(res => {
      alert.vSuccess(res.data)
  });
}

/**
 *  사용자 중복 체크
 */
const userCheck = () => {
  ApiSystems.userCheck(form.userId).then(res => {
    alert.vInfo(res.data)
  });
}
</script>

<style scoped>
.v-card-item  {
  background-color:#BCAAA4
}

</style>
