// make random policy

function randomPolicy(M) {
  let pi = {};
  for (let state of M.states) {
    let actions = M.actions[state];
    pi[state] = actions[Math.floor(actions.length * Math.random())];
  }
  return pi;
}

let pi = randomPolicy(gridworldToMDP([
  [' ', ' ', ' ', 'g']
]));
//console.log(pi);

function getValueFunction(M, pi) {
  /* V: S -> R, V(s) = expect( reward(s, a) + g*V(s_)| P, pi(s)) */
  let V = {};
  for (let state in M.states) {
    V[state] = M.rewards(state, pi(a)) + 2;
  }
  return V
}

function V0(M) {
  let V = {};
  for (let state of M.states) {
    V[state] = 0;
  }
  return V;
}

function valueIteration(M) {
  let V = V0(M);
  for (let i = 0; i < 50; i++) {
    V = bootstrap(M, V);
  }
  return [greedy(M, V), V];
}

function bootstrap(M, V) {
  let V_ = {};
  for (let state of M.states) {
    let maxValue = -Infinity;
    for (let action of M.actions[state]) {
      let sum = 0;
      for (let state_ in M.P[state][action]) {
        // console.log(sum);
        // for (let state_ in M.P[state][action]) {

        if (action in M.rewards[state] && state_ in M.rewards[state][action]) {
          sum += M.P[state][action][state_] *
            (M.rewards[state][action][state_] +
              M.gamma * V[state_]);
        } else {
          sum += M.P[state][action][state_] *
            M.gamma * V[state_];
        }
      }

      if (sum > maxValue) {
        maxValue = sum;
      }
    }
    V_[state] = maxValue;
  }
  return V_
}

function greedy(M, V) {
  let pi = {};
  for (let state of M.states) {
    let maxValue = -Infinity;
    let argmax = 0;
    for (let action of M.actions[state]) {
      let sum = 0;
      for (let state_ in M.P[state][action]) {
        if (action in M.rewards[state] && state_ in M.rewards[state][action]) {
          sum += M.P[state][action][state_] *
            (M.rewards[state][action][state_] +
              M.gamma * V[state_]);
        } else {
          sum += M.P[state][action][state_] *
            M.gamma * V[state_];
        }
      }
      if (sum > maxValue) {
        maxValue = sum;
        argmax = action;
      }
    }
    pi[state] = argmax;
  }
  return pi
}


let grid = [
  [' ', ' ', ' '],
  [' ', ' ', ' '],
  [' ', ' ', ' '],
  [' ', ' ', 'g']
];
M = gridworldToMDP(grid);
let V = V0(M);
//console.log(V);
valIter = valueIteration(M, V);
//console.log(valIter);