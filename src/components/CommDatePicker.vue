<template>
    <PrimeDatePicker
        v-bind="$attrs"
        :modelValue="innerDate"
        :dateFormat="dateFormat"
        :selectionMode="selectionMode"
        :timeOnly="timeOnly"
        :showTime="showTime"
        @update:modelValue="onChange"
    />
</template>

<script setup>
import { formatDate, parseDate } from '@/util/common';
import PrimeDatePicker from 'primevue/datepicker';
import { computed } from 'vue';

defineOptions({
    inheritAttrs: false
});

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
    },
    timeOnly: {
        type: Boolean,
        default: false
    },
    showTime: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:modelValue']);

// 시간 문자열을 Date 객체로 변환
const parseTime = (value) => {
    if (!value) return null;

    if (value instanceof Date) return value;

    if (typeof value !== 'string') return null;

    const match = value.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);

    if (!match) return null;

    const hh = Number(match[1]);
    const mm = Number(match[2]);
    const ss = Number(match[3] ?? 0);

    if (hh > 23 || mm > 59 || ss > 59) return null;

    const date = new Date();
    date.setHours(hh, mm, ss, 0);

    return date;
};

// 날짜+시간 문자열을 Date 객체로 변환
const parseDateTime = (value) => {
    if (!value) return null;

    if (value instanceof Date) return value;

    if (typeof value !== 'string') return null;

    const match = value.match(
        /^(\d{4}-\d{2}-\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/
    );

    if (!match) return parseDate(value);

    const date = parseDate(match[1]);

    if (!date) return null;

    const hh = Number(match[2]);
    const mm = Number(match[3]);
    const ss = Number(match[4] ?? 0);

    if (hh > 23 || mm > 59 || ss > 59) return null;

    date.setHours(hh, mm, ss, 0);

    return date;
};

const toPickerDate = (value) => {
    if (!value) return null;

    if (value instanceof Date) return value;

    if (props.timeOnly) {
        return parseTime(value);
    }

    if (props.showTime) {
        return parseDateTime(value);
    }

    return parseDate(value);
};

const innerDate = computed(() => {
    const value = props.modelValue;

    if (Array.isArray(value)) {
        return value.map(toPickerDate);
    }

    return toPickerDate(value);
});

// 날짜+시간 문자열 변환
const formatDateTime = (date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        return null;
    }

    const dateStr = formatDate(date);
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');

    return `${dateStr} ${hh}:${mm}`;
};

const onChange = (value) => {

    if (!value) {
        emit('update:modelValue', null);
        return;
    }

    // 1. 시간 전용: Date 객체 그대로 유지
    if (props.timeOnly) {
        emit('update:modelValue', value);
        return;
    }

    // 2. 날짜+시간
    if (props.showTime) {
        const result = Array.isArray(value)
            ? value.map(v => v ? formatDateTime(v) : null)
            : formatDateTime(value);

        emit('update:modelValue', result);
        return;
    }

    // 3. 일반 날짜 및 기간 선택
    const result = Array.isArray(value)
        ? value.map(v => v ? formatDate(v) : null)
        : formatDate(value);

    emit('update:modelValue', result);
};
</script>
