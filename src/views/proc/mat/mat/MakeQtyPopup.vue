<template>
  <div class="mt-3">
    <div>
        <FloatLabel variant="on">
            <InputNumber
                v-model="makeQty"
                :min="0"
                :maxFractionDigits="6"
                :useGrouping="false"
            />
            <label for="on_label1">투입량 입력</label>
        </FloatLabel>
    </div>
    <div class="flex justify-end mt-2">
        <Button
          label="저장"
          @click="save"
          ></Button>
    </div>
</div>
</template>

<script setup>
import { inject, onMounted, ref } from 'vue';

const dialogRef = inject('dialogRef')
const makeQty = ref(0)

const save = () =>{
    dialogRef.value.close(makeQty.value)
}

onMounted(() =>{
    console.log('dialogRef.value', dialogRef.value )
    console.log('dialogRef.data', dialogRef.value.data )
    makeQty.value = dialogRef.value.data.row.orderQty
})

</script>

<style  scoped>

</style>
