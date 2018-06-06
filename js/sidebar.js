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
    $("#sidebar-list").children().on("click", function () {
       if (!($(this).children().prop("tagName") == "H3") && !($(this).hasClass("sidebar-entry-selected"))) {
           $(this).parent().children().each(function () {
              if ($(this).hasClass("sidebar-entry-selected")) {
                  $(this).removeClass("sidebar-entry-selected");
                  $(this).addClass("sidebar-entry");
              }
           });
           $(this).removeClass("sidebar-entry");
           $(this).addClass("sidebar-entry-selected");
       }
    });
});