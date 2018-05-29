//on load
$(document).ready(function () {
    //bar slider
    var barslider = document.getElementById("barslider");
    barslider.oninput = function () {
        var val = barslider.value;
        $(".meterfill").width(val + "%");
    };
});