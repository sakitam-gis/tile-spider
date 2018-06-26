import * as path from 'path';

/**
 * resolve path
 * @param _path
 */
const resolve = _path => path.resolve(__dirname, '..', _path);

export {
  resolve
};
