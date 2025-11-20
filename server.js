// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// ====== MIDDLEWARE (общие настройки) ======
app.use(cors());           // чтобы фронт мог стучаться к серверу
app.use(express.json());   // <-- ВАЖНО: парсинг JSON из req.body

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
    ).padStart(2, "0")}`; // например AVZ-01-01
    ACCESS_CODES.push({ code, role, used: false });
  }
});

// ====== МАРШРУТ ЛОГИНА ПО КОДУ ======

app.post("/api/login", (req, res) => {
  // благодаря app.use(express.json()) здесь есть req.body
  const { code } = req.body || {};

  if (!code) {
    return res.status(400).json({ ok: false, error: "Код обязателен" });
  }

  const trimmed = String(code).trim().toUpperCase();
  const record = ACCESS_CODES.find((c) => c.code === trimmed);

  if (!record) {
    return res.status(401).json({ ok: false, error: "Неверный код" });
  }

  // если хочешь одноразовые коды — раскомментируй:
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

// Простейший тестовый маршрут
app.get("/api/ping", (req, res) => {
  res.json({ ok: true, message: "server is alive" });
});

// ====== ЗАПУСК СЕРВЕРА ======
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
