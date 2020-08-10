/*
1 -> 3
2 -> 3
4 -> 3
4 -> 2
*/


function getGraph() {
    let radius = 50;
    v1 = new graph.Vertex(1, radius);
    v2 = new graph.Vertex(2, radius);
    v3 = new graph.Vertex(3, radius);
    v4 = new graph.Vertex(4, radius);

    v1.addOutNeighbor(v3);
    v2.addOutNeighbor(v3);
    v4.addOutNeighbor(v3);
    v4.addOutNeighbor(v2);

    return [v1, v2, v3, v4];
}


let test = {
    getGraph,
};