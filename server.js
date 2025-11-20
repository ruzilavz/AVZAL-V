// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const chatRouter = require("./routes/chat");

const app = express();
const PORT = process.env.PORT || 3000;

// ====== MIDDLEWARE ======
app.use(cors());
app.use(express.json());

// раздаём фронтенд (index.html, css, js) из корня проекта
app.use(express.static(path.join(__dirname)));

// ====== 50 РОЛЕЙ И 50 КОДОВ ======

const BASE_ROLES = [
  "Администратор",
  "Модератор",
  "Артист",
  "VIP‑слушатель",
  "Команда",
  "Тестер",
  "Партнёр",
  "Гость",
  "Подписчик",
  "Особый гость",
];

// 10 ролей * 5 кодов = 50 кодов
const ACCESS_CODES = [];
BASE_ROLES.forEach((role, idx) => {
  for (let i = 1; i <= 5; i++) {
    const code = `AVZ-${String(idx + 1).padStart(2, "0")}-${String(
      i
    ).padStart(2, "0")}`; // AVZ-01-01, AVZ-01-02...
    ACCESS_CODES.push({ code, role, used: false });
  }
});

// ====== ЛОГИН ПО КОДУ ======

app.post("/api/login", (req, res) => {
  const { code } = req.body || {};

  if (!code) {
    return res.status(400).json({ ok: false, error: "Код обязателен" });
  }

  const trimmed = String(code).trim().toUpperCase();
  const record = ACCESS_CODES.find((c) => c.code === trimmed);

  if (!record) {
    return res.status(401).json({ ok: false, error: "Неверный код" });
  }

  // если хочешь одноразовые коды – можно включить:
  // if (record.used) {
  //   return res.status(403).json({ ok: false, error: "Код уже использован" });
  // }
  // record.used = true;

  return res.json({
    ok: true,
    code: record.code,
    role: record.role,
  });
});

// Тестовый маршрут
app.get("/api/ping", (req, res) => {
  res.json({ ok: true, message: "server is alive" });
});

// ====== ИИ‑ЧАТ ======
app.use("/chat", chatRouter);

// ====== ЗАПУСК СЕРВЕРА ======
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
