const path = require('path');
require('dotenv').config();
require("./cronJobs/jobs.js");
const Discord = require('discord.js')
const {bot} = require("./discord/init.js");
const fs = require("fs");


function setCommand(commandName, command){
    bot.commands.set(commandName, command);
    console.log("Loaded command: "+commandName);
}

function readCommands(directory, subDirectory = ""){
    
    const dirPath = path.resolve(__dirname, directory);
    const commands = fs.readdirSync(dirPath);

    for(const file of commands){
        const commandName = file.split(".");
        if(commandName[1]){
            const command = require(dirPath+`/${file}`);

            setCommand((subDirectory ? subDirectory+"-" : subDirectory) +commandName[0], command);
        }
        else{
            return readCommands(directory+"/"+commandName[0], commandName[0]);
        }
    }
}

    bot.commands = new Discord.Collection()
    readCommands('./discord/slash_commands');

bot.on('messageCreate', async (msg) => {
    if(!msg.content.startsWith(prefix)){return;}
    const params = msg.content.substring(1).split(' ');
    const commandName = params.shift(); 
    bot.commands.get(commandName)?.run(bot,msg,params);
})

bot.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
	const { commandName } = interaction;
    const subCommand = interaction.options.getSubcommand(false);
    bot.commands.get(subCommand ? `${commandName}-${subCommand}` : commandName)?.run(bot,interaction);   
});

