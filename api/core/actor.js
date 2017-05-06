'use strict';

const abstractUtils = require('./util/abstract');
const mathUtils = require('./util/math');

// @todo: hack
let _conunter = 0;
const genId = () => ++_conunter+'';

class Actor {

  constructor(options) {
    options = options || {};
    options.stats = options.stats || {};

    this.maxHealth = 30;
    this.health = 30;

    this.id = genId();
    this.stats = Object.assign({}, options.stats);
    this.initiative = mathUtils.initiative.cap.of(this);

    this.opponents = [];
  }

  setOpponents(opponents) {
    this.opponents = opponents;
  }

  decide() {
    const target = abstractUtils.randomArrayUnit(this.opponents);
    const damage = mathUtils.damage.to(this, target);
    return [
      {title: 'move', data: {actor: this, target: target}},
      {title: 'hit', data: {actor: this, target: target, value: damage}},
      {title: 'move', data: {actor: this, target: 'back'}},
    ];
  }

  damage(amount) {
    this.health = Math.max(0, this.health-amount);
    console.log(`Hitting ${this.id} with ${amount}, left: ${this.health}`);
  }

  heal(amount) {
    this.health = Math.min(this.maxHealth, this.health+amount);
  }

  isAlive() {
    return this.health > 0;
  }

  hook(eventQueue) {
    eventQueue.listen('hit', data => {
      if (data.target.id != this.id) return;
      eventQueue.emit('damage', {actor: data.actor, target: this, value: data.value});
    });
    eventQueue.listen('damage', data => {
      if (data.target.id != this.id) return;
      this.damage(data.value);
    });
  }
}

module.exports = Actor;