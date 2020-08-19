M = getExampleMDP();
// M = gridworldToMDP(g);

let statePositions = {};
let stateActionPositions = {};
let vertexPositions = new Map();
let G = test.getGraph();

let isFullscreen = false;
let originalHeight = 600;

function setup() {
  let canvas = createCanvas(getParagraphWidth(), originalHeight);
  canvas.parent('p5-container');
  //physics.initStateActions(statePositions, stateActionPositions, M);
  physics.initVertexPositions(vertexPositions, G);
  let button = createButton('⤢');
  button.parent('p5-container');
  button.addClass('bottom-right');
  button.mousePressed(() => {
    document.body.classList.toggle('hidden');
    if (!isFullscreen) {
      resizeCanvas(window.innerWidth, window.innerHeight);
    } else {
      resizeCanvas(getParagraphWidth(), originalHeight);
    }
    isFullscreen = !isFullscreen;
  });
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

function windowResized() {
  if (!isFullscreen) {
    resizeCanvas(getParagraphWidth(), height);
  }
  else {
    resizeCanvas(window.innerWidth, window.innerHeight)
  }
}

console.log(valueIteration(M))