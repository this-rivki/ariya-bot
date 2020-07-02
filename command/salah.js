const CronJob = require('cron').CronJob
const axios = require('axios')
const fs = require('fs')
const path = require('path')

const groupIds = require('../group-id')
const LIST_CITIES = require('./data/salah-city')
const stickers = require('../stickers')
const { humanizeTimestamp } = require('../utils/date')

const groupId =
  process.env.NODE_ENV === 'DEV'
    ? groupIds['mikqi-and-bot']
    : groupIds['anak-bawang-cabang-tele']

const API_URL = 'https://api.banghasan.com/'
const getSholatApiURL = (cityId, date) =>
  `${API_URL}/sholat/format/json/jadwal/kota/${cityId}/tanggal/${date}`

const getCityId = (ctx) => (city, idx) =>
  ctx.toLowerCase() === city.nama.toLowerCase()

const saveSholatTime = async () => {
  const cityId = '667' // Jakarta
  const today = humanizeTimestamp(Date.now(), '%yyyy%-%mm%-%dd%')

  const { data } = await axios.get(getSholatApiURL(cityId, today))
  const jadwal = data.jadwal.data
  fs.writeFile(
    path.resolve(__dirname, 'data/salah-today.json'),
    JSON.stringify(jadwal, null, 2),
    'utf8',
    (err) => {
      if (err) return console.log(err)

      console.log('file was saved')
    }
  )
}

module.exports = (bot) => {
  bot.command('jadwal_sholat', async (ctx) => {
    const city = ctx.message.text
      .replace(/\/jadwal_sholat.*bot|\/jadwal_sholat/gi, '')
      .replace(/\s/, '')

    const objectCity = LIST_CITIES.find(getCityId(city))
    const cityId = objectCity && objectCity['id']
    if (!cityId) return
    const today = humanizeTimestamp(Date.now(), '%yyyy%-%mm%-%dd%')

    const { data } = await axios.get(getSholatApiURL(cityId, today))
    const jadwal = data.jadwal.data
    await ctx.replyWithSticker(stickers['assalamualaikum'].id)
    ctx.reply(
      `
*Jadwal Sholat Untuk ${objectCity.nama}*
*${jadwal.tanggal}*

Subuh: ${jadwal.subuh}
Dzuhur: ${jadwal.dzuhur}
Ashar: ${jadwal.ashar}
Maghrib: ${jadwal.maghrib}
Isya: ${jadwal.isya}
		`,
      { parse_mode: 'Markdown' }
    )
  })

  // Jadwal Sholat

  bot.command('set_jadwal_sholat', (ctx) => {
    saveSholatTime()
    ctx.reply('Triggered')
    console.log(require('./data/salah-today.json'))
  })

  const setJadwalSholatToday = new CronJob(
    '0 0 3 * * *',
    function () {
      saveSholatTime()
    },
    null,
    true,
    'Asia/Jakarta'
  )
  setJadwalSholatToday.start()

  const checkJadwalSholat = new CronJob(
    '0 * * * * *',
    async function () {
      const jakartaTime = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Jakarta',
      })
      const currentTime = humanizeTimestamp(new Date(jakartaTime), '%hh%:%mi%')
      const jadwalSholat = require('./data/salah-today.json')
      console.log(currentTime)
      console.log(jadwalSholat)
      const waktuSholat = Object.keys(jadwalSholat).find((waktu) => {
        return jadwalSholat[waktu] === currentTime
      })
      console.log(waktuSholat)

      if (waktuSholat) {
        await bot.telegram.sendSticker(groupId, stickers['assalamualaikum'].id)
        await bot.telegram.sendMessage(
          groupId,
          `Udah jam ${jadwalSholat[waktuSholat]} waktunya untuk sholat ${waktuSholat} nih untuk wilayah Jakarta dan sekitarnya.`
        )
      }
    },
    null,
    true,
    'Asia/Jakarta'
  )

  checkJadwalSholat.start()

  const surahOfTheDay = new CronJob(
    '0 5 22 * * *',
    async function () {
      const { data } = await axios.get(`${API_URL}quran/format/json/acak`)

      await bot.telegram.sendSticker(groupId, stickers['assalamualaikum'].id)
      await bot.telegram.sendMessage(
        groupId,
        `
${data.acak.id.teks}

${data.surat.name} ${data.acak.id.ayat}:${data.surat.ayat}
	`
      )
    },
    null,
    true,
    'Asia/Jakarta'
  )

  surahOfTheDay.start()
}
