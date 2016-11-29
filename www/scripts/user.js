function userConstructor(name, isAI) {
    return {
        name: name,
        isAI: isAI, 
        wentFirst: false,

        gameResults: new Array(),

        /* Result Helper Functions */
        recordWin: function () {
            this.gameResults.push("win");
        },
        recordLoss: function () {
            this.gameResults.push("lose");
        },
        recordTie: function () {
            this.gameResults.push("tie");
        },

        /* Total Helper Functions */
        getTotalGamesPlayed: function () {
            return this.gameResults.length;
        },
        getTotalWins: function () {
            var total = 0;
            for (var i = 0; i < this.gameResults.length; i++) {
                if (this.gameResults[i] == "win") {
                    total++;
                }
            }
            return total;
        },
        getTotalLoses: function () {
            var total = 0;
            for (var i = 0; i < this.gameResults.length; i++) {
                if (this.gameResults[i] == "lose") {
                    total++;
                }
            }
            return total;
        },


        getTotalTies: function () {
            var total = 0;
            for (var i = 0; i < this.gameResults.length; i++) {
                if (this.gameResults[i] == "tie") {
                    total++;
                }
            }
            return total;
        }
    };
}