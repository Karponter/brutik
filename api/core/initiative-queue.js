'use strict';

class InitiativeQueue {

  constructor(players) {
    this.queue = [];
    players.forEach(pl => {
      const initiativeCap = pl.initiative;
      this.queue.push({
        player: pl.id,
        initiative: initiativeCap,
        initiativeCap: initiativeCap
      });
    });
  }

  /**
   * Returns id of top-initiative player
   * @return {String} -- players identifier
   */
  top() {
    return this.queue[0].player;
  }

  // Shifts queue.
  // Reduces top-player's initiative and recalculate it's position in 
  shift() {
    const pl = this.queue[0];
    // reset initiative if it falls too much
    if (pl.initiative <= 0)
      pl.initiative += pl.initiativeCap;
    pl.initiative -= 10;
    // bubble player down in initiative queue
    let i = 1; 
    do {
      this.queue[i-1] = this.queue[i];
    } while (++i < this.queue.length && pl.initiative < this.queue[i].initiative);
    this.queue[i-1] = pl;
  }

}

module.exports = InitiativeQueue;