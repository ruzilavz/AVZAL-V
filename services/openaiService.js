// services/openaiService.js
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * messages — массив вида:
 * [{ role: "user" | "assistant", content: "..." }, ...]
 */
async function askOpenAI(messages) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY не задан в .env");
  }

  const systemMessage = {
    role: "system",
    content:
      "Ты ассистент в приложении AVZALØV. Отвечай коротко, по делу, на русском. " +
      "Можешь общаться про музыку, треки, релизы и сам проект.",
  };

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [systemMessage, ...messages],
    temperature: 0.7,
  });

  const choice = response.choices && response.choices[0];
  const text = choice?.message?.content?.trim();

  return text || "Бот пока молчит, попробуй ещё раз.";
}

module.exports = { askOpenAI };
