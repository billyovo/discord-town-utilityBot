const {MessageAttachment} = require('discord.js')
const path = require('path');
const { createCanvas, loadImage } = require('canvas')

module.exports = {

    run: async function(bot, interaction){
        const url = interaction.options.get("image")?.attachment?.url || interaction.options.get("link").value;
        const canvas = createCanvas(1000, 560);
        const ctx = canvas.getContext("2d");
    
        try{
            const base = await loadImage(path.resolve(__dirname, "../../assets/lovethis.png"));
            const image = await loadImage(url);

            ctx.drawImage(image, 0, 0, image.width, image.height, 313, 79, 339, 263);
            ctx.drawImage(base,0, 0);

            const attachment = new MessageAttachment(canvas.toBuffer(), "output.png");
            interaction.reply({files: [attachment]});
        }
        catch(error){
            interaction.reply(error.message,{ephemeral: true});
        }
       
    }
}