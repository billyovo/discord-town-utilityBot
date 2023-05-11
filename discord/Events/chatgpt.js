const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const config = new Configuration({
    apiKey: process.env.openAI,
});

const openai = new OpenAIApi(config);

//look cool right arrow function
const runCompletion = async (content) => {
    try {
        content.unshift({"role": "system", "content":"You are my Best Friend"});
        console.log(content);
        const completion = await openai.createChatCompletion({
            "model": "gpt-3.5-turbo",
            "messages": content,
        });
        console.log(completion.data);
        return completion.data.choices[0].message.content;
    } catch (error) {
        console.log(error);
        return "API ERROR";
    }
};

const sendMessage = (message, content) => {
    message.channel.send({
        content: content,
        reply: { messageReference: message.id },
    });
};

module.exports = {
    name: "messageCreate",
    async execute(message) {
        const botId = message.client.user.id;
        if (message.author.bot) 
          return;
        if (message.mentions.has(botId) && !message.mentions.everyone && !message.mentions.here) {
            const filter = new RegExp(`^<@${botId}>+([^]*)`);
            const orginMessage = message.content.match(filter);
            const filterMessage = orginMessage ? orginMessage[1] : message.content;
            if (message.reference) {
                try {
                    console.log(message.reference);
                    const refMessage = await message.channel.messages.fetch(message.reference.messageId);
                    if (!refMessage || refMessage.content.match(`^<@.*>`) || refMessage.content == "Hello! How can I assist you today?" || refMessage.content == "Don't waste my free Quota Bitch!") {
                        sendMessage(message, "Don't waste my free Quota Bitch!");
                        return;
                    }
                    //handle history messages
                    const history = [{"role": "user", "content": filterMessage}];
                    let currMessage = refMessage;
                    while(currMessage.reference){
                        let text = refMessage.content.match(filter) ? currMessage.content.match(filter)[1] : currMessage.content;
                        if(currMessage.author.id == botId){
                            history.unshift({"role": "assistant", "content": text});
                        } else {
                            history.unshift({"role": "user", "content": text});
                        }
                        currMessage = await currMessage.channel.messages.fetch(currMessage.reference.messageId);
                    }
                    const lastMessage = currMessage.content.match(filter) ? currMessage.content.match(filter)[1] : currMessage.content;
                    history.unshift({"role": "user", "content": lastMessage});
                    console.log(history);
                    const content = history.map(msg => {
                        return {"role": msg.role,"content": msg.content};
                    });
                    const respone = await runCompletion(content);
                    sendMessage(message, respone);
                } catch (error) {
                    console.log(error);
                }
                return;
            }
            if (filterMessage == "") {
                sendMessage(message, "Hello! How can I assist you today?");
            } else {
                const respone = await runCompletion([{"role": "user", "content": filterMessage}]);
                console.log(respone);
                sendMessage(message, respone);
            }
        }
    },
};
