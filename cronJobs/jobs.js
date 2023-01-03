const CronJob = require('cron').CronJob;
const { bot } = require("../discord/init.js");
const { DateTime } = require("luxon");

const bday = new CronJob('1 0 * * *', function () {
	let now = DateTime.now().setZone("Asia/Taipei").endOf("day");
	let birthday = DateTime.now().startOf("day").set({ day: 24, month: 4 });

	if (birthday > now && birthday.ordinal !== now.ordinal) {
		birthday.minus({ year: 1 });
	}

	let diff = now.diff(birthday.minus({ year: 1 }), 'days').toObject();
	diff = Math.round(diff.days);
	let diff_year = now.diff(birthday, 'years').toObject();
	diff_year = Math.round(diff_year.years);
	bot.channels.fetch('728613506202599474', true, false)
		.then((channel) => {

			if (diff == 0) {
				channel.send("@everyone 小妹有錢人生活" + diff_year + "周年 **POSITIVE**");
			}
			else {
				channel.send("@everyone 小妹有錢人生活第" + diff + "天 **POSITIVE**");
			}

		})
		.catch((error) => { console.error(error) })

}, null, true, 'Asia/Taipei');

bday.start();
