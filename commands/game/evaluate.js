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
const connectWeight = [0,1,5,10,Infinity];  //weight for 0,1,2,3,4 connected disc

let top = [5,5,5,5,5,5,5];

//score minimax evaluation formula:
//scoreBase * number of possible combinations of 4 * number of connected piece * weight
let board = [
    ["⚪","⚪","⚪","⚪","⚪","⚪","⚪"],
    ["⚪","⚪","⚪","⚪","⚪","⚪","⚪"],
    ["⚪","⚪","⚪","⚪","⚪","⚪","⚪"],
    ["⚪","⚪","⚪","⚪","⚪","⚪","⚪"],
    ["⚪","⚪","⚪","⚪","⚪","⚪","⚪"],
    ["⚪","⚪","⚪","⚪","⚪","⚪","⚪"]
];

function horizontalEvaluate(board,disc){
    let row = 0;
    let column = verticalMax-1;
    let possibleConnected = 0;
    let connected = 0;
    let score = 0;

    while(column>=0){  //loop through column
        while(row<=horizontalMax-1){ //loop through row
            if(board[column][row]===empty_circle){  //if it's an empty space, increment possible connected
                possibleConnected++;          
            }
            else{
                if(board[column][row]===disc){   //if it's a target player disc, increment real connected and possible connected
                    possibleConnected++;
                    connected++;
                }
                else{ //if the connected sequence is stopped by another player disc, calculate the score and reset connected
                    score += scoreBase * Math.max(0,possibleConnected-calPossibleFour) * connected * connectWeight[connected];
                    connected = 0;
                    possibleConnected = 0;
                }
            }
            row++;
        }
        column--;
        score += scoreBase * Math.max(0,possibleConnected-calPossibleFour) * connected * connectWeight[connected];  //failsafe for out of boundary checks
        connected = 0;  //reset for next column iteration
        possibleConnected = 0;
        row = 0;
    }
    return score;
}

function verticalEvaluate(board,disc){
    let row = 0;
    let column = verticalMax-1;
    let possibleConnected = 0;
    let connected = 0;
    let score = 0;

    while(row<=horizontalMax-1){      //same structure as horizontalEvaluate
        while(column>=0){ 
            if(board[column][row]===empty_circle){  
                possibleConnected++;          
            }
            else{
                if(board[column][row]===disc){   
                    possibleConnected++;
                    connected++;
                }
                else{ 
                    score += scoreBase * Math.max(0,possibleConnected-calPossibleFour) * connected * connectWeight[connected];
                    connected = 0;
                    possibleConnected = 0;
                }
            }
            column--;
        }
        row++;
        score += scoreBase * Math.max(0,possibleConnected-calPossibleFour) * connected * connectWeight[connected];  
        connected = 0;  
        possibleConnected = 0;
        column = verticalMax-1;
    }
    return score;
}

function bottomLeftEvaluate(board,disc){
  
    let possibleConnected = 0;
    let connected = 0;
    let score = 0;

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
            if(board[column_loop][row]===empty_circle){  
                possibleConnected++;          
            }
            else{
                if(board[column_loop][row]===disc){   
                    possibleConnected++;
                    connected++;
                }
                else{ 
                    score += scoreBase * Math.max(0,possibleConnected-calPossibleFour) * connected * connectWeight[connected];
                    connected = 0;
                    possibleConnected = 0;
                }
            }
            column_loop--;
            row++;
        }
        score += scoreBase * Math.max(0,possibleConnected-calPossibleFour) * connected * connectWeight[connected];
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
        if(board[column][row_loop]===empty_circle){  
            possibleConnected++;          
        }
        else{
            if(board[column][row_loop]===disc){   
                possibleConnected++;
                connected++;
            }
            else{ 
                score += scoreBase * Math.max(0,possibleConnected-calPossibleFour) * connected * connectWeight[connected];
                connected = 0;
                possibleConnected = 0;
            }
        }
        row_loop++;
        column--;
    }
        score += scoreBase * Math.max(0,possibleConnected-calPossibleFour) * connected * connectWeight[connected];
        connected = 0;  
        possibleConnected = 0;
    }
    return score;
}

