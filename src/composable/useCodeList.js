// composables/useCodeList.js
import { ApiCommon } from '@/api/apiCommon';
import { isRef, onMounted, ref, watch } from 'vue';

export function useCodeList(groupCode) {
  const codes = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const load = async () => {
    const code = isRef(groupCode) ? groupCode.value : groupCode;
    if (!code) return;

    loading.value = true;
    error.value = null;

    try {
      const list = await ApiCommon.getCodeList(code);
      codes.value = list || [];
    } catch (e) {
      console.error('getCodeList error:', e);
      error.value = e;
    } finally {
      loading.value = false;
    }
  };

  onMounted(load);

  // groupCode가 computed/ref일 때만 watch
  if (isRef(groupCode)) {
    watch(groupCode, () => {
      load();
    });
  }

  return {
    codes,
    loading,
    error,
    reload: load,
  };
}
