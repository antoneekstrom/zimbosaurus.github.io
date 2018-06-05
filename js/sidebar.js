var sidebar_visible = true;

$(document).ready(function () {
    var sidebar_width = $("#sidebar-outercontainer").outerWidth();
    console.log(sidebar_width);
    $("#sidebar-collapsediv").click(function() {
        if (sidebar_visible == true) {
            sidebar_visible = false;
            $("#sidebar-outercontainer").animate({"margin-left" : -sidebar_width}) ;
        } else {
            sidebar_visible = true;
            $("#sidebar-outercontainer").animate({"margin-left" : "0"}) ;
        }
    });
});