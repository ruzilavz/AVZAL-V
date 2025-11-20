// js/profile.js

const profileTracksGrid = document.getElementById("profile-tracks-grid");
const profileTracksCountEl = document.getElementById("profile-tracks-count");

function renderProfileTracks() {
  const tracks = window.RELEASED_TRACKS_DATA || [];
  profileTracksCountEl.textContent = tracks.length;

  profileTracksGrid.innerHTML = "";
  tracks.forEach((t) => {
    const card = document.createElement("div");
    card.className = "profile-track-card";
    const coverUrl = `./covers/${t.slug}${t.coverExt || ".jpg"}`;

    card.style.backgroundImage = `url(${coverUrl})`;
    card.dataset.title = t.title;

    card.addEventListener("click", () => {
      // При клике можно переключать трек в плеере
      const index = tracks.findIndex((x) => x.slug === t.slug);
      if (index !== -1) {
        loadTrack(index);
        // переключаемся на экран плеера
        switchScreen("screen-player");
      }
    });

    profileTracksGrid.appendChild(card);
  });
}

renderProfileTracks();
