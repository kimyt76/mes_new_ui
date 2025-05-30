/**
 * key-value 리스트를 받아서 formData에 append
 * @param {FormData} formData
 * @param {Array} entries [ [key, value], ... ]
 */
export function appendEntries(formData, entries) {
  entries.forEach(([key, value]) => {
    formData.append(key, value);
  });
}

/**
 * 파일과 ID를 처리해서 formData에 append
 * @param {FormData} formData
 * @param {Array} files [ { file, fileKey, idKey, id }, ... ]
 */
export function appendFiles(formData, files) {
  files.forEach(({ file, fileKey, idKey, id }) => {
    if (file instanceof File) {
      formData.append(fileKey, file);
    } else {
      formData.append(idKey, id);
    }
  });
}
