// js/chat.js

const chatMessagesEl = document.getElementById("chat-messages");
const chatFormEl = document.getElementById("chat-form");
const chatInputEl = document.getElementById("chat-input");

const chatState = [
  { from: "other", text: "Привет! Это чат AVZALØV.", time: "10:00" },
  { from: "me", text: "Залетаю послушать новые треки 🔥", time: "10:01" },
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

chatFormEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = chatInputEl.value.trim();
  if (!text) return;
  const now = new Date();
  const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;

  chatState.push({ from: "me", text, time });
  chatInputEl.value = "";
  renderChat();

  // демо-ответ бота
  setTimeout(() => {
    chatState.push({
      from: "other",
      text: "Спасибо за сообщение! Скоро здесь будет настоящий сервер 😊",
      time,
    });
    renderChat();
  }, 600);
});

renderChat();
