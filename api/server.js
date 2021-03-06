'use strict';

require('./ireq-init');
const express = require('express');
const app = express();

const Arena = require('./core/arena');

const pl1 = {
  stats: {
    strength: 4,
    agility: 3,
    stamina: 2
  }
};

const pl2 = {
  stats: {
    strength: 3,
    agility: 3,
    stamina: 3
  }
};

// app.get('/generate', (req, res) => {
  const arena = new Arena({players: [pl1, pl2]});
  arena.launch();
  // arena.launch(scenario => res.json(scenario));
// });

module.exports = app;