import * as XLSX from "xlsx";

export function exportToExcel(data, fileName, columns) {
  if (!data || data.length === 0) return;

  // 1) 숨김(hidden) 컬럼 제거
  const visibleColumns = columns.filter(col => !col.props.hidden);

  // 2) 데이터 변환
  const formattedData = data.map(row => {
    const newRow = {};
    visibleColumns.forEach(col => {
      const field = col?.props?.field;
      const header = col?.props?.header;
      if (!field) return;

      let value = row[field];
      newRow[header] = value;
    });
    return newRow;
  });

  // 3) 시트 생성
  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  // 4) 숫자 → 우측 정렬 + 천단위 콤마 포맷 적용
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  for (let R = 1; R <= range.e.r; R++) {   // 데이터(row) loop
    for (let C = 0; C <= range.e.c; C++) { // 컬럼 loop
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = worksheet[cellAddress];
      if (!cell) continue;

      if (typeof cell.v === "number") {
        cell.t = "n";
        cell.z = "#,##0";

        cell.s = {
          alignment: { horizontal: "right" }
        };
      }
    }
  }

  // 한글/영문/숫자 기준 문자열 너비 계산
  const getTextWidth = (value) => {
    if (value === null || value === undefined) return 0;

    return String(value)
      .split('')
      .reduce((width, char) => {
        const code = char.charCodeAt(0);

        if (code > 255) {
          return width + 2;
        }

        return width + 1;
      }, 0);
  };

  // 5) 자동 컬럼 너비
  worksheet["!cols"] = visibleColumns.map(col => {
    const field = col?.props?.field;
    const header = col?.props?.header ?? "";

    let maxWidth = getTextWidth(header);

    data.forEach(row => {
      const value = row[field];
      const valueWidth = getTextWidth(value);

      if (valueWidth > maxWidth) {
        maxWidth = valueWidth;
      }
    });

    return {
      wch: Math.min(Math.max(maxWidth + 2, 10), 50)
    };
  });

  // 6) 엑셀 워크북 생성 및 다운로드
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, fileName);
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
