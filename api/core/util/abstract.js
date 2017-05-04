'use strict';

/**
 * Nests dot-notation keys of objects into hierarchy
 * @param  {Object} object  -- object with dot-notation keys
 * @return {Object}         -- nested keys object    
 */
const nestKeys = object => {
  const result = {};
  for (let key in object) {
    const levels = key.split('.');
    let _pointer = result;
    let _key = levels[0];
    for (let i = 1; i < levels.length; i++) {      
      if (!_pointer[_key])
        _pointer[_key] = {};
      _pointer = _pointer[_key];
      _key = levels[i];
    }
    _pointer[_key] = object[key];
  }
  return result;
};

/**
 * Returns random unit from array
 */
function randomArrayUnit(array) {
  const idx = Math.floor(Math.random()*array.length);
  return array[idx];
}

module.exports = { nestKeys, randomArrayUnit };