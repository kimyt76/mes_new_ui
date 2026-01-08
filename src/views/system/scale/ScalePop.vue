<template>
    <Card style="width: 50rem; height: 27rem;">
        <template #content>
            <!-- Row 1 -->
            <div class="grid mb-3">
                <div class="col-4">
                    <FloatLabel variant="on">
                        <Select v-model="form.areaCd"
                        :options="areaCds"
                        optionLabel="codeNm"
                        optionValue="code"
                        class="w-full"
                        />
                        <label for="on_label">구역(공장)</label>
                    </FloatLabel>
                </div>
                <div class="col-4">
                    <FloatLabel variant="on">
                        <Select v-model="form.storageCd"
                        :options="storageCds"
                        optionLabel="codeNm"
                        optionValue="code"
                        class="w-full"
                        />
                        <label for="on_label">작업처</label>
                    </FloatLabel>
                </div>
                <div class="col-4">
                    <FloatLabel variant="on">
                        <InputText
                            v-model="form.scaleType"
                            class="w-full"
                        />
                        <label>저울타입</label>
                    </FloatLabel>
                </div>
            </div>
            <!-- Row 2 -->
            <div class="grid mb-3">
                <div class="col-4">
                    <FloatLabel variant="on">
                        <InputText
                            v-model="form.scaleCd"
                            class="w-full"
                        />
                        <label>저울코드</label>
                    </FloatLabel>
                </div>
                <div class="col-4">
                    <FloatLabel variant="on">
                        <InputText
                            v-model="form.scaleName"
                            class="w-full"
                        />
                        <label>저울명</label>
                    </FloatLabel>
                </div>
                <div class="col-4">
                    <FloatLabel variant="on">
                        <InputText
                            v-model="form.scaleNickname"
                            class="w-full"
                        />
                        <label>저울별칭명</label>
                    </FloatLabel>
                </div>
            </div>
            <!-- Row 3 -->
            <div class="grid mb-3">
                <div class="col-4">
                    <FloatLabel variant="on">
                        <InputText
                            v-model="form.nportAddress"
                            class="w-full"
                        />
                        <label>N포트IP주소</label>
                    </FloatLabel>
                </div>
                <div class="col-4">
                    <FloatLabel variant="on">
                        <InputNumber
                            v-model="form.serialPortNo"
                            class="w-full"
                        />
                        <label>N포트 시리얼 포트</label>
                    </FloatLabel>
                </div>
                <div class="col-4">
                    <FloatLabel variant="on">
                        <InputNumber
                            v-model="form.responsPortNo"
                            class="w-full"
                        />
                        <label>응답포트</label>
                    </FloatLabel>
                </div>
            </div>
            <!-- Row 4 -->
            <div class="grid mb-3">
                <div class="col-4">
                    <FloatLabel variant="on">
                        <InputText
                            v-model="form.modelName"
                            class="w-full"
                        />
                        <label>모델명</label>
                    </FloatLabel>
                </div>
                <div class="col-4">
                    <FloatLabel variant="on">
                        <InputText
                            v-model="form.equipNo"
                            class="w-full"
                        />
                        <label>장비번호</label>
                    </FloatLabel>
                </div>

                <div class="col-4">
                    <FloatLabel variant="on">
                        <Select v-model="form.useYn"
                        :options="useYns"
                        optionLabel="codeNm"
                        optionValue="code"
                        style="width: 150px"
                        />
                        <label for="on_label">사용유무</label>
                    </FloatLabel>
                </div>
            </div>
            <div class="grid mb-3">
                <div class="col-12">
                    <FloatLabel variant="on">
                        <Textarea
                            v-model="form.etc"
                            rows="2"
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
                <Button label="저장" class="p-button-secondary" @click="saveInfo"></Button>
                <Button label="닫기" outlined class="ml-2" @click="closeDialog"></Button>
            </div>
        </template>
    </Card>
</template>


<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiSystems } from '@/api/apiSystem';
import { useAlertStore } from '@/stores/alert';
import { useAuthStore } from '@/stores/auth';
import { isEmpty } from '@/util/common';
import { handleApiError } from '@/util/errorHandler';
import { computed, inject, onMounted, reactive, ref } from 'vue';

const {userId} = useAuthStore()
const dialogRef = inject('dialogRef')
const { vError, vSuccess ,vInfo, vWarning} = useAlertStore()
const areaCds = ref([])
const useYns = ref([])
const storageAllRaw = ref([])
const storageCds = computed(() => {
  const area = form.areaCd
  const list = storageAllRaw.value ?? []

  const filtered = area ? list.filter(x => x.areaCd === area) : list

  return filtered.map(x => ({
    code: x.storageCd,
    codeNm: x.storageName,
  }))
})
const form = reactive({
    areaCd: null,
    storageCd: null,
    scaleCd: null,
    scaleName:null,
    scaleType: null,
    modelName: null,
    scaleNickname: null,
    nportAddress: '',
    serialPortNo:'',
    responsPortNo: '',
    equipNo: '',
    etc: null,
    useYn: 'Y',

    scaleId: '',
    userId: userId,
})

const saveInfo = async () =>{
  try{
    const params = {
      ...form
    }
    const res = await ApiSystems.saveScaleInfo(params)
    vSuccess(res.message)
    closeDialog()
  }catch(err){
    handleApiError(err)
  }
}

onMounted( async () =>{
    areaCds.value = await ApiCommon.getCodeList('area')
    useYns.value = await ApiCommon.getCodeList('use_yn')
    storageAllRaw.value = await ApiSystems.getStorageList({})

    if ( !isEmpty(dialogRef.value.data)) {
        const res = await ApiSystems.getScaleInfo(dialogRef.value.data)
        Object.assign(form, res)
    }
})

const closeDialog = () => {
  dialogRef.value.close();
};

</script>

<style scoped>

</style>
