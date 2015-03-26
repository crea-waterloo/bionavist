function handleClickNode(node) {
    // find edges whose subject is this node
    var outwardEdges = _.filter(edges, function(edge) {
        return edge.source.toString() === node.id;
    });

    // group edges by the verb
    var groupedEdges = _.groupBy(outwardEdges, function(edge) {
        return edge.name;
    });

    var nodeDescriptionPanel = new PanelModule.NodeDescriptionPanel(node, groupedEdges);

    $.ajax({
        url: "http://lookup.dbpedia.org/api/search.asmx/KeywordSearch", 
        data: { QueryString: node.label, MaxHits: '1' }, 
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Accept', 'application/json');
        },
        success: function (data) {
            if (data.results[0]) {
                nodeDescriptionPanel.setDescription(data.results[0].description);
            } else {
                nodeDescriptionPanel.setDescription('No description is available.');
            }

            // render
            updateNodeDescriptionPanel(groupedEdges, nodeDescriptionPanel);
        }
    });
}

function updateNodeDescriptionPanel(groupedEdges, nodeDescriptionPanel) {
    $('#right-side-bar').empty();
    $('#right-side-bar').append(nodeDescriptionPanel.render());

    // perform actions only when the node is a subject/has outgoing edges
    if (_.keys(groupedEdges).length > 0) {
        updateNodeHistogram(groupedEdges);
    }

    $('#right-side-bar').show();
}

function updateNodeHistogram(groupedEdges) {
    $('#subject-verb-histogram').highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Verb Frequency'
        },
        xAxis: {
            categories: _.keys(groupedEdges),
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Frequency',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Frequency',
            data: _.map(groupedEdges, function(group) {
                return group.length;
            })
        }]
    });
}
