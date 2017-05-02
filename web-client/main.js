var players = {
  pl1: { health: 30 },
  pl2: { health: 30 },
};

var scenario = [
  { actor: 'pl1', action: 'move', target: 'pl2' },
  { actor: 'pl1', action: 'hit', target: 'pl2', value: 10 },
  { actor: 'pl2', action: 'hit', target: 'pl1', value: 20 },
  { actor: 'pl1', action: 'move', target: 'back' },
  { actor: 'pl2', action: 'move', target: 'pl1' },
  { actor: 'pl2', action: 'hit', target: 'pl1', value: 20 },
  { actor: 'pl1', action: 'die' },
  { actor: 'pl2', action: 'move', target: 'back' },
  { actor: 'pl2', action: 'pose', value: 'win' },
];

function blinkPlayer(playerId) {
  var $pl = $('#'+playerId);
  var _backup_color = $pl.css('background');
  $pl.css('background', '#ffffff');
  setTimeout(function(){
    $pl.css('background', _backup_color);
  }, 75);
}

function movePlayer(playerId, posX) {
  var $pl = $('#'+playerId);
  $pl.css('left', posX);
}

function standsOnLeft(pl1, pl2) {
  return $('#'+pl1).css('left') < $('#'+pl2).css('left');
}

function handle_move(event) {
  var playerId = event.actor;
  var $pl = $('#'+playerId);
  if (event.target == 'back') {
    movePlayer(playerId, players[playerId].home);
    return;
  }
  players[playerId].home = $pl.css('left');
  var direction = standsOnLeft(playerId, event.target) ? -1 : 1;
  $opponent = $('#'+event.target);
  var newPos = parseInt($opponent.css('left')) + parseInt($opponent.css('width'))/2 + (parseInt($opponent.css('width'))+parseInt($pl.css('width')))*direction;
  movePlayer(playerId, newPos);
}

function recalculateHealthBars() {
  for (var id in players) {
    var pl = players[id];
    var $bar = $('#'+id+'-health-bar');
    var percent = pl.health/30 * 90; 
    $bar.css('width', percent+'%');
  }
};

function killPlayer(playerId) {
  var $pl = $('#'+playerId);
  $pl.css('display', 'none');
}

function handleDeath(event) {
  killPlayer(event.actor);
}

function handleHit(event) {
  target = event.target;
  blinkPlayer(target);
  players[target].health = Math.max(0, players[target].health-event.value);
  recalculateHealthBars();
}

function handle_event(event) {
  console.log(event);
  var handler = scenario_handlers[event.action];
  if (!handler) return;
  handler(event);
}

var scenario_handlers = {
  move: handle_move,
  hit: handleHit,
  die: handleDeath,
};

$(document).ready(function(){
  setInterval(function(){
    var action = scenario.shift();
    action && handle_event(action);
  }, 750);
});