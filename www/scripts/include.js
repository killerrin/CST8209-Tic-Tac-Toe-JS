// Import this file to include all scripts
var addScriptModule = (function () {
    var addScript = function(filename) {
        var imported = document.createElement('script');
        imported.src = "scripts/" + filename;
        document.head.appendChild(imported);
    };

    //============================
    // ==== Add scripts here =====
    //============================
    addScript("musicPlaylist.js");
    addScript("user.js");
    addScript("welcomeMessage.js");
    addScript("ticTacToeBoard.js");

    //============================
    return {
        addScript:addScript
    };
}());