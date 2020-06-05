const { Telegraf } = require('telegraf')
const axios = require('axios')
const fs = require('fs')

const stickers = require('./stickers')

const bot = new Telegraf(process.env.BOT_TOKEN)

require('./schedule')(bot)

bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a stickersss'))
bot.on('sticker', (ctx) => {
  console.log(ctx.chat)
  const uniqueId = ctx.message.sticker.file_unique_id
  if (uniqueId === stickers['assalamualaikum'].uniqueId) {
    ctx.replyWithSticker(stickers['waalaikumsalam'].id)
  }
})

bot.hears(/corona/gi, (ctx) => {
  console.log(ctx.chat)
  axios.get('https://covid19.mathdro.id/api/countries/idn').then((res) => {
    const { confirmed, recovered, deaths } = res.data
    ctx.reply(
      `Hari ini yang teridentikasi terkena corona sejumlah *${confirmed.value}*, yang sembuh ada sekitar *${recovered.value}* dan yang meninggal sejumlah *${deaths.value}* `,
      { parse_mode: 'MarkdownV2' }
    )
  })
})

bot.hears(/hi ariya/gi, (ctx) => {
  console.log(ctx.chat)
  ctx.reply(`hi @${ctx.message.from.username} bitch!!`, {
    reply_to_message_id: ctx.message.message_id,
  })
})

bot.hears(/hi bitch/gi, async (ctx) => {
  console.log(ctx.get)
  console.log(ctx.chat)
  ctx.reply(`Hello @${ctx.message.from.username}`, {
    reply_to_message_id: ctx.message.message_id,
  })
})

bot.hears(/canda|lucu|cute|cnd/gi, (ctx) => {
  console.log(ctx.chat)
  ctx.replyWithDocument(stickers['rollingEyes'].id)
})

bot.hears(/itungin/gi, (ctx) => {
  console.log(ctx.chat)
  const text = ctx.message.text
  const isMultiple =
    ['*', 'x', 'kali'].filter((x) => text.indexOf(x)).length > 1
  const splitText = text.split(' ')
  const arrNumber = splitText.filter(Number).map(Number)

  let result = 0
  if (isMultiple) {
    result = arrNumber.reduce((prev, next) => prev * next, 1)
  }
  ctx.reply(`hasilnya adalah ${result}`)
})

bot.hears(/mput/gi, (ctx) => {
  console.log(ctx.chat)
  ctx.reply('[Sini liat portfolio mput aja bitch!!!](https://ariya.design)', {
    parse_mode: 'Markdown',
  })
})

bot.launch()

module.exports = bot
