'use strict';

// @todo: hack
let counter = 0;
const _gen_id = () => `effect-${++counter}`;

// ------------------------------------------------ local utils ---- 

const _addImpact = (effect, type, property, value) => {
    const _impact = effect.impact;
    !_impact[type] && (_impact[type] = []);
    _impact[type].push({property, value});
};

// ------------------------------------------------------ class ---- 
class Effect {

    constructor(spec) {
        this.title = spec.title;
        this.duration = spec.duration || Infinity;
        spec.impact = spec.impact || {};
        this.id = _gen_id();
        this.impact = {};
        this.addImpact = _addImpact.bind(null, this);
        Object.keys(spec.impact).forEach(key => {
            const _impact = spec.impact[key];
            const _iterator = type => this.addImpact(type, key, _impact[type]);
            Object.keys(_impact).forEach(_iterator);
        }); 
    }

}

module.exports = Effect;
