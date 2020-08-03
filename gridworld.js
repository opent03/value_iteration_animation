let g = [[' ', ' ', ' '],
         [' ', ' ', ' '],
         [' ', ' ', ' '],
         [' ', ' ', 'g']];

function gridHelper(i, j) {
  return `(${i}, ${j})`;
}

function stateToIndex(state) {
  let x = state.split(', '); // '(a, b)' 
  let i = parseInt(x[0].split('(')[1]);
  let j = parseInt(x[1].split(')')[0]);
  return [i, j];
}

function findIndex(g, c) {
  for (let i = 0; i < g.length; i++) {
    for (let j = 0; j < g[i].length; j++) {
      if (g[i][j] === c) {
        return [i, j];
      }
    }
  }
}

function getNextState(i, j, a) {
  let i_, j_;
  if (a === 'u') {
    i_ = i - 1;
    j_ = j;
  }
  if (a === 'd') {
    i_ = i + 1;
    j_ = j;
  }
  if (a === 'l') {
    i_ = i;
    j_ = j - 1;
  }
  if (a === 'r') {
    i_ = i;
    j_ = j + 1;
  }
  return [i_, j_];
}

function outOfBounds(g, a, i, j) {
  let [i_, j_] = getNextState(i, j, a);
  return i_ < 0 || j_ < 0 || i_ >= g.length || j_ >= g[i].length;
}

function gridworldToMDP(g){
  let states = [];
  for (let i = 0; i < g.length; i++) {
    for (let j = 0; j < g[i].length; j++) {
      states.push(gridHelper(i, j));
    }
  }
  let possibleActions = ['u', 'd', 'l', 'r'];
  let actions = {};
  for (let i = 0; i < g.length; i++) {
    for (let j = 0; j < g[i].length; j++) {
      actions[gridHelper(i, j)] = possibleActions.filter(a => !outOfBounds(g, a, i, j));
      
    }
  }
  let rewards = {};
  for (let state of states) {
    rewards[state] = {};
    for (let action of actions[state]) {
      rewards[state][action] = {};
      for (let state_ of states) {
        rewards[state][action][state_] = -1;
      }
    }
  }
  let [gi, gj] = findIndex(g, 'g');
  let goal = gridHelper(gi, gj);
  if (!outOfBounds(g, 'u', gi, gj)) {
    rewards[gridHelper(...getNextState(gi, gj, 'u'))]['d'][goal] = 20;
  }
  if (!outOfBounds(g, 'd', gi, gj)) {
    rewards[gridHelper(...getNextState(gi, gj, 'd'))]['u'][goal] = 20;
  }
  if (!outOfBounds(g, 'l', gi, gj)) {
    rewards[gridHelper(...getNextState(gi, gj, 'l'))]['r'][goal] = 20;
  }
  if (!outOfBounds(g, 'r', gi, gj)) {
    rewards[gridHelper(...getNextState(gi, gj, 'r'))]['l'][goal] = 20;
  }
  
  let P = {};
  for (let state of states) {
    P[state] = {};
    for (let action of actions[state]) {
      P[state][action] = {};
      let [i, j] = stateToIndex(state);
      let state_ = gridHelper(...getNextState(i, j, action));
      P[state][action][state_] = 1;
    }
  }
  
  return new MDP(states, actions, rewards, P, 0.95, actionIndexedByStates=true);
  /*
  for (let state of states) {
    for (let action of actions[state]) {
      for (let state_ of states) {
        console.log(state, action, state_);
        console.log(rewards[state][action][state_]);
        console.log();
      }
    }
  }
  */
}
//console.log(stateToIndex('(4123, 64)'));
//console.log(gridworldToMDP(g));





