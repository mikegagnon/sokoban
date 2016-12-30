
var CELL_SIZE = 35;

var EMPTY = 0;
var BLOCK = 1;
var SLIDER = 2;
var PLAYER = 3;
var GOAL = 4;

var SOKOBAN = undefined;

/* Viz class ******************************************************************/
class Viz {

    /* Static functions *******************************************************/

    static getCellId(row, col) {
        return "cell-" + row + "-" + col;
    }

    static getImgTag(filename) {
        return "<img src='" + filename + "' width='" + CELL_SIZE + "'>";
    }

    /* Instance methods *******************************************************/

    constructor(sokoban, boardId) {
        this.sokoban = sokoban;
        this.boardId = boardId;

        this.drawBoard();
    }

    drawBoard() {

        for (var row = 0; row < this.sokoban.numRows; row++) {

            var rowId = "row-" + row;
            var rowTag = "<div id='" + rowId + "' class='row'></div>"

            $(this.boardId).append(rowTag);

            for (var col = 0; col < this.sokoban.numCols; col++) {

                var cellId = Viz.getCellId(row, col);
                var cellTag = "<div id='" + cellId + "' class='cell'></div>";
                $("#" + rowId).append(cellTag);
                $("#" + cellId).css("width", CELL_SIZE);
                $("#" + cellId).css("height", CELL_SIZE);

            }
        }

        this.drawGame();
    }

    drawGame() {

        $("img").remove();

        for (var row = 0; row < this.sokoban.numRows; row++) {
            for (var col = 0; col < this.sokoban.numCols; col++) {
                var cell = this.sokoban.matrix[row][col];

                var filename = undefined;

                if (cell.player && this.sokoban.gameOver) {
                    filename = "player-win.png";
                } else if (cell.player) {
                    filename = "player.png";
                } else if (cell.slider && cell.goal) {
                    filename = "slider-goal.png";
                } else if (cell.slider) {
                    filename = "slider.png";
                } else if (cell.goal) {
                    filename = "goal.png";
                } else if (cell.block) {
                    filename = "block.png";
                } else if (this.sokoban.gameOver) {
                    filename = "empty-win.png";
                } else {
                    filename = "empty.png";
                }

                var cellId = "#" + Viz.getCellId(row, col);
                $(cellId).append(Viz.getImgTag(filename));
            }
        }
    }
}

/* Sokoban class **************************************************************/
class Sokoban {

    /* Static functions *******************************************************/

    // returns a 2-tuple [dr, dc], where:
    //      dr == difference in row
    //      dc == difference in column
    static drdc(direction) {
        if (direction == "up") {
            return [-1, 0];
        } else if (direction == "down") {
            return [1, 0];
        } else if (direction == "left") {
            return [0, -1];
        } else if (direction == "right") {
            return [0, 1];
        } else {
            console.error("Bad direction: " + direction);
        }
    }

    /* Instance methods *******************************************************/

    constructor(boardInit) {
        this.playerRow = undefined;
        this.playerCol = undefined;
        this.matrix = undefined;
        this.numRows = undefined;
        this.numCols = undefined;
        this.numGoals = 0;
        this.gameOver = false;
        this.initGameState(boardInit);
    }

    initGameState(boardInit) {

        this.numRows = boardInit.length;
        this.numCols = boardInit[0].length;
        this.matrix = new Array(this.numRows);

        for (var row = 0; row < this.numRows; row++) {

            this.matrix[row] = new Array(this.numCols);

            for (var col = 0; col < this.numCols; col++) {
                var piece = boardInit[row][col];
                var cell = new Cell(row, col, this);

                cell.addPiece(piece);

                if (piece == GOAL) {
                    this.numGoals += 1;
                } else if (piece == PLAYER) {
                    this.playerRow = row;
                    this.playerCol = col;
                }

                this.matrix[row][col] = cell;
            }
        }
    }

