var nodes = [];
var links = [];
var categories = [];
var json = require('./convertcsv.json');


function findIndex(string, arr){
	for (var i = arr.length - 1; i >= 0; i--) {
		if(arr[i].id === string){
			return i;
		}
	}
	return -1;
}
function findLink(x, y, arr){
	for (var i = arr.length - 1; i >= 0; i--) {
		if((arr[i].source === x) && (arr[i].target === y)){
			return 1;
		}
	}
	return -1;
}

// console.log(json[0]["Box 1"]);

for(relation in json){

	var categories1Index = findIndex(json[relation]["Cat Box 1"], categories);
	if((categories1Index === -1)&&(json[relation]["Cat Box 1"] != '')&&(json[relation]["Cat Box 1"] != 'N/A')){
		categories.push({"id":json[relation]["Cat Box 1"], "type":"square"});
		nodes.push({"id":json[relation]["Cat Box 1"], "type":"square"});

	}

	var categories2Index = findIndex(json[relation]["Cat Box 2"], categories);
	if((categories2Index === -1)&&(json[relation]["Cat Box 2"] != '')&&(json[relation]["Cat Box 2"] != 'N/A')){
		categories.push({"id":json[relation]["Cat Box 2"], "type":"square"});
		nodes.push({"id":json[relation]["Cat Box 2"], "type":"square"});
	
	}

	var sourceIndex = findIndex(json[relation]["Box 1"], nodes);
	if(sourceIndex === -1){
		nodes.push({"score":0, "id":json[relation]["Box 1"], "type":"circle"});
		sourceIndex = findIndex(json[relation]["Box 1"], nodes);
	}
	else{
		nodes[sourceIndex].score += 0.15;
		if(nodes[sourceIndex].score >= 1){
			nodes[sourceIndex].score = 1;
		}
	}

	var targetIndex = findIndex(json[relation]["Box 2"], nodes);
	if(targetIndex === -1){
		nodes.push({"score":0, "id":json[relation]["Box 2"], "type":"circle"});
		targetIndex = findIndex(json[relation]["Box 2"], nodes);
	}
	else{
		nodes[targetIndex].score += 0.15;
		if(nodes[targetIndex].score >= 1){
			nodes[targetIndex].score = 1;
		}
	}

	categories1Index = findIndex(json[relation]["Cat Box 1"], nodes);	
	if((findLink(sourceIndex, categories1Index, links) === -1)&&(categories1Index != -1)){
		links.push({"source":sourceIndex, "target":categories1Index});

	}

	categories2Index = findIndex(json[relation]["Cat Box 2"], nodes);	
	if((findLink(targetIndex, categories2Index, links) === -1)&&(categories2Index != -1)){
		links.push({"source":targetIndex, "target":categories2Index});

	}

	if(findLink(sourceIndex, targetIndex, links) === -1){
		links.push({"source":sourceIndex, "target":targetIndex});
	}

}

console.log(links);