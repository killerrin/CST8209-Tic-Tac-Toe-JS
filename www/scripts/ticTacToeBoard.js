var gameManager = {};

$(document).ready(function () {
    gameManager = (function () {
        // Gets the User Info
        var users = null;
        var getUserInfo = function () {
            users = new Array();
            users.push(userConstructor($("#user1Name").val(), $("#user1AI").is(':checked')));
            users.push(userConstructor($("#user2Name").val(), $("#user2AI").is(':checked')));
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

                        if (gameManager.getCurrentPlayer().isAI) {
                            return;
                        }

                        if (gameManager.selectSquare(parseInt(parent.attr("column")), parseInt(parent.attr("row")))) {
                            gameManager.nextRound();
                        } else {
                            alert("That is an invalid move");
                        }
                    });
                }
            }
        };

        var winnerText = "";
        var roundNumber = 0;
        var playerTurn = false;
        var getFirstPlayer = function () {
            var randomUserIndex = Math.floor((Math.random() * 2));
            users[randomUserIndex].wentFirst = true;
        };

        var simulateAI = function() {
            // Delay the AI 500ms to allow viewing of the screen
            setTimeout(function() {
                while(true) {
                    var randomColumn = Math.floor((Math.random() * 3));
                    var randomRow = Math.floor((Math.random() * 3));

                    if (gameManager.selectSquare(randomColumn, randomRow)) {
                        gameManager.nextRound();
                        break;
                    }
                }
            }, 500);
        };

        return {
            initGame: function () {
                roundNumber = 0;
                playerTurn = false;
                winnerText = "";

                if (users == null) {
                    getUserInfo();
                }

                // Re-initialize the users.wentFirst variable to false to reset it
                // Just in case this is a replay
                for (var i = 0; i < users.length; i++) {
                    users[i].wentFirst = false;
                }

                // Generate the Game Board
                generateGameBoard();

                // Swap out the Menu Blocks
                $("#gameBoard-header").css({
                    "display": "block"
                });
                $("#gameBoard-tableContainer").css({
                    "display": "block"
                });
                $("#gameBoard-resultsContainer").css({
                    "display": "none"
                });

                // Call nextRound to begin the game
                this.nextRound();
            },

            resetGame: function () {
                users = null;
                gameBoard = null;
                roundNumber = 0;
                playerTurn = false;
                winnerText = "";

                // Clear the Input
                $("#user1Name").val("");
                $("#user1AI").prop('checked', false);
                $("#user2Name").val("");
                $("#user2AI").prop('checked', false);

                // Reset the WelcomeMessage back to default
                $("#welcomeMessage-2").fadeTo(0, 0, function () {});
                $("#welcomeMessage-1-PlayButton").show();
                $("#welcomeMessage-1").animate({
                    "padding-top": "200px"
                }, "slow");

                // Swap out the Menu Blocks
                $("#welcomeMessageContainer").css({
                    "display": "block"
                });
                $("#gameBoardContainer").css({
                    "display": "none"
                });

                // Game Board Menu Blocks
                $("#gameBoard-header").css({
                    "display": "block"
                });
                $("#gameBoard-tableContainer").css({
                    "display": "block"
                });
                $("#gameBoard-resultsContainer").css({
                    "display": "none"
                });
            },

            displayResults: function () {
                // Swap out the Menu Blocks
                $("#gameBoard-header").css({
                    "display": "none"
                });
                $("#gameBoard-tableContainer").css({
                    "display": "none"
                });
                $("#gameBoard-resultsContainer").css({
                    "display": "block"
                });

                // Empty out the previous results 
                $("#gameBoard-results-1").empty();

                // Create the Headers and Table
                $(document.createElement("h2")).text("Results").appendTo("#gameBoard-results-1");
                $(document.createElement("h3")).text(winnerText).appendTo("#gameBoard-results-1");
                $(document.createElement("h4")).text("Total Games Played: " + users[0].getTotalGamesPlayed()).appendTo("#gameBoard-results-1");
                var table = $(document.createElement("table")).attr({
                    id: "gameBoard-results-1-table"
                }).appendTo("#gameBoard-results-1");

                var thead = $(document.createElement("thead")).appendTo(table)
                var tr = $(document.createElement("tr")).appendTo(thead);
                $(document.createElement("th")).text("Name").appendTo(tr);
                $(document.createElement("th")).text("Wins").appendTo(tr);
                $(document.createElement("th")).text("Loses").appendTo(tr);
                $(document.createElement("th")).text("Ties").appendTo(tr);

                var tableBody = $(document.createElement("tbody")).attr({
                    id: "gameBoard-results-1-table-body"
                }).appendTo(table);

                // Create the new Table Rows
                for (var i = 0; i < users.length; i++) {
                    var row = $(document.createElement("tr")).appendTo(tableBody);
                    $(document.createElement("td")).text(users[i].name).appendTo(row);
                    $(document.createElement("td")).text(users[i].getTotalWins()).appendTo(row);
                    $(document.createElement("td")).text(users[i].getTotalLoses()).appendTo(row);
                    $(document.createElement("td")).text(users[i].getTotalTies()).appendTo(row);
                }
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
                            winnerText = "Tie";
                        }
                    } else {
                        for (var i = 0; i < users.length; i++) {
                            if (users[i].wentFirst == state) {
                                users[i].recordWin();
                                winnerText = users[i].name + " Wins!";
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
                $("#gameBoard-header-turnNumber").text("Turn " + roundNumber);

                // Check AI
                if (this.getCurrentPlayer().isAI) {
                    simulateAI();
                }
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

    $("#gameBoard-results-2-replayGame").on("click", function (e) {
        gameManager.initGame();
        e.preventDefault();
    });

    $("#gameBoard-results-2-resetGame").on("click", function (e) {
        gameManager.resetGame();
        e.preventDefault();
    });
});