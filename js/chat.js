// js/chat.js

const chatMessagesEl = document.getElementById("chat-messages");
const chatFormEl = document.getElementById("chat-form");
const chatInputEl = document.getElementById("chat-input");

// пользователи
const chatUsers = {
  me: {
    id: "me",
    name: "Вы",
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
    text: "Привет! Я бот AVZALØV. Пока тут только я, но скоро будут живые пользователи.",
    time: getTime(),
  },
];

function buildBotReply(userText) {
  const text = userText.toLowerCase();

  if (text.includes("привет") || text.includes("салам")) {
    return "Привет! Можешь спрашивать про треки, релизы и ранний доступ 🎵";
  }

  if (text.includes("трек") || text.includes("песня")) {
    return "Новинки уже в плеере. Листай треки и жди даты релизов — всё в карточках!";
  }

  if (text.includes("когда") || text.includes("релиз")) {
    return "Точные даты релизов указаны у каждого трека. Некоторые доступны в раннем доступе 😉";
  }

  if (text.includes("код") || text.includes("доступ")) {
    return "Доступ к проекту выдаётся по спец‑кодам от админа. Если у тебя есть код — введи его на экране входа.";
  }

  return "Я услышал тебя. Я бот и сейчас отвечаю вместо живых пользователей. Скоро здесь будет больше жизни 🙌";
}

function renderChat() {
  chatMessagesEl.innerHTML = "";

  chatState.forEach((msg) => {
    const user = chatUsers[msg.from] || chatUsers["bot"];

    const row = document.createElement("div");
    row.className =
      "chat-row " +
      (msg.from === "me" ? "chat-row--me" : "chat-row--other");

    const inner = document.createElement("div");
    inner.className = "chat-row-inner";

    // микропрофиль рисуем только для бота (и вообще не для "me")
    if (msg.from !== "me") {
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

      const actions = document.createElement("div");
      actions.className = "chat-mini-actions";

      const dmBtn = document.createElement("button");
      dmBtn.className = "chat-mini-btn chat-mini-btn--primary";
      dmBtn.textContent = "ЛС";
      dmBtn.dataset.user = user.id;
      dmBtn.dataset.action = "dm";

      const friendBtn = document.createElement("button");
      friendBtn.className = "chat-mini-btn";
      friendBtn.dataset.user = user.id;
      friendBtn.dataset.action = "friend";
      friendBtn.textContent = user.isFriend ? "В друзьях" : "Добавить";

      actions.appendChild(dmBtn);
      actions.appendChild(friendBtn);

      main.appendChild(nameEl);
      main.appendChild(actions);

      mini.appendChild(avatar);
      mini.appendChild(main);

      inner.appendChild(mini);
    }

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

// обработка кликов по ЛС / Друзья
chatMessagesEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".chat-mini-btn");
  if (!btn) return;

  const userId = btn.dataset.user;
  const action = btn.dataset.action;
  const user = chatUsers[userId];
  if (!user) return;

  if (action === "dm") {
    // подставляем @ник бота
    chatInputEl.value = `${user.username} `;
    chatInputEl.focus();
  }

  if (action === "friend") {
    user.isFriend = !user.isFriend;
    renderChat();
  }
});

// отправка сообщения + ответ бота
chatFormEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = chatInputEl.value.trim();
  if (!text) return;

  const time = getTime();

  chatState.push({
    from: "me",
    text,
    time,
  });
  chatInputEl.value = "";
  renderChat();

  setTimeout(() => {
    const reply = buildBotReply(text);
    chatState.push({
      from: "bot",
      text: reply,
      time: getTime(),
    });
    renderChat();
  }, 700);
});

renderChat();
