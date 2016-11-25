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
    addScript("jquery-3.1.1.min.js");
    addScript("user.js");

    //============================
    return {
        addScript:addScript
    };
}());