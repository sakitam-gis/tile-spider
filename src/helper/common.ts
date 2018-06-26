import * as path from 'path';

/**
 * resolve path
 * @param _path
 */
const resolve = _path => path.resolve(__dirname, '..', _path);

/**
 * 判断是否为对象
 * @param value
 * @returns {boolean}
 */
const isObject = value => {
  const type = typeof value;
  return value !== null && (type === 'object' || type === 'function');
};

/**
 * check is function
 * @param value
 * @returns {boolean}
 */
const isFunction = value => {
  if (!isObject(value)) {
    return false;
  }
  return typeof value === 'function' || (value.constructor !== null && value.constructor === Function);
};

/**
 * check is null
 * @param obj
 * @returns {boolean}
 */
const isNull = (obj) => {
  return obj == null;
};

/**
 * check is number
 * @param val
 * @returns {boolean}
 */
const isNumber = (val) => {
  return (typeof val === 'number') && !isNaN(val);
};

export {
  isNull,
  isNumber,
  resolve,
  isObject,
  isFunction
};
