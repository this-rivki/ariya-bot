const { humanizeTimestamp, day } = require('../utils/date')
const HolidaysData = require('./data/holiday')

const config = {
  parse_mode: 'Markdown',
}

const getCurrentMonth = (today) => {
  return today.getMonth() + 1
}

const getHolidaysMonth = (currentMonth, currentYear, type = 'normal') => {
  const datesObj = HolidaysData.filter((data) => {
    const date = new Date(data.date)
    let compareMonth
    if (type === 'normal') {
      compareMonth =
        date.getMonth() + 1 === currentMonth &&
        date.getFullYear() === currentYear
    } else if (type === 'thisyear') {
      compareMonth = date.getFullYear() === currentYear
    } else if (type === 'nextyear') {
      compareMonth = date.getFullYear() === currentYear + 1
    } else {
      compareMonth =
        date.getMonth() + 1 <= currentMonth + 2 &&
        date.getMonth() + 1 >= currentMonth &&
        date.getFullYear() === currentYear
    }
    return compareMonth
  })

  return type !== 'thisyear' && type !== 'nextyear'
    ? datesObj.sort(
        (x, y) => new Date(x.date).getTime() - new Date(y.date).getTime()
      )
    : datesObj
}

const copyWriteCurrentMonth = (holidays, type = 'normal') => {
  let currentMonth = 0
  return holidays
    .map((holiday) => {
      const holidate = new Date(holiday.date)
      let monthName = ''
      if (currentMonth !== holidate.getMonth()) {
        currentMonth = holidate.getMonth()
        const separator =
          type !== 'normal' ? '-----------------------------\n' : ''
        monthName = separator + humanizeTimestamp(holidate, '%month%') + '\n'
      } else {
        monthName = ''
      }
      return `*${monthName}${humanizeTimestamp(
        holidate,
        '%day%, %dd%-%month%-%yyyy%'
      )}*\n${holiday.name}\n`
    })
    .join('\n')
}

module.exports = (bot) => {
  bot.command('hari_libur_bulan_ini', (ctx) => {
    const todayDate = new Date()
    const holidayObj = getHolidaysMonth(
      getCurrentMonth(todayDate),
      todayDate.getFullYear()
    )
    const copyWrites = copyWriteCurrentMonth(holidayObj)

    ctx.reply(
      `Ini hasil penerawangan menurut aku ya bitch!!\n\n${copyWrites}`,
      config
    )
  })

  bot.command('hari_libur_3_bulan_kedepan', (ctx) => {
    const todayDate = new Date()
    const holidayObj = getHolidaysMonth(
      getCurrentMonth(todayDate),
      todayDate.getFullYear(),
      '3months'
    )
    const copyWrites = copyWriteCurrentMonth(holidayObj, '3month')

    ctx.reply(
      `Ini hasil penerawangan untuk 3 bulan kedepan menurut aku ya bitch!!\n\n${copyWrites}`,
      config
    )
  })

  bot.command('hari_libur_tahun_ini', (ctx) => {
    const todayDate = new Date()
    const holidayObj = getHolidaysMonth(
      getCurrentMonth(todayDate),
      todayDate.getFullYear(),
      'thisyear'
    )
    const copyWrites = copyWriteCurrentMonth(holidayObj, '3month')
    ctx.reply(
      `Ini hasil penerawangan untuk 1 tahun ini menurut aku ya bitch!!\n\n${copyWrites}`,
      config
    )
  })

  bot.command('hari_libur_tahun_depan', (ctx) => {
    const todayDate = new Date()
    const holidayObj = getHolidaysMonth(
      getCurrentMonth(todayDate),
      todayDate.getFullYear(),
      'nextyear'
    )
    const copyWrites = copyWriteCurrentMonth(holidayObj, '3month')

    ctx.reply(
      `Ini hasil penerawangan untuk 1 tahun kedepan menurut aku ya bitch!!\n\n${copyWrites}`,
      config
    )
  })
}
