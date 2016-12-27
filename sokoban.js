var numRows = 8;
var numCols = 8;

cellSize = 50;

EMPTY = 0;
BLOCK = 1;
SLIDER = 2;
PLAYER = 3;
GOAL = 4;

var boardInit = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0, 0, 0, 4],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 4, 0, 0, 0, 2, 2, 0],
    [0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 4, 0, 0, 0, 2, 0],
    [0, 0, 0, 1, 0, 0, 0, 0],
    [0, 3, 0, 0, 0, 0, 2, 0],
];

var gameState = {
    playerRow: undefined,
    playerCol: undefined,
    matrix: undefined 
}

class Cell {
    constructor() {
        this.block = false;
        this.slider = false;
        this.player = false;
        this.goal = false;
    }

    addPiece(pieceId) {
        if (pieceId == BLOCK) {
            this.block = true;
        } else if (pieceId == SLIDER) {
            this.slider = true;
        } else if (pieceId == PLAYER) {
            this.player = true;
        } else if (pieceId == GOAL) {
            this.goal = true;
        } else {
            console.error("Unrecognized pieceId: " + pieceId);
        }
    }

    removePiece(pieceId) {
        if (pieceId == BLOCK) {
            this.block = false;
        } else if (pieceId == SLIDER) {
            this.slider = false;
        } else if (pieceId == PLAYER) {
            this.player = false;
        } else if (pieceId == Goal) {
            this.goal = false;
        } else {
            console.error("Unrecognized pieceId: " + pieceId);
        }
    }
}

function initGameState() {
    gameState.matrix = new Array(numRows);

    for (var row = 0; row < numRows; row++) {

        gameState.matrix[row] = new Array(numCols);

        for (var col = 0; col < numCols; col++) {
            var pieceId = boardInit[row][col];
            var cell = new Cell();

            if (pieceId != EMPTY) {
                cell.addPiece(pieceId);
            }

            if (pieceId == PLAYER) {
                gameState.playerRow = row;
                gameState.playerCol = col;
            }

            gameState.matrix[row][col] = cell;
        }
    }
}


function getCellId(row, col) {
    return "cell-" + row + "-" + col;
}

function getImgTag(src) {
    return "<img style='position:absolute;' src='" + src + "' width='" + cellSize + "'>";
}

function drawGame() {

    $("img").remove();

    for (var row = 0; row < numRows; row++) {
        for (var col = 0; col < numCols; col++) {
            var cell = gameState.matrix[row][col];
            var cellId = "#" + getCellId(row, col);

            var src = undefined;

            if (cell.goal) {
                $(cellId).append(getImgTag("goal.png"));
            }

            if (cell.block) {
                  $(cellId).append(getImgTag("block.png"));
            }

            if (cell.slider) {
                $(cellId).append(getImgTag("slider.png"));
            }

            if (cell.player) {
                $(cellId).append(getImgTag("player.png"));

            }
        }
    }
}

function createSokoban(boardId) {

    for (var row = 0; row < numRows; row++) {
        var rowId = "row-" + row;
        var rowTag = "<div id='" + rowId + "' class='row'></div>"

        $(boardId).append(rowTag);

        for (var col = 0; col < numCols; col++) {
            var cellId = getCellId(row, col);
            var cellTag = "<div id='" + cellId + "' class='cell'></div>";
            $("#" + rowId).append(cellTag);
        }
    }

    initGameState();
    drawGame();
}

// returns a 2-tuple [dr, dc], where:
//      dr == difference in row
//      dc == difference in column
function drdc(direction) {
    if (direction == "up") {
        return [-1, 0];
    } else if (direction == "down") {
        return [1, 0];
    } else if (direction == "left") {
        return [0, -1];
    } else if (direction == "right") {
        return [0, 1];
    } else {
        console.error("Bad direction: " + direction)
    }
}

function inBounds(row, col) {
    return row >= 0 &&
           row < numRows &&
           col >= 0 &&
           col < numCols;
}

function inBounds(row, col) {
    return row >= 0 &&
           row < numRows &&
           col >= 0 &&
           col < numCols;
}

function move(direction) {
    var [row, col] = [gameState.playerRow, gameState.playerCol];
    var [dr, dc] = drdc(direction);
    var [newRow, newCol] = [row + dr, col + dc];

    if (inBounds(newRow, newCol)) {
        gameState.matrix[row][col].removePiece(PLAYER);
        gameState.playerRow = newRow;
        gameState.playerCol = newCol;
        gameState.matrix[newRow][newCol].addPiece(PLAYER);
    }

    drawGame();
}

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

    move(direction);
}

document.onkeydown = keydown;
