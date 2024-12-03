// src/utils/regex.js

// 공백 체크
export const hasSpace = /[^\s*$]/;

// 숫자, 알파벳, 한글, 밑줄 허용
export const hasSpecialOrSpace = /^[a-zA-Z0-9_가-힣]+$/;

// 이메일 체크 (간단한 이메일 형식)
export const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

// 전화번호 체크 (10자리 또는 11자리 숫자)
export const isPhoneNumber = /^\d{10,11}$/;

// 숫자만 허용 (음수 포함)
export const isNumeric = /^-?\d+$/;

// 영어 대소문자 + 숫자 + 특수문자 체크
export const isStrongPassword = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

// 연월일시
export const isValidDateTime = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

// 연도
export const isValidYear = /^(1[0-9]{3}|20[0-9]{2}|19[0-9]{2})$/;

// 월
export const isValidMonth = /^(0[1-9]|1[0-2]|[1-9])$/;

// 일자
export const isValidDay = /^(0?[1-9]|[12][0-9]|3[01])$/;

