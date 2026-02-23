<template>
  <Card style="width: 70rem; height: 18rem;">
    <template #content>
      <!-- Row 1 -->
      <div class="grid mb-3">
        <div class="col-4 flex gap-2">
          <FloatLabel variant="on">
            <InputText
              v-model="form.storageCd"
              inputId="storageCd"
              class="w-full"
              :readonly="isReadOnly"
            />
            <label for="storageCd" id="lblStorageCd">창고 코드</label>
          </FloatLabel>
          <Button
            v-if="!isReadOnly"
            label="중복체크"
            class="btn-check"
            @click="useCheck"
          ></Button>
        </div>

        <div class="col-4">
          <FloatLabel variant="on">
            <InputText v-model="form.storageName" inputId="storageName" class="w-full" />
            <label for="storageName" id="lblStorageName">창고명</label>
          </FloatLabel>
        </div>

        <div class="col-4">
          <FloatLabel variant="on">
            <Select
              v-model="form.areaCd"
              :options="areaCds"
              optionLabel="codeNm"
              optionValue="code"
              class="w-full"
              inputId="areaCd"
            />
            <label for="areaCd" id="lblAreaCd">지역(공장)</label>
          </FloatLabel>
        </div>

        <div class="col-4">
          <FloatLabel variant="on">
            <Select
              v-model="form.procCd"
              :options="procs"
              optionLabel="codeNm"
              optionValue="code"
              class="w-full"
              inputId="procCd"
            />
            <label for="procCd" id="lblProcCd">연관공정</label>
          </FloatLabel>
        </div>

        <div class="col-4">
          <FloatLabel variant="on">
            <Select
              v-model="form.prodYns"
              :options="prodYns"
              optionLabel="codeNm"
              optionValue="code"
              class="w-full"
              inputId="prodYns"
            />
            <label for="prodYns" id="lblProdYns">작업처여부</label>
          </FloatLabel>
        </div>

        <div class="col-4">
          <FloatLabel variant="on">
            <Select
              v-model="form.useYn"
              :options="useYns"
              optionLabel="codeNm"
              optionValue="code"
              class="w-full"
              inputId="useYn"
            />
            <label for="useYn" id="lblUseYn">사용여부</label>
          </FloatLabel>
        </div>
      </div>

      <div class="col-12">
        <Fieldset legend="보관품목">
          <CheckboxGroup v-model="form.itemTypeCd" name="보관품목" class="flex flex-wrap gap-4">
            <div
              v-for="itemTypeCd in itemTypeCds"
              :key="itemTypeCd.code"
              class="flex items-center gap-2"
            >
              <Checkbox :inputId="itemTypeCd.code" :value="itemTypeCd.code" />
              <label :for="itemTypeCd.code">{{ itemTypeCd.codeNm }}</label>
            </div>
          </CheckboxGroup>
        </Fieldset>
      </div>

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
import { handleApiError } from '@/util/errorHandler';
import { inject, onMounted, reactive, ref } from 'vue';

const { userId } = useAuthStore()
const { vSuccess, vInfo } = useAlertStore();
const isReadOnly = ref(false);
const dialogRef = inject('dialogRef');

const areaCds = ref([]);
const useYns = ref([]);
const procs = ref([]);
const itemTypeCds = ref([]);

const prodYns = ref([
  { code: 'Y', codeNm: '작업처' },
  { code: 'N', codeNm: '보관창고' },
]);

// ✅ M4 없음: 창고 테이블에 존재하는 항목만 관리
const ITEM_TYPE_CODES = ['M0', 'M1', 'M2', 'M3', 'M5', 'M6', 'M7'];

const form = reactive({
  storageCd: '',
  storageName: '',
  itemTypeCd: [], // ✅ 체크박스 선택값: ['M0','M1'...]
  areaCd: '',
  procCd: '',
  prodYn: 'N',
  useYn: 'Y',

  userId: userId,
});

// ✅ 체크된 itemTypeCd 배열 -> {m0Yn:'Y/N', ...} 로 변환
const buildItemTypeYnMap = (selectedCodes = []) => {
  const map = {};

  // 기본 N 세팅 (항상 값 존재하도록)
  ITEM_TYPE_CODES.forEach((code) => {
    map[code.toLowerCase() + 'Yn'] = 'N';
  });

  // 선택된 것만 Y
  (selectedCodes || []).forEach((code) => {
    const field = String(code).toLowerCase() + 'Yn';
    if (Object.prototype.hasOwnProperty.call(map, field)) {
      map[field] = 'Y';
    }
  });

  return map;
};

// ✅ {m0Yn:'Y',...} -> ['M0','M1'...] 로 변환
const buildSelectedCodesFromYn = (storageInfo) => {
  const selected = [];
  ITEM_TYPE_CODES.forEach((code) => {
    const field = code.toLowerCase() + 'Yn';
    if (storageInfo?.[field] === 'Y') selected.push(code);
  });
  return selected;
};

const saveInfo = async () => {
  try {
    const itemTypeYnMap = buildItemTypeYnMap(form.itemTypeCd);

    const params = {
      ...form,
      ...itemTypeYnMap, // ✅ 서버/DB 컬럼(m0Yn..m7Yn) 포함
    };

    const res = await ApiSystems.saveStorageInfo(params);
    vSuccess(res.message);
    closeDialog();
  } catch (err) {
    handleApiError(err);
  }
};

const useCheck = () => {
  ApiSystems.useCheck(form.storageCd).then((res) => {
    vInfo(res.message);
  });
};

onMounted(async () => {
  // 공통코드 로딩
  itemTypeCds.value = await ApiCommon.getCodeList('ITEM_TYPE_CD');
  areaCds.value = await ApiCommon.getCodeList('AREA');
  useYns.value = await ApiCommon.getCodeList('USE_YN');
  procs.value = await ApiCommon.getCodeList('PROCESS_CD');

  // ✅ M4 코드가 공통코드에 있더라도 화면에서 숨기고 싶으면 아래 필터 켜기
  // itemTypeCds.value = itemTypeCds.value.filter(x => x.code !== 'M4');

  // 수정(조회) 모드
  if (dialogRef?.value?.data) {
    const res = await ApiSystems.getStorageInfo(dialogRef.value.data);

    // form에 기본 데이터 세팅
    Object.assign(form, res);

    // ✅ m0Yn.. 값을 체크박스 배열로 변환해 반영
    form.itemTypeCd = buildSelectedCodesFromYn(res);

    isReadOnly.value = true;
  }
});

const closeDialog = () => {
  dialogRef.value.close();
};
</script>

<style scoped>
</style>
