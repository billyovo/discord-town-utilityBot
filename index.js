const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const config = require('./config.json');
require('dotenv').config();
const fetch = require("node-fetch");
var CronJob = require('cron').CronJob;

var keepAwake = new CronJob('*/5 * * * *', function() {
	fetch("https://discord-bosslist-bot.herokuapp.com/",{method: "HEAD"})
	.then(response => {
		console.log(response.status);
		console.log("Siumui is here");
	});
  }, null, true, 'Asia/Taipei');

keepAwake.start();

const client = new CommandoClient({
	commandPrefix: config.prefix,
	owner: config.owner,
});

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['game', 'game group?'],
	])
	.registerDefaultGroups()
	.registerDefaultCommands({
        help: false, 
        prefix: false, 
        ping: false,
        _eval: false,
        unknownCommand: false, 
        commandState: true
    })
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
    console.log('Logged in');
});

client.login(process.env.TOKEN);