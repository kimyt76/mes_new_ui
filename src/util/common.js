/**
 * 숫자만 표시 체크
 * @param {*} value
 * @returns
 */
export function unformatNumber (value) {
  return value.replace(/[^\d]/g, '')
}


export function deleteComma (value){
  if (typeof value !== 'string') {
    value = String(value ?? '');
  }
  return parseInt(value.replaceAll(',', ''), 10);
}

import { subMonths, addMonths, format } from 'date-fns'

/**
 *  날짜 2025-05-31  형식
 */
export function toDate() {
  return format(new Date(), 'yyyy-MM-dd')
}

/**
 *   월 계산 (더하기)
 */
export function addMonth(date) {
  const nextMonth = addMonths(date, 1); // 월 +1
  return format(nextMonth, 'yyyy-MM-dd')
}

/**
 *   월 계산 (빼기)
 */
export function minMonth(date) {
  const prevMonth = subMonths(date, 1); // 월 -1
  return format(prevMonth, 'yyyy-MM-dd')
}

/**
 *  월의 1일
 * @returns
 */
export function firstDateDay(){
  var date = new Date();
  return  new Date(date.getFullYear(), date.getMonth(), 1);
}
