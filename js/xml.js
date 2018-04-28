var file = "../data/content.xml";
var parser, xmldoc, xhttp, xmltext;

function getXml(xml) {
    xmltext = xml.responseText;
    xmldoc = parser.parseFromString(xmltext, "text/xml");
}

function findTag(tagname, n) {
    var text = xmldoc.getElementsByTagName(tagname)[n].firstChild.nodeValue;
    console.log(text);
}

function getXmlElement(tagname, n) {
    var element = xmldoc.getElementsByTagName(tagname)[n];
    return element;
}

$(document).ready(function() {
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
    
    $("#test").click(function () {
        for (var i = 0; i < xmldoc.getElementsByTagName("content").length; i++) {
            for (var k = 0; k < xmldoc.getElementsByTagName("title").length; k++) {
                var name = xmldoc.getElementsByTagName("title")[k].firstChild.nodeValue;
                console.log(name);
            }
        }
    });
});