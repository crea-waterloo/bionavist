// Data
var vertices,
	edges;

// Constants
var DEBUG_MODE = true;

// Data structures
var adjMatrix = [],
	classArray = [],
	prevClassArray,
	classMatrix = [];

function initializeClustering(arrayOfNodes, arrayOfEdges) {
	vertices = arrayOfNodes;
	edges = arrayOfEdges;
}

function readInGraph() {

	if (DEBUG_MODE)
		console.log('Initializing Adjacency Matrix');

	for (var i = 0; i <= vertices.length; i++) {
		adjMatrix[i] = [];
		for (var j = 0; j <= vertices.length; j++) {
			adjMatrix[i][j] = 0;
		}
	}

	if (DEBUG_MODE)
		console.log('Populating Adjacency Matrix');

	edges.forEach(function (edge) {
		adjMatrix[edge.source][edge.target] = edge.links.length;
		adjMatrix[edge.target][edge.source] = edge.links.length;
	});

	if (DEBUG_MODE) {
		console.log(' > Finished');
		console.log('Adjacency Matrix: ');
		console.log(adjMatrix);
	}

	if (DEBUG_MODE)
		console.log('Initializing Class Array');

	vertices.forEach(function (vertex) {
		classArray[vertex.id] = vertex.id;
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

	for (var i = 1; i <= vertices.length; i ++) {
		classMatrix[i] = [];
		var tempClassArray = Array.apply(null, new Array(vertices.length + 1))
								  .map(Number.prototype.valueOf,0);


		for (var j = 1; j <= vertices.length; j ++) {
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




// Main Function
function cluster() {
	initializeClustering(nodes, edges);
	readInGraph();
	while (classChanges()) {
		updateClass();
	}
}


