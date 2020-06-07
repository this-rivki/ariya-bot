const Markup = require('telegraf/markup')
const axios = require('axios')
const K2C = require('kelvin-to-celsius')
const API_KEY = process.env.WEATHER_API
const API_URL = (location) =>
  `https://api.openweathermap.org/data/2.5/find?q=${location}&appid=${API_KEY}&lang=id`

module.exports = (bot) => {
  bot.command('/cuaca', (ctx) => {
    const city = ctx.message.text
      .replace(/\/cuaca.*bot|\/cuaca/gi, '')
      .replace(/\s/g, '')
    console.log(city)
    if (!city) return ctx.reply('kota mana begoo?!? bego banget dah!!')

    axios.get(API_URL(city)).then((res) => {
      const locationData = res.data.list[0]
      ctx.reply(
        `
Nihh, info dari bitch ya, gue ramal di *${city} itu ${
          locationData.weather[0].description
        }*.
untuk suhunya sendiri yang *paling rendah itu ${K2C(
          locationData.main.temp_min
        )}°C* terus *maksimalnya ${K2C(locationData.main.temp_max)}°C*.
terus-terus *kecepatan anginnya ${locationData.wind.speed} m/s*
			`,
        { parse_mode: 'Markdown' }
      )
    })
  })
}
