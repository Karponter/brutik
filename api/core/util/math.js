'use strict';

const ireq = require('ireq');
const abstract = require('./abstract');
const timings = ireq.config('motions-timing.json');

const _roll = abstract.rollWithChance;

module.exports = abstract.nestKeys({

// -------------------------------------------------------------------- player initialization
  'initiative.cap.of': player =>
    player.stats.agility + 10,

  'damage.to': (brute, victim) => {
    // getting base weapon damage
    const weapon = brute.getWeapon();
    const _rolled = weapon.rollDamage();
    const baseDmg = _rolled.power;
    // stats difference
    let damage = baseDmg + (brute.stats.strength - victim.stats.stamina) * 2;
    return {power: damage, type: _rolled.type};
  },

  'attempt.of.dodge': (brute, victim) => {
    const chance = 0.1 + Math.max(0, victim.stats.agility - brute.stats.agility)*0.1;
    return _roll(chance);
  },

  'attempt.of.block': (brute, victim) => {
    const chance = 0.1 + Math.max(0, victim.stats.strength - brute.stats.strength)*0.05;
    return _roll(chance);
  },

  'actor.calc.endurance': brute =>
    30 + brute.stats.stamina*5,

  'block.drain': (brute, victim, damage) =>
    Math.ceil(damage/10),
});