const CronJob = require('cron').CronJob;
const { bot } = require("../discord/init.js");
const { DateTime } = require("luxon");

let arrival_date = DateTime.now().setZone("Asia/Taipei").startOf("day").set({day: 24, month: 4, year: 2022});

function returnDiff(now){
    if(now.ordinal === arrival_date.ordinal){
        const diff = now.diff(arrival_date,'years').toObject();
        return Math.round(diff.years);
    }
    else{
        const diff = now.diff(arrival_date,'days').toObject();
        return Math.round(diff.days);
    }
    
}
  const newLife = new CronJob('1 0 * * *', function() {
	let now = DateTime.now().setZone("Asia/Taipei").endOf("day");
	
	let diff = returnDiff(now);

	bot.channels.fetch('728613506202599474',true,false)
	.then((channel)=> {
		
		if(now.ordinal === diff.ordinal){
			channel.send("@everyone 小妹有錢人生活"+diff+"周年 **POSITIVE**");
		}
		else{
			channel.send("@everyone 小妹有錢人生活第"+diff+"天 **POSITIVE**");
		}
		
	} )
	.catch((error)=>{console.error(error)})
	

  }, null, true, 'Asia/Taipei');

newLife.start();
