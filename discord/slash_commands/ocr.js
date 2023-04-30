const tesseract = require("node-tesseract-ocr");

module.exports = {
    run: async function (bot, interaction) {
        const url =
            // interaction.optionts.get("image")?.attachment?.url ||
            interaction.options.get("url")?.value;
        let fromText = interaction.options.get("lang")?.value;
        console.log(fromText);
        if (!fromText) {
            fromText = "eng";
        }
        await interaction.deferReply();
        console.log(url);
        config = {
            lang: fromText,
            oem: 1,
            psm: 3,
        };
        if (!url) {
            interaction.reply({
                content: "Nothing is received!",
                ephemeral: true,
            });
            return;
        }
        tesseract.recognize(url, config).then((text) => {
            interaction.editReply({ content: text });
            console.log(text);
        }).catch((error) => {
            console.log(error.message)
        });
    },
};
