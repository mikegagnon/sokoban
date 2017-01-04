function assert(condition) {
    if (!condition) {
        console.error("Assertion failed");
    }
}

// pieceId values
var EMPTY = 0;
var BLOCK = 1;
var SLIDER = 2;
var PLAYER = 3;
var GOAL = 4;
var GOAL_SLIDER = 5;
var GOAL_PLAYER = 6;

/* Snapshot class *************************************************************/
class Snapshot {

    // The matrix argument is a 2-dimensional matrix describing the board state.
    // Each item in the matrix is a pieceId. Namely, either EMPTY, BLOCK,
    // SLIDER, PLAYER, GOAL, GOAL_SLIDER, GOAL_PLAYER.
    //
    // The gameOver argument is a boolen that is true iff the player has solved
    // the puzzle.
    constructor(matrix, gameOver) {
        this.matrix = matrix;
        this.gameOver = gameOver;
        this.numRows = matrix.length;
        this.numCols = matrix[0].length;
    }
}

/* Viz class ******************************************************************/
class Viz {
    
    // The boardId argument specifies the HTML id for the <div> element that
    // will hold the game board
    //
    // The snapshot argument defines the initial gamestate
    constructor(boardId, snapshot) {

    }
    
    // The snapshot argument defines the game state that is to be drawn on the
    // web page
    drawGame(snapshot) {

    }
}

/* Testing out Viz ************************************************************/

var boardInit =  [
[1,0,0],
[0,1,0],
[0,0,1],
];

var gameOver = false;

var snapshot = new Snapshot(boardInit, gameOver);

var viz = new Viz("#board", snapshot);
