let board = new Array(42);
board.fill('z');
let player = 'x';
let gameOver = false;
let AIGame = false;
let disableClicking = true;
let newState = false;
let engineEvals = [];
var showEvals;
var onlyAIGame;



// creates canvas
function setup(){
	if(displayWidth < displayHeight){
		var size = displayWidth/2;
		var offset = 100;
	}else{
		var size = displayHeight/2;
		var offset = 0;
	}
	var cnv = createCanvas(size*7/6,size);
	cnv.position(displayWidth/2 - (width/2), displayHeight/2 + offset - (height/2));
	noLoop();
}

// draws
function draw(){	
	clear();
	newState = true;
	drawBoard(board);
	var winner = evaluateBoard(board);
	if(winner == 1){
		console.log("X wins");
		gameOver = true;
	}
	else if(winner == -1){
		console.log("O wins");
		gameOver = true;
	}
}
function playAI(){
	clearBoard();
	disableClicking = false;
	AIGame = true;
}
function playHuman(){
	clearBoard();
	disableClicking = false;
	AIGame = false;
}
function AIOnly(){
	clearBoard();
	disableClicking = true;
	AIGame = false;
	onlyAIGame = setInterval(function(){
		AIMove();
		if(gameOver || boardFilled(board))
			clearInterval(onlyAIGame);
	}, 1000);
}

function showEvals(){
	if(document.getElementById("engineHolder").style.display == "inline-block"){
		clearInterval(showingEvals);
		document.getElementById("engineHolder").style.display = "none";
		document.getElementById("evalButton").innerHTML = "Show engine evaluation!";
	}else{
		document.getElementById("evalButton").innerHTML = "Hide engine evaluation!";
		showingEvals = setInterval(function(){
			if(newState){
				var evalString = "Engine Evaluations: <br/>";
				document.getElementById("engineHolder").style.display = "inline-block";
				miniMax(board, player, 0);
				newState = !newState;
				
				for(var i = 0; i < engineEvals.length; i++){
					evalString += "(" + indexToCoords(engineEvals[i][0])+ "): " + (Math.floor(engineEvals[i][1]*100)/100) + "<br/>";
				}
				document.getElementById("engineHolder").innerHTML = evalString;
				}

		}, 200);
	}
}
// does the optimal move
function AIMove(){
	var move = miniMax(board, player, 0)[0];
	if(checkValid(board,move)){
		board = makeMove(board, move,player);
		player = changeTurn(player);
		redraw();
	}	
}
// recursively evaluates the position (doesn't make a move yet)
function miniMax(tempBoard, currPlayer, layerNum){
	var evals = [];
	if(boardFilled(tempBoard) || evaluateBoard(tempBoard) != 0){
		return evaluateBoard(tempBoard);
	}else{
		for(var i = 0; i < 7; i++){
			if(checkValid(tempBoard, columnToIndex(i))){
				evals.push([columnToIndex(i), miniMax(makeMove(tempBoard, columnToIndex(i), currPlayer), changeTurn(currPlayer), layerNum + 1)]);
				
			}
			if(layerNum == 1 && i > 1){
					console.log("no");
				}
		}
		if(layerNum == 0)
			engineEvals = evals.slice();
		
		return maximizeForPlayer(currPlayer, evals, layerNum);
			
	}
}

//takes a column and makes it into an array index
function columnToIndex(col){
	for(var i = 5; i >= 0; i--){
		if(board[coordsToIndex(col, i)] == 'z'){
			return coordsToIndex(col, i);
		}
	}
	return -1;
}

function clearBoard(){
	board.fill('z');
	player = 'x';
	gameOver = false;
	redraw();
}

// takes array of [index, eval] pairs and returns best;
function maximizeForPlayer(currPlayer, evals, layerNum){
	if(currPlayer == 'x'){
		var best = -.1;
		var index = 0;
		
		// choose best move, winning faster incentivized by layerNum
		for(var i = 0; i < evals.length; i++){
			if(evals[i][1] > best){
				best = evals[i][1] - layerNum*.01;
				index = i;
			}
		}
		// If guaranteed to lose, make lasting longer worth more
		if(best < -.9){
			for(var i = 0; i < evals.length; i++){
			    if(evals[i][1] < best){
					best = evals[i][1] + layerNum*.01;
					index = i;
			}
		}
		}
	}else if(currPlayer == 'o'){
		var best = 1;
		var index = 0;
		
		// choose best move, winning faster incentivized by layerNum
		for(var i = 0; i < evals.length; i++){
			if(evals[i][1] < best){
				best = evals[i][1] + layerNum*.01;
				index = i;
			}
		}
		
		// If guaranteed to lose, make lasting longer worth more
		if(best > .9){
			for(var i = 0; i < evals.length; i++){
			    if(evals[i][1] < best){
					best = evals[i][1] - layerNum*.01;
					index = i;
			}
		}
		}
	}
	if(layerNum == 0)
		return evals[index];
	else
		return best;
}

