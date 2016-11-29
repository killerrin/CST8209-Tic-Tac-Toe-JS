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
        $("#welcomeMessage-2").fadeTo("slow", 1, function () {});
    });

    $("#welcomeMessage-2-PlayButton").click(function (e) {
        // Perform Validation
        var validationError = false;
        if ($("#user1Name").val() == "" || $("#user2Name").val() == "") {
            alert("Both players must have a name");
            validationError = true;
        } else if ($("#user1Name").val() == $("#user2Name").val()) {
            alert("Player Names can not be the same");
            validationError = true;
        }

        if (validationError) {
            e.preventDefault();        
            return;
        }

        // Hide the WelcomeMessage, and jump into the TicTacToeBoard
        $("#welcomeMessageContainer").css({
            "display": "none"
        });
        $("#gameBoardContainer").css({
            "display": "block"
        });

        // Finally, init the game
        gameManager.initGame();

        e.preventDefault();
    });
});