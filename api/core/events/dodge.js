'use strict';

const Event = require('./event');

class DodgeEvent extends Event {

  constructor(actor) {
    super({type: 'dodge', actor});
  }

}

module.exports = DodgeEvent;
