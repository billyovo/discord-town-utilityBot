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

// function readCommands(directory, subDirectory = ""){
    
//     const dirPath = path.resolve(__dirname, directory);
//     const commands = fs.readdirSync(dirPath);

//     for(const file of commands){
//         const commandName = file.split(".");
//         if(commandName[1]){
//             const command = require(dirPath+`/${file}`);

//             setCommand((subDirectory ? subDirectory+"-" : subDirectory) +commandName[0], command);
//         }
//         else{
//             return readCommands(directory+"/"+commandName[0], commandName[0]);
//         }
//     }
// }

// i call chatgpt to fix this
function readCommands(directory, subDirectory = "") {
    const dirPath = path.resolve(__dirname, directory);
    const commands = fs.readdirSync(dirPath);
  
    for (const file of commands) {
      const filePath = path.join(dirPath, file);
      if (fs.statSync(filePath).isDirectory()) {
        // Subdirectory - recursively read commands in the subdirectory
        const subDir = subDirectory ? subDirectory + "-" : "";
        readCommands(path.join(directory, file), subDir + file);
      } else {
        // Regular command file
        const commandName = file.split(".")[0];
        const command = require(filePath);
        const fullCommandName = subDirectory
          ? `${subDirectory}-${commandName}`
          : commandName;
        setCommand(fullCommandName, command);
      }
    }
}

bot.commands = new Discord.Collection()
readCommands('./discord/slash_commands');

bot.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
	const { commandName } = interaction;
    const subCommand = interaction.options.getSubcommand(false);
    bot.commands.get(subCommand ? `${commandName}-${subCommand}` : commandName)?.run(bot,interaction);   
});


