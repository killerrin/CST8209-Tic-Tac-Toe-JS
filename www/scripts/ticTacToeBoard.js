var gameManager = {};

$(document).ready(function () {
    gameManager = (function () {
        // Gets the User Info
        var users = null;
        var getUserInfo = function () {
            users = new Array();
            users.push(userConstructor($("#user1Name").val()));
            users.push(userConstructor($("#user2Name").val()));
        };

        var gameBoard = null;
        var generateGameBoard = function () {
            // Create the Game Board
            gameBoard = new Array(3); // Rows
            for (var i = 0; i < 3; i++) {
                gameBoard[i] = new Array(3); // Columns
            }

            // Ensure the div is empty before continuing
            $("#gameBoard-tableContainer").empty();

            // Generate the Table and add it to the Game Board
            var table = $(document.createElement("table")).attr({
                id: "gameBoard-table"
            }).appendTo("#gameBoard-tableContainer");

            // Perform a nested loop to get the required 3x3 columns and rows
            for (var y = 0; y < gameBoard.length; y++) {
                var row = $(document.createElement("tr")).attr({
                    id: "gameBoard-table-row" + y,
                    row: y
                }).appendTo(table);

                for (var x = 0; x < gameBoard[y].length; x++) {
                    var col = $(document.createElement("td")).attr({
                        id: "gameBoard-table-row" + y + "-col" + x,
                        row: y,
                        column: x
                    }).appendTo(row);

                    var a = $(document.createElement("a")).attr({
                        id: "gameBoard-table-row" + y + "-col" + x + "-a",
                        href: "#"
                    }).appendTo(col);

                    // Attack the Click Event Handler to the Cells'
                    a.on("click", function (e) {
                        var $this = $(this);
                        var parent = $this.parent()

                        if (gameManager.selectSquare(parseInt(parent.attr("column")), parseInt(parent.attr("row")))) {
                            gameManager.nextRound();
                        }
                    });
                }
            }
        };

        var roundNumber = 0;
        var playerTurn = false;
        var getFirstPlayer = function () {
            var randomUserIndex = Math.floor((Math.random() * 2));
            users[randomUserIndex].wentFirst = true;
        }

        return {
            initGame: function () {
                roundNumber = 0;
                playerTurn = false;

                if (users == null) {
                    getUserInfo();
                }

                // Re-initialize the users.wentFirst variable to false to reset it
                // Just in case this is a replay
                for (var i = 0; i < users.length; i++) {
                    users[i].wentFirst = false;
                }

                generateGameBoard();

                // Call nextRound to begin the game
                this.nextRound();
            },

            resetGame: function () {
                users = null;
                gameBoard = null;
                roundNumber = 0;
                playerTurn = false;

                // Clear the Input
                $("#user1Name").val("");
                $("#user2Name").val("");

                // Reset the WelcomeMessage back to default
                $("#welcomeMessage-2").fadeTo(0, 0, function () {});
                $("#welcomeMessage-1-PlayButton").show();
                $("#welcomeMessage-1").animate({
                    "padding-top": "200px"
                }, "slow");

                // Swap out the Menu Blocks
                $("#welcomeMessageContainer").css({
                    "display": "none"
                });
                $("#gameBoardContainer").css({
                    "display": "block"
                });
            },

            displayResults: function () {

            },

            nextRound: function () {
                if (roundNumber == 0) {
                    getFirstPlayer();
                }

                // Checks if the game is over
                var state = this.checkGameState();

                // If we don't have a null, the game is over
                if (state != null) {
                    if (state == "tie") {
                        for (var i = 0; i < users.length; i++) {
                            users[i].recordTie();
                            $("#gameBoard-header-winner").text("Tie");
                        }
                    } else {
                        for (var i = 0; i < users.length; i++) {
                            if (users[i].wentFirst == state) {
                                users[i].recordWin();
                                $("#gameBoard-header-winner").text(users[i].name + " Wins!");
                            } else {
                                users[i].recordLoss();
                            }
                        }
                    }

                    this.displayResults();
                    return;
                }

                // Change the player and Increment the round number
                roundNumber++;
                playerTurn = !playerTurn;

                // Update the Text
                $("#gameBoard-header-currentTurn").text(this.getCurrentPlayer().name + "'s Turn");
            },

            checkGameState: function () {
                // Check for a winner, and return the winning player
                for (var row = 0; row < gameBoard.length; row++) {
                    // Check for a Vertical Win
                    if (gameBoard[row][0] == gameBoard[row][1] &&
                        gameBoard[row][0] == gameBoard[row][2]) {
                        return gameBoard[row][0];
                    }

                    for (var column = 0; column < gameBoard[row].length; column++) {
                        // Check for a Horizontal Win 
                        if (gameBoard[0][column] == gameBoard[1][column] &&
                            gameBoard[0][column] == gameBoard[2][column]) {
                            return gameBoard[0][column];
                        }
                    }
                }

                // Check for a Diagnol Win
                if ((gameBoard[0][0] == gameBoard[1][1] && gameBoard[0][0] == gameBoard[2][2]) ||
                    (gameBoard[0][2] == gameBoard[1][1] && gameBoard[0][2] == gameBoard[2][0])) {
                    return gameBoard[1][1];
                }

                // Check for Continuation                        
                for (var row = 0; row < gameBoard.length; row++) {
                    for (var column = 0; column < gameBoard[row].length; column++) {
                        if (gameBoard[row][column] == undefined) {
                            //alert(column + ", " + row);
                            return null;
                        }
                    }
                }

                // Lastly, since there is nothing left we must have a tie
                return "tie";
            },

            selectSquare: function (column, row) {
                //alert(column + ", " + row);
                if (gameBoard[row][column] == undefined) {
                    gameBoard[row][column] = playerTurn;

                    var tableCellA = $("#gameBoard-table-row" + row + "-col" + column + "-a");
                    if (playerTurn) {
                        tableCellA.text("X");
                        tableCellA.addClass("ticTacToe-X");
                    } else {
                        tableCellA.text("O");
                        tableCellA.addClass("ticTacToe-O")
                    }

                    return true;
                }

                return false;
            },

            getCurrentPlayer: function () {
                for (var i = 0; i < users.length; i++) {
                    if (users[i].wentFirst == playerTurn) {
                        return users[i];
                    }
                }
            },

            getOffPlayer: function () {
                for (var i = 0; i < users.length; i++) {
                    if (users[i].wentFirst != playerTurn) {
                        return users[i];
                    }
                }
            }
        };
    }());
});