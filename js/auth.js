// js/auth.js

const authOverlay = document.getElementById("auth-overlay");
const authInput = document.getElementById("auth-code-input");
const authSubmit = document.getElementById("auth-submit");
const authError = document.getElementById("auth-error");

window.currentUser = null;

function setAuth(auth) {
  window.currentUser = auth;
  try {
    localStorage.setItem("avz_auth", JSON.stringify(auth));
  } catch (e) {}
  authOverlay.style.display = "none";

  if (window.updateProfileRole) {
    window.updateProfileRole();
  }

  const chatUserNameEl = document.getElementById("chat-username");
  const chatStatusEl = document.getElementById("chat-status");
  if (chatUserNameEl && chatStatusEl) {
    chatUserNameEl.textContent = `Чат (${auth.role})`;
    chatStatusEl.textContent = "онлайн";
  }
}

const API_BASE = "http://localhost:3000"; // там, где крутится server.js

async function doLoginByCode() {
  const code = authInput.value.trim();
  if (!code) {
    authError.textContent = "Введите код.";
    return;
  }

  authError.textContent = "";

  try {
    const res = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    // если сервер вернул не 2xx – покажем текст ошибки
    if (!res.ok) {
      const text = await res.text();
      authError.textContent = `Ошибка ${res.status}: ${text}`;
      return;
    }

    // здесь уже точно JSON
    const data = await res.json();

    if (!data.ok) {
      authError.textContent = data.error || "Неверный код.";
      return;
    }

    // всё ок – сохраняем
    setAuth({ code: data.code, role: data.role });
  } catch (e) {
    console.error(e);
    authError.textContent = "Ошибка соединения с сервером.";
  }
}


authSubmit.addEventListener("click", doLoginByCode);
authInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    doLoginByCode();
  }
});

(function initAuth() {
  try {
    const saved = localStorage.getItem("avz_auth");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.code && parsed.role) {
        setAuth(parsed);
        return;
      }
    }
  } catch (e) {}

  // если нет сохранённого входа — показываем экран кода
  authOverlay.style.display = "flex";
})();
