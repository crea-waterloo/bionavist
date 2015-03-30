// Data
var clusteringNodes,
	clusteringEdges,
	nodesMapForward,
	nodesMapBackward;

// Constants
var DEBUG_MODE = true;

// Data structures
var adjMatrix = [],
	classArray = [],
	prevClassArray,
	classMatrix = [],
	classesHash = {};

var CLUSTER_CUT_OFF_SIZE = 10;


function initializeClustering(arrayOfNodes, arrayOfEdges) {
	// reset
	adjMatrix = [];
	classArray = [];
	divisionCounter = -1;
	classMatrix = [];
	classesHash = {};
	// link
	clusteringNodes = arrayOfNodes;
	clusteringEdges = arrayOfEdges;

	nodesMapForward = [];
	nodesMapBackward = [];

	for (var i = 0; i < clusteringNodes.length; i++) {
		nodesMapForward[i] = clusteringNodes[i].id;
		nodesMapBackward[clusteringNodes[i].id] = i;
	}
	if (DEBUG_MODE) {
		console.log(nodesMapForward);
		console.log(nodesMapBackward);
	}
}

function readInGraph() {

	if (DEBUG_MODE)
		console.log('Initializing Adjacency Matrix');

	for (var i = 0; i <= clusteringNodes.length; i++) {
		adjMatrix[i] = [];
		for (var j = 0; j <= clusteringNodes.length; j++) {
			adjMatrix[i][j] = 0;
		}
	}

	if (DEBUG_MODE)
		console.log('Populating Adjacency Matrix');

	clusteringEdges.forEach(function (edge) {
		adjMatrix[nodesMapBackward[edge.source]][nodesMapBackward[edge.target]] = edge.links.length;
		adjMatrix[nodesMapBackward[edge.target]][nodesMapBackward[edge.source]] = edge.links.length;
	});

	if (DEBUG_MODE) {
		console.log(' > Finished');
		console.log('Adjacency Matrix: ');
		console.log(adjMatrix);
	}

	if (DEBUG_MODE)
		console.log('Initializing Class Array');

	clusteringNodes.forEach(function (node) {
		classArray[nodesMapBackward[node.id]] = nodesMapBackward[node.id];
	});

	if (DEBUG_MODE) {
		console.log(' > Finished');
		console.log('Class Array: ');
		console.log(classArray);
	}
}

function updateClass() {

	if (DEBUG_MODE) 
		console.log('Updating class');

	for (var i = 0; i < clusteringNodes.length; i ++) {
		classMatrix[i] = [];
		var tempClassArray = Array.apply(null, new Array(clusteringNodes.length + 1))
								  .map(Number.prototype.valueOf, 0);

		for (var j = 0; j < clusteringNodes.length; j ++) {
			if (adjMatrix[i][j] !== 0)
				tempClassArray[classArray[j]] += adjMatrix[i][j];
		}

		classMatrix[i] = tempClassArray;
		classArray[i] = tempClassArray.indexOf(Math.max.apply(Math, tempClassArray));
	}

	if (DEBUG_MODE) {
		console.log(' > Finished');
		console.log('Class Array: ');
		console.log(classArray);
	}
}

// Use for single dimensional arrays only.
function arrayEqual(arr1, arr2) {
	if (arr1 == null || arr2 == null)
		return false;

	for (var i = 0; i < arr1.length; i ++) {
		if (arr1[i] !== arr2[i]) 
			return false;
	}
	return true;
}

// Returns 
function classChanges() {
	if (arrayEqual(prevClassArray, classArray))
		return false;
	else {
		prevClassArray = [];
		for (var i = 0; i < classArray.length; i ++) {
			prevClassArray[i] = classArray[i];
		}
		return true;
	}
}

function collapseClasses() {
	if (DEBUG_MODE)
		console.log('Making Classes Hash');

	for (var i = 0; i < classArray.length; i++) {
		if (classesHash[classArray[i]] == null)
			classesHash[classArray[i]] = [];

		classesHash[classArray[i]].push(nodesMapForward[i]);
	}
	if (DEBUG_MODE) {
		console.log(' > Finished');
		console.log('Classes Hash: ');
		console.log(classesHash);
	}
	return classesHash;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function addColorToCluster(arrayOfNodes) {
	var color = getRandomColor();
	if (DEBUG_MODE)
		console.log('Adding color to cluster');

	arrayOfNodes.forEach(function (entry) {
		var foundNode = findNode(entry);
		if (foundNode) {
			foundNode.color = color;
		}
	});
}

function findNode(id) {
	if (typeof id != 'string')
		id = id.toString();

	var graphNodes = s.graph.nodes();
	for (var i = 0; i < graphNodes.length; i++) {
		if (graphNodes[i].id == id)
			return graphNodes[i];
	}
	return false;
}

var DIVISION_SIZE = 800,
	DIVISIONS_PER_ROW = 6,
	divisionCounter = -1;
function createDivisions() {
	divisionCounter++;
	var row = Math.floor(divisionCounter / DIVISIONS_PER_ROW);
	var col = divisionCounter % DIVISIONS_PER_ROW;
	return {x1: DIVISION_SIZE*(col-1),
			x2: DIVISION_SIZE*(col),
			y1: DIVISION_SIZE*(row-1),
			y2: DIVISION_SIZE*(row)};
}

function dropNodes() {
	var errCounter = 0;

	if (DEBUG_MODE)
		console.log('Dropping all clusters with size < ' + CLUSTER_CUT_OFF_SIZE);

	for (var key in classesHash) {
		if (classesHash[key].length <= CLUSTER_CUT_OFF_SIZE) {
			classesHash[key].forEach(function (entry) {
				if (entry != null) {
					try {
						s.graph.dropNode('' + entry);
					} catch (err) {
						errCounter++;
						// console.error(err);
					}
				}
			});
		} else {
			addColorToCluster(classesHash[key]);
			moveCluster(classesHash[key]);
		}
	}
	s.refresh();

	if (DEBUG_MODE) {
		console.log(' > Finished with ' + errCounter + ' errors');
	}
}

function moveCluster(arrayOfNodes) {
	var division = createDivisions();
	if (DEBUG_MODE)
		console.log('Moving cluster to division ' + divisionCounter);
	arrayOfNodes.forEach(function (entry) {
		var foundNode = findNode(entry);
		if (foundNode) {
			foundNode.x = getRandomInt(division.x1, division.x2);
			foundNode.y = getRandomInt(division.y1, division.y2);
		}
	});
}

// Main Function
function cluster(clusterCutOff) {
	if (clusterCutOff != null) 
		CLUSTER_CUT_OFF_SIZE = clusterCutOff;
	else 
		CLUSTER_CUT_OFF_SIZE = 10;

	readInGraph();
	while (classChanges()) {
		updateClass();
	}
	if (DEBUG_MODE) 
		console.log('Class assignment complete');

	collapseClasses();
}
