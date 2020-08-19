class MDP{
  constructor(states, actions, rewards, P, gamma, actionsIndexedByStates=false){
    this.states = states;
    if (actionsIndexedByStates) {
      this.actions = actions;
    }
    else{
      this.actions = {};
      for (let state of states) {
        this.actions[state] = actions
      }
    }
    this.rewards = rewards;
    this.P = P;
    this.gamma = gamma;
  }
}