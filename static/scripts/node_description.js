function handleClickNode(node) {
    // find edges whose subject is this node
    var outwardEdges = _.filter(edges, function(edge) {
        return edge.source.toString() === node.id;
    });

    // group edges by the verb
    var groupedEdges = _.groupBy(outwardEdges, function(edge) {
        return edge.name;
    });

    updateReactPanel(node, groupedEdges);
    updatePanelDescription('Fetching description...');

    $.ajax({
        url: "http://lookup.dbpedia.org/api/search.asmx/KeywordSearch", 
        data: { QueryString: node.label, MaxHits: '1' }, 
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Accept', 'application/json');
        },
        success: function (data) {
            if (data.results[0]) {
                updatePanelDescription(data.results[0].description);
            } else {
                updatePanelDescription('No description is available.');
            }
        }
    });
}
