export const checkTestNoItem = (testNo, testItemCd = null, rowItemCd = null) => {
    if (!testNo) {
        return {
            valid: false,
            message: '시험번호를 입력해주세요.'
        }
    }

    if (testNo.length !== 11) {
        return {
            valid: false,
            message: '시험번호는 11자리여야 합니다.'
        }
    }

    // 길이만 체크하는 경우
    if (testItemCd === null && rowItemCd === null) {
        return {
            valid: true,
            message: ''
        }
    }

    if (!testItemCd) {
        return {
            valid: false,
            message: '시험번호에 해당하는 품목정보가 없습니다.'
        }
    }

    if (testItemCd !== rowItemCd) {
        return {
            valid: false,
            message: '시험번호의 품목과 선택한 품목이 일치하지 않습니다.'
        }
    }

    return {
        valid: true,
        message: ''
    }
}
