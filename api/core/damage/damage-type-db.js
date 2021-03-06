'use strict';

const ireq = require('ireq');
const WEAPON = ireq.const('weapon');
const BODY = ireq.const('body');
const DT = WEAPON.DT;

// DT Structure
// - title: just a name
// - crit: hash of critical effects
// -- effects: add this effects if crit happens
// -- state: set at least this state if crit happens
// -- damageX: damage multiplicator
// -- chance: critical damage chance

module.exports = {
  [DT.crushing]: {
    title: 'crushing',
    crit: {
      [BODY.head]: {
        effects: ['stun'],
        damageX: 2,
        chance: 0.2,
      },
      default: {
        state: BODY.state.injured,
        damageX: 2,
        chance: 0.05,
      },
    },
  },
  [DT.slashing]: {
    title: 'slashing',
    crit: {
      [BODY.head]: {
        effects: ['death'],
        damageX: 2,
        chance: 0.2,
      },
      default: {
        state: BODY.state.wounded,
        damageX: 2,
        chance: 0.05,
      },
    },
  },
};