    inBounds(row, col) {
        return row >= 0 &&
               row < this.numRows &&
               col >= 0 &&
               col < this.numCols;
    }



    checkForVictory() {
        var occupiedGoals = 0;

        for (var row = 0; row < this.numRows; row++) {
            for (var col = 0; col < this.numCols; col++) {
                var cell = this.matrix[row][col];
                if (cell.goal && cell.slider) {
                    occupiedGoals += 1;
                }
            }
        }

        if (occupiedGoals == this.numGoals) {
            this.gameOver = true;
        }
    }

    move(direction) {

        if (this.gameOver) {
            return;
        }

        var [row, col] = [this.playerRow, this.playerCol];
        var [dr, dc] = Sokoban.drdc(direction);
        var [newRow, newCol] = [row + dr, col + dc];

        if (!this.inBounds(newRow, newCol)) {
            return;
        } else {
            var cell = this.matrix[row][col];
            if (cell.nudge(direction)) {
                cell.push(direction);
            }
        }

        this.checkForVictory();
    }

}

/* Cell ***********************************************************************/
class Cell {

    constructor(row, col, sokoban) {
        this.sokoban = sokoban;
        this.row = row;
        this.col = col;
        this.block = false;
        this.slider = false;
        this.player = false;
        this.goal = false;
    }

    getMovablePiece() {
        if (this.slider) {
            return SLIDER;
        } else if (this.player) {
            return PLAYER;
        } else {
            console.error("cannot call getMovablePiece() on an immovable piece");
        }
    }

    addPiece(piece) {
        if (piece == BLOCK) {
            this.block = true;
        } else if (piece == SLIDER) {
            this.slider = true;
        } else if (piece == PLAYER) {
            this.player = true;
        } else if (piece == GOAL) {
            this.goal = true;
        } else if (piece == EMPTY) {
            // do nothing
        } else {
            console.error("Unrecognized piece: " + piece);
        }
    }

    removePiece(piece) {
        if (piece == SLIDER) {
            this.slider = false;
        } else if (piece == PLAYER) {
            this.player = false;
        } else {
            console.error("cannot remove an immovable piece");
        }
    }

    // This cell is being "pushed" in the direction of dir
    // This function may only be called on a cell, if that cell contains
    // exactly one movable piece (i.e. PLAYER or SLIDER)
    push(dir) {
        if (this.slider || this.player) {
            var [dr, dc] = Sokoban.drdc(dir);
            var newRow = this.row + dr;
            var newCol = this.col + dc;
            var newCell = this.sokoban.matrix[newRow][newCol];

            newCell.push(dir);

            var piece = this.getMovablePiece();
            newCell.addPiece(piece);
            this.removePiece(piece);

            if (piece == PLAYER) {
                this.sokoban.playerRow = newRow;
                this.sokoban.playerCol = newCol;
            }
        }
    }

    // This cell is being "nudged" in the direction of dir
    // Returns true iff the cell can be "pushed"
    nudge(dir) {

        if (this.block) {
            return false;
        } else if (this.slider || this.player) {
            var [dr, dc] = Sokoban.drdc(dir);
            var newRow = this.row + dr;
            var newCol = this.col + dc;

            if (this.sokoban.inBounds(newRow, newCol)) {
                var newCell = this.sokoban.matrix[newRow][newCol];
                return newCell.nudge(dir);
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

}

/* Global functions ***********************************************************/

function getPlayerMovment(keyCode) {

    var keyCodeMap = {
        38: "up",
        40: "down",
        37: "left",
        39: "right"
    };

    return keyCodeMap[keyCode];
}

function keydown(event) {

    var direction = getPlayerMovment(event.keyCode);

    // If the user pressed a key we're uninterested in
    if (direction == undefined) {
        return;
    }

    // disable browser scrolling on arrow keys
    event.preventDefault();

    SOKOBAN.move(direction);
    VIZ.drawGame();
}

document.onkeydown = keydown;

