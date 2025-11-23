// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { randomUUID } = require("crypto");

const chatRouter = require("./routes/chat");

const app = express();
const PORT = process.env.PORT || 3000;

// ====== ХРАНЕНИЕ ДАННЫХ ПОЛЬЗОВАТЕЛЕЙ ======
const DATA_DIR = path.join(__dirname, "data");
const USERS_LOG_PATH = path.join(DATA_DIR, "users-log.json");
const USERS_ACCOUNTS_PATH = path.join(DATA_DIR, "users-accounts.json");

function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(USERS_LOG_PATH)) {
    fs.writeFileSync(USERS_LOG_PATH, "[]", "utf8");
  }

  if (!fs.existsSync(USERS_ACCOUNTS_PATH)) {
    fs.writeFileSync(USERS_ACCOUNTS_PATH, "[]", "utf8");
  }
}

function persistUserRecord(record) {
  ensureStorage();

  let users = [];
  try {
    const raw = fs.readFileSync(USERS_LOG_PATH, "utf8");
    users = JSON.parse(raw);
  } catch (e) {
    users = [];
  }

  users.push(record);
  fs.writeFileSync(USERS_LOG_PATH, JSON.stringify(users, null, 2), "utf8");
}

function readAccounts() {
  ensureStorage();
  try {
    const raw = fs.readFileSync(USERS_ACCOUNTS_PATH, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {}
  return [];
}

function saveAccounts(list) {
  fs.writeFileSync(USERS_ACCOUNTS_PATH, JSON.stringify(list, null, 2), "utf8");
}

function generateUserId() {
  if (typeof randomUUID === "function") {
    return randomUUID();
  }
  return `avz-${Date.now().toString(36)}-${Math.floor(Math.random() * 9999)}`;
}

function findOrCreateUser({ name, methodLabel, role }) {
  const accounts = readAccounts();
  const normalized = name.trim().toLowerCase();
  const existing = accounts.find(
    (u) => u.method === methodLabel && u.normalized === normalized
  );

  if (existing) {
    existing.name = name;
    existing.role = role;
    existing.lastLoginAt = new Date().toISOString();
    saveAccounts(accounts);
    return existing;
  }

  const newUser = {
    id: generateUserId(),
    name,
    normalized,
    method: methodLabel,
    role,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };

  accounts.push(newUser);
  saveAccounts(accounts);
  return newUser;
}

ensureStorage();

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

// ====== ЛОГИН ======

const METHOD_LABELS = {
  yandex: "Яндекс ID",
  vk: "VK ID",
  google: "Google",
  admin_code: "Код админа",
};

app.post("/api/login", (req, res) => {
  const { method, name, code } = req.body || {};

  if (!method || !METHOD_LABELS[method]) {
    return res
      .status(400)
      .json({ ok: false, error: "Неизвестный способ входа" });
  }

  if (!name || !String(name).trim()) {
    return res.status(400).json({ ok: false, error: "Введите имя" });
  }

  const displayName = String(name).trim();
  const methodLabel = METHOD_LABELS[method];
  let role = "Гость";
  let usedCode = null;

  if (method === "admin_code") {
    if (!code) {
      return res.status(400).json({ ok: false, error: "Введите код админа" });
    }

    const trimmed = String(code).trim().toUpperCase();
    const record = ACCESS_CODES.find((c) => c.code === trimmed);

    if (!record) {
      return res.status(401).json({ ok: false, error: "Неверный код" });
    }

    role = record.role;
    usedCode = record.code;
  }

  const user = findOrCreateUser({
    name: displayName,
    methodLabel,
    role,
  });

  persistUserRecord({
    id: user.id,
    name: user.name,
    method: user.method,
    role: user.role,
    code: usedCode,
    loggedAt: new Date().toISOString(),
  });

  return res.json({
    ok: true,
    id: user.id,
    name: user.name,
    role: user.role,
    method: user.method,
    code: usedCode,
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
