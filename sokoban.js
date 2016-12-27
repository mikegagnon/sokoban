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

function drawGame() {
    for (var row = 0; row < numRows; row++) {
        for (var col = 0; col < numCols; col++) {
            var cell = gameState.matrix[row][col];
            var cellId = "#" + getCellId(row, col);

            var src = undefined;

            if (cell.block) {
                src = "block.png";
            } else if (cell.slider) {
                src = "slider.png";
            } else if (cell.player) {
                src = "player.png"
            } else if (cell.goal) {
                src = "goal.png"
            }

            if (src == undefined) {
                $(cellId +" img").remove();
            } else {
                var imgTag = "<img src='" + src + "' width='" + cellSize + "'>";
                $(cellId).append(imgTag);
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

function move(direction) {

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