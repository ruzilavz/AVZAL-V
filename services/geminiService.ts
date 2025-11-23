import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

let ai: GoogleGenAI | null = null;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

export const sendMessageToGemini = async (
  message: string, 
  history: { role: string; parts: { text: string }[] }[] = []
): Promise<string> => {
  if (!ai) {
    return "AI Module Offline: API Key missing or system unreachable.";
  }

  try {
    const modelId = 'gemini-2.5-flash';
    
    // Transform history to format expected by @google/genai if strictly needed,
    // or use generateContent for single turn if history management is manual.
    // Here we use chat for context.
    const chat = ai.chats.create({
      model: modelId,
      config: {
        systemInstruction: "You are the AI assistant for the artist AVZALØV. You are helpful, knowledgeable about music production, cyberpunk aesthetics, and the artist's discography. Keep answers concise and cool.",
      }
    });

    // Note: For a real persistent chat, we would replay history into the chat object.
    // For this demo, we are treating it as a new session or simplified interaction.
    
    const result = await chat.sendMessage({ message });
    return result.text || "No data received.";
    
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Connection Error: The neural link was interrupted.";
  }
};
