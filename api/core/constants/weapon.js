'use strict';

const ireq = require('ireq');
const util = ireq.util('abstract');

module.exports = util.hashObject({
  // damage types
  DT: ['crushing', 'slashing', 'piercing'],
});