'use strict';

const ireq = require('ireq');

const abstractUtils = ireq.util('abstract');
const mathUtils = ireq.util('math');
const targeting = ireq.util('targeting');

const WEAPON = ireq.repository('weapon-repo');

const Event = require('./events/event');
const MoveEvent = require('./events/move');
const MoveBackEvent = require('./events/move-back');
const HitEvent = require('./events/hit');

// @todo: hack
let _conunter = 0;
const genId = () => ++_conunter+'';

// @todo: move to logging module
const drawPercent = (percent, msg) => {
  percent = Math.max(percent, 0);
  const length = Math.floor(percent*10);
  let filled = (new Array(2*length)).fill('=').join('');
  let empty = (new Array(20-2*length)).fill('-').join('');
  // console.log(`\t\t\t\t${msg}:\t<${filled}${empty}>`);
}

class Actor {

  /** ------------------------------------------------ Constructor here ---- */

  constructor(options) {
    options = options || {};
    options.stats = options.stats || {};

    this.maxHealth = 30;
    this.health = 30;
    this.id = options.id || genId();
    this.stats = Object.assign({}, options.stats);

    // amount of endurance player gains per in-game second
    this.enduranceRegain = 0.5;
    this.enduranceWasteCoeficient = 1;
    this.enduranceCap = mathUtils.actor.calc.endurance(this);
    this.endurance = this.enduranceCap;

    this.initiative = mathUtils.initiative.cap.of(this);

    this.body = {
      head: 'ok',
      body: 'ok',
      leftHand: 'ok',
      rightHand: 'ok',
      leftLeg: 'ok',
      rightLeg: 'ok'
    };

    this.inventory = {};
    this.fist = WEAPON.get('fist');

    this.opponents = [];
    this._exhaustmentTs = 0;
  }

  /** ------------------------------------------------------ Logic here ---- */

  /**
   * Actor's event emitting desicions.
   * @return {Array}  -- queue of actions to perdorm ba player
   */
  decide() {
    const target = abstractUtils.randomArrayUnit(this.opponents);
    const damage = mathUtils.damage.to(this, target);
    const focus = targeting.get.focus(this, target);
    return [
      new MoveEvent(this, target),
      new HitEvent(this, target, damage.power, focus),
      new MoveBackEvent(this),
    ];
  }

  /**
   * Increeses actor's endurance level
   * Raletes on latest function call 
   * @param  {Number} ts  -- moment of rest calculation
   */
  rest(ts) {
    const timePass = ts - this._exhaustmentTs;
    this._exhaustmentTs = ts;
    const amount = timePass * this.enduranceRegain;
    // console.log('Resting:', this.endurance, amount);
    this.endurance = Math.min(this.enduranceCap, this.endurance + amount);
  }

  /**
   * Reduce actor's endurance level
   * Also calls passive resting
   * @param  {Event} event  -- event that caused exhausetement
   */
  exhaust(event) {
    const now = event.ts.end;
    this.rest(now);
    // console.log('Damaging:', this.endurance, event.value, this.endurance - event.value);
    this.endurance = Math.max(0, this.endurance - event.value);
    drawPercent(this.endurance/this.enduranceCap, `Pl${this.id}`);
  }

  /**
   * Hooks all needed events with current-player related listeners
   * @param  {EventQueue} eventQueue -- arena-wide event queue to subscribe
   */
  hook(eventQueue) {
    eventQueue.listen('hit', event => {
      if (event.target.id != this.id) return;
      // dodge
      if (mathUtils.attempt.of.dodge(event.actor, event.target)) {
        return eventQueue.emit(event.morphToDodge());
      }
      // block
      if (mathUtils.attempt.of.block(event.actor, event.target)) {
        const drainedDamage = mathUtils.block.drain(event.actor, this, event.value);
        eventQueue.emit(event.morphToBlock());  
        eventQueue.emit(event.morphToDamage(drainedDamage));
        return;
      }
      // take damage
      eventQueue.emit(event.morphToDamage());
    });
    eventQueue.listen('damage', event => {
      if (event.target.id != this.id) return;
      this.exhaust(event);
    });
  }

  /** -------------------------------------------------- Oneliners here ---- */

  setOpponents(opponents) {
    this.opponents = opponents;
  }

  isAlive() {
    return this.health > 0;
  }
  
  isStanding() {
    return this.isAlive() && this.endurance > 0;
  }

  getWeapon() {
    if (this.inventory.rightHand)
      return this.inventory.rightHand;
    return this.fist;
  }
}

module.exports = Actor;