'use strict';
const mocha = require('mocha');
const should = require('should');
require('./../ireq-init');
const EffectHost = ireq.effect('effect-host');
const Effect = ireq.effect('effect');

describe('Effect Host testing', () => {

    describe('construction', () => {

        it('without options', () => {
            should(() => new EffectHost()).not.throw();
        });

        it('with options', () => {
            const ts = 100;
            const dependant = {foo: 'bar'};
            const adapter = {one: 'two'};
            const opt = {adapter, dependant, ts};
            let host = null;
            should(() => host = new EffectHost(opt)).not.throw();
            host._ts.should.be.equal(ts);
            host._dependant.should.be.equal(dependant); 
            host._adapter.should.be.equal(adapter); 
        });

    });

    describe('flow chain', () => {

        let host = null;

        beforeEach(() => {
            host = new EffectHost();
        });

        it('chainability', () => {
            should(() => {
                host.emit().subscribe().setDependant({}).setAdapterHash({})
                .setTs(123).modDependant(1, 2).tick();
            }).not.throw();
        });

        it('subscribe and emit', () => {
            const event = 'testEvent';
            let indicator = false;
            const hook = () => indicator = true;
            should(() => host.subscribe(event, hook).emit(event)).not.throw();
            indicator.should.be.equal(true);
        });

        it('mod dependant', () => {
            const dependant = {one: 1, two: 2};
            host.setDependant(dependant).modDependant('one', 2);
            dependant.should.be.deepEqual({one: 3, two: 2});
        });

        it('mod dependant with adapter', () => {
            const dependant = {three: 1, two: 2};
            const adapter = {one: 'three'};
            host.setDependant(dependant).setAdapterHash(adapter)
            .modDependant('one', 2);
            dependant.should.be.deepEqual({three: 3, two: 2});
        });

        it('add & remove effect', () => {
            const dependant = {
                strength: 123,
                stamina: 12,
                something: 1000
            };
            const effect = new Effect({
                title: 'testEffect',
                impact: {
                    strength: { mod: -120 },
                    stamina: { mod: 3 },
                    something: { mod: 10 }
                }
            });
            const dependant_clone = Object.assign({}, dependant);
            host.setDependant(dependant);
            let _effectId = null;
            const _addEvent = () => _effectId = host.add(effect);
            const _removeEvent = () => host.remove(_effectId);
            _addEvent.should.not.throw();
            dependant.should.be.deepEqual({strength: 3, stamina: 15, something: 1010});
            _removeEvent.should.not.throw();
            dependant.should.be.deepEqual(dependant_clone);
        });

    });

});
