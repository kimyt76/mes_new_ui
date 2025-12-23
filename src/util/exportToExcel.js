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

  // 5) 자동 컬럼 너비
  worksheet["!cols"] = visibleColumns.map(col => ({
    wch: Math.max((col?.props?.header?.length ?? 5) * 2, 10)
  }));

  // 6) 엑셀 워크북 생성 및 다운로드
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, fileName);
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
