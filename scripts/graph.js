let stateRadius = 20;
let actionRadius = stateRadius/1.5;

class Vertex {
    // Generic vertex class
    constructor(name, radius) {
        this.name = name;
        this.radius = radius;
        this.outNeighbors = new Set();
        this.distances = new Map();
    }

    addOutNeighbor(vertex) {
        this.outNeighbors.add(vertex);
    }

    isOutNeighbor(vertex) {
        return this.outNeighbors.has(vertex);
    }

    isNeighbor(vertex) {
        return vertex.isOutNeighbor(this) || this.isOutNeighbor(vertex);
    }

    distanceTo(vertex) {
        return this.distances.get(vertex);
    }
}

function computeDistances(graph) {
    for (let v1 of graph) {
        for (let v2 of graph) {
            v1.distances.set(v2, computeDistance(v1, v2, graph));
        }
    }
}

function computeDistance(v1, v2, graph) {
    let traverse = new Map();
    for (let v of graph) {
        traverse.set(v, false);
    }
    return bfs(v1, v2, graph, traverse);
}

function bfs(root, v2, graph, traverse) {
    let Q = [];
    traverse.set(root, true);
    Q.push(root);
    while (Q.length != 0) {
        let v = Q.shift();
        if (v == v2) {
            return 0;
        }
        for (let w in graph) {
            if (w.isNeighbor(v) && !traverse.get(w)) {
                traverse.set(w, true);
                Q.push(w);
                // this is fucked up 
            }
        }
    }

}


function MDPtoGraph(M) {
    let stateVertexMap = new Map();
    let stateActionVertexMap = new Map();
    let result = [];

    // make graph
    for (let state of M.states) {
        let currentStateVertex = new Vertex(state, stateRadius);
        stateVertexMap.set(state, currentStateVertex);
        result.push(currentStateVertex);
        stateActionVertexMap.set(state, new Map());
        for (let action of M.actions[state]) {
            let currentStateActionVertex = new Vertex(action, actionRadius)
            stateActionVertexMap.get(state).set(action, currentStateActionVertex);
            result.push(currentStateActionVertex);
        }
    }
    
    // make connections
    for (let state of M.states) {
        for (let action of M.actions[state]) {
            stateVertexMap.get(state).addOutNeighbor(stateActionVertexMap.get(state).get(action))
            for (let state_ in M.P[state][action]) {
                stateActionVertexMap.get(state).get(action).addOutNeighbor(stateVertexMap.get(state_));
            }
        }
    }


    return result
}

let graph = {
    Vertex,
    MDPtoGraph,
};


