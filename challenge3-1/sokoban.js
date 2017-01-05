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
    
    /* Static functions *******************************************************/

    static getCellId(row, col) {
        return "cell-" + row + "-" + col;
    }

    /* Instance methods *******************************************************/

    // Arguments:
    //    - boardId specifies the id of the <div> that this game will be drawn
    //      inside of.
    //    - snapshot is the initial snapshot of the game.
    //    - cell_size is the width of a cell (in pixels)
    //
    // The constructor creates a grid of cells in HTML. Each row of cells is
    // contained within a <div> with class == "row", and each cell itself is
    // represented by a <div> with class == "cell".
    //
    // Then the constructor invokes drawGame(snapshot)
    constructor(boardId, snapshot, cell_size) {
        this.boardId = boardId;
        this.numRows = snapshot.numRows;
        this.numCols = snapshot.numCols;
        this.cell_size = cell_size;
        this.drawCells();
    }
    
    drawCells() {
        for (var row = 0; row < this.numRows; row++) {

            var rowId = "row-" + row;
            var rowTag = "<div id='" + rowId + "' class='row'></div>"

            $(this.boardId).append(rowTag);

            for (var col = 0; col < this.numCols; col++) {

                var cellId = Viz.getCellId(row, col);
                var cellTag = "<div id='" + cellId + "' class='cell'></div>";
                $("#" + rowId).append(cellTag);
                $("#" + cellId).css("width", this.cell_size);
                $("#" + cellId).css("height", this.cell_size);

            }
        }
    }

    // The snapshot argument defines the game state that is to be drawn on the
    // web page
    drawGame(snapshot) {

    }
}

