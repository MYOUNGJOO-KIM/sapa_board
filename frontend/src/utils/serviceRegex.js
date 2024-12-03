// src/utils/serviceRegex.js

import { hasSpace, hasSpecialOrSpace, isNumeric, isValidDateTime, isValidYear, isValidMonth, isValidDay, isEmail, isPhoneNumber, isStrongPassword } from './regex';

//categoryRegex
export const categoryRegex = {
    catCd: hasSpecialOrSpace,
    catNm: hasSpace
}

//mgtRegex
export const mgtRegex = {
    catCd: hasSpecialOrSpace,
    catNm: hasSpace,
    mgtNm: hasSpecialOrSpace,
    dataType: hasSpace,
    mgtOrderSeq: isNumeric
}

//dataRegex
export const dataRegex = {
    catCd: hasSpecialOrSpace,
    catNm: hasSpace,
    prfNm: hasSpace,
    prfDesc: hasSpace,
    fileList: hasSpace
}

//dataMgtRegex
export const dataMgtRegex = {
    yyyyMMddhhmmss : isValidDateTime,
    yyyy : isValidYear,
    MM : isValidMonth,
    dd : isValidDay,
    text : hasSpace,
    number : isNumeric
}