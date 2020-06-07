const { Telegraf } = require('telegraf')
const axios = require('axios')
const groupIds = require('./group-id')

// 1047378

const groupId =
  process.env.NODE_ENV === 'DEV'
    ? groupIds['mikqi-and-bot']
    : groupIds['anak-bawang-cabang-tele']

const stickers = require('./stickers')

const bot = new Telegraf(process.env.BOT_TOKEN)

require('./schedule')(bot)
require('./command/weather')(bot)
require('./command/news')(bot)

const getRandomNumber = (arr) => Math.floor(Math.random() * arr.length)

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

bot.hears(/bitch/gi, async (ctx) => {
  console.log(ctx.chat)
  const username = ctx.message.from.username || ctx.message.from.first_name
  const answers = [
    `yes @${username}!!`,
    'bitch adalah gw!! 😎',
    `kenapa panggil-panggil @${username}`,
    'bitch is me!!',
    'fucek!',
    'bego',
    'apaan sih lo panggil-panggil gw?',
    'apaan sih lo? kangen ya panggil-panggil? 😎',
    'gaje lu..',
  ]
  ctx.reply(answers[getRandomNumber(answers)], {
    reply_to_message_id: ctx.message.message_id,
  })
})

bot.hears(/canda|lucu|cute|cnd/gi, (ctx) => {
  console.log(ctx.chat)
  ctx.replyWithDocument(stickers['rollingEyes'].id)
})

bot.hears(/rame.*belum|sepi.*sih/, (ctx) => {
  const answers = [
    'belum nihh',
    'gak tau pada kemana orang-orang',
    'belum nih, belum rame.',
  ]
  ctx.reply(answers[getRandomNumber(answers)], {
    parse_mode: 'Markdown',
  })
})

bot.hears(/itungin/gi, (ctx) => {
  console.log(ctx.chat)
  const text = ctx.message.text
  const isMultiple =
    ['*', 'x', 'kali'].filter((x) => text.indexOf(x) >= 0).length >= 1
  const isAdd =
    ['tambah', '+', 'plus'].filter((x) => text.indexOf(x) >= 0).length >= 1
  const isDiv =
    ['bagi', ':', '/'].filter((x) => text.indexOf(x) >= 0).length >= 1
  const isSub =
    ['kurang', '-', 'min'].filter((x) => text.indexOf(x) >= 0).length >= 1
  const splitText = text.split(' ')
  const arrNumber = splitText.filter(Number).map(Number)

  let result = 0
  if (isMultiple) {
    result = arrNumber.reduce((prev, next) => prev * next, 1)
  }
  if (isAdd) {
    result = arrNumber.reduce((prev, next) => prev + next, 0)
  }
  if (isDiv) {
    result = arrNumber.reduce(
      (prev, next, idx) => (idx ? prev / next : next),
      1
    )
  }
  if (isSub) {
    result = arrNumber.reduce((prev, next) => prev - next, 0)
  }
  ctx.reply(`hasilnya adalah ${result}`)
})

bot.hears(/bego|gak sekolah/gi, (ctx) => {
  const username = ctx.message.from.username || ctx.message.from.first_name
  const answers = [
    'ya maaf. 😭',
    'gw emang bego. 😭',
    'makanya ajarin gw biar gak bego. 😎',
    'sekali-kali, biar gak pinter mulu',
    'kapan sih gw pinter?? 🤔',
    'siapa duluuu...',
    'lah emang..',
    'baru tau??',
    `kemana saja anda @${username}??`,
  ]
  ctx.reply(answers[getRandomNumber(answers)], {
    parse_mode: 'Markdown',
  })
})

bot.hears(/mput/gi, (ctx) => {
  console.log(ctx.chat)
  ctx.reply('[Sini liat portfolio mput aja bitch!!!](https://ariya.design)', {
    parse_mode: 'Markdown',
  })
})

bot.command('kirim', (ctx) => {
  ctx.telegram.sendMessage(groupId, ctx.message.text.replace('/kirim ', ''))
})

bot.launch()

module.exports = bot