function bottomRightEvaluate(board,disc){
  
    let possibleConnected = 0;
    let connected = 0;
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
            if(board[column_loop][row]===empty_circle){  
                possibleConnected++;          
            }
            else{
                if(board[column_loop][row]===disc){   
                    possibleConnected++;
                    connected++;
                }
                else{ 
                    score += scoreBase * Math.max(0,possibleConnected-calPossibleFour) * connected * connectWeight[connected];
                    connected = 0;
                    possibleConnected = 0;
                }
            }
            column_loop--;
            row--;
        }
        score += scoreBase * Math.max(0,possibleConnected-calPossibleFour) * connected * connectWeight[connected];
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
        if(board[column][row_loop]===empty_circle){  
            possibleConnected++;          
        }
        else{
            if(board[column][row_loop]===disc){   
                possibleConnected++;
                connected++;
            }
            else{ 
                score += scoreBase * Math.max(0,possibleConnected-calPossibleFour) * connected * connectWeight[connected];
                connected = 0;
                possibleConnected = 0;
            }
        }
        row_loop--;
        column--;
    }
        score += scoreBase * Math.max(0,possibleConnected-calPossibleFour) * connected * connectWeight[connected];
        connected = 0;  
        possibleConnected = 0;
    }
    return score;
}

function evaluateBoard(board){
    let AIScore =     horizontalEvaluate(board,playersCircle[0]) +
                      verticalEvaluate(board,playersCircle[0])   +
                      bottomLeftEvaluate(board,playersCircle[0]) +
                      bottomRightEvaluate(board,playersCircle[0]);

    let playerScore = horizontalEvaluate(board,playersCircle[1]) +
                      verticalEvaluate(board,playersCircle[1])   +
                      bottomLeftEvaluate(board,playersCircle[1]) +
                      bottomRightEvaluate(board,playersCircle[1]);

    return (AIScore - playerScore);
}

function isFull(board){
    board.forEach(column=>{
        if(column.includes(empty_circle)){
            return false;
        }
    })
    return true;
}

function virtualDropDisc(input,disc,boardCopy,topCopy){
    boardCopy[topCopy[input]][input] = disc;
    return boardCopy;
}

function isValid(input){
    return top[input]>=0;
}

function copyBoard(board){
    return JSON.parse(JSON.stringify(board));
}

function copyTop(top){
    return Array.from(top);
}

function maximizer(board){
    let scores = [];
    for(let i = 0;i<=horizontalMax-1;i++){
        let boardCopy = copyBoard(board);

        if(isValid(i)){
            virtualDropDisc(i,playersCircle[0],boardCopy,top);
            scores.push(evaluateBoard(boardCopy));
        }
        else{
            scores.push(-Infinity);
        }
    }

    return scores;
}

function minimizer(board){
    let scores = [];
    for(let i = 0;i<=horizontalMax-1;i++){
        let boardCopy = copyBoard(board);

        if(isValid(i)){
            
            virtualDropDisc(i,playersCircle[1],boardCopy,top);
            scores.push(evaluateBoard(boardCopy));
        }
        else{
            scores.push(Infinity);
        }
    }
    return scores;
}

function minimax(difficulty,board,top){
    let isMaximizerTurn = true;
    let currentDepth = 0;
    let boardCopy = copyBoard(board);
    let topCopy = copyTop(top);
    let scores = [];

    while(currentDepth<difficulty){
        currentDepth++;
        if(isMaximizerTurn){
            scores = maximizer(boardCopy);
            let maxIndex = scores.indexOf(Math.max(...scores))
            boardCopy = virtualDropDisc(maxIndex,playersCircle[0],boardCopy,topCopy);
            topCopy[maxIndex]--;
        }
        else{
            scores = minimizer(boardCopy);
            let minIndex = scores.indexOf(Math.min(...scores))
            boardCopy = virtualDropDisc(minIndex,playersCircle[0],boardCopy,topCopy);
        }
        isMaximizerTurn = !isMaximizerTurn;
        console.log(printBoard(boardCopy));
    }
    return scores;
}

function printBoard(board){
    let message = "";
    board.forEach(row=>{
        message+=row.join(" ")+"\r\n";
    })
    return message;
}

let scores = minimax(3,board,top);
console.log(scores);
//let scores = minimizer(board);
//let scores = maximizer(board);

