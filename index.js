const express = require('express')
const { Telegraf } = require('telegraf')

const app = express()

const TOKEN = "8771407234:AAFlVx8y1S7lrI8Zz0yThThR2JW0iMkDtwc"
const URL = "https://frankbuger.onrender.com"

const bot = new Telegraf(TOKEN)

// /start komandasi
bot.start((ctx) => {
    ctx.reply("Ilovani oching 👇", {
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

// webhook middleware
app.use(bot.webhookCallback(`/bot${TOKEN}`))

// test route
app.get('/', (req, res) => {
    res.send("Bot ishlayapti ✅")
})

const PORT = process.env.PORT || 3000

app.listen(PORT, async () => {
    console.log("Server running...")

    await bot.telegram.setWebhook(`${URL}/bot${TOKEN}`)
    console.log("Webhook o‘rnatildi ✅")
})