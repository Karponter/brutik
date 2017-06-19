'use strict';

const assert = require('assert');

// ------------------------------------------------ local utils ---- 

function _setter (instance, property, value) {
    instance[property] = value || {};
    return instance;
}

// @todo: hack
let counter = 0;
const _gen_id = () => ++counter;

// ------------------------------------------------------ class ---- 
class EffectsHost {

    /**
     * Instance constructor
     * @param  {Object} opt.adapter     -- initial call of ::setAdapterHash
     * @param  {Object} opt.dependant   -- initial call of ::setDependant
     * @param  {Object} opt.ts          -- initial call of ::setTs
     */
    constructor(opt) {
        opt = opt || {};
        this._setter = _setter.bind(null, this);
        this._effects = {};
        this._watchers = {};
        this.setAdapterHash(opt.adapter);
        this.setDependant(opt.dependant);
        this.setTs(opt.ts);
    }

    /**
     * Emits internal event and fires appropriate watchers
     * @chainable
     * @param  {string} event   -- emitted event
     * @return {EffectsHost}    -- this
     */
    emit(event) {
        const watchers = this._watchers[event] || [];
        watchers.forEach(cb => cb(this.dependant));
        return this;
    }

    /**
     * Subscribe watcher function for appropriate event key
     * @chainable
     * @param  {String}   event    -- event key that triggers the whatcher
     * @param  {Function} callback -- whatcher callback function
     * @return {EffectsHost}       -- this
     */
    subscribe(event, callback) {
        if (!this._watchers[event])
            this._watchers[event] = [];
        this._watchers[event].push(callback);
        return this;
    }

    /**
     * Setter for property adapter
     * @chainable
     * @param  {Object} hash    -- key-value mapper for 
     * @return {EffectsHost}    -- this
     */
    setAdapterHash(hash) {
        // @todo: instance accept of simple hash, can be a function, have method `adapt` which accepts data and field
        return this._setter('_adapter', hash);
    }

    /**
     * Setter for dependant unit
     * @chainable
     * @param  {Object} dependant   -- object that will be modified by effects
     * @return {EffectsHost}        -- this
     */
    setDependant(dependant) {
        return this._setter('_dependant', dependant);
    }

    /**
     * Setter for initial timestamp
     * @chainable
     * @param  {Number} ts      -- timestapm of calculation begining
     * @return {EffectsHost}    -- this
     */
    setTs(ts) {
        return this._setter('_ts', ts);
    }

    /**
     * Modifies dependant unit
     * @chainable
     * @param {String} key      -- key to adopt and test
     * @param {Number} amount   -- change value 
     * @return {EffectsHost}    -- this
     */
    modDependant(key, amount, type = 'mod') {
        const adoptedKey = this._adapter[key] || key;
        if (this._dependant[adoptedKey]===undefined)
            return this;
        if (type == 'mod')
            amount += this._dependant[adoptedKey];
        this._dependant[adoptedKey] = amount;
        return this;
    }

    /**
     * Adds effect to host, processes effect modifiers to dependant object
     * @param  {Effect} effect  -- effect to be added
     * @return {String}         -- id of added event
     */
    add(effect) {
        // @todo ::add function should subscribe hooks to this.
        const effectId = effect.id;
        this._effects[effectId] = effect;
        Object.keys(effect.impact).forEach(type => {
            const _impact = effect.impact[type];
            _impact.forEach(i => this.modDependant(i.property, i.value, type));
        }); 
        return effectId;
    }

    /**
     * Removes effect from host, cancels all modifications, made by effect
     * @param  {String} effectId    -- id of effect to remove
     */
    remove(effectId) {
        const modImpact = this._effects[effectId].impact.mod;
        delete this._effects[effectId];
        if (!modImpact) return;
        modImpact.forEach(i => this.modDependant(i.property, -1 * i.value));
    }

    /**
     * Ticker trigger, responsible for time-based effects removing
     * @chainable
     * @param  {Number} ts      -- timestamp of current time
     * @return {EffectsHost}    -- this
     */
    tick(ts) {
        // @todo add effects ticking processing and duration check
        return this;
    }
}

module.exports = EffectsHost;