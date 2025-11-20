// js/profile.js

const profileTracksGrid = document.getElementById("profile-tracks-grid");
const profileTracksCountEl = document.getElementById("profile-tracks-count");
const profileBioEl = document.getElementById("profile-bio");
const profileEditBtn = document.getElementById("profile-edit-btn");
const profileTabs = document.querySelectorAll(".profile-tab");
const profileTabContents = document.querySelectorAll(".profile-tab-content");

// рендер треков из tracks-data.js
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
      // по клику можно переключать трек в плеере
      if (window.loadTrack) {
        const index = tracks.findIndex((x) => x.slug === t.slug);
        if (index !== -1) {
          window.loadTrack(index);
          if (window.switchScreen) {
            window.switchScreen("screen-player");
          }
        }
      }
    });

    profileTracksGrid.appendChild(card);
  });
}

// вкладки профиля
profileTabs.forEach((btn) => {
  btn.addEventListener("click", () => {
    const tab = btn.dataset.tab;

    profileTabs.forEach((b) =>
      b.classList.toggle("profile-tab--active", b === btn)
    );
    profileTabContents.forEach((content) =>
      content.classList.toggle(
        "profile-tab-content--active",
        content.id === "profile-tab-" + tab
      )
    );
  });
});

// кнопка "Редактировать профиль" — простое редактирование био
profileEditBtn.addEventListener("click", () => {
  const current = profileBioEl.textContent.trim();
  const updated = window.prompt("Изменить описание профиля:", current);
  if (updated !== null) {
    profileBioEl.textContent = updated;
    // можно сохранить в localStorage
    try {
      localStorage.setItem("avzalov_profile_bio", updated);
    } catch (e) {}
  }
});

// загрузка сохранённого био, если есть
try {
  const savedBio = localStorage.getItem("avzalov_profile_bio");
  if (savedBio) profileBioEl.textContent = savedBio;
} catch (e) {}

renderProfileTracks();
