var s;
var CANVAS_WIDTH = 900,
    CANVAS_HEIGHT = 600,
    MAX_NODES = 2000;
var updateGraph = true;

var filterKeywords = {
    substance: { 
        'Protein': ['AANAT', 'melatonin', 'elastin', 'collagen', 'cytochrome c', 'adiponectin', 'opsin', 'collagen', 'adiponectin'],
        'Hormone:': ['melatonin', 'cortisol', 'insulin', 'glucagon', 'adrenocorticotropic hormone', 'ACTH', 'oxytocin', 'prolactin', 'leptin', 'vasopressin', 'grelin', 'food intake leptin', 'somatostatin', 'globulin'],
        'Neurotransmitter': ['dopamine', 'serotonin', 'norepinephrine', 'epinephrine', 'adrenaline', 'vasopressin', 'GABA', 'catechcholamine', 'retina dopamine'],
        'Other': ['glucose', 'gastric acid', 'receptor', 'elastase', 'calpain', 'alpha-1-antitrypsin', 'alapha-2-macroglobulin', 'adrenal cortex cortisol']
    },
    structure: ['collagen structure', 'collagen structure', 'hypothalamus', 'pituitary gland', 'adrenal cortex'],
    process: ['leptin hunger response', 'aging', 'reuptake', 'uptake']
};

// var filterKeywords = {
//     substance: {
//         'Protein': ['actin', 'myosin', 'myoglobin', 'hemoglobin', 'melanopsin', 'photoisomerase', 'opsin', 'collagen', 'adiponectin', 'tropoelastin', 'elastin'],
//         'Hormone:': {
//             'Amine': ['insulin', 'oxytocin', 'cortisol', 'glucagon', 'neuroestrogen'],
//             'Peptide': ['progesterone', 'estrogen', 'testosterone', 'growth hormone', 'growth factor']
//         },
//         'Neurotransmitter': ['dopamine', 'serotonin', 'norepinephrine', 'epinephrine', 'acetylcholine', 'GABA', 'catechcholamine']
//     },
//     structure: {
//         'Biological System': ['immune system', 'limbic system', 'circulatory system', 'digestive system', 'integumentary system', 'lymphatic system'],
//         'Tissue | Organ': ['amygdala', 'hypothalamus', 'thalamus', 'hippocampus', 'pituitary gland', 'adrenal gland', 'pancreas', 'acruate nucleus', 'kidney', 'blood vessels', 'esophagus', 'tumor'],
//         'Cell Type': ['lymphocyte', 'native T cell', 'helper T cell', 'cytotoxic T cell', 'activated T cell', 'rested T cells', 'spermatocyte', 'leukocyte', 'adipocyte', 'neuron', 'astrocyte', 'stem cell'],
//         'Receptor': ['G-protein coupled receptor', 'calcium ion channel', 'transport channel', 'serotonin receptor']
//     },
//     process: {
//         'Event Type:': {
//             'Molecular': ['DNA synthesis', 'transcription', 'translation', 'DNA damage', 'DNA repair'], 
//             'Pathway': ['[X]-reuptake', 'MAPKKK cascade', 'signal transduction', '[X]-binding', '[X]-transport'],
//             'Environmental': ['drug administration', 'X injection', 'drug use', 'food intake', 'sun exposure', 'smoke inhalation'],
//             'Biological Phenomena': ['necrosis', 'apoptosis', 'glycolysis', 'lipolysis', 'embryogenesis', 'spermatogenesis']
//         },
//         'Physiological': ['digestion', 'metabolism', 'heart rate', 'vasodilation', 'blood pressure'],
//         'Cognitive': ['memory', 'memory loss', 'attention', 'intelligence', 'executive function', 'perception'],
//         'Disease/Disorder': ['ebola', 'cancer', 'diabetes', 'ADHD', 'Parkinson\'s Disease', 'Huntington\'s Disease', 'obesity', 'anorexia', 'drug addiction', 'alcoholism'],
//         'Other': ['light', 'stress', 'sleepiness', 'arousal', 'hunger', 'bone-formation', 'death', 'aging', 'skin degeneration']
//     },
// }

var color = d3.scale.category10();

var nodes = [],
    links = [];

var force = d3.layout.
    .nodes(nodes)
    .links(links)
    .charge(-400)
    .linkDistance(100)
    .size([CANVAS_WIDTH, CANVAS_HEIGHT])
    .on("tick", tick);

var svg;

var node, link;
window.addEventListener('load', function() {
    populateNodeFilterer();

    $('#update-filter').click(function() {
        currentFilter = [];
        $('form :checked').each(function(index) {
            currentFilter.push(this.value);
        });

        var filteredNodes = _.filter(nodes, function(node) {
            var showNode = false;
            _.each(currentFilter, function(keyword) {
                if (node.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
                    showNode = true;
                    return;
                }
            });
            return showNode;
        });

        updateGraph = false;
        var correspondingEdges = getCorrespondingArrayOfEdges(filteredNodes);
        console.log(filteredNodes);
        console.log(correspondingEdges);
        redrawGraph(filteredNodes, correspondingEdges);
        $('#collapseOne').collapse('hide');
    });

    svg = d3.select("#graph-container-new").append("svg")
    .attr("width", CANVAS_WIDTH)
    .attr("height", CANVAS_HEIGHT);
    node = svg.selectAll(".node");
    link = svg.selectAll(".link");
    fetchRelations();
});

