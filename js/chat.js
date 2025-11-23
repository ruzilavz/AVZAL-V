// js/chat.js

const chatMessagesEl = document.getElementById("chat-messages");
const chatFormEl = document.getElementById("chat-form");
const chatInputEl = document.getElementById("chat-input");

// пользователи для микро‑профилей
const chatUsers = {
  me: {
    id: "me",
    name: "Гость",
    username: "@you",
    isFriend: true,
  },
  bot: {
    id: "bot",
    name: "AVZA бот",
    username: "@avzabot",
    isFriend: true,
  },
};

function getTime() {
  const now = new Date();
  return `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
}

// история сообщений
const chatState = [
  {
    from: "bot",
    text: "Привет! Я ИИ‑бот AVZALØV. Пиши, отвечу на русском 😊",
    time: getTime(),
  },
];

function setChatUserName(name) {
  chatUsers.me.name = name || "Гость";
}

window.setChatUserName = setChatUserName;

// запасной локальный ответ, если OpenAI недоступен
function buildFallbackReply(userText) {
  const text = userText.toLowerCase();

  if (text.includes("привет") || text.includes("салам")) {
    return "Привет! Можешь спрашивать про треки, релизы и сам проект.";
  }

  if (text.includes("трек") || text.includes("песня")) {
    return "Все треки в плеере. Листай и смотри, что уже доступно.";
  }

  return "Я сейчас без подключения к ИИ, но всё равно стараюсь отвечать 🙂";
}

// рендер диалога: микро‑профиль + сообщение — один блок
function renderChat() {
  chatMessagesEl.innerHTML = "";

  chatState.forEach((msg) => {
    const user = chatUsers[msg.from] || chatUsers.bot;

    const row = document.createElement("div");
    row.className =
      "chat-row " +
      (msg.from === "me" ? "chat-row--me" : "chat-row--other");

    const inner = document.createElement("div");
    inner.className = "chat-row-inner";

    // микро‑профиль показываем и для бота, и для "me"
    const mini = document.createElement("div");
    mini.className = "chat-mini-profile";

    const avatar = document.createElement("div");
    avatar.className = "chat-mini-avatar";
    avatar.textContent = (user.name || "?").charAt(0).toUpperCase();

    const main = document.createElement("div");
    main.className = "chat-mini-main";

    const nameEl = document.createElement("div");
    nameEl.className = "chat-mini-name";
    nameEl.textContent = user.name;

    main.appendChild(nameEl);

    const actions = document.createElement("div");
    actions.className = "chat-mini-actions";

    // кнопки только для бота (ЛС / Друзья), для "me" они не нужны
    if (msg.from === "bot") {
      const dmBtn = document.createElement("button");
      dmBtn.className = "chat-mini-btn chat-mini-btn--primary";
      dmBtn.textContent = "ЛС";
      dmBtn.addEventListener("click", () => {
        chatInputEl.value = `${user.username} `;
        chatInputEl.focus();
      });

      const friendBtn = document.createElement("button");
      friendBtn.className = "chat-mini-btn";
      friendBtn.textContent = user.isFriend ? "В друзьях" : "Добавить";
      friendBtn.addEventListener("click", () => {
        user.isFriend = !user.isFriend;
        friendBtn.textContent = user.isFriend ? "В друзьях" : "Добавить";
      });

      actions.appendChild(dmBtn);
      actions.appendChild(friendBtn);
    }

    mini.appendChild(avatar);
    mini.appendChild(main);
    mini.appendChild(actions);

    inner.appendChild(mini);

    const bubble = document.createElement("div");
    bubble.className =
      "chat-bubble " +
      (msg.from === "me" ? "chat-bubble--me" : "chat-bubble--other");
    bubble.innerHTML = `
      <span>${msg.text}</span>
      <span class="chat-time">${msg.time}</span>
    `;

    inner.appendChild(bubble);
    row.appendChild(inner);
    chatMessagesEl.appendChild(row);
  });

  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

// отправка истории на бэкенд ИИ
async function sendToBot() {
  const messagesForApi = chatState.map((m) => ({
    role: m.from === "me" ? "user" : "assistant",
    content: m.text,
  }));

  const res = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: messagesForApi }),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) {
    const err = new Error(
      `HTTP ${res.status}: ${data?.error || "Ошибка бота"}`
    );
    err.fallback = data?.fallback;
    throw err;
  }

  return data.answer;
}

// обработка отправки сообщения
chatFormEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = chatInputEl.value.trim();
  if (!text) return;

  if (!(window.isAuthenticated && window.isAuthenticated())) {
    if (window.requireAuthOverlay) {
      window.requireAuthOverlay("screen-chat");
    }
    return;
  }

  const time = getTime();

  // добавляем своё сообщение
  chatState.push({
    from: "me",
    text,
    time,
  });
  chatInputEl.value = "";
  renderChat();

  try {
    const answer = await sendToBot();
    chatState.push({
      from: "bot",
      text: answer,
      time: getTime(),
    });
    renderChat();
  } catch (err) {
    console.error("Ошибка ИИ‑бота:", err);
    chatState.push({
      from: "bot",
      text: err.fallback || buildFallbackReply(text),
      time: getTime(),
    });
    renderChat();
  }
});

renderChat();
