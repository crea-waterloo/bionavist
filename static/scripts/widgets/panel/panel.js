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
            div.innerHTML = title + subcomponentContent;
            return div;
        }
    });

    var NodeDescriptionPanel = function(title, description) {
        this.title = title;
        this.description = description;
        this.subcomponents = [];
    };

    _.extend(NodeDescriptionPanel.prototype, Panel.prototype, {});

    return {
        Panel: Panel
    };
}(jQuery));
