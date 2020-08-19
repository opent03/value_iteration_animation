class Vertex {
    // Generic vertex class
    constructor(name, radius) {
        this.name = name;
        this.radius = radius;
        this.outNeighbors = new Set();
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
}

let graph = {
    Vertex,
};


