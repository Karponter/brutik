'use strict';

const Event = require('./event');

class MoveEvent extends Event {

  constructor(actor, target) {
    super({type: 'move', target, actor});
  }

}

module.exports = MoveEvent;
