'use strict';

const abstractUtils = require('./util/abstract');
const mathUtils = require('./util/math');

class Actor {

  constructor(options) {
    options = options || {};
    options.stats = options.stats || {};

    this.maxHealth = 30;
    this.health = 30;

    this.stats = Object.assign({}, options.stats);
    this.initiative = mathUtils.initiative.cap.of(this);

    this.opponents = [];
  }

  setOpponents(opponents) {
    this.opponents =opponents;
  }

  decide() {
    const target = abstractUtils.randomArrayUnit(this.opponents);
    return ['move'];
  }

  damage(amount) {
    this.health = Math.max(0, this.health-amount);
  }

  heal(amount) {
    this.health = Math.min(this.maxHealth, this.health+amount);
  }

  isAlive() {
    return this.health > 0;
  }
}

module.exports = Actor;