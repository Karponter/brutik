'use strict';

const _props = ['type', 'actor', 'target', 'value', 'focus', 'cost', 'ts'];
const mathUtils = ireq.util('math');

class Event {

  constructor(data) {
    _props.forEach(p => this[p] = data[p]);
    if (this.actor)
      this.cost = this.actor
  }

  dump() {
    const res = {};
    _props.forEach(p => res[p] = this[p]);
    return res;
  }

  invert() {
    const data = this.dump();
    const _actor = data.actor;
    data.actor = data.target;
    data.target = _actor;
    return new Event(data);
  }

  logTime(start, end) {
    this.ts = { start, end, duration: end-start};
  }
}

module.exports = Event;