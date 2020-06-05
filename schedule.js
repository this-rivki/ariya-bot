const groupIds = require('./group-id')

const groupId =
  process.env.NODE_ENV === 'DEV'
    ? groupIds['mikqi-and-bot']
    : groupIds['anak-bawang-cabang-tele']

module.exports = (bot) => {
  const CronJob = require('cron').CronJob

  // CAT BUT BUTT
  const WeekendCatButBut = new CronJob(
    '* 0 19 * * 6',
    function () {
      bot.telegram.sendMessage(groupId, `Cat but butt 🍑 guys!!`)
    },
    null,
    true,
    'Asia/Jakarta'
  )
  WeekendCatButBut.start()

  const MissYou1 = new CronJob(
    '* 0 7 * * *',
    function () {
      bot.telegram.sendMessage(groupId, `I miss you guys 😭`)
    },
    null,
    true,
    'Asia/Jakarta'
  )
  MissYou1.start()

  const MissYou2 = new CronJob(
    '* 0 20 * * *',
    function () {
      bot.telegram.sendMessage(groupId, `I miss you guys 😭`)
    },
    null,
    true,
    'Asia/Jakarta'
  )
  MissYou2.start()
}
