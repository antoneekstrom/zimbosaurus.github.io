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
    
    setTimeout(function () {
        
        //find all content elements in .xml
        for (var i = 0; i < xmldoc.getElementsByTagName("content").length; i++) {
            
            //elements from .xml
            var xcontent = xmldoc.getElementsByTagName("content")[i];
            var xelement;
            
            //content elements
            var content = $("<div class='content'></div>");
            var h2 = $("<h2></h2>");
            var p = $("<p></p>");
            var img = $("<img>");
            
            //find content tags in .xml file
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
                    var navdiv = $("<div></div>");
                    var navanchor = $("<a></a>");
                    var navli = $("<li></li>");
                    $(navanchor).attr("href", "#" + id);
                    $(navli).append(id);
                    $(navanchor).append(navli);
                    $(navdiv).append(navanchor);
                    $("#sidebar").append(navdiv);
                    
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
    }, 1);
});







