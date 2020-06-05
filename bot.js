const { Telegraf } = require('telegraf')
const axios = require('axios')
const fs = require('fs')

const stickers = require('./stickers')

// const bot = new Telegraf('1140311147:AAH-CmKM4rRzKYSD0BQwdsTTpxtQheju5U0') // PROD
const bot = new Telegraf('1111657351:AAHHgnVZdsLi-IpHY60SeNcZJVonJpLRIaI') // DEV
bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a stickersss'))
bot.on('sticker', (ctx) => {
  const uniqueId = ctx.message.sticker.file_unique_id
  if (uniqueId === stickers['assalamualaikum'].uniqueId) {
    ctx.replyWithSticker(stickers['waalaikumsalam'].id)
  }
})

bot.hears(/sticker/gi, (ctx) =>
  ctx.replyWithSticker(
    'CAACAgIAAx0CSf7kgwACClpe2KTuE-x7MK-dXllhpwyZNKXucQAConcBAAFji0YMmP33swABVmfRGgQ'
  )
)
bot.hears(/corona/gi, (ctx) => {
  axios.get('https://covid19.mathdro.id/api/countries/idn').then((res) => {
    const { confirmed, recovered, deaths } = res.data
    ctx.reply(
      `Hari ini yang teridentikasi terkena corona sejumlah *${confirmed.value}*, yang sembuh ada sekitar *${recovered.value}* dan yang meninggal sejumlah *${deaths.value}* `,
      { parse_mode: 'MarkdownV2' }
    )
  })
})

bot.hears(/hi ariya/gi, (ctx) => {
  ctx.reply(`hi @${ctx.message.from.username} bitch!!`, {
    reply_to_message_id: ctx.message.message_id,
  })
})

bot.hears(/hi bitch/gi, async (ctx) => {
  console.log(ctx.get)
  ctx.reply(`Hello @${ctx.message.from.username}`, {
    reply_to_message_id: ctx.message.message_id,
  })
})

bot.hears(/itungin/gi, (ctx) => {
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

bot.hears(/hi/gi, (ctx) => {
  console.log(ctx.chat)
  ctx.reply('hi')
})

require('./schedule')(bot)

module.exports = bot
