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

function loadContent(name) {
    
    for (var i = 0; i < xmldoc.getElementsByTagName("content").length; i++) {
        
        xcontent = xmldoc.getElementsByTagName("content")[i];
        if (xcontent.getAttribute("id") == name || name == "") {
            
            var content = $("<div class='content'></div>");
            var h2 = $("<h2></h2>");
            var p = $("<p></p>");
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
                    
                    //add title to sidebar
                    var outernavdiv = $("<div></div>");
                    var navdiv = $("<div class='navdiv'></div>");
                    var navanchor = $("<a></a>");
                    var navli = $("<li></li>");
                    var navstatus = $("<div class='status'></div>");
                    $(navstatus).attr("id", id + "status");
                    $(navanchor).attr("href", "#" + id);
                    //$(navdiv).append(navstatus);
                    $(navli).append(id);
                    $(navanchor).append(navli);
                    $(navdiv).append(navanchor);
                    $(outernavdiv).append(navdiv);
                    $("#sidebar").append(outernavdiv);
                    
                }
                
                //finds body element if there is one
                if (xelement.nodeName == "body") {
                    
                    body = xelement.firstChild.nodeValue;
                    $(p).append(body);
                    $(content).append(p);
                    
                }
                
                //finds image element if there is one
                if (xelement.nodeName == "image") {
                    var src = xelement.getAttribute("src");
                    $(img).attr("src", src);
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
                    
                    $(li).append(text);
                    $(a).append(li);
                    $(div).append(a);
                    $(content).append(div);
                    
                }
                
                $("#container").append(content);
            }
            
        }
    }
    
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
        loadContent("");
        contentWidth();
<<<<<<< HEAD
    $(".status").click(function () {
        var s = $(this).attr("id");
        console.log(s);
    });
    }
=======
    }, 5);
>>>>>>> 9a9e5c123b53dfd326187e8b077876f2f2431f34
    
});







