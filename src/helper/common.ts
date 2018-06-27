import * as fs from 'fs';
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
  return obj == undefined;
};

/**
 * check is number
 * @param val
 * @returns {boolean}
 */
const isNumber = (val) => {
  return (typeof val === 'number') && !isNaN(val);
};

/**
 * 检查数据源文件是否存在
 * @param path
 * @returns {boolean}
 */
const checkFileExists = (path) => {
  try {
    fs.statSync(path);
    return fs.existsSync(path);
  } catch (e) {
    return false;
  }
};

/**
 * check folder exist
 * @param path_
 * @param mkdir
 * @returns {boolean}
 */
const checkFolderExist = (path_, mkdir) => {
  const paths = path.normalize(path_).split(path.sep);
  let currentPath = paths[0];
  let result = true;
  for (let i = 1; i < paths.length; i++) {
    currentPath += path.sep + paths[i];
    if (!fs.existsSync(currentPath)) {
      if (mkdir) {
        fs.mkdirSync(currentPath);
      }
      result = false;
    }
  }
  return result;
};

export {
  isNull,
  isNumber,
  resolve,
  isObject,
  isFunction,
  checkFileExists,
  checkFolderExist
};
