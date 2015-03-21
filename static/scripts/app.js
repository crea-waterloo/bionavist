var app = angular.module("crea-relation-viewer", []);

app.factory("Connection", function() {
    var connection = new WebSocket("ws://"+window.location.hostname+":8081");
    var collection = [];

    connection.onopen = function () {
        console.log("Connection opened");
    };

    connection.onclose = function () {
        // console.log("Connection closed");
        console.log("Connection closed");
    };

    connection.onerror = function () {
        console.error("Connection error");
    };

    var interface = {
        collection: collection,
        connection: connection,
        fetch: function() {
            connection.send("fetch");
        }
    };

    return interface;
});

var Node = function(id, name) {
    this.id = id;
    this.name = name;
};

var Edge = function(id, source, target, name) {
    this.id = id;
    this.source = source;
    this.target = target;
    this.name = name;
    this.links = [];
};

_.extend(Edge.prototype, {
    addLink: function(link) {
        if (!_.find(this.links, function(existingLink) {
            return existingLink === link;
        })) {
            this.links.push(link);
        }
    }
});

app.controller("GraphController", ["$scope", "Connection", function($scope, Connection) {
    var s = new sigma('graph-container');
    var nodes = [];
    var edges = [];
    s.settings({
        defaultEdgeColor: '#ec5148'
    });

    // Then, let's add some data to display:
    s.graph.addNode({
      // Main attributes:
      id: 'n0',
      label: 'Hello',
      // Display attributes:
      x: 0,
      y: 0,
      size: 1,
    }).addNode({
      // Main attributes:
      id: 'n1',
      label: 'World !',
      // Display attributes:
      x: 1,
      y: 1,
      size: 1,
    }).addEdge({
      id: 'n0',
      // Reference extremities:
      source: 'n0',
      target: 'n1'
    });

    // Finally, let's ask our sigma instance to refresh:
    s.refresh();
    Connection.connection.onmessage = function (event) {
        var relation = JSON.parse(event.data);
        Connection.collection.push(relation);

        $scope.$apply(function() {
            $scope.relationsJson = Connection.collection;
        });

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

        $scope.$apply(function() {
            $scope.nodes = nodes;
            $scope.edges = edges;
        });
    };

    $scope.fetchRelations = function() {
        Connection.fetch();
        sigma.parsers.json("data.json", {
            container: 'graph-container',
            settings: {
              defaultNodeColor: '#ec5148'
            }
        });
    };
}]);