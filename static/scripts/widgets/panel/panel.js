var PanelModule = (function($) {
    var Panel = function(title) {
        this.title = title;
        this.subcomponents = [];
    };

    _.extend(Panel.prototype, {
        addSubcomponent: function(subcomponent) {
            this.subcomponents.push(subcomponent);
        },

        render: function() {
            var title = '<h3>' + this.title + '</h3>';
            var subcomponentContent = '';
            _.each(this.subcomponents, function(subcomponent) {
                var wrap = document.createElement('div');
                wrap = $(wrap);
                wrap.append(subcomponent.render().clone());
                subcomponentContent += wrap.html();
            });
            var div = document.createElement('div');
            div = $(div);
            div.html(title + subcomponentContent);
            return div;
        }
    });

    var NodeDescriptionPanel = function(node, groupedEdges) {
        this.title = node.label;
        this.subcomponents = [];

        var descriptionComponent = new TextComponent('', 'div', 'dp-description');
        this.subcomponents.push(descriptionComponent);

        var plotContainer = new PlotComponent('subject-verb-histogram');
        this.subcomponents.push(plotContainer);

        var actionTitle = new TextComponent(this.description, 'h5');
        this.subcomponents.push(actionTitle);

        // add the table component
        if (_.keys(groupedEdges).length > 0) {
            var rows = [];
            var rowIndex = 1;
            _.each(groupedEdges, function(edges, edgeName) {
                rows.push([rowIndex, edgeName, _.unique(edges).length, edges.length]);
                rowIndex++;
            });

            var table = new TableModule.Table(['#', 'Verb', 'Unique Count', 'Total Count'], rows);
            this.subcomponents.push(table);
        }
    };

    _.extend(NodeDescriptionPanel.prototype, Panel.prototype, {
        setDescription: function(description) {
            this.subcomponents[0].setText(description);
        }
    });

    var TextComponent = function(text, type, eleClass, eleId) {
        this.text = text;
        this.type = type;
        this.eleClass = eleClass || '';
        this.eleId = eleId || '';
    };

    _.extend(TextComponent.prototype, {
        setText: function(text) {
            this.text = text;
        },

        render: function() {
            var textNode = document.createElement(this.type);
            textNode = $(textNode);
            textNode.html(this.text);
            textNode.addClass(this.eleClass);
            textNode.attr('id', this.eleId);
            return textNode;
        }
    });

    var PlotComponent = function(id) {
        this.id = id;
    };

    _.extend(PlotComponent.prototype, {
        render: function() {
            var plotContainer = document.createElement('div');
            plotContainer = $(plotContainer);
            plotContainer.attr('id', this.id);
            return plotContainer;
        }
    });

    return {
        Panel: Panel,
        NodeDescriptionPanel: NodeDescriptionPanel
    };
}(jQuery));
