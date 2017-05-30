'use strict';

const Event = require('./event');

class DamageEvent extends Event {

  constructor(actor, target, value, focus) {
    super({type: 'damage', actor, target, value, focus});
  }

}

module.exports = DamageEvent;
