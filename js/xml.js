var file = "../data/index.xml"; 
var parser, xmldoc, xhttp, xmltext;

function getXml(xml) {
    xmltext = xml.responseText;
    xmldoc = parser.parseFromString(xmltext, "text/xml");
}

function findTag(tagname, n) {
    var text = xmldoc.getElementsByTagName(tagname)[n].firstChild.nodeValue;
}

function getXmlElement(tagname, n) {
    var element = xmldoc.getElementsByTagName(tagname)[n];
    return element;
}

function loadContent(name, after) {
    
    for (var i = 0; i < xmldoc.getElementsByTagName("content").length; i++) {
        
        xcontent = xmldoc.getElementsByTagName("content")[i];
        
        if (xcontent.getAttribute("id") == name || name == "" || name == xcontent.getElementsByTagName("title")[0].childNodes[0].nodeValue) {
            
            var content = $("<div class='content'></div>");
            var h2 = $("<h2></h2>");
            var img = $("<img>");
            
            for (var k = 0; k < xcontent.childElementCount; k++) {
                
                //finds content child elements
                xelement = xcontent.children[k];
                
                //finds title element if there is one
                if (xelement.nodeName == "title") {
                    
                    title = xelement.firstChild.nodeValue;
                    if (xelement.hasAttribute("id")) {
                        id = xelement.getAttribute("id");
                    } else {
                        id = title;
                    }
                    $(h2).append(title);
                    $(h2).attr("id", id);
                    $(content).append(h2);
                    $(content).attr("data-id", id);
                    
                    $(content).addClass(id.replace(" ", "-"));
                }
                
                //finds body element if there is one
                if (xelement.nodeName == "body") {
                    var p = $("<p></p>");
                    
                    body = xelement.firstChild.nodeValue;
                    $(p).append(body);
                    $(content).append(p);
                    
                }
                
                //finds image element if there is one
                if (xelement.nodeName == "image") {
                    var src = xelement.getAttribute("src");
                    var width = xelement.getAttribute("width");
                    $(img).attr("src", src);
                    $(img).css({width : width});
                    $(img).addClass("incontent");
                    $(content).append(img);
                }
                
                //finds link if there is one
                if (xelement.nodeName == "link") {
                    var div = $("<div></div>");
                    var a = $("<a></a>");
                    var li = $("<li></li>");
                    var text = xelement.firstChild.nodeValue;
                    
                    //adds link if there is one
                    if (xelement.hasAttribute("href")) {
                        var destination = xelement.getAttribute("href");
                        $(a).attr("href", destination);
                        $(a).attr("target", "_blank");
                    }
                    
                    if (xelement.hasAttribute("xmltarget")) {
                        var destination = xelement.getAttribute("xmltarget");
                        $(a).addClass("replacecontent");
                        $(a).attr("data-target", destination);
                    }
                    
                    $(li).append(text);
                    $(a).append(li);
                    $(div).append(a);
                    $(content).append(div);
                    
                }
                
                //creates a filler div
                if (xelement.nodeName == "fill") {
                    var fill = $("<div></div>");
                    
                    $(fill).addClass("fill");
                    $(content).append(fill);
                }
                
                if (after == "") {
                    $("#container").append(content);
                } else {
                    $(content).insertAfter(after);
                }
            }
        }
    }
        
    //other page elements
    for (var i = 0; i < xmldoc.getElementsByTagName("head").length; i++) {
        var xcontent = xmldoc.getElementsByTagName("head")[i];
        
        for (var k = 1; k < xcontent.childNodes.length; k++) {
            var xelement = xcontent.childNodes[k];
            
            //changes top of the page banner
            if (xelement.nodeName == "banner") {
                var src = xelement.getAttribute("src");
                src = "url(" + src + ")";
                $("#headerimage").css({'background-image' : src});
            }
            
            //changes banner title at the top of the page
            if (xelement.nodeName == "bannertitle") {
                var text = xelement.firstChild.nodeValue;
                $("#bannertitle").html(text);
            }
        }
        
    }
    
    refreshSidebar();
}

function contentWidth() {
    if ($(window).width() < 480 || $(window).height() < 480) {
        $(".content").each(function () {
           $(this).css({width : '90%'}); 
        });
        $(".imagetext").css({display : 'none'});
    }
}

function setFile(name) {
    file = name;
    console.log(file);
}

function clearContent() {
    $("#container").children().each(function () {
       $(this).remove(); 
    });
    refreshSidebar();
}

function xmlRequest() {
    clearContent();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            getXml(this);
        }
    };
    xhttp.open("GET", file, true);
    xhttp.send();
}

//if element is scrolled into view
function Utils() {

}

Utils.prototype = {
    constructor: Utils,
    isElementInView: function (element, fullyInView) {
        var pageTop = $(window).scrollTop();
        var pageBottom = pageTop + $(window).height();
        var elementTop = $(element).offset().top;
        var elementBottom = elementTop + $(element).height();

        if (fullyInView === true) {
            return ((pageTop < elementTop) && (pageBottom > elementBottom));
        } else {
            return ((elementTop <= pageBottom) && (elementBottom >= pageTop));
        }
    }
};

