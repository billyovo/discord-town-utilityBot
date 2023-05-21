const axios = require('axios');
const client = axios.create({
    validateStatus: function (status) {
        return status < 500; 
    }
})

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
            console.log(response)
            const result = response.data.choices[0].message.content.match(/.{1,2000}/g) ?? [];
            interaction.editReply({content: result[0]});
            for(let i = 1;i<result.length;i++){
                if (!result[i]){
                    interaction.channel.send({content: result[i]});
                }
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