// js/chat.js

const chatMessagesEl = document.getElementById("chat-messages");
const chatFormEl = document.getElementById("chat-form");
const chatInputEl = document.getElementById("chat-input");
const chatUsersEl = document.getElementById("chat-users");

const chatState = [
  { from: "other", text: "Привет! Это чат AVZALØV.", time: "10:00" },
  { from: "me", text: "Залетаю послушать новые треки 🔥", time: "10:01" },
];

const chatUsers = [
  {
    id: 1,
    name: "AVZALØV",
    handle: "@avzalov",
    color: "#76AABF",
    isFriend: true,
  },
  {
    id: 2,
    name: "Новый слушатель",
    handle: "@newlistener",
    color: "#678391",
    isFriend: false,
  },
  {
    id: 3,
    name: "Продюсер",
    handle: "@producer",
    color: "#056174",
    isFriend: false,
  },
];

function renderChat() {
  chatMessagesEl.innerHTML = "";
  chatState.forEach((msg) => {
    const div = document.createElement("div");
    div.className =
      "chat-bubble " +
      (msg.from === "me" ? "chat-bubble--me" : "chat-bubble--other");
    div.innerHTML = `
      <span>${msg.text}</span>
      <span class="chat-time">${msg.time}</span>
    `;
    chatMessagesEl.appendChild(div);
  });
  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

function renderChatUsers() {
  chatUsersEl.innerHTML = "";

  chatUsers.forEach((u) => {
    const card = document.createElement("div");
    card.className = "chat-user-card";

    const header = document.createElement("div");
    header.className = "chat-user-card-header";

    const avatar = document.createElement("div");
    avatar.className = "chat-user-avatar";
    avatar.style.background = `radial-gradient(circle at 30% 30%, ${u.color}, #034153)`;

    const nameWrap = document.createElement("div");
    const nameEl = document.createElement("div");
    nameEl.className = "chat-user-name";
    nameEl.textContent = u.name;

    const handleEl = document.createElement("div");
    handleEl.className = "chat-user-handle";
    handleEl.textContent = u.handle;

    nameWrap.appendChild(nameEl);
    nameWrap.appendChild(handleEl);

    header.appendChild(avatar);
    header.appendChild(nameWrap);

    const actions = document.createElement("div");
    actions.className = "chat-user-actions";

    const dmBtn = document.createElement("button");
    dmBtn.className = "mini-btn mini-btn--primary";
    dmBtn.textContent = "ЛС";

    dmBtn.addEventListener("click", () => {
      startDirectMessage(u);
    });

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

function startDirectMessage(user) {
  // вставляем @ник и фокусируемся на инпут
  chatInputEl.value = `${user.handle} `;
  chatInputEl.focus();
}

chatFormEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = chatInputEl.value.trim();
  if (!text) return;

  const now = new Date();
  const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;

  chatState.push({ from: "me", text, time });
  chatInputEl.value = "";
  renderChat();

  // демо-ответ
  setTimeout(() => {
    chatState.push({
      from: "other",
      text: "Спасибо за сообщение! Здесь скоро будет живой сервер 😊",
      time,
    });
    renderChat();
  }, 600);
});

// начальный рендер
renderChatUsers();
renderChat();
