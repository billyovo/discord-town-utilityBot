const CronJob = require('cron').CronJob;
const { bot } = require("../discord/init.js");
const { DateTime } = require("luxon");

function returnDiff(now){
	const arrival_date = DateTime.now().setZone("Asia/Taipei").startOf("day").set({day: 24, month: 4, year: 2022});
	
    if(now.ordinal === arrival_date.ordinal){
        const diff = now.diff(arrival_date,'years').toObject();
        return Math.round(diff.years)+"周年";
    }
    else{
        const diff = now.diff(arrival_date,'days').toObject();
        return "第"+Math.round(diff.days)+"天";
    }
   
}
const newLife = new CronJob('1 0 * * *', function() {
	const now = DateTime.now().setZone("Asia/Taipei").endOf("day");

	bot.channels.fetch('728613506202599474',true,false)
	.then((channel)=> {
		channel.send("@everyone 小妹有錢人生活"+returnDiff(now)+" **POSITIVE**");
	} )
	.catch((error)=>{console.error(error)})
	

  }, null, true, 'Asia/Taipei');

newLife.start();