const tesseract = require("node-tesseract-ocr");

module.exports = {
    run: async function (bot, interaction) {
        await interaction.deferReply();
        const url = interaction.options.get("url")?.value;
        
        if (!url) {
            interaction.reply({
                content: "Nothing is received!",
                ephemeral: true,
            });
            return;
        }
        
        const fromText = interaction.options.get("lang")?.value ?? "eng";
        
        try {
            const text = await tesseract.recognize(url, {lang: fromText, oem:1, psm: 3});
            interaction.editReply({ content: text || "I don't see anything!"});
        } catch (error) {
            console.log(error.message);
            interaction.editReply({content: error.message}); 
        }

    },
};
