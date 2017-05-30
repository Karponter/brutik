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
 * Returns random float valua from range
 * @param  {Array} range  -- [from, to] array
 * @return {Number}       -- random arbitrary
 */
const rollRange = range =>
  Math.random()*(range[1]-range[0])+range[0];

/**
 * Returns random key from Puasson's variety hash.
 * Key's value correlates possibility of it's happening.
 * @param  {Object} variety   -- variety hash contains key's appear possibility
 * @return {String}           -- one of variety's keys
 */
const rollVariety = variety => {
  const summ = Object.keys(variety).map(k => variety[k]).reduce((a, v) => a+v, 0);
  let randomValue =  Math.random() * (summ);
  let tempSumm = 0;
  let result = null;
  Object.keys(variety).some(key => {
    tempSumm += variety[key];
    if(randomValue < tempSumm){
      result = key;
      return true;
    }
  });
  return result;
};

/**
 * Reads objects 1st level values and revertes them to keyed hashes.
 * Original object is placed into `legend` field.
 * Hash keys contains array indexes in approproate legend.
 * 0-index elements are placeholded and undefined in legend.
 * @param  {[type]} object [description]
 * @return {[type]}        [description]
 */
const hashObject = object => {
  const res = {legend: object};
  for (let key in object) {
    const list = object[key];
    const hash = {};
    list.forEach((e, i) => hash[e] = i+1);
    res[key] = hash;
  }
  return res;
};

module.exports = { nestKeys, randomArrayUnit, rollWithChance, rollVariety, hashObject, rollRange, };