M = getExampleMDP();
// M = gridworldToMDP(g);

let statePositions = {};
let stateActionPositions = {};
let vertexPositions = new Map();
let graph = getGraph();

function setup() {
  createCanvas(600, 600);
  initStateActions(statePositions, stateActionPositions, M);
  initVertexPositions(vertexPositions, graph);
}

function draw() {

  background(220);
  textAlign(CENTER, CENTER);
  /* 
  updateStateActions(statePositions, stateActionPositions, M);
  
  drawStateActions(statePositions, stateActionPositions, M);
  */
  updateVertexPositions(vertexPositions, graph);

  drawGraph(vertexPositions, graph);

  
  
}

console.log(valueIteration(M))