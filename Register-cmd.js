const axios = require('axios');
require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const apiurl = `https://discord.com/api/v10/applications/${process.env.clientID}/guilds/${process.env.guildId}/commands`;
const commandsPath = path.join(__dirname, 'slash_commands_json');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.json'));

const delopy = (async (command) => {
    try {
        let data = JSON.stringify(command);
        let config = {
            url: apiurl,
            method: 'post',
            headers: {
                Authorization: 'Bot ' + process.env.token,
                'Content-Type': 'application/json'
            },
            data: data
        }
        const response = await axios(config);
        console.log(response.data);
    } catch (err) {
        console.log(err);
    }
})


for (const file of commandFiles){
    const command = require(`./slash_commands_json/${file}`);
    delopy(command);
}

