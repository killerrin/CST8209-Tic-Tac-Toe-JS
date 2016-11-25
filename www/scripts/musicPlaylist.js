var gameAudioManager = {};

$(document).ready(function () {
    /* Setup the Game Audio Manager */
    gameAudioManager = (function () {
        var musicPlayer = $(".musicPlayer");
        return {
            loadSong: function(songUrl) {
                musicPlayer[0].src = songUrl;
                musicPlayer[0].load();
            },
            playSong: function() {
                musicPlayer[0].play();
            },
            pauseSong: function() {
                musicPlayer[0].pause();
            },
            changeSong: function(songUrl) {
                this.loadSong(songUrl);
                this.playSong();
            }
        };
    }());

    /* Setup the UI Events */
    $(".musicPlaylist li").click(function (e) {
        $(".musicPlaylist li").removeClass("active");

        var $this = $(this);
        if (!$this.hasClass("active")) {
            $this.addClass("active");
        }

        gameAudioManager.changeSong($this.find("a").attr("data-value"));

        e.preventDefault();
    });
});