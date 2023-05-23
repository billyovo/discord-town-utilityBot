const axios = require('axios');
const client = axios.create({
    validateStatus: function (status) {
        return status < 500; 
    }
})

function splitString(str, limit = 2000, delimiter = "\n"){    
    if(str.length <= limit){
        return [str];
    }
    const result = [];
    const words = str.split(delimiter);
    let currentString = "";
    for(let i = 0;i<words.length;i++){
        if(currentString.length + words[i].length < limit){
            currentString += words[i] + delimiter;
        }else{
            result.push(currentString);
            currentString = words[i] + delimiter;
        }
    }
    result.push(currentString);
    return result;
}
module.exports = {

    run: async function(bot, interaction){
        const prompt = interaction.options.get("prompt")?.value ?? "Are you here? What's your name?";
       
        const body = {
            "model": "gpt-4-32k",
            "messages": [{
                "role": "user",
                "content": prompt
            }]
        }
        const headers = {
            "Cache-Control": "no-cache, must-revalidate",
            "Content-Type": "application/json",
            "api-key": process.env.GPT_KEY
        }
        await interaction.deferReply();

        client.post(process.env.GPT_LINK, body, {headers: headers})
        .then((response) => {
            if(response.status === 429){
                interaction.editReply({content: `${response.data.error.message}`});
                return;
            }
            console.log(response.data)
            const result = splitString(response.data.choices[0].message.content);
            
          interaction.editReply({content: `Q: ${prompt}\r\n\r\n`});
          for(let i = 0;i<result.length;i++){
            interaction.channel.send(result[i]);
          }
          
        }
        )
        .catch((error) => {
            console.log(error);
            interaction.editReply({content: `${error.message}`});
            }
        );
    }
}