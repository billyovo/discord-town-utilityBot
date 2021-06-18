const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fetch = require("node-fetch");

module.exports = class connect extends Command{
	constructor(client) {
		super(client, {
			name: 'town',
			group: 'minecraft',
			memberName: 'town',
			description: 'get town info',
		});
	}

run(message) {
    fetch('https://towns.letsdream.today/api/v1/guilds',{method: "GET"})
	  .then(response => {
      return response.json();
    })
  .then(data => {
      data.records.forEach((guild)=>{
        if(guild.name === '非洲渡喧'){
          let date = new Date(guild.creationDate);
         const embed = new Discord.MessageEmbed()
         .setColor('#d2691e')
         .setURL('https://towns.letsdream.today/')
         .setTitle('非洲渡喧')
         .setThumbnail(message.guild.iconURL())
         .addFields(
		{ name: '等級', value: guild.level, inline:true },
		{ name: '城鎮幣', value: guild.balance, inline:true },
		 
           { name: '創建日期', value: date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()}
           )
         message.channel.send(embed);
        }
      })
  })
  .catch(error => {message.channel.send(error.message)});
	};
}
