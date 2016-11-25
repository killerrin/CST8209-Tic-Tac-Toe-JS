$(document).ready(function () {
    $("#welcomeMessage-1-PlayButton").click(function (e) {
        // Hide this button
        var $this = $(this);
        $this.hide();

        // Slide Message-1 Upwards 
        $("#welcomeMessage-1").animate({
            "padding-top": "100px"
        }, "slow");

        // Fade in the Input Fields
        $("#welcomeMessage-2").fadeTo("slow", 1, function () {

        });
    });

    $("#welcomeMessage-2-PlayButton").click(function (e) {
        // Hide the welcome message, and jump into the game
        $("#welcomeMessage").css({"display" : "none"});
        $("#ticTacToeBoard").css({"display" : "block"});

        e.preventDefault();
    });
});