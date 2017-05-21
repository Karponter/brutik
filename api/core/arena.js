'use strict';

const Player = require('./actor');
const InitiativeQueue = require('./initiative-queue');
const EventsQueue = require('./event-queue');
const Timer = require('./timer').FightEventTimer;

// Returns array with values of a hash
const objectValues = obj =>
  Object.keys(obj).map(k => obj[k]);

// Targets all players to each other
const interpolateOpponents = (actors, stratagy) => {
  actors.forEach(actor => {
    actor.setOpponents(actors.filter(a => a.id != actor.id));
  });
}

const eventTypes = ['move', 'hit', 'damage', 'dodge', 'block'];
// Registeres list of event types on event queue
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

    this.events = new EventsQueue();
    registerEventTypes(this.events);
    
    opt.players.forEach(pl => {
      const player = new Player(pl);
      player.hook(this.events);
      this.playersHash[player.id] = player;
      this.players.push(player);
    });
    
    interpolateOpponents(this.players);
    this.initiativeQueue = new InitiativeQueue(this.players);
    this.scenario = [];
    this.timer = new Timer();
  }

  /**
   * Returns amount of alive players
   */
  playersAlive() {
    return this.players.filter(pl => pl.isAlive()).length;
  }

  /**
   * Returns amount of players in consiouness
   */
  playersStanding() {
    return this.players.filter(pl => pl.isStanding()).length; 
  }

  /**
   * Launch fight
   */
  launch(cb) {
    const _arena = this;
    console.log(`- initial players: ${this.playersStanding()}`);
    console.log(`- EQ: exhausted: ${this.events.isExhausted()}`);

    // adding new events if queue isempty
    function kickSomeone() {
      const pl = _arena.shiftInitiative();
      const plans = pl.decide();
      // events chaining loop
      const list = [];
      let event, nextEvent = null;
      plans.reduceRight((prev, curr) => {
        if (prev)
          curr.callback = () => _arena.events.emit(prev);
        return curr;
      }, null);
      // events emitting
      _arena.events.emit(plans[0]);
    }

    function eventProcessor(event) {
      const _tgt = event.target ? event.target.id : 'X';
      console.log(event.type, event.actor.id, '==>', _tgt, `(${event.value})`);
      _arena.confirmMotion(event);
    }

    while (this.playersStanding() > 1 && !this.events.isExhausted()) {
      if (this.events.isEmpty())
        kickSomeone();
      this.events.tick(eventProcessor);
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