function populateNodeFilterer() {
    var html = '<form>';

    var generateCheckbox = function(label) {
        var checkbox = '';
        checkbox += '<div class="checkbox"><label>';
        checkbox += '<input class="topbar-filter-checkbox" type="checkbox" value="' + label + '"> ' + label;
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

    html += '</form>';
    
    var newHtml = $('#filter-terms-anchor').html() + html;
    $('#filter-terms-anchor').html(newHtml);
    
}

function fetchRelations() {
    websocketClient();
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// ECMAScript 7
if (![].includes) {
  Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
    'use strict';
    var O = Object(this);
    var len = parseInt(O.length) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1]) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {k = 0;}
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement ||
         (searchElement !== searchElement && currentElement !== currentElement)) {
        return true;
      }
      k++;
    }
    return false;
  };
}

function getCorrespondingArrayOfEdges(arrayOfNodes) {
    var nodeIds = [],
        arrayOfEdges = [];

    _.each(arrayOfNodes, function (node) {
        if (!nodeIds.includes(node.id))
            nodeIds.push(node.id);
    });

    _.each(edges, function (edge) {
        if (nodeIds.includes(edge.source) 
            && nodeIds.includes(edge.target))
            arrayOfEdges.push(edge);
    });
    return arrayOfEdges;
}

function redrawGraph(arrayOfNodes, arrayOfEdges) {
    var nodesDup = [],
        edgesDup = [];

    // s.graph.clear();

    arrayOfNodes = _.filter(arrayOfNodes, function (node) {
        var bool = false;
        _.each(arrayOfEdges, function (edge) {
            if (edge.source == node.id) bool = true;
            if (edge.target == node.id) bool = true;
        });
        return bool;
    });

    console.log('arrayof nodes', arrayOfNodes);

    _.each(arrayOfNodes, function (node) {
        nodesDup.push({
            id: node.id.toString(),
            label: node.name,
            size: 1
        });
        // s.graph.addNode({
        //     id: node.id.toString(),
        //     label: node.name,
        //     size: 1
        // });
    });

    _.each(arrayOfEdges, function (edge) {
        edgesDup.push({
            id: edge.id.toString(),
            source: edge.source.toString(),
            target: edge.target.toString(),
            label: edge.name,
            type: "arrow"
        });
        // s.graph.addEdge({
        //     id: edge.id.toString(),
        //     source: edge.source.toString(),
        //     target: edge.target.toString(),
        //     label: edge.name,
        //     type: "arrow"
        // });
    });



    s.graph.clear();
    s.graph.read({
        nodes: nodesDup,
        edges: edgesDup
    });

    // clustering.js
    initializeClustering(arrayOfNodes, arrayOfEdges);
    cluster(0);
    dropNodes();
    updateGraph = true;
}




function start() {
    console.log("in start");
    link = link.data(force.links(), function(d) { return d.source.id + "-" + d.target.id; });
    link.enter().insert("line", ".node").attr("class", "link");
    console.log(link);
    link.exit().remove();

    node = node.data(force.nodes(), function(d) { return d.id;});
    console.log(node);
    node.enter().append("circle").attr("class", function(d) { return "node " + d.id; }).attr("r", 8);
    node.exit().remove();

  force.start();
}

function tick() {
  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })

  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });
}
setTimeout(function() {
  var a = {id: "a"}, b = {id: "b"}, c = {id: "c"};
  nodes.push(a, b, c);
  links.push({source: a, target: b}, {source: a, target: c}, {source: b, target: c});
  start();
}, 0);

function handleOnMessage(relation) {
	console.log(relation);
    var subjectNode = {id: relation.subject}, objectNode = {id: relation.object};

    console.log(subjectNode);
    if(nodes.includes(subjectNode) && nodes.includes(objectNode)){}
    else if (nodes.includes(subjectNode)){
        nodes.push(objectNode);
        links.push({source: subjectNode, target: objectNode});
    }
    else if (nodes.includes(objectNode)){
        nodes.push(subjectNode);
        links.push({source: subjectNode, target: objectNode});
    }else{
        nodes.push(subjectNode,objectNode);
        links.push({source: subjectNode, target: objectNode});
    }
    start();

    // if (nodes.length > MAX_NODES) return;
    // var subjectNode = _.find(nodes, function(node) {
    //     return node.name === relation.subject;
    // });

    // if (!subjectNode) {
    //     subjectNode = new Node(nodes.length, relation.subject);
    //     nodes.push(subjectNode);
    //     s.graph.addNode({
    //       id: subjectNode.id.toString(),
    //       label: subjectNode.name,
    //       x: getRandomInt(0, CANVAS_WIDTH),
    //       y: getRandomInt(0, CANVAS_HEIGHT),
    //       size: 1,
    //     });
    // }

    // var objectNode = _.find(nodes, function(node) {
    //     return node.name === relation.object;
    // });

    // if (!objectNode) {
    //     objectNode = new Node(nodes.length, relation.object);
    //     nodes.push(objectNode);
    //     s.graph.addNode({
    //       id: objectNode.id.toString(),
    //       label: objectNode.name,
    //       x: getRandomInt(0, CANVAS_WIDTH),
    //       y: getRandomInt(0, CANVAS_HEIGHT),
    //       size: 1,
    //     });
    // }

    // var edge = _.find(edges, function(edge) {
    //     return edge.source === subjectNode.id
    //             && edge.target === objectNode.id 
    //             && edge.name === relation.predicate;
    // });

    // if (!edge) {
    //     edge = new Edge(edges.length, subjectNode.id, objectNode.id, relation.predicate);
    //     edges.push(edge);
    //     s.graph.addEdge({
    //       id: edge.id.toString(),
    //       source: edge.source.toString(),
    //       target: edge.target.toString(),
    //       label: edge.name,
    //       type: "arrow"
    //     });
    // }

    // edge.addLink(relation.link);

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
