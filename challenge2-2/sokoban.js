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

    // The matrix argument is a 2-dimensional matrix describing board state.
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

/* Board class ****************************************************************/
class Board {
    constructor(cells, gameOver) {
        this.cells = cells;
        this.gameOver = gameOver;
        this.numRows = cells.length;
        this.numCols = cells[0].length;
    }
}

class IsoSnapshotBoard {

    static newMatrix(numRows, numCols) {
        var matrix = new Array(numRows);
        for (var row = 0; row < numRows; row++) {
            matrix[row] = new Array(numCols);
        }
        return matrix;
    }

    static toBoard(snapshot) {

        var numRows = snapshot.numRows;
        var numCols = snapshot.numCols;

        var cells = IsoSnapshotBoard.newMatrix(numRows, numCols);

        for (var row = 0; row < numRows; row++) {
            for (var col = 0; col < numCols; col++) {
                var pieceId = snapshot.matrix[row][col];
                cells[row][col] = IsoPieceidCell.toCell(pieceId);
            }
        }

        return new Board(cells, snapshot.gameOver);
    }

    static toSnapshot(board) {
        var numRows = board.numRows;
        var numCols = board.numCols;

        var matrix = IsoSnapshotBoard.newMatrix(numRows, numCols);

        for (var row = 0; row < numRows; row++) {
            for (var col = 0; col < numCols; col++) {

                var cell = board.cells[row][col];
                matrix[row][col] = IsoPieceidCell.toPieceid(cell);
            }
        }

        return new Snapshot(matrix, board.gameOver);
    }

}

class IsoPieceidCell {

    static toCell(pieceId) {

        var block = false;
        var slider = false;
        var player = false;
        var goal = false;

        if (pieceId == BLOCK) {
            this.block = true;
        } else if (pieceId == SLIDER) {
            this.slider = true;
        } else if (pieceId == PLAYER) {
            this.player = true;
        } else if (pieceId == GOAL) {
            this.goal = true;
        } else if (pieceId == GOAL_SLIDER) {
            this.goal = true;
            this.slider = true;
        } else if (pieceId == GOAL_PLAYER) {
            this.goal = true;
            this.player = true;
        }

        return new Cell(block, slider, player, goal);
    }

    static toPieceid(cell) {
        if (cell.block) {
            return BLOCK;
        } else if (cell.goal) {
            if (cell.slider) {
                return GOAL_SLIDER;
            } else if (cell.player) {
                return GOAL_PLAYER;
            } else {
                return GOAL;
            }
        } else if (cell.slider) {
            return SLIDER;
        } else if (cell.player) {
            return PLAYER;
        } else {
            return EMPTY;
        }
    }
}
/* Cell class *****************************************************************/
class Cell {
    constructor(block, slider, player, goal) {
        this.block = block;
        this.slider = slider;
        this.player = player;
        this.goal = goal;
    }
}


/* Sokoban class **************************************************************/
class Sokoban {

    /* Static functions *******************************************************/
    static findPlayer(snapshot) {
        for (var row = 0; row < snapshot.numRows; row++) {
            for (var col = 0; col < snapshot.numCols; col++) {
                var pieceId = snapshot.matrix[row][col];
                if (pieceId == PLAYER) {
                    return [row, col];
                }
            }
        }

        // If there is no player
        assert(false);
    }

    /* Instance methods *******************************************************/

    // The snapshot argument defines the initial gamestate
    constructor(snapshot) {
        this.board = IsoSnapshotBoard.toBoard(snapshot);

        var [row, col] = Sokoban.findPlayer(snapshot);
        this.playerRow = row;
        this.playerCol = col;
    }

