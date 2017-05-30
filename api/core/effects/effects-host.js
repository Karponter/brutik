'use strict';

function _setter (instance, property, value) {
    instance[property] = value || {};
    return instance;
}

// @todo: hack
const _gen_id = () => Date.now();

class EffectsHost {

    /**
     * Instance constructor
     * @param  {Object} opt.adapter     -- initial call of ::setAdapterHash
     * @param  {Object} opt.dependant   -- initial call of ::setDependant
     * @param  {Object} opt.ts          -- initial call of ::setTs
     */
    constructor(opt) {
        opt = opt || {};
        this.setAdapterHash(opt.adapter);
        this.setDependant(opt.dependant);
        this.setTs(opt.ts);
        this._setter = _setter.bind(this);
        this.effects = {};
        this.watchers = {};
    }

    /**
     * Emits internal event and fires appropriate watchers
     * @chainable
     * @param  {string} event   -- emitted event
     * @return {EffectsHost}    -- this
     */
    emitEvent(event) {
        const watchers = this.watchers[event] || [];
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
        if (!this.watchers[event])
            this.watchers[event] = [];
        this.watchers[event].push(callback);
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
        return this._setter('_dependant', hash);
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
    modDependant(key, amount) {
        const adoptedKey = this.adapter[key] || key;
        assert(amount typeof Number, `Amount must be numeric for key ${key}`);
        this.dependant[adoptedKey] += amount;
        return this;
    }

    /**
     * Adds effect to host, processes effect modifiers to dependant object
     * @param  {[type]} effect  -- effect to be added
     * @return {String}         -- id of added event
     */
    add(effect) {
        const effectId = _gen_id+'';
        this._effects[effectId] = effect;
        // @todo: code duplication
        for (let key in effect) {
            this.modDependant(key, -effect[key]);
        }
        return effectId;
    }

    /**
     * Removes effect from host, cancels all modifications, made by effect
     * @param  {String} effectId    -- id of effect to remove
     */
    remove(effectId) {
        const effect = this._effects[effectId];
        // @todo: code duplication
        for (let key in effect) {
            this.modDependant(key, -1 * effect[key]);
        }
        delete this._effects[effectId];
    }

    /**
     * Ticker trigger, responsible for time-based effects removing
     * @chainable
     * @param  {Number} ts      -- timestamp of current time
     * @return {EffectsHost}    -- this
     */
    tick(ts) {
        // @todo
        return this;
    }
}

module.exports = EffectsHost;