// js/player.js
const playerScreen = document.getElementById("screen-player");

// Берём данные треков из глобального массива (из tracks-data.js)
const tracks = window.RELEASED_TRACKS_DATA || [];

let currentIndex = 0;
let isPlaying = false;
let isRepeat = false;
let isShuffle = false;

const audioEl = document.getElementById("audio");
const bgEl = document.getElementById("player-bg");
const coverEl = document.getElementById("player-cover");
const titleEl = document.getElementById("player-track-title");
const artistEl = document.getElementById("player-track-artist");
const seekEl = document.getElementById("player-seek");
const timeCurrentEl = document.getElementById("player-current-time");
const timeDurationEl = document.getElementById("player-duration");
const btnPlay = document.getElementById("btn-play");
const btnPrev = document.getElementById("btn-prev");
const btnNext = document.getElementById("btn-next");
const btnRepeat = document.getElementById("btn-repeat");
const btnShuffle = document.getElementById("btn-shuffle");

function pad(n) {
  return n < 10 ? "0" + n : n;
}
function formatTime(sec) {
  if (!sec || Number.isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${pad(s)}`;
}

// примеры генерации путей
function getTrackCoverUrl(track) {
  // поменяй путь под свою структуру
  const ext = track.coverExt || ".jpg";
  return `./covers/${track.slug}${ext}`;
}

function getTrackAudioUrl(track) {
  const ext = track.audioExt || ".mp3";
  return `audio/${track.slug}${ext}`;
}

function loadTrack(index) {
  if (!tracks.length) return;

  if (index < 0) index = tracks.length - 1;
  if (index >= tracks.length) index = 0;
  currentIndex = index;

  const track = tracks[currentIndex];

  titleEl.textContent = track.title;
  artistEl.textContent = track.artist || "AVZALØV";

  const coverUrl = getTrackCoverUrl(track);
  coverEl.src = coverUrl;
  bgEl.style.backgroundImage = `url(${coverUrl})`;

  audioEl.src = getTrackAudioUrl(track);
  seekEl.value = 0;
  timeCurrentEl.textContent = "0:00";
  timeDurationEl.textContent = "0:00";
}

function updatePlayButton() {
  btnPlay.dataset.state = isPlaying ? "pause" : "play";
}

function play() {
  if (!audioEl.src) return;
  audioEl
    .play()
    .then(() => {
      isPlaying = true;
      updatePlayButton();
      playerScreen.classList.add("is-playing");
    })
    .catch(console.error);
}

function pause() {
  audioEl.pause();
  isPlaying = false;
  updatePlayButton();
  playerScreen.classList.remove("is-playing");
}


function togglePlay() {
  if (isPlaying) pause();
  else play();
}

btnPlay.dataset.state = "play";

function nextTrack() {
  if (isShuffle) {
    const r = Math.floor(Math.random() * tracks.length);
    loadTrack(r);
  } else {
    loadTrack(currentIndex + 1);
  }
  play();
}

function prevTrack() {
  loadTrack(currentIndex - 1);
  play();
}

function getCoverUrl(track) {
  const ext = track.coverExt || ".jpg";
  return `covers/${track.slug}${ext}`; // или похожий путь
}

function getAudioUrl(track) {
  const ext = track.audioExt || ".mp3";
  return `audio/${track.slug}${ext}`;
}

// EVENTS

audioEl.addEventListener("loadedmetadata", () => {
  timeDurationEl.textContent = formatTime(audioEl.duration);
});

audioEl.addEventListener("timeupdate", () => {
  if (!audioEl.duration) return;
  const percent = (audioEl.currentTime / audioEl.duration) * 100;
  seekEl.value = percent;
  timeCurrentEl.textContent = formatTime(audioEl.currentTime);
});

audioEl.addEventListener("ended", () => {
  if (isRepeat) {
    audioEl.currentTime = 0;
    play();
  } else {
    nextTrack();
  }
});

seekEl.addEventListener("input", () => {
  if (!audioEl.duration) return;
  const time = (seekEl.value / 100) * audioEl.duration;
  audioEl.currentTime = time;
});

btnPlay.addEventListener("click", togglePlay);
btnNext.addEventListener("click", nextTrack);
btnPrev.addEventListener("click", prevTrack);

btnRepeat.addEventListener("click", () => {
  isRepeat = !isRepeat;
  btnRepeat.style.opacity = isRepeat ? "1" : "0.5";
});

btnShuffle.addEventListener("click", () => {
  isShuffle = !isShuffle;
  btnShuffle.style.opacity = isShuffle ? "1" : "0.5";
});

// Инициализация
if (tracks.length) {
  loadTrack(0);
}
