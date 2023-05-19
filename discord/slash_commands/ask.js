const axios = require('axios').default;

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

        axios.post(process.env.GPT_LINK, body, {headers: headers})
        .then((response) => response.json())
        .then((data) => {
            interaction.editReply({content: data.choices[0].message.content});
        }
        )
        .catch((error) => {
            console.log(error);
            interaction.editReply({content:"Sorry, I couldn't get a response from the API\r\n"+error.message});
            }
        );
    }
}