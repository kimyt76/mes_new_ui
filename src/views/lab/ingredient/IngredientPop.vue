<template>
    <div class="card flex flex-col w-full bg-gray-100 py-2 h-[480px]">
        <div class="w-full py-0 gap-2">
            <FormatFiled
                v-model="form.krIngredientName"
                type="text"
                label="국문성분명"
                class="w-full mt-3"
                style="width: 100%;"
                size="lg"
            />
            <FormatFiled
                v-model="form.enIngredientName"
                type="text"
                label="영문성분명"
                class="w-full  mt-3"
                style="width: 100%;"
            />
            <FormatFiled
                v-model="form.cnIngredientName"
                type="text"
                label="중문성분명"
                class="w-full  mt-3"
                style="width: 100%;"
            />
            <FormatFiled
                v-model="form.casNo"
                type="text"
                label="CAS NO."
                class="w-full  mt-3"
                style="width: 100%;"
            />
            <FormatFiled
                v-model="form.functionCd"
                type="select"
                label="function"
                :options="functionList"
                optionLabel="codeNm"
                optionValue="code"
                class="w-full  mt-3"
                style="width: 100%;"
            />
            <FormatFiled
                v-model="form.etc"
                type="textarea"
                label="비고"
                class="w-full  mt-3"
                style="width: 100%;"
            />
        </div>
        <div class="card flex flex-row justify-between items-center gap-5  mt-3">
            <Fieldset legend="한도국가">
                <CheckboxGroup v-model="limitCountry" name="한도국가" class="flex flex-wrap gap-4">
                    <div v-for="coiuntry in countries" :key="coiuntry.code" class="flex items-center gap-2">
                        <Checkbox
                            :inputId="`limit-${coiuntry.code}`"
                            :value="coiuntry.code"
                            v-model="limitCountry"
                        />
                        <label :for="`limit-${coiuntry.code}`">{{ coiuntry.codeNm }}</label>
                    </div>
                </CheckboxGroup>
            </Fieldset>
            <Fieldset legend="금지국가">
                <CheckboxGroup v-model="banCountry" name="금지국가" class="flex flex-wrap gap-4">
                    <div v-for="coiuntry in countries" :key="coiuntry.code" class="flex items-center gap-2">
                        <Checkbox
                            :inputId="`ban-${coiuntry.code}`"
                            :value="coiuntry.code"
                            v-model="banCountry"
                        />
                        <label :for="`ban-${coiuntry.code}`">{{ coiuntry.codeNm }}</label>
                    </div>
                </CheckboxGroup>
            </Fieldset>
        </div>

    </div>
    <div class="flex justify-end gap-2">
        <Button type="button" label="저장" severity="secondary" class="bg-primary-300" @click="saveInfo"></Button>
        <Button type="button" label="닫기" outlined class="ml-2"  @click="emit('close-visible')"></Button>
    </div>
</template>

<script setup>
import { ApiCommon } from '@/api/apiCommon';
import { ApiLab } from '@/api/apiLab';
import { isEmpty } from '@/util/common';
import { onMounted, reactive, ref } from 'vue';

const emit = defineEmits(['saved','close-visible'])

const functionList = ref([])
const countries = ref([])
const limitCountry = ref([])
const banCountry = ref([])

const form = reactive({
    krIngredientName: '',
    enIngredientName: '',
    cnIngredientName: '',
    casNo: '',
    functionCd: '',
    etc: '',
})

const props = defineProps({
    title: {
        type: String,
    },
    id: {
        type: String,
    }
})

const saveInfo = async () =>{
    const params = {
        ...form,
        limitCountries : limitCountry.value,
        bannedCountries: banCountry.value,
    }

    try{
        const msg = await ApiLab.saveIngredientInfo(params)

        emit('saved', msg)
        emit('close-dialog')
    }catch(err){
        vError(err.message)
    }

}


onMounted( async () =>{
    functionList.value =  await ApiCommon.getCodeList('fn_Cd')
    countries.value =  await ApiCommon.getCodeList('country_cd')
console.log('props.id', props.id)
    if (!isEmpty(props.id)) {

        const result = await ApiLab.getIngredientInfo(props.id)

       console.log('result', result)
        Object.assign(form, result)

        limitCountry.value = result.limitCountries
        banCountry.value = result.bannedCountries
    }
})

</script>

<style lang="scss" scoped>

</style>
