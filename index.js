const express = require("express");
const { Telegraf, Markup } = require("telegraf");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// ⚠️ TOKENNI keyin .env ga o‘tkazganing yaxshi
const BOT_TOKEN = "8771407234:AAFlVx8y1S7lrI8Zz0yThThR2JW0iMkDtwc";

if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN topilmadi.");
}

const bot = new Telegraf(BOT_TOKEN);

// Middlewares
app.use(cors());
app.use(express.json());

// (agar logo ishlatmoqchi bo‘lsang)
const logo = path.join(__dirname, "logo.png");

// Routes
app.get("/", (req, res) => {
  res.json({
    status: "online",
    time: new Date(),
    message: "Backend is running",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
  });
});

// Telegram /start
bot.start(async (ctx) => {
  try {
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.webApp("Ochish", "https://frankburger.netlify.app/")],
    ]);

    const text = `Salom, ${ctx.from.first_name}! Frank Burger botiga xush kelibsiz!`;

    if (fs.existsSync(logo)) {
      await ctx.replyWithPhoto(
        { source: fs.readFileSync(logo) },
        {
          caption: text,
          ...keyboard,
        }
      );
    } else {
      await ctx.reply(text, keyboard);
    }
  } catch (err) {
    console.error("❌ /start error:", err);
  }
});

// Server start
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);

  try {
    const me = await bot.telegram.getMe();
    console.log(`✅ Telegram connected: @${me.username}`);

    await bot.telegram.deleteWebhook();
    console.log("✅ Old webhook deleted");

    await bot.launch();
    console.log("🤖 Bot started successfully");
  } catch (err) {
    console.error("❌ Bot launch error:", err);
  }
});

process.once("SIGINT", () => {
  bot.stop("SIGINT");
  process.exit(0);
});

process.once("SIGTERM", () => {
  bot.stop("SIGTERM");
  process.exit(0);
});