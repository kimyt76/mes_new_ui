// utils/exportToExcel.ts
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// export function exportToExcel(data: any[], filename: string) {
export function exportToExcel(headers, data, filename) {
  //console.log('data', data)
  console.log('headers', typeof headers)
  const headerTitles = headers.value.map(h => h.title)
  console.log('headerTitles', headerTitles)
  const headerKeys = headers.value.map(h => h.key)
  console.log('headerKeys', headerKeys)
  const formattedData = data.map(item => {
    const row = {}
    headerKeys.forEach((key, idx) => {
      row[headerTitles[idx]] = item[key]
    })
    return row
  })

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });

  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  saveAs(blob, `${filename}.xlsx`);
}
