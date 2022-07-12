
const {Client, Intents} = require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
bot.login(process.env.TOKEN);

bot.on('ready', async () => {
    console.log("Connected to Discord as: "+bot.user.username+bot.user.tag);
})

module.exports = {
    bot: bot
}