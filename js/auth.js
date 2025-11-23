// js/auth.js

const authOverlay = document.getElementById("auth-overlay");
const authSubtitle = document.getElementById("auth-subtitle");
const authNameInput = document.getElementById("auth-name-input");
const authCodeInput = document.getElementById("auth-code-input");
const authSubmit = document.getElementById("auth-submit");
const authError = document.getElementById("auth-error");
const authClose = document.getElementById("auth-close");
const authGuestBtn = document.getElementById("auth-guest");
const openAuthBtn = document.getElementById("open-auth");
const providerButtons = document.querySelectorAll("[data-auth-provider]");

const chatUserNameEl = document.getElementById("chat-username");
const chatStatusEl = document.getElementById("chat-status");

window.currentUser = null;

const API_BASE = "http://localhost:3000"; // там, где крутится server.js

function isAuthenticated() {
  return Boolean(window.currentUser);
}

function toggleLockedSections(locked) {
  const chatLocked = document.getElementById("chat-locked");
  const chatContent = document.getElementById("chat-content");
  const profileLocked = document.getElementById("profile-locked");
  const profileContent = document.getElementById("profile-content");

  if (chatLocked && chatContent) {
    chatLocked.classList.toggle("hidden", !locked);
    chatContent.classList.toggle("hidden", locked);
  }

  if (profileLocked && profileContent) {
    profileLocked.classList.toggle("hidden", !locked);
    profileContent.classList.toggle("hidden", locked);
  }
}

function applyUserToChat(auth) {
  if (chatUserNameEl) {
    chatUserNameEl.textContent = auth?.name || "Гость";
  }

  if (chatStatusEl) {
    chatStatusEl.textContent = auth?.method || "гостевой режим";
  }

  if (window.setChatUserName) {
    window.setChatUserName(auth?.name || "Гость");
  }
}

function setAuth(auth) {
  window.currentUser = auth;
  try {
    localStorage.setItem("avz_auth", JSON.stringify(auth));
  } catch (e) {}

  authOverlay.style.display = "none";
  applyUserToChat(auth);

  if (window.updateProfileRole) {
    window.updateProfileRole();
  }
  if (window.updateProfileUser) {
    window.updateProfileUser();
  }

  toggleLockedSections(false);
}

function setGuest() {
  window.currentUser = null;
  try {
    localStorage.removeItem("avz_auth");
  } catch (e) {}

  applyUserToChat(null);
  if (window.updateProfileRole) {
    window.updateProfileRole();
  }
  if (window.updateProfileUser) {
    window.updateProfileUser();
  }

  toggleLockedSections(true);
}

async function sendLoginRequest(payload) {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.ok) {
    const msg = data?.error || `Ошибка ${res.status}`;
    throw new Error(msg);
  }

  return data;
}

async function login(method) {
  authError.textContent = "";
  const name = authNameInput.value.trim();

  if (!name) {
    authError.textContent = "Введите имя";
    return;
  }

  const payload = { method, name };
  if (method === "admin_code") {
    const code = authCodeInput.value.trim();
    if (!code) {
      authError.textContent = "Введите код админа";
      return;
    }
    payload.code = code;
  }

  try {
    const data = await sendLoginRequest(payload);
    setAuth({
      id: data.id,
      name: data.name,
      method: data.method,
      role: data.role,
      code: data.code,
    });
  } catch (e) {
    authError.textContent = e.message || "Ошибка соединения";
  }
}

function openAuthOverlay(reason) {
  if (reason && authSubtitle) {
    authSubtitle.textContent = "Нужен вход, чтобы открыть " +
      (reason === "screen-chat"
        ? "чат"
        : reason === "screen-profile"
        ? "профиль"
        : "контент");
  } else if (authSubtitle) {
    authSubtitle.textContent = "Выберите способ входа, чтобы открыть чат и профиль.";
  }

  authOverlay.style.display = "flex";
  authNameInput?.focus();
}

function closeAuthOverlay() {
  authOverlay.style.display = "none";
}

authSubmit.addEventListener("click", () => login("admin_code"));

providerButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const method = btn.dataset.authProvider;
    login(method);
  });
});

authGuestBtn.addEventListener("click", () => {
  setGuest();
  closeAuthOverlay();
});

openAuthBtn?.addEventListener("click", () => openAuthOverlay());
authClose?.addEventListener("click", closeAuthOverlay);

authNameInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    login("yandex");
  }
});

authCodeInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    login("admin_code");
  }
});

(function initAuth() {
  try {
    const saved = localStorage.getItem("avz_auth");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.name && parsed.role) {
        setAuth(parsed);
        return;
      }
    }
  } catch (e) {}

  setGuest();
})();

window.requireAuthOverlay = openAuthOverlay;
window.isAuthenticated = isAuthenticated;
