// Music
const audioPlayer = new Audio("media/track1.mp3");
const musicButton = document.getElementById("music-button");

audioPlayer.volume = 0.5;
audioPlayer.loop = true;

musicButton.addEventListener("click", () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        musicButton.textContent = "❤︎";
    } else {
        audioPlayer.pause();
        musicButton.textContent = "♬";
    }
});

