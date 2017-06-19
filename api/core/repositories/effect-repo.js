'use strict';

const ireq = require('ireq');
const Repository = ireq.repository('repository');
const Effect = ireq.effect('effect');
const effectDB = ireq.effect('db');

const _repo = new Repository({
  type: 'effect-repository'
});

// @todo: dummy datasource
const _dataSource = {
  get: id => effectDB[id],
};

_repo.attachSource(_dataSource);
_repo.attachEntityPrototype(Effect);

module.exports = _repo;
