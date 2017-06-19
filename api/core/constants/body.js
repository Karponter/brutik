'use strict';

const bodyParts = {
  head: 'head',
  body: 'body',
  leftHand: 'leftHand',
  rightHand: 'rightHand',
  leftLeg: 'leftLeg',
  rightLeg: 'rightLeg',
  leg: 'leg',
  hand: 'hand'
};

const bodypartStates = {
  ok: 0,
  injured: 1,
  wounded: 2,
  critical: 3,
  lost: 4,
};

const resolve = bodypart => {
  switch (bodypart) {
    case 'rightLeg': case 'leftLeg': return bodyParts.leg;
    case 'rightHand': case 'leftHand': return bodyParts.hand;
  }
  return bodyParts;
};

module.exports = Object.assign({resolve, state: bodypartStates}, bodyParts);