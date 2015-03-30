var s;
var CANVAS_WIDTH = 900,
    CANVAS_HEIGHT = 600,
    MAX_NODES = 2000;

var filterKeywords = {
    substance: {
        'Protein': ['actin', 'myosin', 'myoglobin', 'hemoglobin', 'melanopsin', 'photoisomerase', 'opsin', 'collagen', 'adiponectin', 'tropoelastin', 'elastin'],
        'Hormone:': {
            'Amine': ['insulin', 'oxytocin', 'cortisol', 'glucagon', 'neuroestrogen'],
            'Peptide': ['progesterone', 'estrogen', 'testosterone', 'growth hormone', 'growth factor']
        },
        'Neurotransmitter': ['dopamine', 'serotonin', 'norepinephrine', 'epinephrine', 'acetylcholine', 'GABA', 'catechcholamine']
    },
    structure: {
        'Biological System': ['immune system', 'limbic system', 'circulatory system', 'digestive system', 'integumentary system', 'lymphatic system'],
        'Tissue | Organ': ['amygdala', 'hypothalamus', 'thalamus', 'hippocampus', 'pituitary gland', 'adrenal gland', 'pancreas', 'acruate nucleus', 'kidney', 'blood vessels', 'esophagus', 'tumor'],
        'Cell Type': ['lymphocyte', 'native T cell', 'helper T cell', 'cytotoxic T cell', 'activated T cell', 'rested T cells', 'spermatocyte', 'leukocyte', 'adipocyte', 'neuron', 'astrocyte', 'stem cell'],
        'Receptor': ['G-protein coupled receptor', 'calcium ion channel', 'transport channel', 'serotonin receptor']
    },
    process: {
        'Event Type:': {
            'Molecular': ['DNA synthesis', 'transcription', 'translation', 'DNA damage', 'DNA repair'], 
            'Pathway': ['[X]-reuptake', 'MAPKKK cascade', 'signal transduction', '[X]-binding', '[X]-transport'],
            'Environmental': ['drug administration', 'X injection', 'drug use', 'food intake', 'sun exposure', 'smoke inhalation'],
            'Biological Phenomena': ['necrosis', 'apoptosis', 'glycolysis', 'lipolysis', 'embryogenesis', 'spermatogenesis']
        },
        'Physiological': ['digestion', 'metabolism', 'heart rate', 'vasodilation', 'blood pressure'],
        'Cognitive': ['memory', 'memory loss', 'attention', 'intelligence', 'executive function', 'perception'],
        'Disease/Disorder': ['ebola', 'cancer', 'diabetes', 'ADHD', 'Parkinson\'s Disease', 'Huntington\'s Disease', 'obesity', 'anorexia', 'drug addiction', 'alcoholism'],
        'Other': ['light', 'stress', 'sleepiness', 'arousal', 'hunger', 'bone-formation', 'death', 'aging', 'skin degeneration']
    },
}

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
    populateNodeFilterer();

    s = new sigma({
        graph: g,
        renderer: {
            container: document.getElementById('graph-container'),
            type: 'canvas'
        },
        settings: {
            minEdgeSize: 0.5,
            maxEdgeSize: 4,
            enableEdgeHovering: true,
            edgeHoverSizeRatio: 1,
            edgeHoverExtremities: true,
            batchEdgesDrawing: true
        }
    });

    // s.graph.addNode({
    //     id: 'newnode1',
    //     label: 'newnode1',
    //     x: 1,
    //     y: 1,
    //     size: 1
    // }).addNode({
    //     id: 'newnode2',
    //     label: 'newnode2',
    //     x: 500,
    //     y: 500,
    //     size: 1
    // }).addEdge({
    //     id: 'newedge1',
    //     source: 'newnode1',
    //     target: 'newnode2',
    //     label: 'newedge1',
    //     hover_color: '#333333',
    //     size: 13
    //     // type: 't'
    // });

    // s.refresh();

    s.bind('overEdge outEdge clickEdge doubleClickEdge rightClickEdge', function(e) {
        console.log(e.type, e.data.edge, e.data.captor);
    });

    s.bind('clickNode', function(e) {
        handleClickNode(e.data.node);
    });

    // s.bind('overEdge outEdge clickEdge', function(e) {
    //     console.log('event', e);
    //     handleClickEdge(e.data.edge);
    // });

    s.bind('clickStage', function(e) {
        handleClickStage();
    });

    fetchRelations();
});

function populateNodeFilterer() {
    var html = '';

    var generateCheckbox = function(label) {
        var checkbox = '';
        checkbox += '<div class="checkbox"><label>';
        checkbox += '<input type="checkbox"> ' + label;
        checkbox += '</label></div>';
        return checkbox;
    };

    _.each(filterKeywords, function(categoryItems, categoryKey) {
        html += '<div class="col-sm-4"><div class="well well-sm">';
        html += '<h4>' + categoryKey + '</h4>';
        if (_.isArray(categoryItems)) {
            _.each(categoryItems, function(item) {
                html += generateCheckbox(item);
            });
        } else {
            html += '<div class="row">';
            _.each(categoryItems, function(subcategoryItems, subcategoryKey) {
                html += '<div class="col-sm-4">';
                html += '<h6>' + subcategoryKey + '</h6>';
                if (_.isArray(subcategoryItems)) {
                    _.each(subcategoryItems, function(item) {
                        html += generateCheckbox(item);
                    });
                } else {
                    html += '<div class="row">';
                    _.each(subcategoryItems, function(items, key) {
                        html += '<div class="col-sm-12">';
                        html += '<h7>' + key + '</h7>';
                        _.each(items, function(item) {
                            html += generateCheckbox(item);
                        });
                        html += '</div>'
                    });
                    html += '</div>'
                }
                html += '</div>';
            });
            html += '</div>';
        }
        html += '</div></div>';
    });
    
    var newHtml = $('#filter-terms-anchor').html() + html;
    $('#filter-terms-anchor').html(newHtml);
    
}

function fetchRelations() {
    websocketClient();
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function redrawGraph(arrayOfNodes, arrayOfEdges) {
    var nodesDup = [],
        edgesDup = [];

    _.each(arrayOfNodes, function (node) {
        nodesDup.push({
            id: node.id.toString(),
            label: node.name,
            size: 1
        });
    });

    _.each(arrayOfEdges, function (edge) {
        edgesDup.push({
            id: edge.id.toString(),
            source: edge.source.toString(),
            target: edge.target.toString(),
            label: edge.name,
            type: "arrow"
        });
    });

    s.graph.clear();
    s.graph.read({
        nodes: nodesDup,
        edges: edgesDup
    });

    // clustering.js
    initializeClustering(arrayOfNodes, arrayOfEdges);
    cluster();
    dropNodes();
}

function handleOnMessage(relation) {
    if (nodes.length > MAX_NODES) return;
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

    // s.refresh();
}

function handleConnectionClose() {
    console.log("Connection closed");
}

function handleClickEdge(edge) {
    console.log(edge);
}

function handleClickStage() {

}

function applyLayout() {
    s.startForceAtlas2({
        linLogMode: false,
        scalingRatio: 100,
        iterationsPerRender: 10000,
        outboundAttractionDistribution: true,
        // adjustSizes: true,
        edgeWeightInfluence: 0.2
    });
}

function stopLayout() {
    s.stopForceAtlas2();
}
