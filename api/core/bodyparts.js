'use strict';

module.exports = {

  // ---------------------------------------------------------------- head ----
  'head': {
    handicaps: [
      null,
      'sanityLoss',
      'bleeding',
      ['lostConciouness', 'massiveBleading'],
      'DEATH'
    ],
  },

  // ---------------------------------------------------------------- body ----
  'body': {
    handicaps: [
      null,
      null,
      'bleeding',
      ['lostConciouness', 'massiveBleading'],
      'DEATH'
    ],
  },

  // ----------------------------------------------------------- left hand ----
  'leftHand': {
    handicapss: [
      null,
      'reducedDraining',
      'smallBleeding',
      'bleeding',
      ['massiveBleading', 'leftHandLoss'],
    ],
  },

  // ---------------------------------------------------------- right hand ----
  'rightHand': {
    handicaps: [
      null,
      'strengthLoss',
      'smallBleeding',
      'bleeding',
      ['massiveBleading', 'rightHandLoss'],
    ]
  },

  
  // ------------------------------------------------------------ left leg ----
  'leftLeg': {
    handicaps: [
      null, 
      ['initiativeReduced', 'dodgeReduced'],
      'smallBleeding',
      'bleeding',
      ['massiveBleading', 'leftLegLoss', 'useless'],
    ],
  },

  // ----------------------------------------------------------- right leg ----
  'rightLeg': {
    handicaps: [
      null,
      ['initiativeReduced', 'dodgeReduced'],
      'smallBleeding',
      'bleeding',
      ['massiveBleading', 'rightLegLoss', 'useless'],
    ],
  }

};
