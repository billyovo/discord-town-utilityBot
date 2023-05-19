const axios = require('axios');
require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
// add AppID and guildID(Sever ID) into the .env file
// don't ask me why use guild maybe she is in somewhere so i use guild mode and why guildID but not serverID because... i don't know
// Copilot also don't know it suggest me to write i don't know
const apiurl = `https://discord.com/api/v10/applications/${process.env.AppID}/guilds/${process.env.guildId}/commands`;
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

