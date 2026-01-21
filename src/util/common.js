import { ApiCommon } from "@/api/apiCommon";

/**
 * 숫자만 표시 체크
 * @param {*} value
 * @returns
 */
export function unformatNumber (value) {
  return value.replace(/[^\d]/g, '')
}

//숫자콤마 제거
export function toNumber(v){
  if (v === null || v === undefined || v === '') return 0
  // "1,234" 같은 값 대비
  return Number(String(v).replaceAll(',', '')) || 0
}

import { format, subMonths } from 'date-fns';

/**
 *  날짜 2025-05-31  형식
 */
export function toDate() {
  return format(new Date(), 'yyyy-MM-dd')
}

/**
 *   월 계산 (더하기)
 */
export function addMonth(date, amount) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + amount);

  return d.toISOString().substring(0, 10);
}

/**
 *   월 계산 (빼기)
 */
export function minMonth(date) {
  const prevMonth = subMonths(date, 1); // 월 -1
  return format(prevMonth, 'yyyy-MM-dd')
}

/**
 *   월 계산 (빼기)
 */
export function addDay(date, amount) {
  const d = new Date(date);
  d.setDate(d.getDate() + amount);

  return d.toISOString().substring(0, 10);
}


/**
 *  월의 1일
 * @returns
 */
