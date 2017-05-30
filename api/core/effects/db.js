'use strict';

const ireq = require('ireq');
const TIME = ireq.util('time');

module.exports = {

  // bleeding
  'bleeding': {
    effect: {
      healthRegen: { set: 0 },
      endurence: { mod: -1 },
      health: { tick: -1 }
    },
    duration: 3 * TIME.DAY
  },

  // heavy bleeding
  'heavyBleeding': {
    effect: {
      healthRegen: { set: 0 },
      endurence: { mod: -3 },
      health: { tick: -2 }
    },
    duration: TIME.INFINITY
  },  

  // stunning
  'stun': {
    effect: {
      initiative: { set: 0 }
    },
    duration: 5 * TIME.SECOND
  }
};
