var TableModule = (function($) {
    var Table = function(columnLabels, rows) {
        this.columnLabels = columnLabels;
        this.rows = rows;
    };

    _.extend(Table.prototype, {
        render: function() {
            var thead = '<thead><tr>';
            _.each(this.columnLabels, function(columnLabel) {
                thead += '<th>' + columnLabel + '</th>';
            });
            thead += '</tr></thead>';

            var tbody = '<tbody>';
            _.each(this.rows, function(row) {
                tbody += '<tr>';
                _.each(row, function(cell) {
                    if (!_.isArray(cell)) {
                        tbody += '<td>' + cell + '</td>';
                    } else {
                        tbody += '<td>';
                        _.each(cell, function(subcell) {
                            tbody += '<a href="' + subcell.link + '" target="_new">' + subcell.text + '</a>' + ', ';
                        });
                        tbody = tbody.slice(0, -2);
                        tbody += '</td>';
                    }
                });
                tbody += '</tr>';
            });
            tbody += '</tbody>';

            var table = document.createElement('table');
            table = $(table);
            table.html(thead + tbody);
            table.addClass('table table-bordered');
            return table;
        }
    });

    return {
        Table: Table
    };
}(jQuery));
