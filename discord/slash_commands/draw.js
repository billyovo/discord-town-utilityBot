const axios = require('axios');
const client = axios.create({
    validateStatus: function (status) {
        return status < 500; 
    }
})

module.exports = {

    run: async function(bot, interaction){
        const prompt = interaction.options.get("prompt")?.value ?? "A fish on a plate";
       
        const headers = {
            "Cache-Control": "no-cache, must-revalidate",
            "Content-Type": "application/json",
            "api-key": process.env.DRAW_KEY
        }
        const body = {
            "caption": prompt,
            "resolution": "1024x1024"
        }
        await interaction.deferReply();

        try{
            
            const jobID = await client.post(`${process.env.DRAW_LINK}${process.env.DRAW_API_VERSION}`, body, {headers: headers});
            if(jobID.status !== 200){
                return await interaction.editReply({content: `${jobID.data.message}`});
            }
            console.log(jobID.data)

            
            const polling = setInterval(async ()=>{
                const url = await client.get(`${process.env.DRAW_LINK}/operations/${jobID.data.id}${process.env.DRAW_API_VERSION}`, {headers: headers});
                console.log(url.data)
                if(url.data.status === "Succeeded"){
                    clearInterval(polling);
                    await interaction.editReply({content: url.data.result.contentUrl});
                }
                if(url.response.status !== 200){
                    throw new Error("Something is wrong when getting the job ID :(");
                }

                //get link as image buffer
                const image = await client.get(url.data.result.contentUrl, {responseType: 'arraybuffer'});

                if(image.status !== 200){
                    throw new Error("Something is wrong when getting the image :(");
                }
                await interaction.editReply({files: [image.data]}); 
                clearInterval(polling);
            },2500)
                       
        }
        catch(error){
            console.log(error);
            await interaction.editReply(error.message);
        }
    }
}