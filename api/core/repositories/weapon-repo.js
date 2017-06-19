'use strict';

const ireq = require('ireq');
const Repository = ireq.repository('repository');
const Weapon = ireq.item('weapon');
const weaponDB = ireq.item('weapon-db');

const _repo = new Repository({
  type: 'weapon-repository'
});

// @todo: dummy datasource
const _dataSource = {
  get: id => weaponDB[id],
};

_repo.attachSource(_dataSource);
_repo.attachEntityPrototype(Weapon);

module.exports = _repo;
