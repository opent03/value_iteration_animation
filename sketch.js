let gamma = 0.95;
let states = ['s0', 's1', 's2'];
let actions = ['a0', 'a1'];
let rewards = {
  's0': {},
  's1': {
    'a0': {
      's0': 5
    }
  },
  's2': {
    'a1': {
      's0': -1
    }
  }
};
let P = {
  's0': {
    'a0': {
      's0': 0.5,
      's2': 0.5
    },
    'a1': {
      's2': 1.0
    }
  },
  's1': {
    'a0': {
      's0': 0.7,
      's1': 0.1,
      's2': 0.2
    },
    'a1': {
      's1': 0.95,
      's2': 0.05
    }
  },
  's2': {
    'a0': {
      's0': 0.4,
      's2': 0.6
    },
    'a1': {
      's0': 0.3,
      's1': 0.3,
      's2': 0.4
    }
  }
};
M = new MDP(states, actions, rewards, P, gamma)
//M = gridworldToMDP(g);
let statePositions = {};
let stateActionPositions = {};
let radius = 20;
let arrowScale = 10;
let arrowCurve = 0.01 * arrowScale;
let k = 0.05;
let springLength = 200;
let physicsGamma = 0.1;

function setup() {
  createCanvas(600, 600);
  for (let s of M.states) {
    statePositions[s] = {
      x: random(radius, width - radius),
      y: random(radius, height - radius),
      vx: 0,
      vy: 0
    }
  }
  for (let s of M.states) {
    stateActionPositions[s] = {}
    for (let a of M.actions[s]) {
      stateActionPositions[s][a] = {
        x: random(radius, width - radius),
        y: random(radius, height - radius),
        vx: 0,
        vy: 0
      }
    }
  }
}

function draw() {

  background(220);
  textAlign(CENTER, CENTER);

  // initialization
  for (let s of M.states) {
    let p = statePositions[s];
    p.ax = -p.vx * physicsGamma;
    p.ay = -p.vy * physicsGamma;
  }
  // compute changes
  for (let s of M.states) {
    let p = statePositions[s];
    // draw actions
    for (let a of M.actions[s]) {
      let q = stateActionPositions[s][a];
      let d = dist(p.x, p.y, q.x, q.y);
      let vectX = (p.x - q.x) / d;
      let vectY = (p.y - q.y) / d;
      let F = k * (d - springLength)
      q.ax = F * vectX - q.vx * physicsGamma;
      q.ay = F * vectY - q.vy * physicsGamma;
      p.ax -= F * vectX;
      p.ay -= F * vectY;
      for (let s_ in M.P[s][a]) {
        let r = statePositions[s_];
        let d_ = dist(r.x, r.y, q.x, q.y);
        let vectX_ = (q.x - r.x) / d_;
        let vectY_ = (q.y - r.y) / d_;
        let F_ = k * (d_ - springLength)
        r.ax += F_ * vectX_;
        r.ay += F_ * vectY_;
        q.ax -= F_ * vectX_;
        q.ay -= F_ * vectY_;
      }
    }
  }

  // big spring for states
  for (let s of M.states) {
    let p = statePositions[s];
    for (let s_ of M.states) {
      if (s != s_) {
        let q = statePositions[s_];
        let d = dist(p.x, p.y, q.x, q.y);
        let vectX = (p.x - q.x) / d;
        let vectY = (p.y - q.y) / d;
        let F = k * (d - springLength) // double the girth
        q.ax += F * vectX;
        q.ay += F * vectY;
        p.ax -= F * vectX;
        p.ay -= F * vectY;
      }
    }
  }

  // for action springs
  for (let s of M.states) {
    for (let a of M.actions[s]) {
      p = stateActionPositions[s][a];
      for (let s_ of M.states) {
        for (let a_ of M.actions[s_]) {
          q = stateActionPositions[s_][a_];
          if (p != q) {
            let d = dist(p.x, p.y, q.x, q.y);
            let vectX = (p.x - q.x) / d;
            let vectY = (p.y - q.y) / d;
            let F = k * (d - springLength) // double the girth
            
            q.ax += F * vectX;
            q.ay += F * vectY;
            p.ax -= F * vectX;
            p.ay -= F * vectY;
          }
        }
      }
    }
  }
  
  // updates
  for (let s of M.states) {
    let p = statePositions[s];
    // grav
    p.vx += p.ax;
    p.vy += p.ay;
    p.x += p.vx;
    p.y += p.vy;
    // draw actions
    for (let a of M.actions[s]) {
      let q = stateActionPositions[s][a];
      q.vx += q.ax;
      q.vy += q.ay;
      q.x += q.vx;
      q.y += q.vy;
    }
  }

  // draw arrows
  for (let s of M.states) {
    let p = statePositions[s];
    for (let a of M.actions[s]) {
      let q = stateActionPositions[s][a];
      arrow(p.x, p.y, q.x, q.y, radius / 2);
      // for (let s_ of M.states) {
      for (let s_ in M.P[s][a]) {
        // if (M.P[s][a].hasOwnProperty(s_)) {
        if (true) {
          let t = statePositions[s_];
          arrow(q.x, q.y, t.x, t.y, radius);
          if (M.rewards[s].hasOwnProperty(a)) {
            if (M.rewards[s][a].hasOwnProperty(s_)) {
              let r = M.rewards[s][a][s_];
              text(r, (t.x + q.x) / 2, (t.y + q.y) / 2);
            }
          }
        }

      }
    }
  }

  // draw states
  for (let s of M.states) {
    let p = statePositions[s];
    circle(p.x, p.y, 2 * radius)
    text(s, p.x, p.y)
    // draw actions
    for (let a of M.actions[s]) {
      let q = stateActionPositions[s][a];
      circle(q.x, q.y, radius);
      text(a, q.x, q.y);
    }
  }
}

function arrow(x1, y1, x2, y2, radius) {
  push();
  noFill()
  translate(x1, y1);
  let theta = atan2(y2 - y1, x2 - x1);
  rotate(theta);
  let l = dist(x1, y1, x2, y2) - radius;
  bezier(0, 0, l / 2, l * arrowCurve, l / 2, l * arrowCurve, l, 0);
  line(l, 0, l - arrowScale, arrowScale);
  line(l, 0, l - arrowScale, -arrowScale);
  pop();
}

console.log(valueIteration(M))