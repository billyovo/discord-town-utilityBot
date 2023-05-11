const fs = require("fs");
const path = require('path');

const {Client, Intents} = require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
bot.login(process.env.TOKEN);

bot.on('ready', async () => {
    console.log("Connected to Discord as: "+bot.user.username+bot.user.tag);
})


//this Event reader need to runing with the bot is on
const eventsPath = path.join(__dirname, 'Events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        bot.once(event.name, (...args) => event.execute(...args));
    } else {
        bot.on(event.name, (...args) => event.execute(...args));
    }
}



module.exports = {
    bot: bot
}