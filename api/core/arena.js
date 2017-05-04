'use strict';

const Player = require('./actor');
const InitiativeQueue = require('./initiative-queue');
const EventsQueue = require('./event-queue');
const Motion = require('./motion');

// Returns array with values of a hash
const objectValues = obj =>
  Object.keys(obj).map(k => obj[k]);

// Targets all players to each other
const interpolateOpponents = (actors, stratagy) => {
  actors.forEach(actor => {
    actor.setOpponents(actors.filter(a => a.id != actor.id));
  });
}

const eventTypes = ['move', 'hit'];

const registerEventTypes = queue =>
  eventTypes.forEach(t => queue.register(t));  

class Arena {

  /**
   * Arena constructor
   * @param  {Array} opt.players  -- list of players on the arena
   */
  constructor(opt) {
    // keep both list and hash of players
    this.playersHash = {};
    this.players = [];
    opt.players.forEach(pl => {
      const player = new Player(pl);
      this.playersHash[pl.id] = player;
      this.players.push(player);
    });
    interpolateOpponents(this.players);
    this.initiativeQueue = new InitiativeQueue(objectValues(this.players));
    this.events = new EventsQueue();
    registerEventTypes(this.events);
    this.scenario = [];
  }

  /**
   * Returns amount of alive players
   */
  playersAlive() {
    return this.players.filter(pl => pl.isAlive()).length;
  }

  /**
   * Launch fight
   */
  launch(cb) {
    const _arena = this;
    while (this.playersAlive() > 1 && !this.events.isExhausted()) {
      // adding new events if no nothing
      if (this.events.isEmpty()) {
        const pl = this.shiftInitiative();
        const plans = pl.decide();
        // reduce plans list to postprocess hell and execute
        plans.reduceRight((acc, action) => {
          return () => {
            _arena.events.emit(action, {}, acc)
          };
        }, null)();
      }
      this.events.tick(event => {
        _arena.confirmMotion(new Motion(event));
      });
    }
    cb && cb(this.scenario);
  }

  /**
   * Add motion to scenario list
   */
  confirmMotion(motion) {
    this.scenario.push(motion);
  }

  /**
   * Returns top-initiative player for a moment and shifts queue
   */
  shiftInitiative() {
    const playerId = this.initiativeQueue.top();
    this.initiativeQueue.shift();
    return this.playersHash[playerId];
  }

}

module.exports = Arena;