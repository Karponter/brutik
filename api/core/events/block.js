'use strict';

const Event = require('./event');

class BlockEvent extends Event {

  constructor(actor) {
    super({type: 'block', actor});
  }

}

module.exports = BlockEvent;
