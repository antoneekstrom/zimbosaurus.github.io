//on load
$(document).ready(function () {
    //slider
    var barslider = document.getElementById("barslider");
    barslider.oninput = function () {
        var val = barslider.value;
        $(".meterfill").width(val + "%");
    };
});