'use strict';

// @todo: dummy
const _validateSource = source => {
    return true;
};

// @todo: incapsulate errors 
class ReadyStateError extends Error {
    constructor(stateOwner, id) {
        const idString = id ? `(${id})` : '';
        super(`Attempt to trigger not ready ${stateOwner||'unit'}${idString}`);
    }
}

class UnknownIdError extends Error {
    constructor(stateOwner, id, needle) {
        const idString = id ? `(${id})` : '';
        super(`Repository ${stateOwner||'unit'}${idString} is not responsible for entity '${needle}'`);
    }
}

module.exports = class Repository {

    constructor (options) {
        Object.assign(this, options);
        this.hash = {};
        this.dataSource = null;
        this.log = options.log || console;
        this.type = options.type || 'repository';
    }

    attachSource (source) {
        try { _validateSource(source); } catch (e) {
            return this.log.warn(source, `Can not attach invalid source: ${e.message}`);
        }
        this.dataSource = source;
    }

    attachEntityPrototype (_proto) {
        this._prototype = _proto;
    }

    assertReady () {
        if (!this.dataSource || !this._prototype)
            throw new ReadyStateError(this.type, this.id);
    }

    assertResponsible (id) {
        if (!this.hash[id] && !this.dataSource.hasId(id))
            throw new UnknownIdError(this.type, this.id, id);
    }

    cache (id) {
        this.assertReady();
        if (this.hash[id] !== undefined) 
            return true;
        const resource = this.dataSource.get(id);
        if (!resource)
            return false;
        this.hash[id] = new this._prototype(resource);
        return true;
    }

    get (id) {
        this.assertReady();
        if (!this.cache(id))
            return null;
        return this.hash[id];
    }

}