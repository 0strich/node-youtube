const _ = require("lodash");

// 값이 있는지 확인
const isExist = (data) => {
  const emptyType = [undefined, null, NaN, false];
  const emptyString = ["undefined", "null", "NaN", "false", ""];
  const emptyArray = [...emptyType, ...emptyString];

  if (typeof data === "object") {
    return !_.isEmpty(data) ? true : false;
  } else {
    return !emptyArray.includes(data) ? true : false;
  }
};

// 현재 시간에서 초 추가
const addSecondsDate = (numOfSeconds, date = new Date()) => {
  date.setSeconds(date.getSeconds() + numOfSeconds);
  return date;
};

// 두 날짜 시간차
const diffDate = (date1 = new Date(), date2 = new Date()) => {
  return ((date2 - date1) / 1000).toFixed(0);
};

// 개체 null, undefined, 공백 제거
const cleanObject = (object = {}) => {
  const cleanElements = [null, undefined, "null", "undefined"];
  const cleanObject = { ...object };

  // 문자열 좌우 공백 제거
  Object.keys(cleanObject).forEach((key) => {
    if (typeof cleanObject[key] === "string") {
      cleanObject[key] = cleanObject[key].trim();
    }
  });

  // 불필요 속성 제거(ex, null, undefined)
  const propNames = Object.getOwnPropertyNames(cleanObject);
  for (let i = 0; i < propNames.length; i++) {
    const propName = propNames[i];
    if (cleanElements.includes(cleanObject[propName])) {
      delete cleanObject[propName];
    }
  }

  return cleanObject;
};

const timestamp = new Date().getTime().toString();

module.exports = { isExist, addSecondsDate, diffDate, cleanObject, timestamp };
