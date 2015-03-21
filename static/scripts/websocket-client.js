var connection;

function websocketClient() {
    connection = new WebSocket("ws://"+window.location.hostname+":8081");

    connection.onopen = function () {
        connection.send("fetch");
    };
    connection.onclose = function () {
        console.log("Connection closed");
    };
    connection.onerror = function () {
        console.error("Connection error");
    };
    connection.onmessage = function (event) {
        var relation = JSON.parse(event.data);

        var subjectNode = _.find(nodes, function(node) {
            return node.name === relation.subject;
        });

        if (!subjectNode) {
            subjectNode = new Node(nodes.length, relation.subject);
            nodes.push(subjectNode);
        }

        var objectNode = _.find(nodes, function(node) {
            return node.name === relation.object;
        });

        if (!objectNode) {
            objectNode = new Node(nodes.length, relation.object);
            nodes.push(objectNode);
        }

        var edge = _.find(edges, function(edge) {
            return edge.source === subjectNode.id
                    && edge.target === objectNode.id 
                    && edge.name === relation.predicate;
        });

        if (!edge) {
            edge = new Edge(edges.length, subjectNode.id, objectNode.id, relation.predicate);
            edges.push(edge);
        }

        edge.addLink(relation.link);
    };
}