export function firstDateDay(){
  var date = new Date();
  return  new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 *  KST 날짜 시간
 */
export function todayKST () {
  const date = new Date()
  // UTC → KST (UTC+9)
  date.setHours(date.getHours() + 9)
  return date.toISOString().split('T')[0] // YYYY-MM-DD 형식
}

export function formatDate (value) {
  if (!value) return ''
  const d = new Date(value)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  //console.log('yyyy', `${yyyy}-${mm}-${dd}`)
  return `${yyyy}-${mm}-${dd}`
}

/**
 *   빈 값 체크
 */
export function isEmpty(input) {
  // 1) undefined / null
  if (input === undefined || input === null) return true;

  // 2) Date: 유효하지 않은 Date만 empty
  if (input instanceof Date) return Number.isNaN(input.getTime());

  // 3) 문자열: 공백 제거 후 빈 문자열, "null"
  if (typeof input === "string") {
    const s = input.trim();
    return s === "" || s.toLowerCase() === "null";
  }

  // 4) 배열: 길이 0이면 empty
  if (Array.isArray(input)) return input.length === 0;

  // 5) 그 외 객체: 키가 없으면 empty
  if (typeof input === "object") return Object.keys(input).length === 0;

  // 6) 숫자/boolean/function 등은 empty 아님
  return false;
}


/**
 *  item cd 채번
 */
export async function makeItemCd(itemTypeCd, itemL, itemM){
  let itemCd = ''
  const com = 'J'
  let cd = ''
  let seqLen = 0
  let seq = ''

  /**
   * 원재료
   */
  if ( itemTypeCd === "M1" ) {
    cd = com+'RM'+itemL+itemM
    seqLen = 5
    itemCd = await ApiCommon.newSeq(itemTypeCd, cd, seqLen)
  }else if ( itemTypeCd === "M4"){
    cd = com+itemL+itemM
    seqLen = 4
    itemCd = await ApiCommon.newSeq(itemTypeCd, cd, seqLen)
  }

  return itemCd
}

// M0	완제품
// M1	원재료
// M2	부자재
// M3	반제품
// M4	제품
// M5	벌크제품
// M6	포장품
// M7	소모품
export const typeCd = (cd) => {
  if ( cd === "M0" ){
    return "AF"
  }else if ( cd === "M3" ){
    return '1I'
  }else if ( cd === "M5" ){
    return '1B'
  }else if ( cd === "M6" ){
    return 'AP'
  }
}

export const typeNm = (cd) => {
  if ( cd === "M0" ){
    return "[완제품]"
  }else if ( cd === "M1" ){
    return "[원재료]"
  }else if ( cd === "M2" ){
    return '[부자재]'
  }else if ( cd === "M3" ){
    return '[반제품]'
  }else if ( cd === "M4" ){
    return '[제품]'
  }else if ( cd === "M5" ){
    return '[벌크제품]'
  }else if ( cd === "M6" ){
    return '[포장품]'
  }else if ( cd === "M7" ){
    return '[소모품]'
  }
}


export function replaceString(str, type) {
  return str.replace(/\[+\s*(.*?)\s*\]+/g, `${typeNm(type)}`);
}

export const formatComma = (value) =>{
  if (value === null || value === undefined || value === '') return '';

  const numeric = value.toString().replace(/,/g, '');

  if (isNaN(numeric)) return 0;
  // toLocaleString은 자동으로 음수, 소수점 포함
  return Number(numeric).toLocaleString(undefined, { maximumFractionDigits: 20 });
}

export const parseCommaInput = (value) => {
  // 모든 콤마 제거
  const numeric = value.replace(/,/g, '');

  if (numeric === '') return 0;

  // 숫자 유효성 체크 (음수, 소수점 포함)
  if (/^-?\d*(\.\d*)?$/.test(numeric)) {
    return Number(numeric);
  }

  return null;
}


export const incrementAlpabet = (cd) => {
  // 끝 두 글자 추출
  const match = cd.match(/(.)(.)$/);
  if (!match) return cd;

  const firstChar = match[1];
  const secondChar = match[2];

  // 첫 글자를 알파벳 +1
  const nextChar = String.fromCharCode(firstChar.charCodeAt(0) + 1);
  // 새 접미사
  const newSuffix = nextChar + secondChar;

  // 기존 문자열 앞부분 + 새 접미사
  return cd.slice(0, -2) + newSuffix;
}


export const incrementNumber = (cd) => {
  // 끝 두 글자 추출
  const match = cd.match(/(.)(.)$/);

  if (!match) return cd;

  const firstChar = match[1];
  const secondChar = match[2];

  // 첫 글자를 숫자 +1
  const nextChar =Number(firstChar)+1;

  // 새 접미사
  const newSuffix = nextChar + secondChar;

  // 기존 문자열 앞부분 + 새 접미사
  return cd.slice(0, -2) + newSuffix;
}


/**
 * 부가세
 * @param {*} supplyPrice
 * @returns
 */
export const calculateVAT = (supplyPrice) =>{
  let val = supplyPrice * 0.1
  return Math.round(val);
}

/**
 * 전화번호 포멧
 */
export const formatTelNo = (num) =>{
  const numbersOnly = num.replaceAll(/[^0-9]/g, "");
  let result ="";
  const length = numbersOnly .length;
    if(length === 8) {
        result = numbersOnly.replace(/(\d{4})(\d{4})/, '$1-$2');
    } else if(numbersOnly.startsWith("02") && (length === 9 || length === 10)) {
        result = numbersOnly.replace(/(\d{2})(\d{3,4})(\d{4})/, '$1-$2-$3');
    } else if(!numbersOnly.startsWith("02") && (length === 10 || length === 11)) {
        result = numbersOnly.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
    } else {
        result = undefined;
    }
    console.log(`${num} -> ${result}`);
    return result;
}


/**
 * 리스트에서 itemCd 를 추출하여 , 로 붙이기
 */
export const getItemCds = (list) =>{
    return list
        .map(item => item.itemCd)
        .filter(cd => cd != null && cd !== '')
        .join(',');
}

/**
 * 리스트에서 itemCd 를 추출하여 뒤에 2자리를 자르고  , 로 붙이기
 */
export const getItemCdCsv = (list) =>{
    return list
        .map(item => {
        const cd = item.itemCd;
        return cd ? cd.slice(0, -2) : cd;   // 끝 2자리 제거
        })
        .filter(cd => cd != null && cd !== '')
        .join(',');
}
