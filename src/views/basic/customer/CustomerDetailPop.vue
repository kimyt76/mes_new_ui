<template>
<v-card>
  <v-card-item
    :title="props.title"
    />
    <v-card-text>
      <v-form ref="vform">
        <v-row class="mt-3">
          <v-col>
            <v-select
              v-model="form.customerType"
              label="거래처구분"
              :items="customerTypes"
              item-title="codeNm"
              item-value="code"
              variant="underlined"
              density="compact"
              />
          </v-col>
          <v-col>
            <v-text-field
              v-model="form.customerCd"
              label="사업자번호"
              variant="underlined"
              density="compact"
              />
          </v-col>
          <v-col>
              <v-btn
                v-if="props.mode === 'N'"
                text="중복확인"
                @click="checkCustomerCd"
              />
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="form.customerName"
              label="상호명"
              variant="underlined"
              density="compact"
              />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="form.memberName"
              label="담당자"
              variant="underlined"
              density="compact"
              append-inner-icon="mdi-magnify"
              @click:append-inner="openUserPop"
              />
          </v-col>
          <v-col>
            <v-text-field
              v-model="form.businessType"
              label="업태"
              variant="underlined"
              density="compact"
              />
          </v-col>
          <v-col>
            <v-text-field
              v-model="form.businessItem"
              label="종목"
              variant="underlined"
              density="compact"
              />
          </v-col>
          <v-col>
            <v-text-field
              v-model="form.president"
              label="대표자명"
              variant="underlined"
              density="compact"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="form.tel"
                label="전화"
                variant="underlined"
                density="compact"
                />
            </v-col>
            <v-col>
              <v-text-field
                v-model="form.fax"
                label="팩스"
                variant="underlined"
                density="compact"
                />
            </v-col>
            <v-col>
              <v-text-field
                v-model="form.presidentTel"
                label="휴대폰"
                variant="underlined"
                density="compact"
                />
            </v-col>
            <v-col>
              <v-text-field
                v-model="form.email"
                label="이메일"
                variant="underlined"
                density="compact"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <v-text-field
                  v-model="form.customerManager"
                  label="거래처담당자"
                  variant="underlined"
                  density="compact"
                  />
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="form.customerManagerTel"
                  label="담당자핸드폰"
                  variant="underlined"
                  density="compact"
                  />
              </v-col>
              <v-col>
                <v-select
                  v-model="form.customerGrp1"
                  label="그룹유형1"
                  :items="customerGrp1s"
                  item-title="codeNm"
                  item-value="code"
                  variant="underlined"
                  density="compact"
                  />
              </v-col>
              <v-col>
                <v-select
                  v-model="form.customerGrp2"
                  label="그룹유형2"
                  :items="customerGrp2s"
                  item-title="codeNm"
                  item-value="code"
                  variant="underlined"
                  density="compact"
                  />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <v-text-field
                v-model="form.zipCode"
                label="우편번호"
                variant="underlined"
                density="compact"
                />
              </v-col>
              <v-col cols="3">
                <v-text-field
                v-model="form.tradingMethod"
                label="거래방법"
                variant="underlined"
                density="compact"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="form.address"
                  label="주소"
                  variant="underlined"
                  density="compact"
                  />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="form.searchText"
                  label="검색창내용"
                  variant="underlined"
                  density="compact"
                  />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="form.memo"
                  label="비고"
                  variant="underlined"
                  density="compact"
                  />
              </v-col>
            </v-row>
      </v-form>
  </v-card-text>
    <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="indigo-darken-4"
          text="저장"
          variant="tonal"
          depressed
          @click="saveInfo"
          />
        <v-btn
          text="닫기"
          variant="tonal"
            @click="emit('close-dialog')"
        />
      </v-card-actions>

<v-dialog  v-model="dialog" height="700" width="900px" persistent>
    <UserListPop
      @selected="handleSelected"
      @close-dialog="dialog = false"
      />
</v-dialog>

</v-card>
</template>

<script setup>
import { ApiBase } from '@/api/apiBase';
import { ApiCommon } from '@/api/apiCommon';
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';
import UserListPop from '@/views/system/user/UserListPop.vue';
import { onMounted, reactive, ref } from 'vue';

const dialog = ref(false)
const { userId, memberNm} = useAuthStore()
const { vError, vInfo, vWarning } = useAlertStore()
const emit = defineEmits(['saved','close-dialog'])

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

const customerTypes = ref([])
const customerGrp1s = ref([])
const customerGrp2s = ref([])

const form = reactive({
  customerType: '',
  customerCd: '',
  customerName: '',
  memberCd: '',
  memberName: '',
  businessItem: '',
  businessType: '',
  president: '',
  tel: '',
  fax: '',
  presidentTel: '',
  email: '',
  customerManager: '',
  customerManagerTel: '',
  zipCode: '',
  address: '',
  tradingMethod: '',
  customerGrp1: '',
  customerGrp2: '',

  searchText: '',
  memo: '',

  userId: userId,
})


const saveInfo = async () => {
  try{
    const params = {
      ...form
    }

    const msg = await ApiBase.saveCustomerInfo(params)
    emit('saved', msg)
    emit('close-dialog')
  }catch(err){
    vError(err.message)
  }
}

onMounted( async () => {
  customerTypes.value = await ApiCommon.getCodeList('CUSTOMER_TYPE')
  customerGrp1s.value = await ApiCommon.getCodeList('CUSTOMER_GRP1')
  customerGrp2s.value = await ApiCommon.getCodeList('CUSTOMER_GRP2')

  if( props.mode === 'U') {
    const res = await ApiBase.getCustomerInfo(props.id)
    Object.assign(form, res)
  }else{
    form.memberName = memberNm
    form.memberCd = userId
  }
})

const handleSelected = (obj) => {
  form.memberCd = obj.userId
  form.memberName = obj.memberNm
}

const checkCustomerCd = async () =>{
  const checkYn = await ApiBase.getCheckCustomerCd(form.customerCd)

  if ( checkYn === 'N') {
    vInfo("사용할 수 있는 번호입니다.")
  }else{
    vWarning("사용할 수 없는 번호입니다.")
    form.customerCd = ''
  }
}

const openUserPop = () =>{
  dialog.value = true
}

</script>

<style  scoped>
.v-card-item  {
  height: 45px;
  background-color:#BCAAA4
}

</style>
