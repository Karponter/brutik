'use strict';

class Motion {
  constructor(e) {
    this.action = e.type;
    this.actor = e.data.actor;
    e.data.target && (this.target = e.data.target);
    this.value = e.data.value;
  }
}

module.exports = Motion;
