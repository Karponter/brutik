'use strict';
const mocha = require('mocha');
const should = require('should');
const EventQueue = require('./../core/effects/effects-host');

describe('Event Host testing', () => {

    const queue = new EventQueue();
    const eventTypes = ['type1', 'hello', 'test', 'creep-event'];

    it('register some', () => {
        eventTypes.forEach(e => should(()=>queue.register(e)).not.throw());
    });

    it('emit registered', () => {
        eventTypes.map(e => {
            return () => queue.emit(e, {});
        }).forEach(fn => should(fn).not.throw());
    });

    it('emit unregistered', () => {
        ['weird', '123'].map(e => {
            return () => queue.emit(e, {});
        }).forEach(fn => should(fn).throw());
    });

    it('hang registered listeners', () => {
        eventTypes.map(e => {
            return () => queue.listen(e, ()=>0);
        }).forEach(fn => should(fn).not.throw());
    });

    it('hang unregistered listeners', () => {
        ['weird', '123'].map(e => {
            return () => queue.listen(e, ()=>0);
        }).forEach(fn => should(fn).throw());
    });

    it('flushes listeners', () => {
        const _event = eventTypes[0];
        queue._listeners[_event].length.should.be.equal(1);
        queue.flush(_event);
        queue._listeners[_event].length.should.be.equal(0);
        queue._listeners[eventTypes[1]].length.should.be.equal(1);
        queue.flush();
        eventTypes.forEach(e => {
            queue._listeners[e].length.should.be.equal(0);
        });
    });    

    it('tick fires all hooks', () => {
        const _event1 = eventTypes[0];
        const _event2 = eventTypes[1];
        const fire = () => 'fired';
        queue.listen(_event1, fire);
        queue.listen(_event1, fire);
        queue.listen(_event2, fire);
        queue.emit(_event1, {});
        queue.emit(_event2, {});
        queue.tick().should.be.deepEqual(['fired', 'fired']);
        queue.tick().should.be.deepEqual(['fired']);
        queue.tick().should.be.deepEqual([]);
    });

    it('', );

});
