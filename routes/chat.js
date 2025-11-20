// routes/chat.js
const express = require("express");
const router = express.Router();
const { askOpenAI } = require("../services/openaiService");

function buildFallbackReply(messages) {
  const lastUserMessage =
    messages
      .slice()
      .reverse()
      .find((m) => m.role === "user")?.content || "";

  const normalized = lastUserMessage.toLowerCase();

  if (normalized.includes("привет") || normalized.includes("салам")) {
    return "Привет! Можешь спрашивать про треки, релизы и сам проект.";
  }

  if (normalized.includes("трек") || normalized.includes("песня")) {
    return "Все треки в плеере. Листай и смотри, что уже доступно.";
  }

  return "Я сейчас без подключения к ИИ, но всё равно стараюсь отвечать 🙂";
}

router.post("/", async (req, res) => {
  const { messages } = req.body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res
      .status(400)
      .json({ ok: false, error: "Поле messages обязательно" });
  }

  try {
    const answer = await askOpenAI(messages);
    return res.json({ ok: true, answer });
  } catch (err) {
    console.error("Ошибка /chat:", err);
    const fallback = buildFallbackReply(messages);
    return res.status(503).json({
      ok: false,
      error: err.message || "Ошибка бота, попробуйте позже",
      fallback,
    });
  }
});

module.exports = router;
