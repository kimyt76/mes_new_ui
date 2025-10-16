<template>
  <HotTable
    ref="innerHot"
    :licenseKey="'non-commercial-and-evaluation'"
    v-bind="$attrs"
    :theme="'htThemeMain'"
  />
</template>

<script setup>
import { HotTable} from '@handsontable/vue3'
import { ref } from 'vue'

const innerHot = ref(null)
defineExpose({
  hotInstance: innerHot,
})


</script>

<style>
/* modern 테마 사용 */
@import 'handsontable/styles/handsontable.min.css';
@import 'handsontable/styles/ht-theme-main.min.css';
/* header 색상 지정*/
.ht_clone_top th {
  background-color: #FFE0B2;
  color: #000;
}

</style>
