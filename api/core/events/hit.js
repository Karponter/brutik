'use strict';

const Event = require('./event');
const DamageEvent = require('./damage');
const BlockEvent = require('./block');
const DodgeEvent = require('./dodge');

class HitEvent extends Event {

  constructor(actor, target, value, focus) {
    super({type: 'hit', target, actor, value, focus});
  }

  morphToDamage(drained, forceNoCrit) {
    const damage = drained || this.value;
    const event = new DamageEvent(this.actor, this.target, damage, this.focus);
    if (forceNoCrit)
      return event;
    // crit calculations here, go to math
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
