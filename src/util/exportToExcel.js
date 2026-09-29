import * as XLSX from "xlsx";

export function exportToExcel(data, fileName, columns) {
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


  // 1) 숨김(hidden) 컬럼 제거
  const visibleColumns = columns.filter(col => {
    return getColumnProp(col, "hidden") !== true;
  });


  // 2) 데이터 변환
  const formattedData = data.map(row => {

    const newRow = {};

    visibleColumns.forEach(col => {

      const field = getColumnProp(col, "field");
      const header = getColumnProp(col, "header");

      if (!field) return;

      newRow[header ?? field] = row[field];

    });

    return newRow;
  });


  // 3) 시트 생성
  const worksheet =
    XLSX.utils.json_to_sheet(formattedData);

  // 데이터 없는 경우 방지
  if (!worksheet["!ref"]) return;

  // 4) 숫자 우측 정렬 + 천단위 콤마
  const range =
    XLSX.utils.decode_range(
      worksheet["!ref"]
    );


  for (let R = 1; R <= range.e.r; R++) {
    for (let C = 0; C <= range.e.c; C++) {
      const cellAddress =
        XLSX.utils.encode_cell({
          r: R,
          c: C
        });
      const cell = worksheet[cellAddress];

      if (!cell) continue;


      if (typeof cell.v === "number") {
        cell.t = "n";
        cell.z = "#,##0";
        cell.s = { alignment: { horizontal: "right" } };
      }
    }
  }


  /**
   * 한글 / 영문 / 숫자 너비 계산
   */
  const getTextWidth = (value) => {
    if ( value === null || value === undefined ) {
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


  // 5) 자동 컬럼 너비
  worksheet["!cols"] = visibleColumns.map(col => {

      const field = getColumnProp( col, "field" );
      const header = getColumnProp( col, "header" ) ?? "";
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
          Math.max(
            maxWidth + 2,
            10
          ),
          50
        )
      };

    });


  // 6) 워크북 생성
    const workbook =
        XLSX.utils.book_new();
        XLSX.utils.book_append_sheet( workbook, worksheet, fileName );
        XLSX.writeFile( workbook, `${fileName}.xlsx` );
    }
