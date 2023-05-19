
const {Client, GatewayIntentBits} = require('discord.js');
const bot = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages]});
bot.login(process.env.TOKEN);

bot.on('ready', async () => {
    console.log("Connected to Discord as: "+bot.user.username+bot.user.tag);
})

module.exports = {
    bot: bot
}