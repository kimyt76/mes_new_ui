<template>
  <div ref="container"></div>
</template>

<script setup>
import Handsontable from 'handsontable'
import 'handsontable/styles/handsontable.min.css'
import 'handsontable/styles/ht-theme-main.min.css'
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  data: { type: Array, default: () => [] },
  colHeaders: { type: [Array, Boolean], default: () => [] },
  columns: { type: Array, default: () => [] },
  colWidths: { type: Array, default: () => [] },
  stretchH: { type: [String, Boolean], default: 'all' },
  rowHeaders: { type: [Boolean, Array], default: false },
  height: { type: [Number, String], default: 400 },
  afterChange: { type: Function, default: null },
  afterSelection: { type: Function, default: null },
  afterOnCellMouseDown: { type: Function, default: null },
})

const container = ref(null)
const hotInstance = shallowRef(null)

let alive = false
const stopHandles = []

function isHotDestroyed(hot) {
  if (!hot) return true
  // Handsontable 버전별로 다름: 함수/불리언 모두 방어
  if (hot._isDestroyed) return true
  if (hot.isDestroyed === true) return true
  if (typeof hot.isDestroyed === 'function' && hot.isDestroyed()) return true
  return false
}

function stopAllWatches() {
  for (const stop of stopHandles) stop && stop()
  stopHandles.length = 0
}

function safe(fn) {
  const hot = hotInstance.value
  if (!alive) return
  if (isHotDestroyed(hot)) return
  try {
    fn(hot)
  } catch (e) {
    // 여기서 콘솔 스팸 막고 싶으면 주석 해제
    // console.warn('[BaseHotTable] ignored error:', e)
  }
}

/**
 * destroy 이후에도 Handsontable 내부에서 hook/접근이 튈 수 있어서
 * - hook을 빈 함수로 덮어 이벤트 전파 차단
 * - getSettings 같은 postMortem throw를 안 하게 덮어 안정화
 */
function neutralize(inst) {
  if (!inst) return
  try {
    inst.updateSettings({
      afterChange: null,
      afterSelection: null,
      afterOnCellMouseDown: null,
      beforeDestroy: null,
    })
  } catch (e) {}

  try {
    inst.getSettings = () => ({})
  } catch (e) {}
  try {
    inst.isDestroyed = () => true
  } catch (e) {}
}

function destroyHot() {
  alive = false
  stopAllWatches()

  const inst = hotInstance.value
  hotInstance.value = null

  if (!inst) return

  // 먼저 이벤트/throw 무력화
  neutralize(inst)

  // 포커스가 남아있으면 내부 이벤트가 더 튈 수 있어 blur
  try {
    document.activeElement?.blur?.()
  } catch (e) {}

  // 최종 destroy
  try {
    if (!isHotDestroyed(inst)) inst.destroy()
  } catch (e) {
    // ignore
  } finally {
    neutralize(inst)
  }
}

onMounted(() => {
  alive = true

  const inst = new Handsontable(container.value, {
    data: props.data,
    colHeaders: props.colHeaders,
    columns: props.columns,
    colWidths: props.colWidths,
    rowHeaders: props.rowHeaders,
    height: props.height,
    stretchH: props.stretchH,


    licenseKey: 'non-commercial-and-evaluation',
    className: 'ht-theme-main',

    // 언마운트 중에 Handsontable이 스스로 뭔가 하려는 타이밍 차단용
    beforeDestroy() {
      alive = false
    },

    afterChange(changes, source) {
      if (!alive) return
      props.afterChange?.(changes, source)
    },
    afterSelection(r, c, r2, c2) {
      if (!alive) return
      props.afterSelection?.(r, c, r2, c2)
    },
    afterOnCellMouseDown(event, coords, TD) {
      if (!alive) return
      if (!coords) return
      props.afterOnCellMouseDown?.(event, coords, TD)
    },
  })

  hotInstance.value = inst

  // ✅ watch는 "destroy 이후 호출"만 막으면 됨. flush:'sync'는 불필요하게 타이밍 꼬이게 함.
  stopHandles.push(
    watch(
      () => props.data,
      (v) => safe((h) => h.loadData(v)),
      { deep: true } // row 내부 변경을 반영해야 하면 유지
    ),
  )
  stopHandles.push(
     watch(
        () => props.colWidths,
        (v) => safe((h) => h.updateSettings({ colWidths: v })),
        { deep: true }
    )
  )

  stopHandles.push(
    watch(
      () => props.columns,
      (v) => safe((h) => h.updateSettings({ columns: v })),
      { deep: true }
    )
  )

  stopHandles.push(
    watch(
      () => props.colHeaders,
      (v) => safe((h) => h.updateSettings({ colHeaders: v })),
      { deep: true }
    )
  )

  stopHandles.push(
    watch(
      () => props.rowHeaders,
      (v) => safe((h) => h.updateSettings({ rowHeaders: v }))
    )
  )

  stopHandles.push(
    watch(
      () => props.height,
      (v) => safe((h) => h.updateSettings({ height: v }))
    )
  )

  stopHandles.push(
     watch(() => props.stretchH, (v) => safe((h) => h.updateSettings({ stretchH: v })))
  )

})

onBeforeUnmount(() => {
  destroyHot()
})

defineExpose({ hotInstance, destroyHot })
</script>

<style>
.ht_clone_top th {
  background-color: #BCAAA4;
  color: #000;
}
</style>
