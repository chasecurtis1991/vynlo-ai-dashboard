/**
 * Telegram Notification Utility
 * Sends feature update notifications to Chase
 */

const TELEGRAM_BOT_TOKEN = typeof window !== "undefined" 
  ? localStorage.getItem("vynlo_telegramToken") || ""
  : "";

const TELEGRAM_CHAT_ID = typeof window !== "undefined"
  ? localStorage.getItem("vynlo_telegramChatId") || ""
  : "";

interface TelegramMessage {
  chat_id: string;
  text: string;
  parse_mode?: "Markdown" | "HTML";
}

async function sendToTelegram(message: string): Promise<boolean> {
  const token = TELEGRAM_BOT_TOKEN;
  const chatId = TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.log("📝 Telegram (not sent - missing credentials):", message);
    return false;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    const data = await response.json();
    
    if (data.ok) {
      console.log("✅ Telegram notification sent");
      return true;
    } else {
      console.error("❌ Telegram error:", data.description);
      return false;
    }
  } catch (error) {
    console.error("❌ Telegram request failed:", error);
    return false;
  }
}

export function notifyFeatureAdded(feature: {
  name: string;
  description: string;
  location: string;
  tech: string;
  improvement?: string;
}): void {
  const message = `🔧 **New Feature Added to Vynlo Dashboard**

**${feature.name}**
${feature.description}

📁 **Location:** \`${feature.location}\`
🛠️ **Tech:** ${feature.tech}${feature.improvement ? `\n\n${feature.improvement}` : ""}

🤖 *Added by your AI agent*`;

  sendToTelegram(message);
}

export function notifyStatusUpdate(message: string): void {
  sendToTelegram(`📊 **Vynlo AI Dashboard Update**

${message}

🤖 *AI Agent*`);
}

export function notifyError(error: string): void {
  sendToTelegram(`⚠️ **Dashboard Error**

${error}

🤖 *AI Agent*`);
}
