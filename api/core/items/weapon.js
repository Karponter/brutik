'use strict';

const ireq = require('ireq');
const WEAPON = ireq.const('weapon');
const DT = WEAPON.DT;

const abstract = ireq.util('abstract');

class Weapon {

    constructor(spec) {
        Object.assign(this, spec);
        this.DTVariety = {};
        this.damage.forEach((dmg, i) => this.DTVariety[i+''] = dmg.variety);
    }

    rollDamage() {
        const DT = this.rollDamageType();
        return {
            power: Math.round(abstract.rollRange(DT.power)),
            type: DT.type,
        };
    }

    rollDamageType() {
        const damageKey = abstract.rollVariety(this.DTVariety);
        return this.damage[damageKey];
    }

}

module.exports = Weapon;
