'use strict';

const Player = require('./actor');
const InitiativeQueue = require('./initiative-queue');
const EventsQueue = require('./event-queue');
const Motion = require('./motion');

class Arena {

  /**
   * Arena constructor
   * @param  {Array} opt.players  -- list of players on the arena
   */
  constructor(opt) {
    this.players = {};
    opt.players.forEach(pl => {
      this.players[pl.id] = new Player(pl);
    });
    this.initiativeQueue = new InitiativeQueue(this.players);
    this.events = new EventsQueue();
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
    while (this.playersAlive() > 1) {
      // adding new events if no nothing
      if (this.events.isEmpty()) {
        const pl = this.shiftInitiative();
        const plans = pl.deside();
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
    return this.players[playerId];
  }

}

module.exports = Arena;