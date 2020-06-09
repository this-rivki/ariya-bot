const axios = require('axios')
const LIST_CITIES = require('./data/salah-city')
const stickers = require('../stickers')
const { humanizeTimestamp } = require('../utils/date')

const API_URL = 'https://api.banghasan.com/'
const getSholatApiURL = (cityId, date) =>
  `${API_URL}/sholat/format/json/jadwal/kota/${cityId}/tanggal/${date}`

const getCityId = (ctx) => (city, idx) =>
  ctx.toLowerCase() === city.nama.toLowerCase()

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
    ctx.replyWithSticker(stickers['assalamualaikum'].id)
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
}
