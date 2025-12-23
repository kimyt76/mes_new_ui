<template>
  <Card style="width: 50rem; height: 16rem;">
    <template #content>
            <!-- Row 1 -->
            <div class="grid mt-2 mb-5">
                <div class="col-4">
                    <FloatLabel variant="on">
                        <InputText v-model="form.comTypeCd" class="w-full" />
                        <label>공통타입</label>
                    </FloatLabel>
                </div>
                <div class="col-4">
                    <FloatLabel variant="on">
                        <InputText v-model="form.comTypeNm" class="w-full" />
                        <label>공통타입명</label>
                    </FloatLabel>
                </div>
                <div class="col-4">
                    <FloatLabel variant="on">
                        <InputNumber v-model="form.dispOrder" class="w-full" />
                        <label>순서</label>
                    </FloatLabel>
                </div>
            </div>
            <!-- Row 2 -->
            <div class="grid mb-5">
                <div class="col-4">
                    <FloatLabel variant="on">
                        <InputText v-model="form.code" class="w-full" />
                        <label>코드</label>
                    </FloatLabel>
                </div>
                <div class="col-4">
                    <FloatLabel variant="on">
                        <InputText v-model="form.codeNm" class="w-full" />
                        <label>코드명</label>
                    </FloatLabel>
                </div>
                <div class="col-4">
                    <FloatLabel variant="on">
                        <Select v-model="form.useYn"
                                :options="useYns"
                                optionLabel="codeNm"
                                optionValue="code" class="w-full" />
                        <label>사용유무</label>
                    </FloatLabel>
                </div>
            </div>
            <!-- Row 2 -->
            <div class="grid mb-5">
                <div class="col-12">
                    <FloatLabel variant="on">
                        <InputText v-model="form.discription" class="w-full" />
                        <label>비고</label>
                    </FloatLabel>
                </div>
            </div>
    </template>
  </Card>
    <!-- Buttons -->
    <div class="flex gap-2 justify-end pt-3">
        <Button label="저장" severity="secondary" @click="saveInfo"></Button>
        <Button label="닫기" @click="closeDialog"></Button>
    </div>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';
import { isEmpty } from '@/util/common';
import { inject, onMounted, reactive, ref } from 'vue';

const {userId} = useAuthStore()
const dialogRef = inject('dialogRef')
const { vError, vSuccess } = useAlertStore()
const useYns = ref([])
const form = reactive({
  comId : '',
  comTypeCd: '',
  comTypeNm: '',
  code: '',
  codeNm: '',
  dispOrder: '',
  useYn : '',
  discription: '',

  userId : userId,
})

onMounted( async () => {
    useYns.value = await ApiCommon.getCodeList('use_yn')

    if ( !isEmpty(dialogRef.value.data  )){
        form.comId = dialogRef.value.data
        const res =  await ApiCommon.getCommonInfo(form.comId)
        Object.assign(form, res)
    }
})

const saveInfo = async () => {
  try{
    const params = {
      ...form
    }

    const msg = await ApiCommon.saveCommonInfo(params)
    vSuccess(msg.data)
    closeDialog()
  }catch(err){
    vError(err.response.data.message)
  }
}

const closeDialog = () =>{
    dialogRef.value.close()
}
</script>

<style scoped>

</style>
