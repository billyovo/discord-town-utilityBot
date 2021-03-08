const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
module.exports = class connect extends Command{
	constructor(client) {
		super(client, {
			name: 'connectai',
			group: 'game',
			memberName: 'connectai',
			description: 'play connect with AI',
            args: [
                {
                    key: 'difficulty',
                    prompt: 'how difficult ai is',
                    type: 'integer',
                },
            ],
		});
	}

    run(message, {difficulty}) {  

    //----------------------------------------------game related functions--------------------------------------------------------
        function addReactions(message){
            numberEmotes.forEach((emote)=>{
                message.react(emote);
            })
        }

        function gameEnd(board,turn,players,message,reason){
            let embed = new Discord.MessageEmbed()
            .setColor("#50C878")
            .setDescription(board)
    
            message.reactions.removeAll();
            switch(reason){
                case STATUS.WIN:{
                    embed.setTitle("🎉 " +players[(turn+1)%2].username+" 嬴了!");
                    break;
                }
                case STATUS.TIMEOUT:{
                    embed.setTitle("⏰ "+players[turn%2].username+" 因為沒有回應所以輸了!");
                    break;
                }
                case STATUS.DRAW:{
                    embed.setTitle("🎉 平手!");
                    break;
                }
            }
            message.edit(embed)
        }

        async function updateGameMessage(boardString,turn,players,message){
            let embed = new Discord.MessageEmbed()
            .setTitle(players[turn%2].username+" 的回合")
            .setColor("#50C878")
            .setDescription(boardString)
            .addField("Turn:",playersCircle[turn%2])
            message.edit(embed)
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
                if(isValid(input,game)){
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
           if(board[pointer][input]===board[pointer+1][input]&&board[pointer][input]!=empty_circle){
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
       let column = game.top[input];
       let connected = 1;
       while(pointer+1<horizontalMax){
           if(board[column][pointer]===board[column][pointer+1]&&board[column][pointer]!==empty_circle){
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
       let column = game.top[input];
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
           
           if(board[column][row]===board[column-1][row+1]&&board[column][row]!=empty_circle){
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
       let column = game.top[input];
       while(row<horizontalMax-1&&column<verticalMax-1){
           row++;
           column++;
       }
       return [row,column];
   }

   function checkWinBottomRight(board,input){
       let temp = getBottomRight(input);
       let row = temp[0];
       let column = temp[1];
       let connected = 1;
       while((row-1>=0)&&(column-1>=0)){
           
           if(board[column][row]===board[column-1][row-1]&&board[column][row]!=empty_circle){
               connected++;
           }
           else{
               connected = 1;
           }
           if(connected >= 4){
               return true;
           }
           row--;
           column--;
       }
       return false;
   }

   function isValid(input,game){
    return game.top[input]>=0;
    }
//----------------------------------------AI related functions--------------------------------------------------------------------------------
    function horizontalEvaluate(game,disc){
        let row = 0;
        let column = verticalMax-1;
        let possibleConnected = 0;
        let connected = 0;
        let connectedMax = 0;
        let score = 0;

        while(column>=0){  //loop through column
            while(row<=horizontalMax-1){ //loop through row
                if(game.board[column][row]===empty_circle){  //if it's an empty space, increment possible connected
                    possibleConnected++;     
                    connected = 0;     
                }
                else{
                    if(game.board[column][row]===disc){   //if it's a target player disc, increment real connected and possible connected
                        possibleConnected++;
                        connected++;
                        connectedMax = Math.max(connectedMax,connected);
                    }
                    else{ //if the connected sequence is stopped by another player disc, calculate the score and reset connected
                        score += scoreBase * Math.max(0,possibleConnected-calPossibleFour) * connectedMax * connectWeight[connectedMax];
                        connected = 0;
                        connectedMax = 0;

                    }
                }
                row++;
            }
            column--;
            score += scoreBase * Math.max(0,possibleConnected-calPossibleFour) * connectedMax * connectWeight[connectedMax];  //failsafe for out of boundary checks
            connected = 0;  //reset for next column iteration

            row = 0;
        }
        if(!isFinite(score)){
            return Infinity;
        }
        return score;
    }

    function verticalEvaluate(game,disc){
        let row = 0;
        let column = verticalMax-1;
        let possibleConnected = 0;
        let connected = 0;
        let connectedMax = 0;
        let score = 0;

        while(row<=horizontalMax-1){      //same structure as horizontalEvaluate
            while(column>=0){ 
                if(game.board[column][row]===empty_circle){  
                    possibleConnected++;      
                    connected = 0;      
                }
                else{
                    if(game.board[column][row]===disc){   
                        possibleConnected++;
                        connected++;
                        connectedMax = Math.max(connectedMax,connected);
                    }
                    else{ 
                        score += scoreBase * Math.max(0,possibleConnected-calPossibleFour) * connectedMax * connectWeight[connectedMax];
                        connected = 0;
                        connectedMax = 0;

                    }
                }
                column--;
            }
            row++;
            score += scoreBase * Math.max(0,possibleConnected-calPossibleFour) * connectedMax * connectWeight[connectedMax];  
            connected = 0;  

            column = verticalMax-1;
        }
        if(!isFinite(score)){
            return Infinity;
        }
        return score;
    }

    function bottomLeftEvaluate(game,disc){
    
        let possibleConnected = 0;
        let connected = 0;
        let score = 0;
        let connectedMax = 0;

        /*
                                        O O O O O O O
                                        O O O O O O O
                                        O O O O O O O
         Start from here ------------>  O O O O O O O
    Search diagonally to upper right    O O O O O O O
    Loop until the end of column        O O O O O O O

        */
        for(let column = diagonallyEvaluateStart;column<=verticalMax-1;column++){    //start vertically first
            let column_loop = column;
            let row = 0;
            while(column_loop>=0){   //only column will overflow in this loop, use it as exit condition
                if(game.board[column_loop][row]===empty_circle){  
                    possibleConnected++;      
                    connected = 0;      
                }
                else{
                    if(game.board[column_loop][row]===disc){   
                        possibleConnected++;
                        connected++;
                        connectedMax = Math.max(connectedMax,connected);
                    }
                    else{ 
                        score += scoreBase * Math.max(0,possibleConnected-calPossibleFour) * connectedMax * connectWeight[connectedMax];
                        connected = 0;
                        connectedMax = 0;

                    }
                }
                column_loop--;
                row++;
            }
            score += scoreBase * Math.max(0,possibleConnected-calPossibleFour) * connectedMax * connectWeight[connectedMax];
            connected = 0;  

        }


        /*
                                                      O O O O O O O
                                                      O O O O O O O
        Next loop for bottom left                     O O O O O O O
        diagonal check                                O O O O O O O
                                                      O O O O O O O
    Start from second column here horizontally        O O O O O O O
                                                        ^
    Until the 4th column inclusive where 4 connect is no longer possible
        */
       for(let row = 1;row<=bottomLeftEvaluateEnd;row++){    //similar to the vertical loop above.
        let row_loop = row;
        let column = verticalMax-1;
        while(row_loop<=horizontalMax-1){   
            if(game.board[column][row_loop]===empty_circle){  
                possibleConnected++;     
                connected = 0;       
            }
            else{
                if(game.board[column][row_loop]===disc){   
                    possibleConnected++;
                    connected++;
                    connectedMax = Math.max(connectedMax,connected);
                }
                else{ 
                    score += scoreBase * Math.max(0,possibleConnected-calPossibleFour) * connectedMax * connectWeight[connectedMax];
                    connected = 0;
                    connectedMax = 0;

                }
            }
            row_loop++;
            column--;
        }
            score += scoreBase * Math.max(0,possibleConnected-calPossibleFour) * connectedMax * connectWeight[connectedMax];
            connected = 0;  

        }
        if(!isFinite(score)){
            return Infinity;
        }
        return score;
    }

    function bottomRightEvaluate(game,disc){
    
        let possibleConnected = 0;
        let connected = 0;
        let connectedMax = 0;
        let score = 0;

        /*
           O O O O O O O
           O O O O O O O
           O O O O O O O
           O O O O O O O <--- start from here first
           O O O O O O O
           O O O O O O O

        */
        for(let column = diagonallyEvaluateStart;column<=verticalMax-1;column++){    
            let column_loop = column;
            let row = 6;
            while(column_loop>=0){   
                if(game.board[column_loop][row]===empty_circle){  
                    possibleConnected++;     
                    connected = 0;       
                }
                else{
                    if(game.board[column_loop][row]===disc){   
                        possibleConnected++;
                        connected++;
                        connectedMax = Math.max(connectedMax,connected);
                    }
                    else{ 
                        score += scoreBase * Math.max(0,possibleConnected-calPossibleFour) * connectedMax * connectWeight[connectedMax];
                        connected = 0;
                        connectedMax = 0;

                    }
                }
                column_loop--;
                row--;
            }
            score += scoreBase * Math.max(0,possibleConnected-calPossibleFour) * connectedMax * connectWeight[connectedMax];
            connected = 0;  

        }


        /*
             O O O O O O O
             O O O O O O O
             O O O O O O O
             O O O O O O O
             O O O O O O O
             O O O O O O O    start from 5th column diagonally
                       ^
        */
       for(let row = bottomRightEvaluateStart;row>=bottomRightEvaluateEnd;row--){    //similar to the vertical loop above.
        let row_loop = row;
        let column = verticalMax-1;
        while(row_loop>=0){   
            if(game.board[column][row_loop]===empty_circle){  
                possibleConnected++;        
                connected = 0;    
            }
            else{
                if(game.board[column][row_loop]===disc){   
                    possibleConnected++;
                    connected++;
                    connectedMax = Math.max(connectedMax,connected);
                }
                else{ 
                    score += scoreBase * Math.max(0,possibleConnected-calPossibleFour) * connectedMax * connectWeight[connectedMax];
                    connected = 0;
                    connectedMax = 0;

                }
            }
            row_loop--;
            column--;
        }
            score += scoreBase * Math.max(0,possibleConnected-calPossibleFour) * connectedMax * connectWeight[connectedMax];
            connected = 0;  

        }
        if(!isFinite(score)){
            return Infinity;
        }
        return score;
    }

    function evaluateBoard(game){
        let AIScore =     horizontalEvaluate(game,playersCircle[0]) +
                          verticalEvaluate(game,playersCircle[0])   +
                          bottomLeftEvaluate(game,playersCircle[0]) +
                          bottomRightEvaluate(game,playersCircle[0]);

        let playerScore = horizontalEvaluate(game,playersCircle[1]) +
                          verticalEvaluate(game,playersCircle[1])   +
                          bottomLeftEvaluate(game,playersCircle[1]) +
                          bottomRightEvaluate(game,playersCircle[1]);

        return (AIScore - playerScore);
    }

    function isFull(game){
        game.board.forEach(column=>{
            if(column.includes(empty_circle)){
                return false;
            }
        })
        return true;
    }

    function dropDisc(input,disc,game){
        game.board[game.top[input]][input] = disc;
        game.top[input]--;
        return copyGame(game);
    }

    function isValid(input,game){
        return game.top[input]>=0;
    }

    function copyGame(game){
        return JSON.parse(JSON.stringify(game));
    }

    function maximizer(game){
        let scores = [];
        for(let i = 0;i<=horizontalMax-1;i++){
            let newGame = copyGame(game);
            if(isValid(i,game)){
                dropDisc(i,playersCircle[0],newGame);
                scores.push(evaluateBoard(newGame));
            }
            else{
                scores.push(-Infinity);
            }
        }
        return scores.indexOf(Math.max(...scores));
    }

    async function minimizer(game){
        let scores = [];
        for(let i = 0;i<=horizontalMax-1;i++){
            let newGame = copyGame(game);
            if(isValid(i,game)){          
                dropDisc(i,playersCircle[1],newGame);
                scores.push(evaluateBoard(newGame));
            }
            else{
                scores.push(Infinity);
            }
        }
        return scores.indexOf(Math.min(...scores));
    }

    function minimax(difficulty,game){
        var game = copyGame(game);
        var currentDepth = 0;
        var isMaximizerTurn = false;
        var boardValue;
        while(currentDepth!==difficulty){
            boardValue = evaluateBoard(game);
            if(!isFinite(boardValue)){
                return boardValue;
            }

            if(isMaximizerTurn){
                game = dropDisc(maximizer(game),playersCircle[0],game);
            }
            else{
                game = dropDisc(minimizer(game),playersCircle[1],game);
            }
            currentDepth++;
            isMaximizerTurn = !isMaximizerTurn;
        }
        return evaluateBoard(game);
    }
        
        

        const empty_circle = "⚪";
        const playersCircle = ["🔵","🔴"]; //blue red
        const numberEmotes = ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣"];
        const horizontalMax = 7;
        const verticalMax = 6;
        const STATUS = {
            DRAW: "draw",
            TIMEOUT: "timeout",
            WIN: "win"
        }

        const calPossibleFour = 3;
        const scoreBase = 10;
        const diagonallyEvaluateStart = 3;
        const bottomLeftEvaluateEnd = 4;
        const bottomRightEvaluateStart = 5;
        const bottomRightEvaluateEnd = 3;
        const connectWeight = [0,1,2,10,Infinity];  //weight for 0,1,2,3,4 connected disc

        let players = [this.client.user,message.author];
        let turn = 1;
        let game = { 
            top: [5,5,5,5,5,5,5],
            board: Array.from(Array(verticalMax), () => Array(horizontalMax).fill(empty_circle))
        }
        
        let embed = new Discord.MessageEmbed()
        .setTitle("Connect with AI")
        .setDescription("<@"+message.author.id+">'s game")
        .setColor("#50C878")

        message.delete();
	    message.channel.send(embed) 
        .then(async msg=>{
            updateGameMessage(parseBoardToString(game.board),turn,players,msg);
            addReactions(msg);
            let gameContinue = true;
            while(gameContinue){
                let input = -1;
                if(players[turn%2]!==this.client.user){
                    input = await receiveGameInput(msg,players,turn)
                                  .catch(()=>{
                                      gameEnd(parseBoardToString(game.board),turn,players,msg,STATUS.TIMEOUT);
                                      gameContinue = false;
                                  })
                }
                else{
                    var evalGame = [];
                    var scores = [];
                    for(let i = 0;i<=horizontalMax-1;i++){
                        evalGame.push(copyGame(game));
                        evalGame[i] = dropDisc(i,playersCircle[0],evalGame[i]);
                        scores.push(minimax(difficulty,evalGame[i]));
                    }
                    input = scores.indexOf(Math.max(...scores));
                    console.log(scores);
                }

                if(gameContinue){
                    //board[top[input]][input] = playersCircle[turn%2];
                    game = dropDisc(input,playersCircle[turn%2],game);
                    game.top[input]++; //omg this is...
                    turn++;
                    if(checkWin(game.board,input)){
                        gameContinue = false;
                        gameEnd(parseBoardToString(game.board),turn,players,msg,STATUS.WIN);
                    }
                    else{
                        if(turn-1>=42){
                            gameContinue = false;
                            gameEnd(parseBoardToString(game.board),turn,players,msg,STATUS.DRAW);
                        }
                        else{
                            updateGameMessage(parseBoardToString(game.board),turn,players,msg);
                        }
                    }
                    game.top[input]--;
                }
            }

                
            })
        }
}
