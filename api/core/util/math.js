'use strict';

const ireq = require('ireq');
const abstract = require('./abstract');
const timings = ireq.config('motions-timing.json');

const _roll = abstract.rollWithChance;
const _rollDamage = power => Math.round(abstract.rollRange(power));

module.exports = abstract.nestKeys({

// -------------------------------------------------------------------- player initialization
  'initiative.cap.of': player =>
    player.stats.agility + 10,

  'damage.to': (brute, victim) => {
    // getting base weapon damage
    const weapon = brute.getWeapon();
    const variety = {};
    weapon.damage.forEach((dmg, i) => variety[i+''] = dmg.variety);
    const damageKey = abstract.rollVariety(variety);
    const power = weapon.damage[parseInt(damageKey)].power;
    const baseDmg = _rollDamage(power);
    // stats difference
    let damage = baseDmg + (brute.stats.strength - victim.stats.stamina) * 2;
    return damage;
  },

  'attempt.of.dodge': (brute, victim) => {
    const chance = 0.1 + Math.max(0, victim.stats.agility - brute.stats.agility)*0.1;
    return _roll(chance);
  },

  'attempt.of.block': (brute, victim) => {
    const chance = 0.1 + Math.max(0, victim.stats.strength - brute.stats.strength)*0.1;
    return _roll(chance);
  },

  'actor.calc.endurance': brute => 30,

  'block.drain': (brute, victim, damage) =>
    Math.ceil(damage/10),
});