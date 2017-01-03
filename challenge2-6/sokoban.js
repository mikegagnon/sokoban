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

/* Board class ****************************************************************/
class Board {

    // The cells argument is a 2-dimensional matrix describing the board state.
    // Each item in cells is a cell object, which is to say an instance of the
    // Cell class.
    //
    // The gameOver argument is a boolen that is true iff the player has solved
    // the puzzle.
    constructor(cells, gameOver) {
        this.cells = cells;
        this.gameOver = gameOver;
        this.numRows = cells.length;
        this.numCols = cells[0].length;
    }
}

/* Cell class *****************************************************************/
// Iff this.block == true, then that means there is a block in this cell
// And so on for this.slider, this.player, and this.goal
class Cell {
    constructor(block, slider, player, goal) {
        this.block = block;
        this.slider = slider;
        this.player = player;
        this.goal = goal;
    }
}

/* IsoSnapshotBoard class *****************************************************/
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

/* IsoPieceidCell class *****************************************************/
class IsoPieceidCell {

    static toCell(pieceId) {

        var block = false;
        var slider = false;
        var player = false;
        var goal = false;

        if (pieceId == BLOCK) {
            block = true;
        } else if (pieceId == SLIDER) {
            slider = true;
        } else if (pieceId == PLAYER) {
            player = true;
        } else if (pieceId == GOAL) {
            goal = true;
        } else if (pieceId == GOAL_SLIDER) {
            goal = true;
            slider = true;
        } else if (pieceId == GOAL_PLAYER) {
            goal = true;
            player = true;
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


/* Sokoban class **************************************************************/
class Sokoban {

    // The snapshot argument defines the initial gamestate
    constructor(snapshot) {
        this.board = IsoSnapshotBoard.toBoard(snapshot);

        var [row, col] = this.findPlayer();
        this.playerRow = row;
        this.playerCol = col;
    }

    findPlayer() {

        for (var row = 0; row < this.board.numRows; row++) {
            for (var col = 0; col < this.board.numCols; col++) {
                var cell = this.board.cells[row][col];
                if (cell.player) {
                    return [row, col];
                }
            }
        }

        // If there is no player
        assert(false);
    }

    // Returns true iff (row, col) is in bounds
    inBounds(row, col) {
        return row >= 0 &&
               row < this.board.numRows &&
               col >= 0 &&
               col < this.board.numCols;
    }

    push(row, col, direction) {
        if (!this.inBounds(row, col)) {
            return false;
        }

        var cell = this.board.cells[row][col];

        if (cell.block) {
            return false;
        } else if (cell.slider || cell.player) {
            var newRow = row;
            var newCol = col;

            if (direction == "up") {
                newRow -= 1;
            } else if (direction == "down") {
                newRow += 1;
            } else if (direction == "left") {
                newCol -= 1;
            } else if (direction == "right") {
                newCol += 1;
            } else {
                assert(false);
            }

            if (this.push(newRow, newCol, direction)) {

                var newCell = this.board.cells[newRow][newCol];

                if (cell.player) {
                    this.playerRow = newRow;
                    this.playerCol = newCol;
                    cell.player = false;
                    newCell.player = true;
                } else {
                    assert(cell.slider);
                    cell.slider = false;
                    newCell.slider = true;
                }

                return true;
            } else {
                return false;
            }

        } else {
            return true;
        }


    }

    // Moves the player in the specified direction. direction must be either:
    // "up", "down", "left", or "right"
    // Returns a snapshot object that defines the game state after the player is moved
    move(direction) {
        this.push(this.playerRow, this.playerCol, direction);
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

// Returns true iff cell1 and cell2 are identical
function cells_equal(cell1, cell2) {
    return cell1.block == cell2.block &&
        cell1.slider == cell2.slider &&
        cell1.player == cell2.player &&
        cell1.goal == cell2.goal;
}

function boards_equal(board1, board2) {
    if (board1.gameOver != board2.gameOver ||
        board1.numRows != board2.numRows ||
        board1.numCols != board2.numCols) {
        return false;
    }

    for (var row = 0; row < board1.numRows; row++) {
        for (var col = 0; col < board1.numCols; col++) {
            var cell1 = board1.cells[row][col];
            var cell2 = board2.cells[row][col];
            if (!cells_equal(cell1, cell2)) {
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

// Test exiting PLAYER exiting GOAL
var matrix = [
    [0, 0],
    [0, 6],
    [0, 0],
];

var snapshot_init = new Snapshot(matrix, false);
var sokoban = new Sokoban(snapshot_init);

var snapshot_result = sokoban.move("up");
var matrix_expected = [
    [0, 3],
    [0, 4],
    [0, 0],
];
var snapshot_expected = new Snapshot(matrix_expected, false);
assert(snapshots_equal(snapshot_result, snapshot_expected));

var snapshot_result = sokoban.move("down");
var matrix_expected = [
    [0, 0],
    [0, 6],
    [0, 0],
];
var snapshot_expected = new Snapshot(matrix_expected, false);
assert(snapshots_equal(snapshot_result, snapshot_expected));

/* Test move out-of-bounds ****************************************************/

// move right
var matrix = [
    [0, 3],
    [0, 0],
    [0, 0],
];
var snapshot_init = new Snapshot(matrix, false);
var sokoban = new Sokoban(snapshot_init);
var snapshot_result = sokoban.move("right");
var matrix_expected = [
    [0, 3],
    [0, 0],
    [0, 0],
];
var snapshot_expected = new Snapshot(matrix_expected, false);
assert(snapshots_equal(snapshot_result, snapshot_expected));

// move up
var matrix = [
    [0, 3],
    [0, 0],
    [0, 0],
];
var snapshot_init = new Snapshot(matrix, false);
var sokoban = new Sokoban(snapshot_init);
var snapshot_result = sokoban.move("up");
var matrix_expected = [
    [0, 3],
    [0, 0],
    [0, 0],
];
var snapshot_expected = new Snapshot(matrix_expected, false);
assert(snapshots_equal(snapshot_result, snapshot_expected));

// move down
var matrix = [
    [0, 0],
    [0, 0],
    [3, 0],
];
var snapshot_init = new Snapshot(matrix, false);
var sokoban = new Sokoban(snapshot_init);
var snapshot_result = sokoban.move("down");
var matrix_expected = [
    [0, 0],
    [0, 0],
    [3, 0],
];
var snapshot_expected = new Snapshot(matrix_expected, false);
assert(snapshots_equal(snapshot_result, snapshot_expected));

// move left
var matrix = [
    [0, 0],
    [0, 0],
    [3, 0],
];
var snapshot_init = new Snapshot(matrix, false);
var sokoban = new Sokoban(snapshot_init);
var snapshot_result = sokoban.move("left");
var matrix_expected = [
    [0, 0],
    [0, 0],
    [3, 0],
];
var snapshot_expected = new Snapshot(matrix_expected, false);
assert(snapshots_equal(snapshot_result, snapshot_expected));


/* Tests for IsoPieceidCell  **************************************************/

// Test toCell
var cell1 = IsoPieceidCell.toCell(EMPTY);
var cell2 = new Cell(false, false, false, false);
assert(cells_equal(cell1, cell2));

var cell1 = IsoPieceidCell.toCell(BLOCK);
var cell2 = new Cell(true, false, false, false);
assert(cells_equal(cell1, cell2));

var cell1 = IsoPieceidCell.toCell(SLIDER);
var cell2 = new Cell(false, true, false, false);
assert(cells_equal(cell1, cell2));

var cell1 = IsoPieceidCell.toCell(PLAYER);
var cell2 = new Cell(false, false, true, false);
assert(cells_equal(cell1, cell2));

var cell1 = IsoPieceidCell.toCell(GOAL);
var cell2 = new Cell(false, false, false, true);
assert(cells_equal(cell1, cell2));

var cell1 = IsoPieceidCell.toCell(GOAL_SLIDER);
var cell2 = new Cell(false, true, false, true);
assert(cells_equal(cell1, cell2));

var cell1 = IsoPieceidCell.toCell(GOAL_PLAYER);
var cell2 = new Cell(false, false, true, true);
assert(cells_equal(cell1, cell2));

// Test toPieceid
var emptyCell = new Cell(false, false, false, false);
var pieceId = IsoPieceidCell.toPieceid(emptyCell)
assert(pieceId == EMPTY);

var blockCell = new Cell(true, false, false, false);
var pieceId = IsoPieceidCell.toPieceid(blockCell)
assert(pieceId == BLOCK);

var sliderCell = new Cell(false, true, false, false);
var pieceId = IsoPieceidCell.toPieceid(sliderCell)
assert(pieceId == SLIDER);

var playerCell = new Cell(false, false, true, false);
var pieceId = IsoPieceidCell.toPieceid(playerCell)
assert(pieceId == PLAYER);

var goalCell = new Cell(false, false, false, true);
var pieceId = IsoPieceidCell.toPieceid(goalCell)
assert(pieceId == GOAL);

var goalSliderCell = new Cell(false, true, false, true);
var pieceId = IsoPieceidCell.toPieceid(goalSliderCell)
assert(pieceId == GOAL_SLIDER);

var goalPlayerCell = new Cell(false, false, true, true);
var pieceId = IsoPieceidCell.toPieceid(goalPlayerCell)
assert(pieceId == GOAL_PLAYER);

/* Tests for IsoSnapshotBoard  **************************************************/

function test_IsoSnapshotBoard(snapshot1) {
    var board1 = IsoSnapshotBoard.toBoard(snapshot1);
    var snapshot2 = IsoSnapshotBoard.toSnapshot(board1);
    var board2 = IsoSnapshotBoard.toBoard(snapshot2);
    
    assert(snapshots_equal(snapshot1, snapshot2));
    assert(boards_equal(board1, board2));
}

// gameOver false
var matrix = [[EMPTY]];
var gameOver = false;
var snapshot = new Snapshot(matrix, gameOver);
test_IsoSnapshotBoard(snapshot);

// gameOver true
var matrix = [[EMPTY]];
var gameOver = true;
var snapshot = new Snapshot(matrix, gameOver);
test_IsoSnapshotBoard(snapshot);

// SLIDER
var matrix = [[SLIDER]];
var gameOver = false;
var snapshot = new Snapshot(matrix, gameOver);
test_IsoSnapshotBoard(snapshot);

// PLAYER
var matrix = [[PLAYER]];
var gameOver = false;
var snapshot = new Snapshot(matrix, gameOver);
test_IsoSnapshotBoard(snapshot);

// GOAL
var matrix = [[GOAL]];
var gameOver = false;
var snapshot = new Snapshot(matrix, gameOver);
test_IsoSnapshotBoard(snapshot);

// GOAL_SLIDER
var matrix = [[GOAL_SLIDER]];
var gameOver = false;
var snapshot = new Snapshot(matrix, gameOver);
test_IsoSnapshotBoard(snapshot);

// GOAL_PLAYER
var matrix = [[GOAL_PLAYER]];
var gameOver = false;
var snapshot = new Snapshot(matrix, gameOver);
test_IsoSnapshotBoard(snapshot);

// Complex matrix
var matrix =  [
    [5, 0, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 0, 0, 0, 1, 0],
    [1, 4, 3, 2, 0, 0, 1, 0],
    [1, 1, 1, 0, 2, 4, 1, 0],
    [1, 4, 1, 1, 2, 0, 1, 0],
    [1, 0, 1, 0, 4, 0, 1, 1],
    [1, 2, 0, 0, 2, 2, 4, 1],
    [1, 0, 0, 0, 4, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1]
];
var gameOver = false;
var snapshot = new Snapshot(matrix, gameOver);
test_IsoSnapshotBoard(snapshot);
