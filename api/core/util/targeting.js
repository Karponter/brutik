'use strict';

const abstract = require('./abstract');
const care = (head, body, leftHand, rightHand, leftLeg, rightLeg) =>
  ({head, body, leftHand, rightHand, leftLeg, rightLeg});
const defaultVariety = care(10, 30, 15, 15, 15, 15);

module.exports = abstract.nestKeys({

  'get.focus': (brute, victim) =>
    abstract.rollVariety(defaultVariety),

});