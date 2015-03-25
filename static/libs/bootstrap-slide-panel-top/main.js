$(document).ready(function() {

    // Page load animation panel
    var $openPanel = $('header #collapseOne');
    if ($openPanel.length) {
        $(window).load(function() {
            setTimeout(function() {
                $openPanel.collapse('show');
            }, 1000);
        });
    }

    // Button close panel
    $('#home-accordion .close').on('click', function() {
        $('#collapseOne').collapse('hide');
        applyLayout();
        window.setTimeout(stopLayout, 5000);
    });

    $('#bionavist-top-bar').on('hidden.bs.collapse', function () {
        applyLayout();
        window.setTimeout(stopLayout, 5000);
    });

});