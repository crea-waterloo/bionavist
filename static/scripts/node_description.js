function handleClickNode(node) {
    $('#dp-name').text(node.label).show();
    $('#dp-description').text('A description of ' + node.label + '.').show();

    // find edges whose subject is this node
    var outwardEdges = _.filter(edges, function(edge) {
        return edge.source.toString() === node.id;
    });

    // group edges by the verb
    var groupedEdges = _.groupBy(outwardEdges, function(edge) {
        return edge.name;
    });

    // console.log('edges', outwardEdges);
    // console.log('groupedEdges', groupedEdges);

    $('#subject-verb-actions table').remove();
    // perform actions only when the node is a subject/has outgoing edges
    if (_.keys(groupedEdges).length > 0) {
        $('#subject-verb-histogram').show();
        $('#subject-actions-title').text(node.label + ' Actions').show();
        updateNodeHistogram(groupedEdges);

        var rows = [];
        var rowIndex = 1;
        _.each(groupedEdges, function(edges, edgeName) {
            rows.push([rowIndex, edgeName, _.unique(edges).length, edges.length]);
            rowIndex++;
        });

        var table = new TableModule.Table(['#', 'Verb', 'Unique Count', 'Total Count'], rows);
        var tableNode = table.render();
        $('#subject-verb-actions').append(tableNode);
    } else {
        $('#subject-verb-histogram').hide();
        $('#subject-actions-title').hide();
    }
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
