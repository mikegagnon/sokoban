
function assert(condition) {
    if (!condition) {
        console.error("Assertion failed");
        $("html").append("<p style='color: red'>Test failed. See JS console " +
            "for details.</p>");
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

    // The matrix argument is a 2-dimensional array describing board state.
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

/* Sokoban class **************************************************************/
class Sokoban {

    // The snapshot argument defines the initial gamestate
    constructor(snapshot) {
        this.snapshot = snapshot;
        var [row, col] = this.findPlayer();
        this.playerRow = row;
        this.playerCol = col;
    }

    findPlayer() {

        for (var row = 0; row < this.snapshot.numRows; row++) {
            for (var col = 0; col < this.snapshot.numCols; col++) {
                var pieceId = this.snapshot.matrix[row][col];
                if (pieceId == PLAYER) {
                    return [row, col];
                }
            }
        }

        // If there is no player
        assert(false);
    }

    // Moves the player in the specified direction. direction must be either:
    // "up", "down", "left", or "right"
    // Returns a snapshot object that defines the game state after the player is moved
    move(direction) {

        this.snapshot.matrix[this.playerRow][this.playerCol] = EMPTY;

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

        this.snapshot.matrix[this.playerRow][this.playerCol] = PLAYER;

        return this.snapshot;
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

// Returns true iff the two snapshots are identical
function snapshots_equal(snapshot1, snapshot2) {
    if (snapshot1.gameOver != snapshot2.gameOver ||
        snapshot1.numRows != snapshot2.numRows ||
        snapshot1.numCols != snapshot2.numCols) {
        return false;
    }

    return matrices_equal(snapshot1.matrix, snapshot2.matrix);
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

