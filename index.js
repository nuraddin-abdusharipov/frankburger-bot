const express = require('express')
const TelegramBot = require('node-telegram-bot-api')

const app = express()

const TOKEN = "8566315145:AAHeFYExxZxBCj2PgtGzYk8qc4ZHaJY0VYY"
const URL = "https://frankbuger.onrender.com" // keyin qo'yamiz

// Webhook mode
const bot = new TelegramBot(TOKEN)
bot.setWebHook(`${URL}/bot${TOKEN}`)

app.use(express.json())

// Telegram webhook
app.post(`/bot${TOKEN}`, (req, res) => {
    bot.processUpdate(req.body)
    res.sendStatus(200)
})

// /start komandasi
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id

    bot.sendMessage(chatId, "Ilovani oching 👇", {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "🍔 Ilovani ochish",
                        web_app: {
                            url: "https://your-app.netlify.app"
                        }
                    }
                ]
            ]
        }
    })
})

// test route
app.get('/', (req, res) => {
    res.send("Bot ishlayapti ✅")
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log("Server running..."))