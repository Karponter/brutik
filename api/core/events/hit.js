'use strict';

const ireq = require('ireq');
const mathUtils = ireq.util('math');

const Event = require('./event');
const DamageEvent = require('./damage');
const BlockEvent = require('./block');
const DodgeEvent = require('./dodge');
const EffectApplyEvent = require('./effect-apply');

class HitEvent extends Event {

  constructor(actor, target, value, focus) {
    super({type: 'hit', target, actor, value, focus});
  }

  morphToDamage(drained, forceNoCrit) {
    const damage = {
      type: this.value.type,
      power: drained || this.value.power,
    };
    const event = new DamageEvent(this.actor, this.target, damage, this.focus);
    if (forceNoCrit)
      return event;
    const report = mathUtils.attempt.of.crit(this.actor, this.target, damage, this.focus);
    if (!report.isCritical)
      return event;
    event.damage.power = report.damage.power;
    // pushing siblings to effect
    report.effects.forEach(effect => {
      event.siblings.push(new EffectApplyEvent(this.target, effect));
    });
    return event;
  }

  morphToBlock() {
    return new BlockEvent(this);
  }

  morphToDodge() {
    return new DodgeEvent(this);
  }

}

module.exports = HitEvent;
