
const audio = document.querySelector("#audio");
const songTitle = document.querySelector("#songTitle");
const artistName = document.querySelector("#artistName");
const playBtn = document.querySelector("#playBtn");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");
const progress = document.querySelector("#progress");
const currentTimeText = document.querySelector("#currentTime");
const durationText = document.querySelector("#duration");
const volume = document.querySelector("#volume");
const playlistElement = document.querySelector("#playlist");
const autoplay = document.querySelector("#autoplay");

const songs = [
    {
        title: "Khwaab Ka Musafir",
         artist: "Pranay Dwivedi",
        src: "songs/song1.mp3"
    },
    {
        title: "Jab Se Tumko Dekha",
        artist: "Artist Name",
        src: "songs/song2.mp3"
    },
    {
        title: "Zara Zara",
        artist: "Bombay Jayashri",
        src: "songs/song3.mp3"
    },
    {
        title: "Tere Bin Adhura",
        artist: "Amit Mishra",
        src: "songs/song4.mp3"
    },
];

let currentIndex = 0;

// Convert seconds into minutes:seconds
function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

// Load selected song
function loadSong(index) {
    currentIndex = index;

    const song = songs[currentIndex];

    audio.src = song.src;
    songTitle.textContent = song.title;
    artistName.textContent = song.artist;

    progress.value = 0;
    currentTimeText.textContent = "0:00";
    durationText.textContent = "0:00";

    renderPlaylist();
}

// Play song
async function playSong() {
    try {
        await audio.play();
        playBtn.textContent = "⏸";
    } catch (error) {
        playBtn.textContent = "▶";
        console.error("Audio playback failed:", error);
    }
}

// Pause song
function pauseSong() {
    audio.pause();
    playBtn.textContent = "▶";
}

// Play or pause
playBtn.addEventListener("click", function () {
    if (audio.paused) {
        playSong();
    } else {
        pauseSong();
    }
});

// Next song
function nextSong() {
    currentIndex = (currentIndex + 1) % songs.length;
    loadSong(currentIndex);
    playSong();
}

// Previous song
function previousSong() {
    currentIndex =
        (currentIndex - 1 + songs.length) % songs.length;

    loadSong(currentIndex);
    playSong();
}

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", previousSong);

// Update progress and current time
audio.addEventListener("timeupdate", function () {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        progress.value = (audio.currentTime / audio.duration) * 100;
        currentTimeText.textContent = formatTime(audio.currentTime);
    }
});

// Show total duration when metadata loads
audio.addEventListener("loadedmetadata", function () {
    durationText.textContent = formatTime(audio.duration);
});

// Seek to a selected position
progress.addEventListener("input", function () {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime = (progress.value / 100) * audio.duration;
    }
});

// Volume control
volume.addEventListener("input", function () {
    audio.volume = Number(volume.value);
});

// Playlist
function renderPlaylist() {
    playlistElement.innerHTML = "";

    songs.forEach(function (song, index) {
        const item = document.createElement("li");

        item.textContent = `${index + 1}. ${song.title}`;

        if (index === currentIndex) {
            item.classList.add("active");
        }

        item.addEventListener("click", function () {
            loadSong(index);
            playSong();
        });

        playlistElement.appendChild(item);
    });
}

// Autoplay next song when current song ends
audio.addEventListener("ended", function () {
    if (autoplay.checked) {
        nextSong();
    } else {
        playBtn.textContent = "▶";
    }
});

// Update play button if playback is interrupted
audio.addEventListener("pause", function () {
    playBtn.textContent = "▶";
});

audio.addEventListener("play", function () {
    playBtn.textContent = "⏸";
});

// Set initial volume
audio.volume = Number(volume.value);

// Initialize player
loadSong(0);
  