const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const { NONAME } = require('dns');
module.exports = class connect extends Command{
	constructor(client) {
		super(client, {
			name: 'connect',
			group: 'game',
			memberName: 'connect',
			description: 'play connect',
		});
	}

run(message) {
    function createGameMessage(message){
        return new Promise((resolve, reject) => {
        let joinedUser = "";
        const filter = (reaction,user) => reaction.emoji.name === '🎲' && !user.bot; 
        const collector = message.createReactionCollector(filter, { time: 30000 });
        message.react("🎲");

        collector.on('collect',(reaction,user)=>{
            joinedUser = user;
            collector.stop();
        });

        collector.on('end',()=>{
            joinedUser===""?
            reject():
            resolve(joinedUser);

        });
    })
}

    async function updateGameMessage(boardString,turn,players,message){
        const color = ["#00FF00","#0000FF"];
        let embed = new Discord.MessageEmbed()
        .setTitle(players[turn%2].username+" 的回合")
        .setColor("#50C878")
        .setDescription(boardString)
        .addField("Turn:",playersCircle[turn%2])
        message.edit(embed)
    }

    function gameTimeOut(boardString,turn,players,message){
        let embed = new Discord.MessageEmbed()
        .setTitle("⏰ "+players[turn%2].username+" 因為沒有回應所以輸了!")
        .setColor("#50C878")
        .setDescription(boardString)
        message.reactions.removeAll();
        message.edit(embed)
    }

    function gameWin(boardString,turn,players,message){
        let embed = new Discord.MessageEmbed()
        .setTitle("🎉 " +players[turn%2].username+" 嬴了!")
        .setColor("#50C878")
        .setDescription(boardString)
        message.reactions.removeAll();
        message.edit(embed)
    }

    function addReactions(message){
        numberEmotes.forEach((emote)=>{
            message.react(emote);
        })
    }

    function parseBoardToString(board){
        let result = "";
        board.forEach(row => {
            result += row.join(" ")+"\r\n";
        });
        result += numberEmotes.join(" ");
        return result;
    }

    function receiveGameInput(message,players,turn){
        return new Promise((resolve, reject) => {
        const filter = (reaction,user) =>  numberEmotes.includes(reaction.emoji.name) && user.id===players[turn%2].id; 
        const collector = message.createReactionCollector(filter, { time: 30000 });
        let isTimeOut = true;
        collector.on('collect',(reaction,user)=>{
            reaction.users.remove(user);
            let input = numberEmotes.findIndex(emoteName=>emoteName===reaction.emoji.name);
            if(isValid(input)){
                isTimeOut = false;
                collector.stop();      
                resolve(input);
            }
        });

        collector.on('end',()=>{
            if(isTimeOut){reject();}
        });
    })
} 

    function checkWin(board,input){
        return checkWinHorizontal(board,input)||
                checkWinVertical(board,input)||
                checkWinBottomLeft(board,input)||
                checkWinBottomRight(board,input);
    }

    function checkWinVertical(board,input){
        let pointer = 0;
        let connected = 1;
        while(pointer+1<verticalMax){
            if(board[pointer][input]===board[pointer+1][input]&&board[pointer][input]!=black_circle){
                connected++;
            }
            else{
                connected = 1;
            }
            if(connected >= 4){
                return true;
            }
            pointer++;
        }
        return false;
    }

    function checkWinHorizontal(board,input){
        let pointer = 0;
        let column = top[input]+1;
        let connected = 1;
        while(pointer+1<horizontalMax){
            if(board[column][pointer]===board[column][pointer+1]&&board[column][pointer]!==black_circle){
                connected++;
            }
            else{
                connected = 1;
            }
            if(connected >= 4){
                return true;
            }
            pointer++;
        }
        return false;
    }

    function getBottomLeft(input){
        let row = input;
        let column = top[input]+1;
        while(row>0&&column<verticalMax-1){
            row--;
            column++;
        }
        return [row,column];
    }

    function checkWinBottomLeft(board,input){
        let temp = getBottomLeft(input);
        let row = temp[0];
        let column = temp[1];
        let connected = 1;
        
        while((row+1<=horizontalMax-1)&&(column-1>=0)){
            console.log((column+1) + " "+(row-1)+" "+board[column][row]+" "+board[column+1][row-1])
            
            if(board[column][row]===board[column-1][row+1]&&board[column][row]!=black_circle){
                connected++;
            }
            else{
                connected = 1;
            }
            if(connected >= 4){
                return true;
            }
            row++;
            column--;
        }
        return false;
    }

    function getBottomRight(input){
        let row = input;
        let column = top[input]+1;
        while(row<horizontalMax-1&&column>0){
            row++;
            column--;
        }
        return [row,column];
    }

    function checkWinBottomRight(board,input){

    }

    function isValid(input){
        return top[input]>=0;
    }

    const black_circle = "⚪";
    const playersCircle = ["🔵","🔴"]; //blue red
    const numberEmotes = ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣"];
    const horizontalMax = 7;
    const verticalMax = 6;

    let top = [5,5,5,5,5,5,5]

    let board = Array.from(Array(verticalMax), () => Array(horizontalMax).fill(black_circle));
    let players = [message.author];
    let turn = Math.floor(Math.random() * Math.floor(2));

    message.delete();
    let embed = new Discord.MessageEmbed()
    .setTitle("Connect")
    .setDescription("<@"+message.author.id+"> wants to play with you!")
    .setColor("#50C878")

	message.channel.send(embed) //pre game
    .then(msg=>{
        createGameMessage(msg)
        .then(async user=>{
            players.push(user);
            msg.reactions.removeAll();
            updateGameMessage(parseBoardToString(board),turn,players,msg);
            addReactions(msg);
            let gameContinue = true;
            while(gameContinue){
                gameContinue = true;
                let input = await receiveGameInput(msg,players,turn)
                                  .catch(()=>{
                                      gameTimeOut(parseBoardToString(board),turn,players,msg);
                                      gameContinue = false;
                                  })
                if(gameContinue){
                    board[top[input]][input] = playersCircle[turn%2];
                    top[input]--;
                    turn++;
                    await updateGameMessage(parseBoardToString(board),turn,players,msg)
                    .then(()=>{
                        if(checkWinBottomLeft(board,input)){
                            gameContinue = false;
                            gameWin(parseBoardToString(board),turn,players,msg);
                        }
                    })
                    
                }
            }
            
        })
    //    .catch(()=>{
    //        embed.setDescription("Game gone~");
    //        msg.edit(embed);
    //        msg.reactions.removeAll();
    //    })
    
	})


    }
}