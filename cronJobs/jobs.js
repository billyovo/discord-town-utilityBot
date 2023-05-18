const CronJob = require('cron').CronJob;
const { bot } = require("../discord/init.js");
const { DateTime } = require("luxon");
const axios = require('axios');


const callhko = async () => {
    const config = {
        url: 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?',
        method: 'get',
        params: {
            dataType: 'fnd',
            lang: 'en'
        },
    };
    const response = await axios(config);
    return response;
}


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
	.catch((error)=>{console.error(error)});
	
}, null, true, 'Asia/Taipei');

const weather = new CronJob('0 8 * * *', async function() {
    try {
        const respone = await callhko();
        const rain = respone.data.weatherForecast[0].PSR;
        console.log(respone.data.weatherForecast[0].PSR)
        if (rain == "High" || rain == "Medium High"){
            bot.channels.fetch('728568561957732375',true,false)
            .then((channel)=> {
                channel.send("出門口記得帶遮!!!!!!!!!!");
            } )
            .catch((error)=>{console.error(error)});
        }
    } catch (error) {
        console.log(error);
    }


}, null, true, 'Asia/Taipei');


weather.start();
newLife.start();