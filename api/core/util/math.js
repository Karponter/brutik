'use strict';

const abstract = require('./abstract');
module.exports = abstract.nestKeys({

// -------------------------------------------------------------------- player initialization
  'initiative.cap.of': player =>
    player.stats.agility + 10,

  'damage.to': (brute, victim) =>
    10 + (brute.stats.strength - victim.stats.endurence) * 2,
});