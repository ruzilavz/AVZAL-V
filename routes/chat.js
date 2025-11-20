// routes/chat.js
const express = require("express");
const router = express.Router();
const { askOpenAI } = require("../services/openaiService");

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
    return res
      .status(500)
      .json({ ok: false, error: "Ошибка бота, попробуйте позже" });
  }
});

module.exports = router;
