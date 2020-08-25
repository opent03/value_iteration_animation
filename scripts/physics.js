let radius = 20;
let arrowScale = 10;
let arrowCurve = 0.01 * arrowScale;
let k = 0.05;
let springLength = 200;
let physicsGamma = 0.1;
let margin = 50;

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
                applyForce(p1, p2, length=2);
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
    let drawVertexPositions = new Map();
    let minX = min(graph.map(v => vertexPositions.get(v).x));
    let minY = min(graph.map(v => vertexPositions.get(v).y));
    let maxX = max(graph.map(v => vertexPositions.get(v).x));
    let maxY = max(graph.map(v => vertexPositions.get(v).y));

    // recalculate vertex positions
    for (let v of graph) {
        let p = vertexPositions.get(v);
        drawVertexPositions.set(v, {
            x: map(p.x, minX, maxX, margin, width-margin ),
            y: map(p.y, minY, maxY, margin, height-margin)
        });
    }

    // draw arrows
    for (let v1 of graph) {
        let p1 = drawVertexPositions.get(v1);
        for (let v2 of graph) {
            let p2 = drawVertexPositions.get(v2);
            if (v1.isOutNeighbor(v2)) {
                arrow(p1.x, p1.y, p2.x, p2.y, v2.radius);
            }
        }
    }

    // draw vertices
    for (let v of graph) {
        let p = drawVertexPositions.get(v);
        circle(p.x, p.y, 2*v.radius);
        text(v.name, p.x, p.y);
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

let physics = {
    initVertexPositions, 
    updateVertexPositions, 
    drawGraph, 
    radius,
    arrowScale,
    arrowCurve, 
    k,
    springLength,
    physicsGamma
};
