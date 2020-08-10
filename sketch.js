M = getExampleMDP();
// M = gridworldToMDP(g);

let statePositions = {};
let stateActionPositions = {};
let vertexPositions = new Map();
let G = test.getGraph();

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent('p5-container');
  //physics.initStateActions(statePositions, stateActionPositions, M);
  physics.initVertexPositions(vertexPositions, G);
}

function draw() {
  background(220);
  textAlign(CENTER, CENTER);
  /* 
  updateStateActions(statePositions, stateActionPositions, M);
  
  drawStateActions(statePositions, stateActionPositions, M);
  */
  physics.updateVertexPositions(vertexPositions, G);

  physics.drawGraph(vertexPositions, G);
}

console.log(valueIteration(M))