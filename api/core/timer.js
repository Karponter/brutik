'use strict';

const errors = ireq.core('errors');
const Event = ireq.event('event');
const timings = ireq.config('motions-timing');

const _defaultMeasure = {
  'ms': 1,
  's': 1000,
  'm': 1000*60,
  'h': 1000*60*60,
};

/**
 * Abstract time ticker with measure-resolvation
 */
class Timer {

  constructor(opt) {
    opt = opt || {};
    this.ts = opt.initialTs || 0;
    this.measure = opt.measure || _defaultMeasure; 
    // @hack: first key is default
    this.measureFallback = Object.keys(this.measure)[0];
  }

  normalizeWithMeasure(time, measure) {
    measure = (measure) ? measure.toLowerCase() : this.measureFallback;
    if (!this.measure[measure])
      throw new errors.MissingPropertyError(`Invalid measure: ${measure}`);
    return time * this.measure[measure];
  }

  tick(time, measure) {
    this.ts += this.normalizeWithMeasure(time, measure);
  }

  getTime(measure) {
    let ts = this.ts;
    if (measure && this.measure[measure])
      ts /= this.measure[measure];
    return ts; 
  }

}

/**
 * Timer that is binded fight events calculation
 */
class FightEventTimer extends Timer {

  constructor() {
    super();
  }

  tick(event, measure) {
    if (!(event instanceof Event))
      throw new errors.InvalidParameterError(`Invalid event instance, got type: ${typeof event}`);
    measure = measure || 's';
    const eventType = event.type;
    let motionTime = timings[eventType];
    if (!motionTime)
      return this.getTime(measure);
    // @todo: actor related thigs should be here
    super.tick(motionTime, measure);
    return this.getTime(measure);
  }

}

module.exports = { Timer, FightEventTimer };
