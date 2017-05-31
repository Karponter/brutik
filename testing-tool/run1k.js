'use strict';

// --------------------------------------------------------------- imports ----

require('./../api/ireq-init');
const Arena = require('./../api/core/arena.js');

// --------------------------------------------------------- players setup ----

const pl1 = {
  id: 'one@',
  stats: {
    strength: 4,
    agility: 3,
    stamina: 2
  }
};

const pl2 = {
  id: 'two@',
  stats: {
    strength: 3,
    agility: 3,
    stamina: 3
  }
};

// ------------------------------------------------- statistics calcuation ----

const logLoss = (stats, looser) => {
  stats.losses[looser] ? stats.losses[looser]++ : stats.losses[looser] = 1;
}

const calculateStats = scenario => {
  const stats = {
    losses: {},
  };
  const wins = scenario.map(s => s[s.length-1].target.id);
  const _iterator = logLoss.bind(null, stats);
  wins.forEach(_iterator);
  return stats;
}

// ----------------------------------------------------------- fights loop ----

const fightsAmount = 1000;

const printWins = (stats, pl) => {
  const id = pl.id;
  const wins = fightsAmount-stats.losses[pl.id];
  const percent = Math.round(wins/fightsAmount*100);
  console.log(`${id}:\t\t${wins}/${fightsAmount}   ${percent}%`);
}

const result = [];
let fightsOver = 0;
const finalizer = scenario => {
  result[fightsOver++] = scenario;
  if (result.length < fightsAmount) return;
  const stats = calculateStats(result);
  const _printer = printWins.bind(null, stats);
  [pl1, pl2].forEach(_printer);
};
for (let i = 0; i < fightsAmount; i++) {
  const arena = new Arena({players: [pl1, pl2]});
  arena.launch(finalizer);
}
