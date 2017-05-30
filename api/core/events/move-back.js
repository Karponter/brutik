'use strict';

const Move = require('./move');

class MoveBackEvent extends Move {

  constructor(actor) {
    super(actor, 'back');
  }

}

module.exports = MoveBackEvent;
