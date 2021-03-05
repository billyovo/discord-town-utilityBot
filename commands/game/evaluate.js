'use strict';

const empty_circle = "⚪";
const playersCircle = ["🔵","🔴"]; //blue red
const horizontalMax = 7;
const verticalMax = 6;
const calPossibleFour = 3;
const scoreBase = 10;
const diagonallyEvaluateStart = 3;
const bottomLeftEvaluateEnd = 4;
const bottomRightEvaluateStart = 5;
const bottomRightEvaluateEnd = 3;
const connectWeight = [0,1,2,5,Infinity];  //weight for 0,1,2,3,4 connected disc

let game = {
    board : [
        ["⚪","⚪","⚪","⚪","⚪","⚪","⚪"],
        ["⚪","⚪","⚪","⚪","⚪","⚪","⚪"],
        ["⚪","⚪","⚪","⚪","⚪","⚪","⚪"],
        ["⚪","⚪","⚪","⚪","⚪","⚪","⚪"],
        ["⚪","⚪","⚪","⚪","⚪","⚪","⚪"],
        ["⚪","⚪","⚪","🔴","⚪","⚪","⚪"]
    ],
    top: [5,5,5,4,5,5,5]
}

//score minimax evaluation formula:
//scoreBase * number of possible combinations of 4 * number of connected piece * weight


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
                    possibleConnected = 0;
                }
            }
            row++;
        }
        column--;
        score += scoreBase * Math.max(0,possibleConnected-calPossibleFour) * connectedMax * connectWeight[connectedMax];  //failsafe for out of boundary checks
        connected = 0;  //reset for next column iteration
        possibleConnected = 0;
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
                    possibleConnected = 0;
                }
            }
            column--;
        }
        row++;
        score += scoreBase * Math.max(0,possibleConnected-calPossibleFour) * connectedMax * connectWeight[connectedMax];  
        connected = 0;  
        possibleConnected = 0;
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
                    possibleConnected = 0;
                }
            }
            column_loop--;
            row++;
        }
        score += scoreBase * Math.max(0,possibleConnected-calPossibleFour) * connectedMax * connectWeight[connectedMax];
        connected = 0;  
        possibleConnected = 0;
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
                possibleConnected = 0;
            }
        }
        row_loop++;
        column--;
    }
        score += scoreBase * Math.max(0,possibleConnected-calPossibleFour) * connectedMax * connectWeight[connectedMax];
        connected = 0;  
        possibleConnected = 0;
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
                    possibleConnected = 0;
                }
            }
            column_loop--;
            row--;
        }
        score += scoreBase * Math.max(0,possibleConnected-calPossibleFour) * connectedMax * connectWeight[connectedMax];
        connected = 0;  
        possibleConnected = 0;
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
                possibleConnected = 0;
            }
        }
        row_loop--;
        column--;
    }
        score += scoreBase * Math.max(0,possibleConnected-calPossibleFour) * connectedMax * connectWeight[connectedMax];
        connected = 0;  
        possibleConnected = 0;
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

function virtualDropDisc(input,disc,game){
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
            virtualDropDisc(i,playersCircle[0],newGame);
            scores.push(evaluateBoard(newGame));
        }
        else{
            scores.push(-Infinity);
        }
    }
    return scores.indexOf(Math.max(...scores));
}

function minimizer(game){
    let scores = [];
    for(let i = 0;i<=horizontalMax-1;i++){
        let newGame = copyGame(game);

        if(isValid(i,game)){
            
            virtualDropDisc(i,playersCircle[1],newGame);
            scores.push(evaluateBoard(newGame));
        }
        else{
            scores.push(Infinity);
        }
    }
    return scores.indexOf(Math.min(...scores));
}

function minimax(currentDepth,difficulty){
    
}


function printBoard(board){
    let message = "";
    board.forEach(row=>{
        message+=row.join(" ")+"\r\n";
    })
    return message;
}

console.log(maximizer(game));

//let scores = minimizer(board);
//let scores = maximizer(board);


