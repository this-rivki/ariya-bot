const { Telegraf } = require("telegraf")

const axios = require("axios")

const bot = new Telegraf("1140311147:AAH-CmKM4rRzKYSD0BQwdsTTpxtQheju5U0")
bot.start((ctx) => ctx.reply("Welcome"))
bot.help((ctx) => ctx.reply("Send me a stickersss"))
bot.on("sticker", (ctx) => ctx.reply("👍"))
bot.hears(/corona/gi, (ctx) => {
  axios.get("https://covid19.mathdro.id/api/countries/idn").then((res) => {
    const { confirmed, recovered, deaths } = res.data
    ctx.reply(
      `Hari ini yang teridentikasi terkena corona sejumlah ${confirmed.value}, yang sembuh ada sekitar ${recovered.value} dan yang meninggal sejumlah ${deaths.value}`
    )
  })
})

bot.hears(/hi bitch/gi, async (ctx) => {
  console.log(ctx.get)
  ctx.reply(`Hello @${ctx.message.from.username}`, {
    reply_to_message_id: ctx.message.message_id,
  })
})

bot.launch()

module.exports = bot
