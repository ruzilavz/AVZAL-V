// js/profile.js

const profileTracksGrid = document.getElementById("profile-tracks-grid");
const profileTracksCountEl = document.getElementById("profile-tracks-count");
const profileBioEl = document.getElementById("profile-bio");
const profileEditBtn = document.getElementById("profile-edit-btn");
const profileTabs = document.querySelectorAll(".profile-tab");
const profileTabContents = document.querySelectorAll(".profile-tab-content");
const profileRoleEl = document.getElementById("profile-role");
const profileUsernameEl = document.getElementById("profile-username");
const profileUserIdEl = document.getElementById("profile-user-id");
const profileAvatarEl = document.getElementById("profile-avatar");
const avatarInputEl = document.getElementById("avatar-input");
const profileFollowersCountEl = document.getElementById("profile-followers-count");
const profileFollowingCountEl = document.getElementById("profile-following-count");
const profileFriendsCountEl = document.getElementById("profile-friends-count");

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

let profileSocial = {
  followers: 40800000,
  following: 0,
  friends: { bot: true },
};

let avatarDataUrl = null;

function formatNumber(num) {
  if (typeof num !== "number") return "0";
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return Math.round(num / 100) / 10 + "K";
  }
  return String(num);
}

function getFriendsCount() {
  return Object.values(profileSocial.friends || {}).filter(Boolean).length;
}

function updateProfileUser() {
  const name = String(window.currentUser?.name || "guest");
  if (profileUsernameEl) {
    profileUsernameEl.textContent = `@${name.toLowerCase().replace(/\s+/g, "_")}`;
  }

  if (profileUserIdEl) {
    const id = window.currentUser?.id;
    profileUserIdEl.textContent = id ? `ID: ${id}` : "ID: —";
  }
}

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

function renderSocialStats() {
  if (profileFollowersCountEl) {
    profileFollowersCountEl.textContent = formatNumber(profileSocial.followers);
  }
  if (profileFollowingCountEl) {
    profileFollowingCountEl.textContent = formatNumber(profileSocial.following);
  }
  if (profileFriendsCountEl) {
    profileFriendsCountEl.textContent = formatNumber(getFriendsCount());
  }
}

function updateProfileRole() {
  const role = window.currentUser?.role || "гость";
  profileRoleEl.textContent = `Роль: ${role}`;
}

window.updateProfileRole = updateProfileRole;
window.updateProfileUser = updateProfileUser;

function applyAvatar(imageUrl) {
  avatarDataUrl = imageUrl;
  if (profileAvatarEl) {
    if (imageUrl) {
      profileAvatarEl.style.backgroundImage = `url(${imageUrl})`;
    } else {
      profileAvatarEl.style.backgroundImage = "";
    }
  }

  try {
    if (imageUrl) localStorage.setItem("avz_avatar", imageUrl);
    else localStorage.removeItem("avz_avatar");
  } catch (e) {}
}

function syncFriendshipWithProfile(friendId, isFriend) {
  if (!friendId) return;
  profileSocial.friends[friendId] = Boolean(isFriend);

  try {
    localStorage.setItem(
      "avz_social",
      JSON.stringify({
        followers: profileSocial.followers,
        following: profileSocial.following,
        friends: profileSocial.friends,
      })
    );
  } catch (e) {}

  renderSocialStats();
}

window.syncFriendshipWithProfile = syncFriendshipWithProfile;

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

profileAvatarEl?.addEventListener("click", () => {
  avatarInputEl?.click();
});

avatarInputEl?.addEventListener("change", (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    alert("Пожалуйста, выберите изображение");
    return;
  }

  const reader = new FileReader();
  reader.onload = (ev) => {
    applyAvatar(ev.target.result);
  };
  reader.readAsDataURL(file);
  avatarInputEl.value = "";
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

try {
  const savedSocial = localStorage.getItem("avz_social");
  if (savedSocial) {
    const parsed = JSON.parse(savedSocial);
    profileSocial.followers = Number(parsed.followers) || profileSocial.followers;
    profileSocial.following = Number(parsed.following) || profileSocial.following;
    profileSocial.friends = parsed.friends || profileSocial.friends;
  }
} catch (e) {}

if (window.chatUsers?.bot) {
  window.chatUsers.bot.isFriend = Boolean(profileSocial.friends.bot);
}

try {
  const savedAvatar = localStorage.getItem("avz_avatar");
  if (savedAvatar) {
    applyAvatar(savedAvatar);
  }
} catch (e) {}

renderProfileTracks();
renderSocialStats();
updateProfileRole();
updateProfileUser();
