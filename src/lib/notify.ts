/**
 * Telegram notification — best-effort, never breaks the request.
 * Configure via env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
 * If not set → silently skips (site still works).
 */

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export async function sendTelegram(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return; // bot not configured — site still works

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chat,
        text,
        parse_mode: "HTML",
      }),
    });
  } catch {
    // best-effort: notification failure never breaks the request
  }
}

export function formatVisitNotification(data: {
  name: string;
  contact: string;
  visitDate?: string;
  message?: string;
}): string {
  const dateStr = data.visitDate
    ? `\n📅 <b>Дата визита:</b> ${escapeHtml(data.visitDate)}`
    : "\n📅 <b>Дата:</b> не указана (клиент выберет позже)";
  const msgStr = data.message
    ? `\n💬 <b>Комментарий:</b> ${escapeHtml(data.message)}`
    : "";
  return [
    "🐾 <b>Новая заявка на визит</b>",
    "",
    `👤 <b>Имя:</b> ${escapeHtml(data.name)}`,
    `📞 <b>Контакт:</b> ${escapeHtml(data.contact)}`,
    dateStr,
    msgStr,
  ].join("\n");
}

export function formatReservationNotification(data: {
  kittenName: string;
  name: string;
  contact: string;
  message?: string;
}): string {
  const msgStr = data.message
    ? `\n💬 <b>Комментарий:</b> ${escapeHtml(data.message)}`
    : "";
  return [
    "🐱 <b>Новая заявка на бронирование котёнка</b>",
    "",
    `🐾 <b>Котёнок:</b> ${escapeHtml(data.kittenName)}`,
    `👤 <b>Имя:</b> ${escapeHtml(data.name)}`,
    `📞 <b>Контакт:</b> ${escapeHtml(data.contact)}`,
    msgStr,
  ].join("\n");
}
