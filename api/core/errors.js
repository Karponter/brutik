'use strict';

class InvalidParameterError extends Error {
  constructor(msg) {
    this.name = 'InvalidParameterError';
    this.message = msg;
  }
}

module.exports = { InvalidParameterError };