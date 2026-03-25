<template>
  <div class="edit-table-wrap">
    <DataTable
      v-model:selection="innerSelection"
      :value="modelValue"
      :dataKey="dataKey"
      :editMode="editMode"
      :scrollable="scrollable"
      :scrollHeight="scrollHeight"
      :showGridlines="showGridlines"
      class="common-edit-table"
      @cell-edit-complete="handleCellEditComplete"
      :pt="{
        table: { style: tableStyle },
        column: {
          bodycell: ({ state }) => ({
            class: [{ 'cell-editing': state['d_editing'] }]
          })
        }
      }"
    >
      <Column
        v-if="selectable"
        :selectionMode="selectionMode"
        :headerStyle="{ width: selectionWidth }"
        style="text-align: center;"
      />

      <Column
        v-for="col in normalizedColumns"
        :key="col.field"
        :field="col.field"
        :header="col.header"
        :headerStyle="getHeaderStyle(col)"
        :bodyStyle="getBodyStyle(col)"
      >
        <template #body="{ data }">
          <slot
            v-if="$slots[`body-${col.field}`]"
            :name="`body-${col.field}`"
            :data="data"
            :field="col.field"
            :column="col"
          />
          <template v-else>
            <div :class="getBodyClass(col)">
              {{ data[col.field] }}
            </div>
          </template>
        </template>

        <template #editor="{ data, field }">
          <slot
            v-if="$slots[`editor-${col.field}`]"
            :name="`editor-${col.field}`"
            :data="data"
            :field="field"
            :column="col"
          />
          <template v-else>
            <InputText
              v-if="col.editor === 'text'"
              v-model="data[field]"
              autofocus
              class="w-full"
            />

            <Textarea
              v-else-if="col.editor === 'textarea'"
              v-model="data[field]"
              autoResize
              rows="1"
              autofocus
              class="w-full"
            />

            <InputNumber
              v-else-if="col.editor === 'number'"
              v-model="data[field]"
              autofocus
              inputClass="w-full"
            />

            <Select
              v-else-if="col.editor === 'select'"
              v-model="data[field]"
              :options="col.options || []"
              :optionLabel="col.optionLabel || 'label'"
              :optionValue="col.optionValue || 'value'"
              autofocus
              class="w-full"
            />

            <InputText
              v-else
              v-model="data[field]"
              autofocus
              class="w-full"
            />
          </template>
        </template>
      </Column>

      <Column v-if="showDelete" field="actions"
        :header="deleteHeader"
        :headerStyle="{ width: deleteWidth, minWidth: deleteWidth, textAlign: 'center' }"
        :bodyStyle="{ width: deleteWidth, minWidth: deleteWidth, textAlign: 'center' }"
       >
        <template #body="slotProps">
          <slot name="delete" :row="slotProps.data" :index="slotProps.index">
            <i class="pi pi-trash cursor-pointer" @click="$emit('remove-row', slotProps.index)"></i>
          </slot>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] },
  dataKey: { type: String, required: true },
  selection: { type: [Array, Object, null], default: null },
  selectable: { type: Boolean, default: false },
  selectionMode: { type: String, default: 'multiple' },
  selectionWidth: { type: String, default: '3rem' },
  editMode: { type: String, default: 'cell' },
  scrollable: { type: Boolean, default: true },
  scrollHeight: { type: String, default: 'flex' },
  showGridlines: { type: Boolean, default: true },
  tableStyle: { type: String, default: 'min-width: 1200px; table-layout: fixed;' },
  showDelete: { type: Boolean, default: false },
  deleteHeader: { type: String, default: '-' },
  deleteWidth: { type: String, default: '40px' },
  validators: { type: Object, default: () => ({}) }
})

const emit = defineEmits([
  'update:modelValue',
  'update:selection',
  'cell-edit-complete',
  'remove-row'
])

const innerSelection = ref(props.selection)

watch(
  () => props.selection,
  (val) => {
    innerSelection.value = val
  }
)

watch(innerSelection, (val) => {
  emit('update:selection', val)
})

const normalizedColumns = computed(() =>
  props.columns.map((col) => ({
    editor: 'text',
    align: 'left',
    multiline: false,
    editable: true,
    ...col
  }))
)

const getHeaderStyle = (col) => ({
  width: col.width,
  minWidth: col.width,
  textAlign: col.align || 'left'
})

const getBodyStyle = (col) => ({
  width: col.width,
  minWidth: col.width,
  textAlign: col.align || 'left',
  verticalAlign: col.multiline ? 'top' : 'middle'
})

const getBodyClass = (col) => ({
  'cell-text': true,
  'single-line-center': !col.multiline && col.align === 'center',
  'single-line-left': !col.multiline && col.align !== 'center',
  'multiline-cell': col.multiline
})

const handleCellEditComplete = (event) => {
  const { field, newValue, data } = event
  const validator = props.validators[field]

  if (validator) {
    const result = validator(newValue, data, field, event)

    if (result === false) {
      event.preventDefault()
      return
    }

    if (result !== undefined) {
      data[field] = result
      emit('cell-edit-complete', event)
      emit('update:modelValue', [...props.modelValue])
      return
    }
  }

  data[field] = newValue
  emit('cell-edit-complete', event)
  emit('update:modelValue', [...props.modelValue])
}
</script>

<style scoped>
.edit-table-wrap {
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

:deep(.common-edit-table.p-datatable) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.common-edit-table .p-datatable-wrapper) {
  flex: 1;
  min-height: 0;
}

:deep(.common-edit-table .p-datatable-thead > tr > th) {
  background-color: #bcaaa4;
  color: white;
  font-size: 14px;
  text-align: center;
  font-family: monaco, Consolas;
}

:deep(.common-edit-table .p-inputtext),
:deep(.common-edit-table .p-textarea),
:deep(.common-edit-table .p-inputnumber-input) {
  width: 100%;
  box-sizing: border-box;
}

:deep(.common-edit-table .cell-editing) {
  padding-top: 4px !important;
  padding-bottom: 4px !important;
}

.cell-text {
  width: 100%;
  box-sizing: border-box;
  line-height: 1.4;
}

.single-line-center {
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.single-line-left {
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.multiline-cell {
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
