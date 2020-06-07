const axios = require('axios')
const API_KEY = process.env.NEWS_API_KEY
const API_URL = `https://newsapi.org/v2/top-headlines?country=id&apiKey=${API_KEY}&limit=1`

module.exports = (bot) => {
  const fetchNewsAndSend = (ctx) => {
    axios.get(API_URL).then((res) => {
      const news = res.data
      const message = news.articles.reduce(
        (prev, nextVal) =>
          `${prev}\n\n- [${nextVal.title}](${nextVal.url}) (${nextVal.source.name})`,
        'Gue kasih info nih semoga bermanfaat.\n'
      )
      ctx.reply(message, { parse_mode: 'Markdown' })
    })
  }

  bot.command('/berita', (ctx) => {
    fetchNewsAndSend(ctx)
  })

  bot.hears(
    /berita.*hari ini|berita.*sih|berita.*dong|info.*sih|berita.*today|berita.*tudey/,
    (ctx) => {
      fetchNewsAndSend(ctx)
    }
  )
}