var Utils = new Utils();

function dLoadContent() {
    var l = xmldoc.getElementsByTagName("content").length;
    
    for (var i = 0; i < l; i++) {
        
        var div = $("<div class='content'></div>");
        var p = $("<p>loading..</p>");
        var debug = $("<p></p>");
        
        $(debug).append(i);
        
        $(div).append(debug);
        $(div).append(p);
        $(div).addClass("load");
        
        var id;
        for (var k = 0; k < xmldoc.getElementsByTagName("content")[i].childNodes.length; k++) {
            if (xmldoc.getElementsByTagName("content")[i].childNodes[k].nodeName == "title") {
                id = xmldoc.getElementsByTagName("content")[i].childNodes[k].firstChild.nodeValue;
                $(div).attr("data-id", id);
                if (xmldoc.getElementsByTagName("content")[i].childNodes[k].hasAttribute("id")) {
                    id = xmldoc.getElementsByTagName("content")[i].childNodes[k].getAttribute("id");
                }
            }
            
        }
        
        $("#container").append(div);
        
        /*var top = $(div).offset().top;
        var scroll = $(window).scrollTop();*/
    }
}

function replaceContent(name) {
    setFile(name);
    xmlRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4) {
            xmlRequest();
        }
    }
    refreshSidebar();
}

function refreshSidebar() {
    
    $("#sidebar").children().not("#sidebartitle").each(function() {
       $(this).remove(); 
    });
    
    $("#container").children().each(function() {
        
        var id = $(this).attr("data-id");
        
        //add title to sidebar
        var outernavdiv = $("<div class='outernavdiv'></div>");
        var navdiv = $("<div class='navdiv'></div>");
        var navanchor = $("<a></a>");
        var navli = $("<li></li>");
        var navstatus = $("<div class='status'></div>");
        $(navstatus).attr("id", "status" + id);
        $(navanchor).attr("href", "#" + id);
        $(navdiv).append(navstatus);
        $(navli).append(id);
        $(navanchor).append(navli);
        $(navdiv).append(navanchor);
        $(outernavdiv).append(navdiv);
        $("#sidebar").append(outernavdiv);
        
    });
    statusClick();
}

function modeLoad() {
    var m = getCookie("lmode");
    
    if (m == "standard") {
        loadContent("", "");
        
    } else if (m == "dynamic") {
        dLoadContent();
        
    }
}

function statusClick() {
    //sidebar status indicator action, I do not know why this has to be inside onload
    $(".status").click(function () {
        var s = $(this).attr("id");
        s = s.replace("status", "");
        s = s.replace(" ", "-");
            
        console.log(s);
        $("." + s).toggle();
        
        if ($(this).css("backgroundColor") == "rgb(34, 139, 34)") {
                
            $(this).css({backgroundColor : '#a0a0a0'});
                
        } else {
                
            $(this).css({backgroundColor : 'forestgreen'});
        }
    });
}

function updateMode() {
    var loadmode = getCookie("lmode");
    if (loadmode == "standard" || loadmode == "dynamic") {
        
        $("#loadmode").html(getCookie("lmode"));
        
    } else {
        
        setCookie("lmode", "standard", 7);
        $("#loadmode").html(getCookie("lmode"));
    }
}

//loads visible content
function loadVisible() {
    $(".load").each(function () {
        var isElementInView = Utils.isElementInView($(this), false);
            
        if (isElementInView) {
            var id = $(this).attr("data-id");
            var c = $(this);
            var index = $(this).index();
                
            loadContent(id, c);
            c.remove();    
        }   
    });
    refreshSidebar();
}

$(document).ready(function() {
    
    
    //sets document to load
    var name = $("#name").text();
    file = "data/" + name + ".xml";
    console.log(file);
    
    //set up xml parsing
    parser = new DOMParser();
    xhttp = new XMLHttpRequest();
    
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            getXml(this);
        }
    };
    xhttp.open("GET", file, true);
    xhttp.send();
    
    xhttp.onload = function () {
        updateMode();
        modeLoad();
        contentWidth();
        refreshSidebar();
        statusClick();
    }
    
    //append element at specified index
    jQuery.fn.appendAt = function( content, index ) {
        this.each(function(i, item) {
            var $content = $(content).clone();
            if ( index === 0 ) {
                $(item).prepend($content);
            } else {
                $content.insertAfter($(item).children().eq(index-1));
            }
        });
        $(content).remove();
        return this;
    };
    
    //replace loadcontainer with content div on visible
    $(window).scroll(function () {
        loadVisible();
    });
    
    updateMode();
    
    $("#change-load").click(function () {
        if (getCookie("lmode") == "standard") {
            setCookie("lmode", "dynamic", 7);
            
        } else if (getCookie("lmode") == "dynamic") {
            setCookie("lmode", "standard", 7);
            
        }
        updateMode();
    })
    
});







