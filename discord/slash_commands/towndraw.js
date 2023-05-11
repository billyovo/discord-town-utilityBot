const {MessageAttachment} = require('discord.js');
const axios = require('axios');
const fs = require('fs');
const apiurl = "http://127.0.0.1:7860/sdapi/v1/txt2img";

const draw = async (prompt) => {
    try {
        const request = prompt + "<lora:westTownDraw:1>";
        const config = {
            url: apiurl,
            method: 'post',
            data: {
                "enable_hr": false,
                "denoising_strength": 0,
                "firstphase_width": 0,
                "firstphase_height": 0,
                "hr_scale": 2,
                "hr_upscaler": "string",
                "hr_second_pass_steps": 0,
                "hr_resize_x": 0,
                "hr_resize_y": 0,
                "prompt": request,
                "styles": [
                    "string"
                ],
                "seed": -1,
                "subseed": -1,
                "subseed_strength": 0,
                "seed_resize_from_h": -1,
                "seed_resize_from_w": -1,
                "batch_size": 1,
                "n_iter": 1,
                "steps": 50,
                "cfg_scale": 7,
                "width": 512,
                "height": 512,
                "restore_faces": false,
                "tiling": false,
                "do_not_save_samples": false,
                "do_not_save_grid": false,
                "negative_prompt": "string",
                "eta": 0,
                "s_min_uncond": 0,
                "s_churn": 0,
                "s_tmax": 0,
                "s_tmin": 0,
                "s_noise": 1,
                "override_settings": {},
                "override_settings_restore_afterwards": true,
                "script_args": [],
                "send_images": true,
                "save_images": false,
                "alwayson_scripts": {}
            }
        };
        const response = await axios(config);
        console.log(response);
        return base2img(response.data.images[0], prompt);
    } catch (err) {
        console.log(err);
    }
};


const base2img = async (data, prompt) => {
    const buffer = Buffer.from(data, 'base64');
    let index = 0;
    let filename = `./img/towndraw/${prompt}.png`;
    while (fs.existsSync(filename)){
        filename = `./img/towndraw/${prompt}${index}.png`;
        index++;
    }
    fs.writeFileSync(filename, buffer);
    return filename;
};


module.exports = {
    run: async function(bot, interaction){
        const prompt = interaction.options.get("prompt")?.value;
        if (!prompt) {
            interaction.reply({
                content: "Please give me a guide to draw!",
                ephemeral: true,
            });
            return;
        }
        await interaction.deferReply();
        try{
            const image = await draw(prompt);
            interaction.editReply({files: [image]});
        }catch (err){
            console.log(err);
            interaction.editReply({content: "Something went wrong!",ephemeral: true});
        }
    }
}