// click handler
function touchStarted(){
	for(var i = 0; i < 7; i++){
		var centerX = i*(width/7) + width/14;
		if((mouseX  < centerX + (width/14) * .95) && mouseX > (centerX - (width/14) * .95) && mouseY > 0 && mouseY < height && !disableClicking){
			if(checkValid(board, columnToIndex(i), player)){
			board = makeMove(board, columnToIndex(i), player);
			player = changeTurn(player);
			redraw();
			if(AIGame){
				disableClicking = true;
				setTimeout(function() {AIMove(); disableClicking = false;}, 1000);
			}
			break;
			}
		}
	}
}

// checks if someone has won (board is filled with z by default)
function evaluateBoard(tempBoard){
	var winningPlayer = 'z';
	var horiCount = 0;
	for(var j = 0; j < 6; j++){
		for(var i = 0; i < 5; i++){
			if(winningPlayer == 'z' && tempBoard[coordsToIndex(i,j)] != 'z' && tempBoard[coordsToIndex(i,j)] == tempBoard[coordsToIndex(i+1,j)] && tempBoard[coordsToIndex(i,j)] == tempBoard[coordsToIndex(i+2,j)] && tempBoard[coordsToIndex(i,j)] == tempBoard[coordsToIndex(i+3,j)]){
				winningPlayer = tempBoard[coordsToIndex(i,j)];
			}
		}
	}
	for(var j = 0; j < 3; j++){
		for(var i = 0; i < 7; i++){
			if(winningPlayer == 'z' && tempBoard[coordsToIndex(i,j)] != 'z' && tempBoard[coordsToIndex(i,j)] == tempBoard[coordsToIndex(i,j+1)] && tempBoard[coordsToIndex(i,j)] == tempBoard[coordsToIndex(i,j+2)] && tempBoard[coordsToIndex(i,j)] == tempBoard[coordsToIndex(i,j+3)]){
				winningPlayer = tempBoard[coordsToIndex(i,j)];
			}
		}
	}
	
	if(winningPlayer == 'o')
		return -1;
	else if(winningPlayer == 'x')
		return 1;
	else
		return 0;
		
}
// checks for a tie
function boardFilled(tempBoard){
	var filled = true;
	for(var i = 0; i < tempBoard.length; i++){
		if(tempBoard[i] == 'z'){
			filled = false;
			break;
		}
	}
	return filled;
}
// turns x y coordinates into an index
function coordsToIndex(x, y){
	return y*7 + x;
}

// returns the player for the next turn
function changeTurn(currPlayer){
	if (currPlayer == 'x')
		return 'o';
	else
		return 'x';
}
// turns an index into x,y coordinates
function indexToCoords(index){
	return [index%7, Math.floor(index/7)];
}

// returns a board with the move by player at index
function makeMove(tempBoard, index, currPlayer){
	var currBoard = tempBoard.slice();
	currBoard[index] = currPlayer;
	return currBoard;
}

//checks if moving at index would be valid
function checkValid(tempBoard, index){
	if(index == -1)
		return false;
	if(tempBoard[index] != 'o' && tempBoard[index] != 'x' && !gameOver)
		return true;
	return false;
}

//draws the board
function drawBoard(tempBoard){
	fill(0,0,255);
	rect(0,0,width,height);
	fill(255,255,255);
	for(var j = 0; j < 6; j++){
		for(var i = 0; i < 7; i++){
			circle(i*width/7 + width/14,j*height/6 + height/12, height/6);
		}
	}
	
	for(var i = 0; i < tempBoard.length; i++){
		if(tempBoard[i] == 'x'){
			drawRed(i);
		}else if(tempBoard[i] == 'o'){
			drawYellow(i);
		}
	}
	
}
// draws red
function drawRed(index){
	var centerX;
	var centerY;
	centerX = indexToCoords(index)[0]*(width/7) + width/14;
	centerY = indexToCoords(index)[1]*height/6 + height/12;
	fill(255,0,0);
	circle(centerX,centerY, height/6);
}
// draws yellow
function drawYellow(index){
	var centerX;
	var centerY;
	centerX = indexToCoords(index)[0]*(width/7) + width/14;
	centerY = indexToCoords(index)[1]*height/6 + height/12;
	fill(255,255,0);
	circle(centerX,centerY, height/6);
}