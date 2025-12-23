import { ApiCommon } from '@/api/apiCommon';
import { useAlertStore } from '@/stores/alert';
import axios from 'axios';

const { vError } = useAlertStore()

export const download = async (attachFileId, seq) => {
  try {
    console.log('attachFileId', attachFileId)
    console.log('seq', seq)
    const response = await ApiCommon.download(attachFileId, seq);
    // const response = await axios.get('/files/download', {
    //   params: { attachFileId, seq },
    //   responseType: 'blob' // 중요한 설정!
    // });
    console.log('response', response.data)

    const blob = new Blob([response.data]);
    const fileName = getFileNameFromHeader(response.headers['content-disposition']) || 'downloaded_file';
    console.log('fileName',fileName)

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = decodeURIComponent(fileName);
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('파일 다운로드 실패:', error);
    vError('파일 다운로드 중 오류가 발생했습니다.');
  }
};

const getFileNameFromHeader = (disposition) => {
 if (!disposition) return null;

  // 우선 filename*=UTF-8'' 인코딩된 값을 먼저 확인
  const utf8Match = disposition.match(/filename\*=UTF-8''([^;\r\n]*)/);
  if (utf8Match && utf8Match[1]) {
    return decodeURIComponent(utf8Match[1].trim());
  }

  // fallback: 일반 filename="..." 형식
  const fallbackMatch = disposition.match(/filename="?([^"]+)"?/);
  if (fallbackMatch && fallbackMatch[1]) {
    return fallbackMatch[1].trim();
  }

  return null;
};
