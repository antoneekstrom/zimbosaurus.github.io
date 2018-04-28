function addIndex(div) {
        
    $(".title").each(function(i, obj) {
            
        var anchor = $("<a></a>");
        var name = $("<p></p>");
        name.html(obj[i].html());
        div.add(name);
    }); 
}

$(document).ready(function() {
    var sidebar_visible = false;
    var sidebar_width = $("#sidebar").outerWidth();
    $("#sidebar").css({"left" : -sidebar_width});
    
   $("#slidehandle").click(function() {
       if (sidebar_visible == true) {
           sidebar_visible = false;
           $("#sidebar").animate({"left" : -sidebar_width}) ;
           $("#slidehandle").animate({"left" : "0"}) ;
       } else {
           sidebar_visible = true;
           $("#sidebar").animate({"left" : "0"}) ;
           $("#slidehandle").animate({"left" : sidebar_width}) ;
       }
   });
    $(".minimize").click(function() {
        var m = $(this);
        var p = $(this).parent();
        var x = false;
        
        if ($(m).hasClass("minimized")) {
            
            if (x == false) {
            
                x = true;
                $(m).removeClass("minimized");
                $(p).children("h2").animate({"margin-top" : "10px"});
                $(p).animate({height : "auto", "padding-bottom" : "40px"});
                $(m).parent().children().not(m).not(".title").show();
                
            }
            
        } else if (!$(m).hasClass("minimized")) {
            
            if (x == false) {
                
                x = true;
                $(m).addClass("minimized");
                $(p).children("h2").animate({"margin-top" : "0"});
                $(p).animate({height : "auto", "padding-bottom" : "10px"});
                $(this).parent().children().not(m).not(".title").hide();
                
            }
            
        }  
    });
});