<template>
  <div>
    <table>
        <tbody>
            <tr>
                <th class="cellBorder cellHeader">라인명</th>
                <th class="cellBorder cellHeader">저울</th>
                <th class="cellBorder cellHeader">-</th>
            </tr>
            <tr
                v-for="(item, index) in lineList" :key="item.orderDist" >
                <td class="cellBorder">
                    <input type="time" v-model="item.lineName" class="w-full" />
                </td>
                <td class="cellBorder">
                    <InputNumber v-model="item.scaleCd" class="w-full" />
                </td>
                <td class="cellBorder">
                    <InputNumber v-model="item.line2" class="w-full"/>
                </td>
            </tr>
        </tbody>
    </table>
    </div>
    <div class="flex justify-end gap-2 mt-2">
        <button label="저장"/>
        <button label="닫기" v-on:click=""/>
    </div>
</template>

<script setup>
import { useDialog } from 'primevue';
import { inject, onMounted, ref } from 'vue';

const dialog = useDialog()
const dialogRef = inject('dialogRef')
const lineList = ref([
    createDefaultLineList
])

const createDefaultLineList = () => {
    return Array.from({ length: 5 },
        (_, index) => ({
            qcProcTestLineId: null,
            testType: '',
            lineName: '',
            scleCd: '',

            orderDist: index + 1
        })
    )
}

onMounted( async () =>{

})

</script>

<style scoped>

</style>
