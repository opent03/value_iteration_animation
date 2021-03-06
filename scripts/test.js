/*
1 -> 3
2 -> 3
4 -> 3
4 -> 2
*/


function getGraph() {
    let radius = 30;
    v1 = new graph.Vertex(1, radius);
    v2 = new graph.Vertex(2, radius);
    v3 = new graph.Vertex(3, radius);
    v4 = new graph.Vertex(4, radius);
    v5 = new graph.Vertex(5, radius);
    v6 = new graph.Vertex(6, radius);
    v7 = new graph.Vertex(7, radius);
    v8 = new graph.Vertex(8, radius);
    v9 = new graph.Vertex(9, radius);
    v10 = new graph.Vertex(10, radius);


    v1.addOutNeighbor(v3);
    v2.addOutNeighbor(v3);
    v5.addOutNeighbor(v7);
    v4.addOutNeighbor(v6);
    v4.addOutNeighbor(v8);
    v4.addOutNeighbor(v10);
    v7.addOutNeighbor(v1);
    v5.addOutNeighbor(v6);
    v7.addOutNeighbor(v8);
    v9.addOutNeighbor(v2);
    v3.addOutNeighbor(v7);
    graph = [v1, v2, v3, v4, v5, v6, v7, v8, v9, v10];
    computeDistances(graph);
    console.log(v9.distanceTo(v10));
    return graph;
}

let test = {
    getGraph,
};