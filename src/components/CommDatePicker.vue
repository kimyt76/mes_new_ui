<template>
    <PrimeDatePicker
        v-bind="$attrs"
        :modelValue="innerDate"
        :dateFormat="dateFormat"
        :selectionMode="selectionMode"
        @update:modelValue="onChange"
    />
</template>

<script setup>
import { formatDate, parseDate } from '@/util/common';
import PrimeDatePicker from 'primevue/datepicker';
import { computed } from 'vue';

defineOptions({
    inheritAttrs: false
})

const props = defineProps({
    modelValue: {
        type: [String, Date, Array],
        default: null
    },
    dateFormat: {
        type: String,
        default: 'yy-mm-dd'
    },
    selectionMode: {
        type: String,
        default: 'single'
    }
})

const emit = defineEmits(['update:modelValue'])

const toPickerDate = (value) => {
    if (!value) return null

    if (value instanceof Date) {
        return value
    }

    return parseDate(value)
}

const innerDate = computed(() => {
    const value = props.modelValue

    if (Array.isArray(value)) {
        return value.map(toPickerDate)
    }

    return toPickerDate(value)
})

const onChange = (value) => {
    const result = Array.isArray(value)
        ? value.map(v => v ? formatDate(v) : null)
        : value ? formatDate(value) : null

    emit('update:modelValue', result)
}
</script>
