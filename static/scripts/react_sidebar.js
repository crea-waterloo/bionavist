var ReactPanel = React.createClass({
  render: function() {
    var groupedEdges = this.props.groupedEdges;
    var colLabels = ['Verb', 'Unique Count', 'Total Count', 'Objects'];
    var rows = [];
    var rowIndex = 1;
    _.each(groupedEdges, function(edges, edgeName) {
        var subentries = [];
        _.each(edges, function(edge) {
            subentries.push({text: nodes[edge.target].name, link: edge.links[0]});
        });
        rows.push([edgeName, _.unique(edges).length, edges.length, subentries]);
        rowIndex++;
    });

    return (
      <div className="reactPanel">
        <h2>{ this.props.title }</h2>
        <div id="react-panel-description"></div>
        <ReactHistogram groupedEdges={groupedEdges} />
        <ReactTable columnLabels={colLabels} rows={rows} />
      </div>
    );
  }
});

var ReactDescription = React.createClass({
  render: function() {
    return (
      <p>{ this.props.description }</p>
    );
  }
});

var ReactTable = React.createClass({
  render: function() {
    var rows = this.props.rows;
    var headerCells;
    var rowNodes;
    if (rows.length > 0) {
      headerCells = this.props.columnLabels.map(function(label) {
        return (
          <th>{ label }</th>
        );
      });

      var rowNodes = rows.map(function(row) {
        var rowCells = row.map(function(cell) {
          if (!_.isArray(cell)) {
            return (
              <td>{ cell }</td>
            );
          } else {
            var subcells = cell.map(function(subcell) {
              return (
                <li className="shift-left"><a href={ subcell.link } target="_new">{ subcell.text }</a></li>
              );
            });
            return (
              <td><ul>{ subcells }</ul></td>
            );
          }
        });
        return (
          <tr>{ rowCells }</tr>
        );
      });
    }
    return (
      <table className="table table-bordered">
        <thead><tr>{ headerCells }</tr></thead>
        <tbody>{ rowNodes }</tbody>
      </table>
    );
  }
});

var ReactHistogram = React.createClass({
  render: function() {
    var groupedEdges = this.props.groupedEdges;
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
    return (
      <div id="subject-verb-histogram"></div>
    )
  }
});

function updateReactPanel(node, groupedEdges) {
  title = node.label || 'Title';
  React.render(
    <ReactPanel title={title} groupedEdges={groupedEdges} />,
    document.getElementById('right-side-bar')
  );
}

// This needs to be separate from updateReactPanel since description is fetched asynchronously
function updatePanelDescription(description) {
  React.render(
    <ReactDescription id="react-panel-description" description={description} />,
    document.getElementById('react-panel-description')
  );
}

updateReactPanel({}, {});
updatePanelDescription('Description will appear here once you click on a node!');
