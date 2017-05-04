'use strict';
const assert = require('assert');

/**
 * Event queue and listeners
 */

class EventQueue {

    constructor() {
        this._queue = [];
        this._registered = {};
        this._listeners = {};
        this.endurence = 10000;
    }

    /**
     * Registers event type for queue. Only registered can be fired.
     * @param  event {String}   -- event type to register
     */
    register(event) {
        this._registered[event] = true;
        this._listeners[event] = [];
    }

    /**
     * Checks if event type is registered and valid for this queue
     * @param  event {String}   -- event type to check
     * @return {Boolean}
     */
    check(event) {
        return !!this._registered[event];
    }

    /**
     * Throws error, if `event` is not registered in this queue.
     * @param  event {String} -- event type to check
     */
    assertRegistrer(event) {
        assert(this.check(event), `Oops, event ${event} is not registerd`);
    }

    /**
     * Emits event of specified type and puts it to queue
     * Only registered can be emitted
     * @param  type {String}     -- emitted event type
     * @param  data {Object}     -- data object
     */
    emit(type, data, callback) {
        this.assertRegistrer(type);
        this._queue.push({type, data, callback});
    }

    /**
     * Adds event listener function
     * @param  event {String}       -- event type to listen
     * @param  callback {Function}  -- callback function
     */
    listen(event, callback) {
        this.assertRegistrer(event);
        this._listeners[event].push(callback);
    }

    /**
     * Event processing and listeners hooking
     * @param  callback {Function}  -- tick callback function, accepts event that fired
     * @return {Array}              -- list of values every hook reurned
     */
    tick(callback) {
        if (!this.endurence) return [];
        this.endurence--;
        const event = this._queue.shift();
        const result = this._listeners[event.type].map(cb => cb(event.data));
        // callbacks hooking
        event.callback && event.callback();
        callback && callback(event);
        return result;
    }

    /**
     * Flushes all listentrs for type
     * @param event {String}    -- type to flush, if undefined -- flushes all
     */
    flush(event) {
        if (event)
            return this._listeners[event] = [];        
        for (let key in this._listeners) 
            this.flush(key);
    }

    /**
     * Checks if instance has no events to process
     * @return {Boolean}
     */
    isEmpty() {
        return !this._queue.length;
    }

    /**
     * Checks if queue execution times limit was reached
     */
    isExhausted() {
        return !this.endurence;
    }
}

module.exports = EventQueue;
