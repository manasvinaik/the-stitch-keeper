// List of music tracks
const tracks = [
    "media/track1.mp3",
    "media/track2.mp3",
    "media/track3.mp3"
];

let currentTrackIndex = 0;
const audioPlayer = new Audio();
const musicButton = document.getElementById("music-button");

function shuffleTracks() {
    let shuffledTracks = tracks.filter(track => track !== "media/track3.mp3"); 
    shuffledTracks.sort(() => Math.random() - 0.5); 
    return ["media/track3.mp3", ...shuffledTracks]; 
}

let randomizedTracks = shuffleTracks();
audioPlayer.src = randomizedTracks[currentTrackIndex];
audioPlayer.volume = 0.5;

// Play/Pause when button is clicked
musicButton.addEventListener("click", () => {
    if (audioPlayer.paused) {
        audioPlayer.play(); 
        musicButton.textContent = "❤︎"; 
    } else {
        audioPlayer.pause();
        musicButton.textContent = "♬"; 
    }
});

audioPlayer.addEventListener("ended", () => {
    currentTrackIndex = (currentTrackIndex + 1) % randomizedTracks.length;
    audioPlayer.src = randomizedTracks[currentTrackIndex];
    audioPlayer.play();
});
