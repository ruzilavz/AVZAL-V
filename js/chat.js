// js/chat.js

const chatMessagesEl = document.getElementById("chat-messages");
const chatFormEl = document.getElementById("chat-form");
const chatInputEl = document.getElementById("chat-input");
const chatUsersEl = document.getElementById("chat-users");

// пользователи (мини‑профили)
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

function renderChatUsers() {
  chatUsersEl.innerHTML = "";

  chatUsers.forEach((u) => {
    const card = document.createElement("div");
    card.className = "chat-user-card";

    const header = document.createElement("div");
    header.className = "chat-user-card-header";

    const avatar = document.createElement("div");
    avatar.className = "chat-user-avatar";
    avatar.style.backgroundImage =
      "linear-gradient(135deg, " + u.color + ", #034153)";

    const infoWrap = document.createElement("div");
    const nameEl = document.createElement("div");
    nameEl.className = "chat-user-name";
    nameEl.textContent = u.name;
    const handleEl = document.createElement("div");
    handleEl.className = "chat-user-handle";
    handleEl.textContent = u.handle;

    infoWrap.appendChild(nameEl);
    infoWrap.appendChild(handleEl);
    header.appendChild(avatar);
    header.appendChild(infoWrap);

    const actions = document.createElement("div");
    actions.className = "chat-user-actions";

    // кнопка ЛС
    const dmBtn = document.createElement("button");
    dmBtn.className = "mini-btn mini-btn--primary";
    dmBtn.textContent = "ЛС";
    dmBtn.addEventListener("click", () => {
      chatInputEl.value = `${u.handle} `;
      chatInputEl.focus();
    });

    // кнопка Друзья
    const friendBtn = document.createElement("button");
    friendBtn.className = "mini-btn";
    friendBtn.textContent = u.isFriend ? "В друзьях" : "Добавить";
    friendBtn.addEventListener("click", () => {
      u.isFriend = !u.isFriend;
      friendBtn.textContent = u.isFriend ? "В друзьях" : "Добавить";
    });

    actions.appendChild(dmBtn);
    actions.appendChild(friendBtn);

    card.appendChild(header);
    card.appendChild(actions);

    chatUsersEl.appendChild(card);
  });
}

function renderChat() {
  chatMessagesEl.innerHTML = "";

  chatState.forEach((msg) => {
    const user = usersById[msg.from] || usersById["avzalov"];

    const row = document.createElement("div");
    row.className =
      "chat-row " +
      (msg.from === "me" ? "chat-row--me" : "chat-row--other");

    if (msg.from !== "me") {
      const avatarBtn = document.createElement("button");
      avatarBtn.className = "chat-avatar";
      avatarBtn.style.backgroundImage =
        "linear-gradient(135deg, " + user.color + ", #034153)";
      row.appendChild(avatarBtn);
    } else {
      const spacer = document.createElement("div");
      spacer.style.width = "28px";
      row.appendChild(spacer);
    }

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
  });

  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

chatFormEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = chatInputEl.value.trim();
  if (!text) return;

  const now = new Date();
  const time = `${now.getHours()}:${String(now.getMinutes()).padStart(
    2,
    "0"
  )}`;

  chatState.push({ from: "me", text, time });
  chatInputEl.value = "";
  renderChat();

  // демо‑ответ
  setTimeout(() => {
    chatState.push({
      from: "avzalov",
      text: "Спасибо за сообщение! Здесь скоро будет настоящий сервер 😊",
      time,
    });
    renderChat();
  }, 600);
});

renderChatUsers();
renderChat();
