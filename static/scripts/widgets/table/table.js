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

            var tbody = '<tbody><tr>';
            _.each(this.rows, function(row) {
                tbody += '<tr>';
                _.each(row, function(cell) {
                    tbody += '<td>' + cell + '</td>';
                });
                tbody += '</tr>';
            });
            tbody += '</tr></tbody>';

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
