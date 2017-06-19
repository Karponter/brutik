'use strict';

const abstract = require('./abstract');
const ireq = require('ireq');
const BODY = ireq.const('body');

const care = (head, body, leftHand, rightHand, leftLeg, rightLeg) => ({
  [BODY.head]: head,
  [BODY.body]: body,
  [BODY.leftHand]: leftHand,
  [BODY.rightHand]: rightHand,
  [BODY.leftLeg]: leftLeg,
  [BODY.rightLeg]: rightLeg
});
const defaultVariety = care(10, 30, 15, 15, 15, 15);

module.exports = abstract.nestKeys({

  'get.focus': (brute, victim) =>
    abstract.rollVariety(defaultVariety),

});