let radius = 20;
let arrowScale = 10;
let arrowCurve = 0.01 * arrowScale;
let k = 0.05;
let springLength = 200;
let physicsGamma = 0.1;

function initStateActions(statePositions, stateActionPositions, M) {
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

function updateStateActions(statePositions, stateActionPositions, M) {
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
}

function drawStateActions(statePositions, stateActionPositions, M) {
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

function initVertexPositions(vertexPositions, graph) {
    for (let v of graph) {
        vertexPositions.set(v, {
            x: random(radius, width - radius),
            y: random(radius, height - radius),
            vx: 0,
            vy: 0
        });
    }
}

function updateVertexPositions(vertexPositions, graph) {
    // initialization
    for (let v of graph) {
        let p = vertexPositions.get(v);
        p.ax = -p.vx * physicsGamma;
        p.ay = -p.vy * physicsGamma;
    }

    for (let v1 of graph) {
        let p1 = vertexPositions.get(v1);
        for (let v2 of graph) {
            let p2 = vertexPositions.get(v2);
            if (v1 == v2) {
                continue;
            }
            if (v1.isNeighbor(v2)) {
                applyForce(p1, p2);
            }
            else {
                applyForce(p1, p2, length = 2);
            }
        }
    }

    for (let v of graph) {
        let p = vertexPositions.get(v);
        p.vx += p.ax;
        p.vy += p.ay;
        p.x += p.vx;
        p.y += p.vy;
    }
}

function drawGraph(vertexPositions, graph) {
    // draw arrows
    for (let v1 of graph) {
        let p1 = vertexPositions.get(v1);
        for (let v2 of graph) {
            let p2 = vertexPositions.get(v2);
            if (v1.isOutNeighbor(v2)) {
                arrow(p1.x, p1.y, p2.x, p2.y, radius);
            }
        }
    }

    // draw vertices
    for (let v of graph) {
        let p = vertexPositions.get(v);
        circle(p.x, p.y, 2 * radius)
        text(v.name, p.x, p.y)
    }
}



// helper
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

function applyForce(p, q, length = 1) {
    let d = dist(p.x, p.y, q.x, q.y);
    let vectX = (p.x - q.x) / d;
    let vectY = (p.y - q.y) / d;
    let F = k * (d - length * springLength)
    p.ax -= F * vectX;
    p.ay -= F * vectY;
}