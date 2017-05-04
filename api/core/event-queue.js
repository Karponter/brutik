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
     * @return {Boolean}        -- answer
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
    emit(type, data) {
        this.assertRegistrer(type);
        this._queue.push({type, data});
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
     */
    tick() {
        const event = this._queue.shift();
        return this._listeners[event.type].map(cb => cb());
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
}

module.exports = EventQueue;
