
import * as XLSX from "xlsx";

export function exportToExcel(data, fileName, columns, options = {}) {
  if (!data || data.length === 0) return;
  if (!columns || columns.length === 0) return;

  /**
   * PrimeVue Column
   *   col.props.field
   *
   * 직접 정의한 Column
   *   col.field
   *
   * 둘 다 지원
   */
  const getColumnProp = (col, name) => {
    return col?.props?.[name] ?? col?.[name];
  };

  // 엑셀 옵션
  const columnWidths = options.columnWidths ?? {};
  numberFormat: '#,##0.######;[Red]-#,##0.######;0'

  // 1) 숨김 컬럼 및 field 없는 컬럼 제거
  // 데이터와 너비 계산에 동일한 컬럼 목록 사용
  const visibleColumns = columns.filter(col => {
    const hidden = getColumnProp(col, "hidden");
    const field = getColumnProp(col, "field");

    return hidden !== true && field;
  });

  if (visibleColumns.length === 0) return;

  // 2) 데이터 변환
  const formattedData = data.map(row => {
    const newRow = {};

    visibleColumns.forEach(col => {
      const field = getColumnProp(col, "field");
      const header = getColumnProp(col, "header");

      newRow[header ?? field] = row[field];
    });

    return newRow;
  });

  // 3) 시트 생성
  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  if (!worksheet["!ref"]) return;

  // 4) 숫자 우측 정렬 + 천단위 콤마 + 소수점 옵션
  const range = XLSX.utils.decode_range(worksheet["!ref"]);

  for (let R = 1; R <= range.e.r; R++) {
    for (let C = 0; C <= range.e.c; C++) {
      const cellAddress = XLSX.utils.encode_cell({
        r: R,
        c: C
      });

      const cell = worksheet[cellAddress];

      if (!cell) continue;

      if (typeof cell.v === "number") {
            cell.t = "n";

            cell.z = Number.isInteger(cell.v)
                ? "#,##0"
                : "#,##0.######";

            cell.s = {
                alignment: { horizontal: "right" }
            };
        }
    }
  }

  /**
   * 한글 / 영문 / 숫자 너비 계산
   */
  const getTextWidth = (value) => {
    if (value === null || value === undefined) {
      return 0;
    }

    return String(value)
      .split("")
      .reduce((width, char) => {
        const code = char.charCodeAt(0);

        if (code > 255) {
          return width + 2;
        }

        return width + 1;
      }, 0);
  };

  // 5) 컬럼 너비 설정
  worksheet["!cols"] = visibleColumns.map(col => {
    const field = getColumnProp(col, "field");
    const header = getColumnProp(col, "header") ?? field;

    // 화면에서 지정한 너비가 있으면 우선 적용
    const fixedWidth =
      columnWidths[field] ?? columnWidths[header];

    if (
      fixedWidth !== undefined &&
      fixedWidth !== null &&
      Number.isFinite(Number(fixedWidth)) &&
      Number(fixedWidth) > 0
    ) {
      return {
        wch: Number(fixedWidth)
      };
    }

    // 별도 지정이 없으면 기존 자동 너비 계산
    let maxWidth = getTextWidth(header);

    data.forEach(row => {
      const value = row[field];
      const valueWidth = getTextWidth(value);

      if (valueWidth > maxWidth) {
        maxWidth = valueWidth;
      }
    });

    return {
      wch: Math.min(
        Math.max(maxWidth + 2, 10),
        50
      )
    };
  });

  // 6) 워크북 생성
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    fileName
  );

  XLSX.writeFile(
    workbook,
    `${fileName}.xlsx`
  );
}
