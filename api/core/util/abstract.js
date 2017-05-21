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

/**
 * Rolls a chance, returns boolean
 */
const rollWithChance = chance =>
  Math.random() <= chance;

/**
 * Returns random key from Puasson's veriety hash.
 * Key's value correlates possibility of it's happening.
 * @param  {Object} veriety   -- veriety hash contains key's appear possibility
 * @return {String}           -- one of veriety's keys
 */
const rollVariety = veriety => {
  const summ = Object.keys(veriety).map(k => veriety[k]).reduce((a, v) => a+v, 0);
  let randomValue =  Math.random() * (summ);
  let tempSumm = 0;
  let result = null;
  Object.keys(veriety).some(key => {
    tempSumm += veriety[key];
    if(randomValue < tempSumm){
      result = key;
      return true;
    }
  });
  return result;
};

module.exports = { nestKeys, randomArrayUnit, rollWithChance, rollVariety };