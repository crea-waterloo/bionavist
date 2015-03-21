var s;
var CANVAS_WIDTH = 900;
var CANVAS_HEIGHT = 600;

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

var nodes = [];
var edges = [];
var g = {
    nodes: [],
    edges: []
};

window.addEventListener('load', function() {
    s = new sigma({
        graph: g,
        renderer: {
            container: document.getElementById('graph-container'),
            type: 'canvas'
        },
        settings: {
        }
    });
});

function fetchRelations() {
    websocketClient();
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function handleOnMessage(relation) {
    var subjectNode = _.find(nodes, function(node) {
        return node.name === relation.subject;
    });

    if (!subjectNode) {
        subjectNode = new Node(nodes.length, relation.subject);
        nodes.push(subjectNode);
        s.graph.addNode({
          id: subjectNode.id.toString(),
          label: subjectNode.name,
          x: getRandomInt(0, CANVAS_WIDTH),
          y: getRandomInt(0, CANVAS_HEIGHT),
          size: 1,
        });
    }

    var objectNode = _.find(nodes, function(node) {
        return node.name === relation.object;
    });

    if (!objectNode) {
        objectNode = new Node(nodes.length, relation.object);
        nodes.push(objectNode);
        s.graph.addNode({
          id: objectNode.id.toString(),
          label: objectNode.name,
          x: getRandomInt(0, CANVAS_WIDTH),
          y: getRandomInt(0, CANVAS_HEIGHT),
          size: 1,
        });
    }

    var edge = _.find(edges, function(edge) {
        return edge.source === subjectNode.id
                && edge.target === objectNode.id 
                && edge.name === relation.predicate;
    });

    if (!edge) {
        edge = new Edge(edges.length, subjectNode.id, objectNode.id, relation.predicate);
        edges.push(edge);
        s.graph.addEdge({
          id: edge.id.toString(),
          source: edge.source.toString(),
          target: edge.target.toString(),
          label: edge.name,
          type: "arrow"
        });
    }

    edge.addLink(relation.link);

    s.refresh();
}

function applyLayout() {
    s.startForceAtlas2({
        linLogMode: false,
        edgeWeightInfluence: 0.2,
        scalingRatio: 100,
        iterationsPerRender: 10000
    });
}

function stopLayout() {
    s.stopForceAtlas2();
}