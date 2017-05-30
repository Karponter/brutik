'use strict';

const ireq = require('ireq');
const WEAPON = ireq.const('weapon');
const DT = WEAPON.DT;

// durability -1 means infinite durability
// rarity is `common` be default
// damage variety is 1 be default

module.exports = {

  'fist': {
    damage: [
      {
        type: DT.crushing,
        power: [5, 10],
        variety: 1
      },
    ],
    weigth: 1,
    durability: -1,
  },

  'knife': {
    damage: [
      {
        type: DT.slashing,
        power: [10, 15],
      },
    ],
    weigth: 2,
    durability: 100,
  },

  'stick': {
    damage: [
      {
        type: DT.crushing,
        power: [13, 18],
      },
    ],
    weigth: 3,
    durability: 60,
  },

};