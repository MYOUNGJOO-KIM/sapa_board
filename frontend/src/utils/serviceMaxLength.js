// src/utils/serviceMaxLength.js

import { CAT_CD_MAX_LENGTH, CAT_NM_MAX_LENGTH, MGT_NM_MAX_LENGTH, DATA_TYPE_MAX_LENGTH, MGT_ORDER_SEQ_MIN_SIZE, MGT_ORDER_SEQ_MAX_SIZE, PRF_NM_MAX_LENGTH, PRF_DESC_MAX_LENGTH, FILES_MAX_LENGTH, CONTENT_MAX_LENGTH } from './maxLength';

//CATEGORY_MAX_LENGTH
export const CATEGORY_MAX_LENGTH = {
    catCd: CAT_CD_MAX_LENGTH,
    catNm: CAT_NM_MAX_LENGTH
}

//MGT_MAX_LENGTH
export const MGT_MAX_LENGTH = {
    catCd: CAT_CD_MAX_LENGTH,
    catNm: CAT_NM_MAX_LENGTH,
    mgtNm: MGT_NM_MAX_LENGTH,
    dataType: DATA_TYPE_MAX_LENGTH,
    mgtOrderSeqMinSize: MGT_ORDER_SEQ_MIN_SIZE,
    mgtOrderSeqMaxSize: MGT_ORDER_SEQ_MAX_SIZE
}

//DATA_MAX_LENGTH
export const DATA_MAX_LENGTH = {
    catCd: CAT_CD_MAX_LENGTH,
    catNm: CAT_NM_MAX_LENGTH,
    prfNm: PRF_NM_MAX_LENGTH,
    prfDesc: PRF_DESC_MAX_LENGTH,
    fileList: FILES_MAX_LENGTH
}

//DATA_MGT_MAX_LENGTH
export const DATA_MGT_MAX_LENGTH = {
    content: CONTENT_MAX_LENGTH
}