
const {EmbedBuilder, MessageAttachment} = require('discord.js')
const { createCanvas } = require('canvas');
const { AttachmentBuilder } = require('discord.js');

function hexToRgb(hex) {
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
    
    return r + "," + g + "," + b;
}

function rgbToHex(red, green, blue) {
    const rgb = (red << 16) | (green << 8) | (blue << 0);
    return ('#' + (0x1000000 + rgb).toString(16).slice(1)).toUpperCase();
  }
  
module.exports = {

    run: async function(bot, interaction){
        let colour = interaction.options.get('colour').value.replaceAll(" ","").replaceAll("#","").toUpperCase();
        
        let resolved = null;

        const canvas = createCanvas(250, 250);
        const ctx = canvas.getContext("2d");
        const embed = new EmbedBuilder();
        if(!colour.includes(",")){
            resolved = hexToRgb(colour);
            ctx.fillStyle = "rgb("+resolved+")";
            embed.setColor("#"+colour);
            embed.addFields(
                {
                    name: "RGB",
                    value: resolved,
                    inline: true
                },
                {
                    name: "HEX",
                    value: "#"+colour,
                    inline: true
                }
            )
        }
        else{
            const rgb = colour.split(",");
            resolved = rgbToHex(...rgb);
            embed.setColor(resolved);
            ctx.fillStyle = resolved;
            embed.addFields(
                {
                    name: "HEX",
                    value: resolved,
                    inline: true
                },
                {
                    name: "RGB",
                    value: colour,
                    inline: true
                }
            )
        }
        embed.setTitle('Colour Converter')
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const attachment = new AttachmentBuilder(canvas.toBuffer(), "output.png");
        embed.setImage("attachment://output.png");
	    interaction.reply({ embeds: [embed] , files: [attachment]});
    
    }

}