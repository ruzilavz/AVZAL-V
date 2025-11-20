// js/chat.js

const chatMessagesEl = document.getElementById("chat-messages");
const chatFormEl = document.getElementById("chat-form");
const chatInputEl = document.getElementById("chat-input");

// пользователи
const chatUsers = [
  {
    id: "avzalov",
    name: "AVZALØV",
    handle: "@avzalov",
    color: "#76AABF",
    isFriend: true,
  },
  {
    id: "listener",
    name: "Слушатель",
    handle: "@listener",
    color: "#678391",
    isFriend: false,
  },
  {
    id: "producer",
    name: "Продюсер",
    handle: "@producer",
    color: "#056174",
    isFriend: false,
  },
];

const usersById = {};
chatUsers.forEach((u) => (usersById[u.id] = u));
usersById["me"] = {
  id: "me",
  name: "Вы",
  handle: "@you",
  color: "#96A3AB",
  isFriend: true,
};

// сообщения
const chatState = [
  { from: "avzalov", text: "Привет! Это чат AVZALØV.", time: "10:00" },
  {
    from: "me",
    text: "Залетаю послушать новые треки 🔥",
    time: "10:01",
  },
];

// рендер всего диалога
function renderChat() {
  chatMessagesEl.innerHTML = "";
  let lastFrom = null;

  chatState.forEach((msg) => {
    const user = usersById[msg.from] || usersById["avzalov"];

    // если сменился автор сообщения — рисуем микро‑профиль над его сообщением
    if (msg.from !== lastFrom) {
      const mini = document.createElement("div");
      mini.className = "chat-mini-profile";

      const left = document.createElement("div");
      left.className = "chat-mini-left";

      const avatar = document.createElement("div");
      avatar.className = "chat-mini-avatar";
      avatar.style.backgroundImage =
        "linear-gradient(135deg, " + user.color + ", #034153)";

      const textWrap = document.createElement("div");
      const nameEl = document.createElement("div");
      nameEl.className = "chat-mini-name";
      nameEl.textContent = user.name;
      const handleEl = document.createElement("div");
      handleEl.className = "chat-mini-handle";
      handleEl.textContent = user.handle;

      textWrap.appendChild(nameEl);
      textWrap.appendChild(handleEl);
      left.appendChild(avatar);
      left.appendChild(textWrap);

      const actions = document.createElement("div");
      actions.className = "chat-mini-actions";

      // для других пользователей даём ЛС и Друзья
      if (msg.from !== "me") {
        const dmBtn = document.createElement("button");
        dmBtn.className = "chat-mini-btn chat-mini-btn--primary";
        dmBtn.textContent = "ЛС";
        dmBtn.addEventListener("click", () => {
          chatInputEl.value = `${user.handle} `;
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

      mini.appendChild(left);
      mini.appendChild(actions);
      chatMessagesEl.appendChild(mini);
    }

    // сам пузырь сообщения
    const row = document.createElement("div");
    row.className =
      "chat-row " + (msg.from === "me" ? "chat-row--me" : "chat-row--other");

    const bubble = document.createElement("div");
    bubble.className =
      "chat-bubble " +
      (msg.from === "me" ? "chat-bubble--me" : "chat-bubble--other");
    bubble.innerHTML = `
      <span>${msg.text}</span>
      <span class="chat-time">${msg.time}</span>
    `;

    row.appendChild(bubble);
    chatMessagesEl.appendChild(row);

    lastFrom = msg.from;
  });

  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

// отправка сообщения
chatFormEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = chatInputEl.value.trim();
  if (!text) return;

  const now = new Date();
  const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;

  chatState.push({ from: "me", text, time });
  chatInputEl.value = "";
  renderChat();

  // демо‑ответ
  setTimeout(() => {
    chatState.push({
      from: "avzalov",
      text: "Спасибо за сообщение! Скоро здесь будет настоящий сервер 😊",
      time,
    });
    renderChat();
  }, 600);
});

// стартовый рендер
renderChat();
