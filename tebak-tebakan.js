const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')

const getRandomNumber = (arr) => Math.floor(Math.random() * arr.length)
const getName = (user) => `@${user.username}` || user.first_name

const wrongAnswers = [
  `yak yak yakkkkk jawabannya salah`,
  `mikirrr atuh`,
  `ngaco dahhh`,
  `ngarang banget sihh`,
  `ngotak donggg`,
  'SALAHHHHH',
  'SALAHHHH',
  'SALAHHH',
  'SALAHH',
  'SALAH',
  '❌',
  'bodooo amatttt.',
  'bisa mikir gak sih?',
  'nyampe gak otaknya?',
  'udahan ajalah sana',
  'niat main gak sih?',
  'itu jawaban apa lobang pantat? kok kasar',
  'he?',
  'yakinnn?',
  'next',
  'NEXT!',
  'hmmm',
  'gpp',
  'g',
]

const rightAnswer = [
  'wuihhhhhh.. bener sekalii',
  'mantappp pancinggg!!',
  'ini baru benerrrr',
  'gelaaa sihhh. jawabannya sakti',
  'manjiw. mantap jiwa',
  'wahhh ada orang pintar ternyata.',
  'ini gak cari contekkan kan? kok bisa bener?',
  'gak ahh. gak percaya kalo bener',
  'apakah gue mimpi? kok jawabnnya bener?',
  'bener nihhh?? iyaa beneeerrrr',
  'brrrrrrrrr beneeeeerrrrr',
]

const alreadyGiveUp = [
  'udah nyerah ngapain jawab sih? niat nyerah gak sih??',
  'udah deh diem aja...',
  'yang cupu diem aja deh',
  'kaya ada yang bales?',
  'IGNORE THIS',
  'GAK PEDULI',
]

module.exports = (bot) => {
  // Handler factoriess
  const { enter, leave } = Stage

  // Greeter scene
  const quizes = require('./quizes.json')
  let selectedQuiz = {
    question: '',
    answer: '',
    fullAnswer: '',
  }
  let giveUpMember = []

  const quiz = new Scene('quiz')
  quiz.enter((ctx) => {
    giveUpMember = []
    selectedQuiz = quizes[getRandomNumber(quizes)]
    ctx.reply(selectedQuiz.question)
  })
  quiz.hears(/nyerah/gi, async (ctx) => {
    const newGiveUp = ctx.from
    const isExist =
      giveUpMember.filter((member) => member.id === newGiveUp.id).length > 0

    if (!isExist) {
      await ctx.reply(`${newGiveUp.first_name} cupu ahhh~`)
      giveUpMember.push(newGiveUp)
    } else {
      await ctx.reply(`${newGiveUp.first_name} iyeee udah tau~`)
    }

    if (giveUpMember.length >= 3) {
      await ctx.reply(`Jawabannya ituuuuuu....`)
      await ctx.reply(
        `.............................................................................`
      )
      await ctx.reply(`Mau tauuu???`)

      setTimeout(() => {
        ctx.reply(`Jawabannya itu, ${selectedQuiz.fullAnswer}`)
        ctx.reply('cupu klean. cuihhh..')
      }, 3000)

      ctx.scene.leave('quiz')
    }
  })

  quiz.command('lagi', enter('quiz'))

  quiz.on('message', async (ctx) => {
    const isExist =
      giveUpMember.filter((member) => member.id === ctx.from.id).length > 0

    if (isExist) {
      ctx.reply(alreadyGiveUp[getRandomNumber(alreadyGiveUp)], {
        reply_to_message_id: ctx.message.message_id,
      })
      return
    }
    const response = ctx.message.text

    const isTrue =
      response.toLowerCase().indexOf(selectedQuiz.answer.toLowerCase()) >= 0

    if (isTrue) {
      await ctx.reply(rightAnswer[getRandomNumber(rightAnswer)], {
        reply_to_message_id: ctx.message.message_id,
      })

      await ctx.reply(`Jawabannya itu, ${selectedQuiz.fullAnswer}`)
      await ctx.reply(`Lagi gak?? /lagi`)
    } else {
      ctx.reply(wrongAnswers[getRandomNumber(wrongAnswers)], {
        reply_to_message_id: ctx.message.message_id,
      })
    }
  })

  const stage = new Stage([quiz], { ttl: 120 })
  bot.use(session())
  bot.use(stage.middleware())
  bot.command('quiz', (ctx) => ctx.scene.enter('quiz'))
}
