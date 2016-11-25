function userConstructor(name) {
    return {
        name: name,
        gameResults: new Array(),

        totalWins: function() {
            var total = 0;
            for(var i = 0; i < this.gameResults.length; i++) {
                if (this.gameResults[i] == "win") {
                    total++;
                }
            }
            return total;
        },

        totalLoses: function() {
            var total = 0;
            for(var i = 0; i < this.gameResults.length; i++) {
                if (this.gameResults[i] == "lose") {
                    total++;
                }
            }
            return total;
        },

        totalTies: function() {
            var total = 0;
            for(var i = 0; i < this.gameResults.length; i++) {
                if (this.gameResults[i] == "tie") {
                    total++;
                }
            }
            return total;
        }
    };
}