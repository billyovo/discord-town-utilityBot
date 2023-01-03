const CronJob = require('cron').CronJob;
const { bot } = require("../discord/init.js");
const { DateTime } = require("luxon");

  const newLife = new CronJob('1 0 * * *', function() {
	let now = DateTime.now().setZone("Asia/Taipei").endOf("day");
	let arrival_date = DateTime.now().setZone("Asia/Taipei").startOf("day").set({day: 24, month: 4, year: 2022});


	let diff = now.diff(arrival_date,'days').toObject();

	bot.channels.fetch('728613506202599474',true,false)
	.then((channel)=> {
		
		if(diff == 0){
			channel.send("@everyone 小妹有錢人生活"+Math.round(diff.years)+"周年 **POSITIVE**");
		}
		else{
			channel.send("@everyone 小妹有錢人生活第"+Math.round(diff.days)+"天 **POSITIVE**");
		}
		
	} )
	.catch((error)=>{console.error(error)})
	

  }, null, true, 'Asia/Taipei');

newLife.start();
