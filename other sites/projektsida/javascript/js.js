function playGandhi() {
    var audio = new Audio("resources/sounds/oof.mp3");
    audio.play();
}

$(Document).ready(function() {
   $("#gandhi").click(function () {playGandhi()});
});