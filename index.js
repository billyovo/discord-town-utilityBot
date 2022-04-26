const path = require('path');
const fetch = require("node-fetch");
require('dotenv').config();
require("./cronJobs/jobs.js");
const Discord = require('discord.js')
const {bot} = require("./discord/init.js");
const fs = require("fs");
const config = require("./config.json");
const prefix = config.prefix;

function loadCommands(){
    bot.commands = new Discord.Collection();
    const dirPath = path.resolve(__dirname, './discord/commands');
    const commands = fs.readdirSync(dirPath).filter(file => file.endsWith(".js"));
    for (const file of commands) {
        const commandName = file.split(".")[0];
        const command = require(dirPath+`/${file}`);
      
        bot.commands.set(commandName, command);
        console.log("Loaded command: "+commandName);
    }

    const slashDirPath = path.resolve(__dirname, './discord/slash_commands');
    const slashCommands = fs.readdirSync(slashDirPath).filter(file => file.endsWith(".js"));
    for (const file of slashCommands) {
        const commandName = file.split(".")[0];
        const command = require(slashDirPath+`/${file}`);
      
        bot.commands.set(commandName, command);
        console.log("Loaded slash command: "+commandName);
    }
}

loadCommands();

bot.on('messageCreate',async (msg) => {
    if(!msg.content.startsWith(prefix)){return;}
    if(msg.member && !msg.member.permissions.has(Permissions.FLAGS.MANAGE_WEBHOOKS)){return;}
    let params = msg.content.substring(1).split(' ');
    const commandName = params.shift(); 
    bot.commands.get(commandName)?.run(bot,msg,params);
})

bot.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
	const { commandName } = interaction;
    bot.commands.get(commandName)?.run(bot,interaction);   
});