    // Moves the player in the specified direction. direction must be either:
    // "up", "down", "left", or "right"
    // Returns a snapshot object that defines the game state after the player is moved
    move(direction) {

        this.board.cells[this.playerRow][this.playerCol].player = false;

        if (direction == "up") {
            this.playerRow -= 1;
        } else if (direction == "down") {
            this.playerRow += 1;
        } else if (direction == "left") {
            this.playerCol -= 1;
        } else if (direction == "right") {
            this.playerCol += 1;
        } else {
            assert(false);
        }

        this.board.cells[this.playerRow][this.playerCol].player = true;

        return IsoSnapshotBoard.toSnapshot(this.board);
    }
}

/******************************************************************************/
/* Snapshot tests *************************************************************/
/******************************************************************************/

var matrix = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
];
var gameOver = false;
var snapshot = new Snapshot(matrix, gameOver);
assert(snapshot.matrix == matrix);
assert(snapshot.gameOver == gameOver);
assert(snapshot.numRows == 3);
assert(snapshot.numCols == 3);

var matrix = [
    [0, 0, 0],
    [0, 0, 0],
];
var gameOver = true;
var snapshot = new Snapshot(matrix, gameOver);
assert(snapshot.matrix == matrix);
assert(snapshot.gameOver == gameOver);
assert(snapshot.numRows == 2);
assert(snapshot.numCols == 3);

var matrix = [
    [0, 0],
    [0, 0],
    [0, 0],
];
var gameOver = true;
var snapshot = new Snapshot(matrix, gameOver);
assert(snapshot.matrix == matrix);
assert(snapshot.gameOver == gameOver);
assert(snapshot.numRows == 3);
assert(snapshot.numCols == 2);

/******************************************************************************/
/* sokoban.move tests *********************************************************/
/******************************************************************************/

// Returns true iff the two snapshots are identical
function snapshots_equal(snapshot1, snapshot2) {
    return matrices_equal(snapshot1.matrix, snapshot2.matrix) &&
        snapshot1.gameOver == snapshot2.gameOver &&
        snapshot1.numRows == snapshot2.numRows &&
        snapshot1.numCols == snapshot2.numCols;
}

// Returns true iff matrix1 and matrix2 have the same dimensions and values
function matrices_equal(matrix1, matrix2) {

    var numRows1 = matrix1.length;
    var numCols1 = matrix1[0].length;

    var numRows2 = matrix2.length;
    var numCols2 = matrix2[0].length;

    if (numRows1 != numRows2 || numCols1 != numCols2) {
        return false;
    }

    for (var row = 0; row < numRows1; row++) {
        for (var col = 0; col < numCols1; col++) {
            if (matrix1[row][col] != matrix2[row][col]) {
                return false;
            }
        }
    }

    return true;
}

/* Test case: only in bounds. Only empty squares and player *******************/

// Init sokoban
var matrix = [
    [0, 0],
    [0, 3],
    [0, 0],
];

var snapshot_init = new Snapshot(matrix, false);
var sokoban = new Sokoban(snapshot_init);


// Test move up
var snapshot_result = sokoban.move("up");
var matrix_expected = [
    [0, 3],
    [0, 0],
    [0, 0],
];
var snapshot_expected = new Snapshot(matrix_expected, false);
assert(snapshots_equal(snapshot_result, snapshot_expected));

// Test move left
var snapshot_result = sokoban.move("left");
var matrix_expected = [
    [3, 0],
    [0, 0],
    [0, 0],
];
var snapshot_expected = new Snapshot(matrix_expected, false);
assert(snapshots_equal(snapshot_result, snapshot_expected));

// Test move down
var snapshot_result = sokoban.move("down");
var matrix_expected = [
    [0, 0],
    [3, 0],
    [0, 0],
];
var snapshot_expected = new Snapshot(matrix_expected, false);
assert(snapshots_equal(snapshot_result, snapshot_expected));

// Test move right
var snapshot_result = sokoban.move("right");
var matrix_expected = [
    [0, 0],
    [0, 3],
    [0, 0],
];
var snapshot_expected = new Snapshot(matrix_expected, false);
assert(snapshots_equal(snapshot_result, snapshot_expected));

