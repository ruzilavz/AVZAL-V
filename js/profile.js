// js/profile.js

const profileTracksGrid = document.getElementById("profile-tracks-grid");
const profileTracksCountEl = document.getElementById("profile-tracks-count");
const profileBioEl = document.getElementById("profile-bio");
const profileEditBtn = document.getElementById("profile-edit-btn");
const profileTabs = document.querySelectorAll(".profile-tab");
const profileTabContents = document.querySelectorAll(".profile-tab-content");
const profileRoleEl = document.getElementById("profile-role");

const contactEls = {
  telegram: document.getElementById("contact-telegram"),
  email: document.getElementById("contact-email"),
  instagram: document.getElementById("contact-instagram"),
};

// базовое состояние профиля
let profileData = {
  bio: profileBioEl.textContent,
  telegram: contactEls.telegram.textContent,
  email: contactEls.email.textContent,
  instagram: contactEls.instagram.textContent,
};

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

function renderContacts() {
  contactEls.telegram.textContent = profileData.telegram;
  contactEls.email.textContent = profileData.email;
  contactEls.instagram.textContent = profileData.instagram;
}

function updateProfileRole() {
  const role = window.currentUser?.role || "гость";
  profileRoleEl.textContent = `Роль: ${role}`;
}

window.updateProfileRole = updateProfileRole;

// вкладки
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

// редактирование профиля (только админ / супер‑админ)
profileEditBtn.addEventListener("click", () => {
  const role = window.currentUser?.role || "гость";
  const lower = role.toLowerCase();

  const isAdmin =
    role === "Администратор" ||
    lower === "super_admin" ||
    lower.startsWith("admin");

  if (!isAdmin) {
    alert("Редактировать профиль может только админ.");
    return;
  }

  const newBio = window.prompt("Описание профиля:", profileData.bio);
  if (newBio !== null) profileData.bio = newBio;

  const newTelegram = window.prompt("Telegram:", profileData.telegram);
  if (newTelegram !== null) profileData.telegram = newTelegram;

  const newEmail = window.prompt("Email:", profileData.email);
  if (newEmail !== null) profileData.email = newEmail;

  const newInsta = window.prompt("Instagram:", profileData.instagram);
  if (newInsta !== null) profileData.instagram = newInsta;

  profileBioEl.textContent = profileData.bio;
  renderContacts();

  try {
    localStorage.setItem("avz_profile", JSON.stringify(profileData));
  } catch (e) {}
});

// загрузить сохранённые данные, если есть
try {
  const saved = localStorage.getItem("avz_profile");
  if (saved) {
    profileData = JSON.parse(saved);
    profileBioEl.textContent = profileData.bio;
    renderContacts();
  }
} catch (e) {}

renderProfileTracks();
updateProfileRole();
