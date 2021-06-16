const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const config = require('./config.json');
const fetch = require("node-fetch");
var CronJob = require('cron').CronJob;
require('dotenv').config();
var { DateTime } = require('luxon');

const owner = config.owner;
const prefix = config.prefix;
const keepAwakeEndpoint = config.keepAwakeEndpoint;

var keepAwake = new CronJob('*/25 * * * *', function() {
	fetch(keepAwakeEndpoint,{method: "HEAD"})
	.then(response => {
		console.log("bossBot's status: "+response.status+" "+response.statusText);
	});
  }, null, true, 'Asia/Taipei');

  var bday = new CronJob('*/1 * * * *', function() {
	const locales = ["零","一","二","三","四","五","六","七","八","九"];
	let now = DateTime.now();
	let birthday = DateTime.fromISO("2021-01-02");
	let diff = now.diff(birthday,'days').toObject();
	diff = diff.days.toString();
	let channel = client.channels.fetch(728613506202599474,true,true);
	//let channel = client.channels.cache.get(728613506202599474);
	console.log(channel);
	let middle = diff == 0 ? "零" : locales[diff[1]]+"十";
	//channel.send("<@430842771847380997>, @everyone 小妹生日後第"+locales[diff[0]]+"百"+middle+locales[diff[2]]+"天後不快樂");
	console.log("<@430842771847380997>, @everyone 小妹生日後第"+locales[diff[0]]+"百"+middle+locales[diff[2]]+"天後不快樂");
  }, null, true, 'Asia/Taipei');

keepAwake.start();

const client = new CommandoClient({
	commandPrefix: prefix,
	owner: owner,
});

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['game', 'game group?'],
		['minecraft', 'minecraft town group'],
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
    console.log('Logged in as '+client.user.username);
});

client.login(process.env.TOKEN);
