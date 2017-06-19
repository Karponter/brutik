'use strict';

const Event = require('./event');

class EffectApplyEvent extends Event {

  constructor(target, effect) {
    super({type: 'effect-apply', target, value: effect});
  }

}

module.exports = EffectApplyEvent;
